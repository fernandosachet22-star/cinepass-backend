
import { Router } from 'express';
import ReservaController from '../controllers/ReservaController';
import {
  autenticar,
  autorizarPerfis,
} from '../middlewares/autenticacao';

const reservaRoutes = Router();

reservaRoutes.post(
  '/',
  autenticar,
  ReservaController.criar
);

reservaRoutes.post(
  '/balcao',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  ReservaController.criarNoBalcao
);

export default reservaRoutes;
