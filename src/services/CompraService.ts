
import CompraRepository, {
  ReservaCompra,
} from '../repositories/CompraRepository';

class CompraService {
  private validarReserva(reserva: ReservaCompra | null) {
    if (!reserva) {
      throw new Error('Reserva não encontrada.');
    }

    if (reserva.status !== 'ATIVA') {
      throw new Error('Esta reserva não está ativa.');
    }

    if (reserva.expiraEm <= new Date()) {
      throw new Error('O prazo da reserva expirou.');
    }

    if (reserva.assentos.length === 0) {
      throw new Error('A reserva não possui assentos.');
    }

    for (const item of reserva.assentos) {
      if (item.status !== 'RESERVADO') {
        throw new Error(
          'Existe um assento que não está disponível para compra.'
        );
      }

      if (item.ingresso) {
        throw new Error('Este assento já possui um ingresso emitido.');
      }
    }

    return reserva;
  }

  async confirmar(reservaId: number, usuarioId: number) {
    if (!Number.isInteger(reservaId) || reservaId <= 0) {
      throw new Error('ID da reserva inválido.');
    }

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      throw new Error('Usuário inválido.');
    }

    return CompraRepository.confirmarReserva(
      reservaId,
      (reserva: ReservaCompra | null) => {
        if (!reserva) {
          throw new Error('Reserva não encontrada.');
        }

        if (reserva.usuarioId !== usuarioId) {
          throw new Error(
            'Você não tem permissão para comprar esta reserva.'
          );
        }

        return this.validarReserva(reserva);
      }
    );
  }

  async confirmarVendaBalcao(reservaId: number) {
    if (!Number.isInteger(reservaId) || reservaId <= 0) {
      throw new Error('ID da reserva inválido.');
    }

    return CompraRepository.confirmarReserva(
      reservaId,
      (reserva: ReservaCompra | null) => {
        if (!reserva) {
          throw new Error('Reserva não encontrada.');
        }

        if (reserva.usuarioId !== null) {
          throw new Error(
            'Esta reserva não foi criada para venda no balcão.'
          );
        }

        return this.validarReserva(reserva);
      }
    );
  }
}

export default new CompraService();
