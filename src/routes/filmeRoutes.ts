import { Router } from 'express';
import FilmeController from '../controllers/FilmeController';
import { autenticar, autorizarPerfis } from '../middlewares/autenticacao';

const filmeRoutes = Router();

filmeRoutes.get('/', FilmeController.listar);

filmeRoutes.post(
  '/',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  FilmeController.criar
);

filmeRoutes.put(
  '/:id',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  FilmeController.atualizar
);

filmeRoutes.delete(
  '/:id',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  FilmeController.excluir
);

export default filmeRoutes;