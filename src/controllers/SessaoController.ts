
import { Request, Response } from 'express';
import SessaoService from '../services/SessaoService';

class SessaoController {
  listarPorFilme = async (req: Request, res: Response) => {
    try {
      const filmeId = Number(req.params.filmeId);

      if (!Number.isInteger(filmeId) || filmeId <= 0) {
        return res.status(400).json({
          erro: 'ID do filme inválido.',
        });
      }

      const sessoes = await SessaoService.listarPorFilme(filmeId);

      return res.json(sessoes);
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao buscar sessões.';

      return res.status(404).json({ erro: mensagem });
    }
  };

  listarAssentos = async (req: Request, res: Response) => {
    try {
      const sessaoId = Number(req.params.sessaoId);

      const dados = await SessaoService.listarAssentos(sessaoId);

      return res.json(dados);
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao buscar assentos.';

      return res.status(404).json({ erro: mensagem });
    }
  };

  listarTodas = async (req: Request, res: Response) => {
    try {
      const sessoes = await SessaoService.listarTodas();
      return res.json(sessoes);
    } catch (erro) {
      return res.status(500).json({
        erro: 'Erro ao listar sessões.',
      });
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const sessao = await SessaoService.criar({
        filmeId: Number(req.body.filmeId),
        salaId: Number(req.body.salaId),
        dataHora: req.body.dataHora,
        preco: Number(req.body.preco),
      });

      return res.status(201).json({
        mensagem: 'Sessão cadastrada com sucesso!',
        sessao,
      });
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao cadastrar sessão.';

      return res.status(400).json({ erro: mensagem });
    }
  };
}

export default new SessaoController();
