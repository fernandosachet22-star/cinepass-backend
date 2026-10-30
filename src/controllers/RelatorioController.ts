
import { Request, Response } from 'express';
import RelatorioService from '../services/RelatorioService';

class RelatorioController {
  listar = async (_req: Request, res: Response) => {
    try {
      const relatorio = await RelatorioService.listar();

      return res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);

      return res.status(500).json({
        erro: 'Não foi possível gerar o relatório.',
      });
    }
  };
}

export default new RelatorioController();
