import prisma from '../database/prisma';

interface CriarSessaoDTO {
  filmeId: number;
  salaId: number;
  dataHora: Date;
  preco: number;
}

class SessaoRepository {
  async listarPorFilme(filmeId: number) {
    return prisma.sessao.findMany({
      where: { filmeId },
      include: {
        filme: true,
        sala: true,
      },
      orderBy: {
        dataHora: 'asc',
      },
    });
  }

  async listarTodas() {
    return prisma.sessao.findMany({
      include: {
        filme: true,
        sala: true,
      },
      orderBy: {
        dataHora: 'asc',
      },
    });
  }

  async buscarAssentosPorSessao(sessaoId: number) {
    return prisma.sessao.findUnique({
      where: { id: sessaoId },
      include: {
        sala: {
          include: {
            assentos: {
              orderBy: [
                { fileira: 'asc' },
                { numero: 'asc' },
              ],
            },
          },
        },
      },
    });
  }

  async expirarReservas(sessaoId: number, agora: Date) {
    return prisma.$transaction(async (tx) => {
      const expiradas = await tx.reserva.findMany({
        where: {
          sessaoId,
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
    });
  }

  async listarReservasPorSessao(sessaoId: number) {
    return prisma.reservaAssento.findMany({
      where: { sessaoId },
      include: { reserva: true },
    });
  }

  async buscarSalaPorId(salaId: number) {
    return prisma.sala.findUnique({
      where: { id: salaId },
    });
  }

  async criar(dados: CriarSessaoDTO) {
    return prisma.sessao.create({
      data: {
        filmeId: dados.filmeId,
        salaId: dados.salaId,
        dataHora: dados.dataHora,
        preco: dados.preco,
      },
      include: {
        filme: true,
        sala: true,
      },
    });
  }
}

export default new SessaoRepository();
