
import { Router } from 'express';
import CompraController from '../controllers/CompraController';
import { autenticar } from '../middlewares/autenticacao';

const compraRoutes = Router();

compraRoutes.post(
  '/:reservaId/confirmar',
  autenticar,
  CompraController.confirmar
);

export default compraRoutes;
