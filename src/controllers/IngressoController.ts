
import { Request, Response } from 'express';
import IngressoService from '../services/IngressoService';

class IngressoController {
  async buscarPorCodigo(req: Request, res: Response) {
    try {
      const codigo = String(req.params.codigo);

      const ingresso = await IngressoService.buscarPorCodigo(codigo);

      return res.json(ingresso);
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao consultar ingresso.';

      return res.status(erro instanceof Error && mensagem === 'Ingresso não encontrado.' ? 404 : 400)
        .json({ erro: mensagem });
    }
  }

  async validar(req: Request, res: Response) {
    try {
      const codigo = String(req.params.codigo);

      const ingresso = await IngressoService.validar(codigo);

      return res.json({
        mensagem: 'Ingresso validado com sucesso!',
        ingresso,
      });
    } catch (erro) {
      const mensagem = erro instanceof Error
        ? erro.message
        : 'Erro ao validar ingresso.';

      const status = mensagem === 'Ingresso não encontrado.'
        ? 404
        : mensagem === 'Este ingresso já foi utilizado.'
          ? 409
          : 400;

      return res.status(status).json({ erro: mensagem });
    }
  }
}

export default new IngressoController();
