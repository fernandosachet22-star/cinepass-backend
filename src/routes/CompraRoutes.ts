
import { Router } from 'express';
import CompraController from '../controllers/CompraController';

const compraRoutes = Router();

compraRoutes.post('/:reservaId/confirmar', CompraController.confirmar);

export default compraRoutes;
