import prisma from '../database/prisma';

type PerfilUsuario = 'CLIENTE' | 'OPERADOR' | 'ADMINISTRADOR';

type DadosNovoUsuario = {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: PerfilUsuario;
};

class UsuarioRepository {
  buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  criar(dados: DadosNovoUsuario) {
    return prisma.usuario.create({
      data: dados,
    });
  }

  buscarPrimeiroAdministrador() {
    return prisma.usuario.findFirst({
      where: { perfil: 'ADMINISTRADOR' },
      select: { id: true },
    });
  }

  listar() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        createdAt: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  buscarPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
    });
  }

  buscarDadosPublicosPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        createdAt: true,
      },
    });
  }

  atualizarSenha(id: number, senhaHash: string) {
    return prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });
  }
}

export default new UsuarioRepository();
