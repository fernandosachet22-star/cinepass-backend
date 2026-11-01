
import { Router } from 'express';
import CompraController from '../controllers/CompraController';
import {
  autenticar,
  autorizarPerfis,
} from '../middlewares/autenticacao';

const compraRoutes = Router();

compraRoutes.post(
  '/:reservaId/confirmar',
  autenticar,
  CompraController.confirmar
);

compraRoutes.post(
  '/balcao/:reservaId/confirmar',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  CompraController.venderNoBalcao
);

export default compraRoutes;
