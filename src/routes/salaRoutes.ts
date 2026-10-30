import { Router } from 'express';
import SalaController from '../controllers/SalaController';

const router = Router();

router.get('/', SalaController.listar);
router.get('/:id', SalaController.buscarPorId);
router.post('/', SalaController.criar);

export default router;