
import { Router } from 'express';
import RelatorioController from '../controllers/RelatorioController';
import { autenticar, autorizarPerfis } from '../middlewares/autenticacao';

const routes = Router();

routes.get(
  '/',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  RelatorioController.listar
);

export default routes;
