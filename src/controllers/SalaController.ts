import { Request, Response } from 'express';
import SalaService from '../services/SalaService';

class SalaController {
  async listar(req: Request, res: Response) {
    try {
      const salas = await SalaService.listar();
      return res.json(salas);
    } catch (error) {
      return res.status(500).json({
        mensagem: 'Erro ao listar salas.',
      });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const sala = await SalaService.buscarPorId(id);

      return res.json(sala);
    } catch (error) {
      return res.status(404).json({
        mensagem: 'Sala não encontrada.',
      });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const sala = await SalaService.criar(req.body);

      return res.status(201).json({
        mensagem: 'Sala cadastrada com sucesso!',
        sala,
      });
    } catch (error) {
      return res.status(400).json({
        mensagem: error instanceof Error
          ? error.message
          : 'Erro ao cadastrar sala.',
      });
    }
  }
}

export default new SalaController();