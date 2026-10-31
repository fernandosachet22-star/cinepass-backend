
import CompraRepository from '../repositories/CompraRepository';

class CompraService {
  async confirmar(reservaId: number, usuarioId: number) {
    if (!Number.isInteger(reservaId) || reservaId <= 0) {
      throw new Error('ID da reserva inválido.');
    }

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      throw new Error('Usuário inválido.');
    }

    return CompraRepository.confirmarReserva(reservaId, usuarioId);
  }
}

export default new CompraService();
