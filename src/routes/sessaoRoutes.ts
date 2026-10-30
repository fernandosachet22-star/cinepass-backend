
import { Router } from 'express';
import SessaoController from '../controllers/SessaoController';

const sessaoRoutes = Router();

sessaoRoutes.get('/', SessaoController.listarTodas);
sessaoRoutes.get('/filme/:filmeId', SessaoController.listarPorFilme);
sessaoRoutes.get('/:sessaoId/assentos', SessaoController.listarAssentos);
sessaoRoutes.post('/', SessaoController.criar);

export default sessaoRoutes;
