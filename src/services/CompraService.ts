
import CompraRepository from '../repositories/CompraRepository';

class CompraService {
  async confirmar(reservaId: number) {
    if (!Number.isInteger(reservaId) || reservaId <= 0) {
      throw new Error('ID da reserva inválido.');
    }

    return CompraRepository.confirmarReserva(reservaId);
  }
}

export default new CompraService();
