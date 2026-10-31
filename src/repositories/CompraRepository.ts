
import prisma from '../database/prisma';
import { randomUUID } from 'crypto';

class CompraRepository {
  async confirmarReserva(reservaId: number, usuarioId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT id
        FROM "Reserva"
        WHERE id = ${reservaId}
        FOR UPDATE
      `;

      const reserva = await tx.reserva.findUnique({
        where: { id: reservaId },
        include: {
          assentos: {
            include: {
              ingresso: true,
              assento: true,
            },
          },
        },
      });

      if (!reserva) {
        throw new Error('Reserva não encontrada.');
      }

      if (reserva.usuarioId !== usuarioId) {
        throw new Error('Você não tem permissão para comprar esta reserva.');
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
          throw new Error('Existe um assento que não está disponível para compra.');
        }

        if (item.ingresso) {
          throw new Error('Este assento já possui um ingresso emitido.');
        }
      }

      await tx.reservaAssento.updateMany({
        where: {
          reservaId,
          status: 'RESERVADO',
        },
        data: {
          status: 'VENDIDO',
        },
      });

      for (const item of reserva.assentos) {
        await tx.ingresso.create({
          data: {
            codigo: randomUUID(),
            reservaAssentoId: item.id,
          },
        });
      }

      return tx.reserva.update({
        where: { id: reservaId },
        data: {
          status: 'CONFIRMADA',
        },
        include: {
          assentos: {
            include: {
              assento: true,
              ingresso: true,
            },
          },
          sessao: {
            include: {
              filme: true,
              sala: true,
            },
          },
        },
      });
    });
  }
}

export default new CompraRepository();
