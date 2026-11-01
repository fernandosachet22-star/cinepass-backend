
import { Router } from 'express';
import SalaController from '../controllers/SalaController';
import { autenticar, autorizarPerfis } from '../middlewares/autenticacao';

const router = Router();

router.get('/', SalaController.listar);
router.get('/:id', SalaController.buscarPorId);

router.post(
  '/',
  autenticar,
  autorizarPerfis('OPERADOR', 'ADMINISTRADOR'),
  SalaController.criar
);

export default router;
