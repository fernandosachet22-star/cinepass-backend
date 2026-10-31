
import prisma from '../database/prisma';

class IngressoRepository {
  async buscarPorCodigo(codigo: string) {
    return prisma.ingresso.findUnique({
      where: { codigo },
      include: {
        reservaAssento: {
          include: {
            assento: true,
            reserva: {
              include: {
                sessao: {
                  include: {
                    filme: true,
                    sala: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async listarPorUsuario(usuarioId: number) {
    return prisma.ingresso.findMany({
      where: {
        reservaAssento: {
          reserva: {
            usuarioId,
          },
        },
      },
      include: {
        reservaAssento: {
          include: {
            assento: true,
            reserva: {
              include: {
                sessao: {
                  include: {
                    filme: true,
                    sala: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async validar(codigo: string) {
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT id
        FROM "Ingresso"
        WHERE codigo = ${codigo}
        FOR UPDATE
      `;

      const ingresso = await tx.ingresso.findUnique({
        where: { codigo },
      });

      if (!ingresso) {
        throw new Error('Ingresso não encontrado.');
      }

      if (ingresso.utilizadoEm) {
        throw new Error('Este ingresso já foi utilizado.');
      }

      return tx.ingresso.update({
        where: { codigo },
        data: {
          utilizadoEm: new Date(),
        },
      });
    });
  }
}

export default new IngressoRepository();
