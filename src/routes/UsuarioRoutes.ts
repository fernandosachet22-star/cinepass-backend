
import { Router } from 'express';

import UsuarioController from '../controllers/UsuarioController';

import {
  autenticar,
  autorizarPerfis,
} from '../middlewares/autenticacao';

const routes = Router();

// Cadastro público: sempre cria CLIENTE.
routes.post('/cadastro', UsuarioController.cadastrar);

// Login.
routes.post('/login', UsuarioController.login);

// Criação única do primeiro administrador.
routes.post(
  '/admin/setup',
  UsuarioController.criarPrimeiroAdministrador
);

// Consultar o próprio perfil.
routes.get(
  '/perfil',
  autenticar,
  UsuarioController.perfil
);

// Alterar a própria senha.
routes.post(
  '/senha',
  autenticar,
  UsuarioController.alterarSenha
);

// Listar usuários: somente administrador.
routes.get(
  '/',
  autenticar,
  autorizarPerfis('ADMINISTRADOR'),
  UsuarioController.listar
);

// Criar usuários com perfil definido: somente administrador.
routes.post(
  '/gerenciar',
  autenticar,
  autorizarPerfis('ADMINISTRADOR'),
  UsuarioController.criarGerenciado
);

export default routes;
