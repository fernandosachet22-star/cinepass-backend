import SessaoRepository from '../repositories/SessaoRepository';
import FilmeRepository from '../repositories/FilmeRepository';

class SessaoService {
  async listarPorFilme(filmeId: number) {
    const filme = await FilmeRepository.buscarPorId(filmeId);

    if (!filme) {
      throw new Error('Filme não encontrado.');
    }

    return SessaoRepository.listarPorFilme(filmeId);
  }

  async listarTodas() {
    return SessaoRepository.listarTodas();
  }

  async listarAssentos(sessaoId: number) {
    if (!Number.isInteger(sessaoId) || sessaoId <= 0) {
      throw new Error('ID da sessão inválido.');
    }

    const agora = new Date();

    const sessao = await SessaoRepository.buscarAssentosPorSessao(sessaoId);

    if (!sessao) {
      throw new Error('Sessão não encontrada.');
    }

    await SessaoRepository.expirarReservas(sessaoId, agora);

    const reservas = await SessaoRepository.listarReservasPorSessao(sessaoId);

    const reservasPorAssento = new Map(
      reservas.map((reserva) => [reserva.assentoId, reserva])
    );

    return {
      sessaoId: sessao.id,
      filme: sessao.filmeId,
      sala: {
        id: sessao.sala.id,
        nome: sessao.sala.nome,
      },
      assentos: sessao.sala.assentos.map((assento) => {
        const reserva = reservasPorAssento.get(assento.id);

        let status = 'LIVRE';

        if (reserva?.status === 'VENDIDO') {
          status = 'VENDIDO';
        } else if (
          reserva?.status === 'RESERVADO' &&
          reserva.reserva.status === 'ATIVA' &&
          reserva.reserva.expiraEm > agora
        ) {
          status = 'RESERVADO';
        }

        return {
          id: assento.id,
          codigo: assento.codigo,
          fileira: assento.fileira,
          numero: assento.numero,
          status,
        };
      }),
    };
  }

  async criar(dados: {
    filmeId: number;
    salaId: number;
    dataHora: string;
    preco: number;
  }) {
    if (!Number.isInteger(dados.filmeId) || dados.filmeId <= 0) {
      throw new Error('Filme inválido.');
    }

    if (!Number.isInteger(dados.salaId) || dados.salaId <= 0) {
      throw new Error('Sala inválida.');
    }

    if (!dados.dataHora || isNaN(Date.parse(dados.dataHora))) {
      throw new Error('Data e horário inválidos.');
    }

    if (typeof dados.preco !== 'number' || dados.preco <= 0) {
      throw new Error('O preço deve ser maior que zero.');
    }

    const filme = await FilmeRepository.buscarPorId(dados.filmeId);

    if (!filme) {
      throw new Error('Filme não encontrado.');
    }

    const sala = await SessaoRepository.buscarSalaPorId(dados.salaId);

    if (!sala) {
      throw new Error('Sala não encontrada.');
    }

    return SessaoRepository.criar({
      filmeId: dados.filmeId,
      salaId: dados.salaId,
      dataHora: new Date(dados.dataHora),
      preco: dados.preco,
    });
  }
}

export default new SessaoService();
