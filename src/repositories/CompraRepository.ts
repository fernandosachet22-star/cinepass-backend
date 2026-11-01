
import prisma from '../database/prisma';
import { randomUUID } from 'crypto';

export interface ReservaCompra {
  usuarioId: number | null;
  status: string;
  expiraEm: Date;
  assentos: {
    id: number;
    status: string;
    ingresso: { id: number } | null;
  }[];
}

class CompraRepository {
  async confirmarReserva(
    reservaId: number,
    validarReserva: (
      reserva: ReservaCompra | null
    ) => ReservaCompra
  ) {
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

      const reservaValidada = validarReserva(reserva);

      await tx.reservaAssento.updateMany({
        where: {
          reservaId,
          status: 'RESERVADO',
        },
        data: {
          status: 'VENDIDO',
        },
      });

      for (const item of reservaValidada.assentos) {
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
