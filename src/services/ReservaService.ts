import ReservaRepository from '../repositories/ReservaRepository';

class ReservaService {
  async criar(sessaoId: number, assentosIds: number[]) {
    if (!Number.isInteger(sessaoId) || sessaoId <= 0) {
      throw new Error('Sessão inválida.');
    }

    if (!Array.isArray(assentosIds) || assentosIds.length === 0) {
      throw new Error('Selecione pelo menos um assento.');
    }

    if (
      assentosIds.some((id) => !Number.isInteger(id) || id <= 0) ||
      new Set(assentosIds).size !== assentosIds.length
    ) {
      throw new Error('Lista de assentos inválida.');
    }

    const sessao = await ReservaRepository.buscarSessaoPorId(sessaoId);

    if (!sessao) {
      throw new Error('Sessão não encontrada.');
    }

    const assentos = await ReservaRepository.buscarAssentosPorIds(
      assentosIds
    );

    if (assentos.length !== assentosIds.length) {
      throw new Error('Um ou mais assentos não foram encontrados.');
    }

    if (assentos.some((assento) => assento.salaId !== sessao.salaId)) {
      throw new Error('Um ou mais assentos não pertencem à sala desta sessão.');
    }

    if (sessao.dataHora <= new Date()) {
      throw new Error('Não é possível reservar assentos para uma sessão que já começou.');
    }

    return ReservaRepository.criar({
      sessaoId,
      assentosIds,
    });
  }
}

export default new ReservaService();
