import IngressoRepository, {
  IngressoParaValidacao,
} from '../repositories/IngressoRepository';

class IngressoService {
  async buscarPorCodigo(codigo: string) {
    if (!codigo || codigo.trim().length === 0) {
      throw new Error('Informe o código do ingresso.');
    }

    const ingresso = await IngressoRepository.buscarPorCodigo(
      codigo.trim()
    );

    if (!ingresso) {
      throw new Error('Ingresso não encontrado.');
    }

    return ingresso;
  }

  async listarPorUsuario(usuarioId: number) {
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      throw new Error('Usuário inválido.');
    }

    return IngressoRepository.listarPorUsuario(usuarioId);
  }

  async validar(codigo: string) {
    if (!codigo || codigo.trim().length === 0) {
      throw new Error('Informe o código do ingresso.');
    }

    return IngressoRepository.validar(
      codigo.trim(),
      (ingresso: IngressoParaValidacao | null) => {
        if (!ingresso) {
          throw new Error('Ingresso não encontrado.');
        }

        if (ingresso.utilizadoEm) {
          throw new Error('Este ingresso já foi utilizado.');
        }

        return ingresso;
      }
    );
  }
}

export default new IngressoService();