
import { Router } from 'express';
import ReservaController from '../controllers/ReservaController';
import { autenticar } from '../middlewares/autenticacao';

const reservaRoutes = Router();

reservaRoutes.post('/', autenticar, ReservaController.criar);

export default reservaRoutes;
