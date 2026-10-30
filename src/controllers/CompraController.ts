
import { Request, Response } from 'express';
import CompraService from '../services/CompraService';

class CompraController {
  async confirmar(req: Request, res: Response) {
    try {
      const reservaId = Number(req.params.reservaId);

      const compra = await CompraService.confirmar(reservaId);

      return res.status(200).json({
        mensagem: 'Compra confirmada com sucesso!',
        compra,
      });
    } catch (erro) {
      if (erro instanceof Error) {
        if (
          erro.message.includes('inválido') ||
          erro.message.includes('não encontrada') ||
          erro.message.includes('não está ativa') ||
          erro.message.includes('expirou') ||
          erro.message.includes('não possui')
        ) {
          return res.status(400).json({ erro: erro.message });
        }
      }

      return res.status(500).json({
        erro: 'Não foi possível confirmar a compra.',
      });
    }
  }
}

export default new CompraController();
