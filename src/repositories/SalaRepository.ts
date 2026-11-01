import prisma from '../database/prisma';

interface CriarSalaDTO {
  nome: string;
  fileiras: number;
  assentosPorFileira: number;
  assentos: {
    codigo: string;
    fileira: string;
    numero: number;
  }[];
}

class SalaRepository {
  async listar() {
    return prisma.sala.findMany({
      include: {
        assentos: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    return prisma.sala.findUnique({
      where: { id },
      include: {
        assentos: true,
      },
    });
  }

  async criar(dados: CriarSalaDTO) {
    return prisma.sala.create({
      data: {
        nome: dados.nome,
        fileiras: dados.fileiras,
        assentosPorFileira: dados.assentosPorFileira,
        assentos: {
          create: dados.assentos,
        },
      },
      include: {
        assentos: true,
      },
    });
  }
}

export default new SalaRepository();