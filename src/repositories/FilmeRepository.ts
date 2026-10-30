
import prisma from '../database/prisma';

export interface Filme {
  id: number;
  titulo: string;
  descricao: string;
  duracao: number;
  classificacao: string;
  genero: string;
  imagem: string;
}

class FilmeRepository {
  async listar() {
    return prisma.filme.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    return prisma.filme.findUnique({
      where: { id },
    });
  }

  async criar(dados: Omit<Filme, 'id'>) {
    return prisma.filme.create({
      data: dados,
    });
  }

  async excluir(id: number) {
    return prisma.filme.delete({
      where: { id },
    });
  }
}

export default new FilmeRepository();
