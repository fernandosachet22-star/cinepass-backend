import SalaRepository from '../repositories/SalaRepository';

interface CriarSalaDTO {
  nome: string;
  fileiras: number;
  assentosPorFileira: number;
}

class SalaService {
  async listar() {
    return SalaRepository.listar();
  }

  async buscarPorId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID da sala inválido.');
    }

    const sala = await SalaRepository.buscarPorId(id);

    if (!sala) {
      throw new Error('Sala não encontrada.');
    }

    return sala;
  }

  async criar(dados: CriarSalaDTO) {
    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('O nome da sala é obrigatório.');
    }

    if (
      !Number.isInteger(dados.fileiras) ||
      dados.fileiras < 1 ||
      dados.fileiras > 26
    ) {
      throw new Error('A sala deve ter entre 1 e 26 fileiras.');
    }

    if (
      !Number.isInteger(dados.assentosPorFileira) ||
      dados.assentosPorFileira < 1
    ) {
      throw new Error(
        'A quantidade de assentos por fileira deve ser maior que zero.'
      );
    }

    const assentos = [];

    for (let i = 0; i < dados.fileiras; i++) {
      const fileira = String.fromCharCode(65 + i);

      for (
        let numero = 1;
        numero <= dados.assentosPorFileira;
        numero++
      ) {
        assentos.push({
          codigo: `${fileira}${numero}`,
          fileira,
          numero,
        });
      }
    }

    return SalaRepository.criar({
      nome: dados.nome.trim(),
      fileiras: dados.fileiras,
      assentosPorFileira: dados.assentosPorFileira,
      assentos,
    });
  }
}

export default new SalaService();