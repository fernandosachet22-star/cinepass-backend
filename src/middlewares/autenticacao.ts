
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

import jwt from 'jsonwebtoken';
import type { PerfilUsuario } from '../services/UsuarioService';

type DadosUsuarioToken = {
  id: number;
  email: string;
  perfil: PerfilUsuario;
};

declare global {
  namespace Express {
    interface Request {
      usuario?: DadosUsuarioToken;
    }
  }
}

const perfisValidos: PerfilUsuario[] = [
  'CLIENTE',
  'OPERADOR',
  'ADMINISTRADOR',
];

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Autenticação necessária.',
    });
  }

  const token = autorizacao.slice(7);
  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    return res.status(500).json({
      erro: 'Configuração de autenticação indisponível.',
    });
  }

  try {
    const dados = jwt.verify(token, segredo);

    if (typeof dados === 'string' || !dados.sub) {
      return res.status(401).json({
        erro: 'Token inválido.',
      });
    }

    const id = Number(dados.sub);
    const email = dados.email;
    const perfil = dados.perfil;

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof email !== 'string' ||
      typeof perfil !== 'string' ||
      !perfisValidos.includes(perfil as PerfilUsuario)
    ) {
      return res.status(401).json({
        erro: 'Token inválido.',
      });
    }

    req.usuario = {
      id,
      email,
      perfil: perfil as PerfilUsuario,
    };

    return next();
  } catch {
    return res.status(401).json({
      erro: 'Token inválido ou expirado.',
    });
  }
}

export function autorizarPerfis(
  ...perfisPermitidos: PerfilUsuario[]
): RequestHandler {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        erro: 'Autenticação necessária.',
      });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Você não tem permissão para realizar esta operação.',
      });
    }

    return next();
  };
}
