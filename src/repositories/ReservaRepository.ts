import prisma from '../database/prisma';

interface CriarReservaDTO {
  sessaoId: number;
  assentosIds: number[];
}

class ReservaRepository {
  buscarSessaoPorId(sessaoId: number) {
    return prisma.sessao.findUnique({
      where: { id: sessaoId },
    });
  }

  buscarAssentosPorIds(assentosIds: number[]) {
    return prisma.assento.findMany({
      where: {
        id: { in: assentosIds },
      },
    });
  }

  async criar(dados: CriarReservaDTO) {
    const agora = new Date();

    return prisma.$transaction(async (tx) => {
      const expiradas = await tx.reserva.findMany({
        where: {
          sessaoId: dados.sessaoId,
          status: 'ATIVA',
          expiraEm: { lte: agora },
        },
        select: { id: true },
      });

      const idsExpirados = expiradas.map((reserva) => reserva.id);

      if (idsExpirados.length > 0) {
        await tx.reservaAssento.deleteMany({
          where: {
            reservaId: { in: idsExpirados },
          },
        });

        await tx.reserva.updateMany({
          where: {
            id: { in: idsExpirados },
          },
          data: { status: 'EXPIRADA' },
        });
      }

      const reserva = await tx.reserva.create({
        data: {
          sessaoId: dados.sessaoId,
          expiraEm: new Date(agora.getTime() + 10 * 60 * 1000),
          assentos: {
            create: dados.assentosIds.map((assentoId) => ({
              assentoId,
              sessaoId: dados.sessaoId,
            })),
          },
        },
        include: {
          assentos: {
            include: { assento: true },
          },
        },
      });

      return reserva;
    });
  }
}

export default new ReservaRepository();
