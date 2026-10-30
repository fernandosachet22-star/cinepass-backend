
import { Request, Response } from 'express';
import FilmeService from '../services/FilmeService';

class FilmeController {
  listar = async (req: Request, res: Response) => {
    try {
      const filmes = await FilmeService.listar();
      return res.json(filmes);
    } catch (erro) {
      return res.status(500).json({
        erro: 'Erro ao listar filmes.',
      });
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const filme = await FilmeService.criar(req.body);

      return res.status(201).json(filme);
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao cadastrar filme.';

      return res.status(400).json({ erro: mensagem });
    }
  };

  excluir = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await FilmeService.excluir(id);

      return res.status(200).json({
        mensagem: 'Filme excluído com sucesso.',
      });
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao excluir filme.';

      return res.status(400).json({ erro: mensagem });
    }
  };
}

export default new FilmeController();
