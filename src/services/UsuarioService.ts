import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'crypto';
import UsuarioRepository from '../repositories/UsuarioRepository';

export type PerfilUsuario =
  | 'CLIENTE'
  | 'OPERADOR'
  | 'ADMINISTRADOR';

type DadosUsuario = {
  nome: string;
  email: string;
  senha: string;
};

class UsuarioService {
  private validarDados(
    nome: unknown,
    email: unknown,
    senha: unknown
  ): DadosUsuario {
    if (
      typeof nome !== 'string' ||
      typeof email !== 'string' ||
      typeof senha !== 'string'
    ) {
      throw new Error('Informe nome, e-mail e senha.');
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (nomeLimpo.length < 3) {
      throw new Error('O nome precisa ter pelo menos 3 caracteres.');
    }

    if (nomeLimpo.length > 100) {
      throw new Error('O nome deve ter no máximo 100 caracteres.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      throw new Error('Informe um e-mail válido.');
    }

    if (emailLimpo.length > 150) {
      throw new Error('O e-mail é muito longo.');
    }

    if (senha.length < 8) {
      throw new Error('A senha precisa ter pelo menos 8 caracteres.');
    }

    if (senha.length > 100) {
      throw new Error('A senha deve ter no máximo 100 caracteres.');
    }

    return {
      nome: nomeLimpo,
      email: emailLimpo,
      senha,
    };
  }

  private obterSegredoJWT(): string {
    const segredo = process.env.JWT_SECRET;

    if (!segredo) {
      throw new Error('JWT_SECRET não está configurada.');
    }

    return segredo;
  }

  private dadosPublicos(usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    createdAt: Date;
  }) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      createdAt: usuario.createdAt,
    };
  }

  private gerarToken(usuario: {
    id: number;
    email: string;
    perfil: string;
  }) {
    return jwt.sign(
      {
        email: usuario.email,
        perfil: usuario.perfil,
      },
      this.obterSegredoJWT(),
      {
        subject: String(usuario.id),
        expiresIn: '8h',
      }
    );
  }

  private async criarUsuario(
    dados: DadosUsuario,
    perfil: PerfilUsuario
  ) {
    const existente = await UsuarioRepository.buscarPorEmail(
      dados.email
    );

    if (existente) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12);

    const usuario = await UsuarioRepository.criar({
      nome: dados.nome,
      email: dados.email,
      senhaHash,
      perfil,
    });

    return this.dadosPublicos(usuario);
  }

  async cadastrarCliente(
    nome: unknown,
    email: unknown,
    senha: unknown
  ) {
    const dados = this.validarDados(nome, email, senha);

    return this.criarUsuario(dados, 'CLIENTE');
  }

  async login(email: unknown, senha: unknown) {
    if (typeof email !== 'string' || typeof senha !== 'string') {
      throw new Error('Informe o e-mail e a senha.');
    }

    const emailLimpo = email.trim().toLowerCase();

    const usuario = await UsuarioRepository.buscarPorEmail(
      emailLimpo
    );

    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senhaHash
    );

    if (!senhaCorreta) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const dadosUsuario = this.dadosPublicos(usuario);

    return {
      usuario: dadosUsuario,
      token: this.gerarToken(usuario),
    };
  }

  async criarPrimeiroAdministrador(
    nome: unknown,
    email: unknown,
    senha: unknown,
    chaveRecebida: string
  ) {
    const chaveConfigurada = process.env.ADMIN_SETUP_KEY;

    if (!chaveConfigurada) {
      throw new Error('ADMIN_SETUP_KEY não está configurada.');
    }

    const chaveInformada = Buffer.from(chaveRecebida);
    const chaveEsperada = Buffer.from(chaveConfigurada);

    if (
      chaveInformada.length !== chaveEsperada.length ||
      !timingSafeEqual(chaveInformada, chaveEsperada)
    ) {
      throw new Error('Chave de configuração inválida.');
    }

    const administradorExistente =
      await UsuarioRepository.buscarPrimeiroAdministrador();

    if (administradorExistente) {
      throw new Error('O administrador inicial já foi criado.');
    }

    const dados = this.validarDados(nome, email, senha);

    return this.criarUsuario(dados, 'ADMINISTRADOR');
  }

  async criarUsuarioGerenciado(
    nome: unknown,
    email: unknown,
    senha: unknown,
    perfil: unknown
  ) {
    if (
      perfil !== 'CLIENTE' &&
      perfil !== 'OPERADOR' &&
      perfil !== 'ADMINISTRADOR'
    ) {
      throw new Error('Perfil de usuário inválido.');
    }

    const dados = this.validarDados(nome, email, senha);

    return this.criarUsuario(dados, perfil);
  }

  async listar() {
    return UsuarioRepository.listar();
  }

  async buscarPorId(id: number) {
    return UsuarioRepository.buscarDadosPublicosPorId(id);
  }

  async alterarSenha(
    usuarioId: number,
    senhaAtual: unknown,
    novaSenha: unknown
  ) {
    if (
      typeof senhaAtual !== 'string' ||
      typeof novaSenha !== 'string' ||
      novaSenha.length < 8 ||
      novaSenha.length > 100
    ) {
      throw new Error(
        'Informe as senhas corretamente. A nova senha precisa ter pelo menos 8 caracteres.'
      );
    }

    const usuario = await UsuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    const senhaCorreta = await bcrypt.compare(
      senhaAtual,
      usuario.senhaHash
    );

    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta.');
    }

    if (senhaAtual === novaSenha) {
      throw new Error('A nova senha deve ser diferente da senha atual.');
    }

    const senhaHash = await bcrypt.hash(novaSenha, 12);

    await UsuarioRepository.atualizarSenha(usuarioId, senhaHash);

    return {
      mensagem: 'Senha alterada com sucesso!',
    };
  }
}

export default new UsuarioService();
