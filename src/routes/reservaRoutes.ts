
import { Router } from 'express';
import ReservaController from '../controllers/ReservaController';

const reservaRoutes = Router();

reservaRoutes.post('/', ReservaController.criar);

export default reservaRoutes;
