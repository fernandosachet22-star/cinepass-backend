
import { Request, Response } from 'express';
import CompraService from '../services/CompraService';

class CompraController {
  async confirmar(req: Request, res: Response) {
    try {
      const usuarioId = req.usuario?.id;

      if (!usuarioId) {
        return res.status(401).json({
          erro: 'Autenticação necessária.',
        });
      }

      const reservaId = Number(req.params.reservaId);

      const compra = await CompraService.confirmar(
        reservaId,
        usuarioId
      );

      return res.status(200).json({
        mensagem: 'Compra confirmada com sucesso!',
        compra,
      });
    } catch (erro) {
      if (erro instanceof Error) {
        if (erro.message.includes('inválido')) {
          return res.status(400).json({ erro: erro.message });
        }

        if (erro.message.includes('permissão')) {
          return res.status(403).json({ erro: erro.message });
        }

        if (
          erro.message.includes('não encontrada') ||
          erro.message.includes('não está ativa') ||
          erro.message.includes('expirou') ||
          erro.message.includes('não possui')
        ) {
          return res.status(400).json({ erro: erro.message });
        }
      }

      return res.status(409).json({
        erro: erro instanceof Error
          ? erro.message
          : 'Não foi possível confirmar a compra.',
      });
    }
  }
}

export default new CompraController();
