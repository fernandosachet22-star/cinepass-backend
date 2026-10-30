
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
