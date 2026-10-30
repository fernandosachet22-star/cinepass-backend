
import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

class UsuarioController {
  cadastrar = async (req: Request, res: Response) => {
    try {
      const { nome, email, senha } = req.body;

      const usuario = await UsuarioService.cadastrarCliente(
        nome,
        email,
        senha
      );

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro ao cadastrar usuário.';

      const status = mensagem.includes('já está cadastrado')
        ? 409
        : 400;

      return res.status(status).json({
        erro: mensagem,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;

      const resultado = await UsuarioService.login(email, senha);

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        ...resultado,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login.';

      return res.status(401).json({
        erro: mensagem,
      });
    }
  };

  criarPrimeiroAdministrador = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { nome, email, senha } = req.body;

      const chave = req.header('x-admin-setup-key') || '';

      const usuario = await UsuarioService.criarPrimeiroAdministrador(
        nome,
        email,
        senha,
        chave
      );

      return res.status(201).json({
        mensagem: 'Administrador inicial criado com sucesso!',
        usuario,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro ao criar administrador.';

      const status = mensagem.includes('já foi criado')
        ? 409
        : mensagem.includes('Chave de configuração inválida')
          ? 401
          : 400;

      return res.status(status).json({
        erro: mensagem,
      });
    }
  };

  criarGerenciado = async (req: Request, res: Response) => {
    try {
      const { nome, email, senha, perfil } = req.body;

      const usuario = await UsuarioService.criarUsuarioGerenciado(
        nome,
        email,
        senha,
        perfil
      );

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso!',
        usuario,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro ao criar usuário.';

      const status = mensagem.includes('já está cadastrado')
        ? 409
        : 400;

      return res.status(status).json({
        erro: mensagem,
      });
    }
  };

  listar = async (_req: Request, res: Response) => {
    try {
      const usuarios = await UsuarioService.listar();

      return res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);

      return res.status(500).json({
        erro: 'Não foi possível listar os usuários.',
      });
    }
  };

  perfil = async (req: Request, res: Response) => {
    try {
      const id = req.usuario?.id;

      if (!id) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const usuario = await UsuarioService.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado.',
        });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao consultar perfil:', error);

      return res.status(500).json({
        erro: 'Não foi possível consultar o perfil.',
      });
    }
  };

  alterarSenha = async (req: Request, res: Response) => {
    try {
      const usuarioId = req.usuario?.id;

      if (!usuarioId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const resultado = await UsuarioService.alterarSenha(
        usuarioId,
        req.body.senhaAtual,
        req.body.novaSenha
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({
        erro: error instanceof Error
          ? error.message
          : 'Não foi possível alterar a senha.',
      });
    }
  };
}

export default new UsuarioController();
