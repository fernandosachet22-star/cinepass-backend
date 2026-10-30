
import prisma from '../database/prisma';

interface CriarSalaDTO {
  nome: string;
  fileiras: number;
  assentosPorFileira: number;
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
    const assentos = [];

    for (let i = 0; i < dados.fileiras; i++) {
      const fileira = String.fromCharCode(65 + i);

      for (let numero = 1; numero <= dados.assentosPorFileira; numero++) {
        assentos.push({
          codigo: `${fileira}${numero}`,
          fileira,
          numero,
        });
      }
    }

    return prisma.sala.create({
      data: {
        nome: dados.nome,
        fileiras: dados.fileiras,
        assentosPorFileira: dados.assentosPorFileira,
        assentos: {
          create: assentos,
        },
      },
      include: {
        assentos: true,
      },
    });
  }
}

export default new SalaRepository();
