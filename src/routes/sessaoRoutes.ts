
import { Router } from 'express';
import SessaoController from '../controllers/SessaoController';
import { autenticar, autorizarPerfis } from '../middlewares/autenticacao';

const sessaoRoutes = Router();

sessaoRoutes.get('/', SessaoController.listarTodas);
sessaoRoutes.get('/filme/:filmeId', SessaoController.listarPorFilme);
sessaoRoutes.get('/:sessaoId/assentos', SessaoController.listarAssentos);

sessaoRoutes.post(
  '/',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  SessaoController.criar
);

export default sessaoRoutes;
