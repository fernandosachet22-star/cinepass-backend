
import { Router } from 'express';
import FilmeController from '../controllers/FilmeController';

const filmeRoutes = Router();

filmeRoutes.get('/', FilmeController.listar);
filmeRoutes.post('/', FilmeController.criar);
filmeRoutes.delete('/:id', FilmeController.excluir);

export default filmeRoutes;
