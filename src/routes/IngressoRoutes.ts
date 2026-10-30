
import { Router } from 'express';
import IngressoController from '../controllers/IngressoController';

const ingressoRoutes = Router();

ingressoRoutes.get('/:codigo', IngressoController.buscarPorCodigo);
ingressoRoutes.post('/:codigo/validar', IngressoController.validar);

export default ingressoRoutes;
