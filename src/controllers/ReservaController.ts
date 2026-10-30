
import { Request, Response } from 'express';
import ReservaService from '../services/ReservaService';

class ReservaController {
  async criar(req: Request, res: Response) {
    try {
      const sessaoId = Number(req.body.sessaoId);
      const assentosIds = req.body.assentosIds;

      const reserva = await ReservaService.criar(sessaoId, assentosIds);

      return res.status(201).json({
        mensagem: 'Reserva realizada com sucesso! Você tem 10 minutos para concluir a compra.',
        reserva,
      });
    } catch (erro) {
      if (erro instanceof Error) {
        if (
          erro.message.includes('inválida') ||
          erro.message.includes('Selecione') ||
          erro.message.includes('encontrada') ||
          erro.message.includes('pertencem') ||
          erro.message.includes('começou')
        ) {
          return res.status(400).json({ erro: erro.message });
        }
      }

      return res.status(409).json({
        erro: 'Um ou mais assentos já estão reservados ou vendidos.',
      });
    }
  }
}

export default new ReservaController();
