
import { Router } from 'express';
import IngressoController from '../controllers/IngressoController';
import {
  autenticar,
  autorizarPerfis,
} from '../middlewares/autenticacao';

const ingressoRoutes = Router();

ingressoRoutes.get(
  '/meus',
  autenticar,
  IngressoController.meus
);

ingressoRoutes.get(
  '/:codigo',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  IngressoController.buscarPorCodigo
);

ingressoRoutes.post(
  '/:codigo/validar',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  IngressoController.validar
);

export default ingressoRoutes;
