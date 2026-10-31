
import FilmeRepository from '../repositories/FilmeRepository';

interface CriarFilmeDTO {
  titulo: string;
  descricao: string;
  duracao: number;
  classificacao: string;
  genero: string;
  imagem: string;
}

class FilmeService {
  async listar() {
    return await FilmeRepository.listar();
  }

  async buscarPorId(id: number) {
    const filme = await FilmeRepository.buscarPorId(id);

    if (!filme) {
      throw new Error('Filme não encontrado.');
    }

    return filme;
  }

  async criar(dados: CriarFilmeDTO) {
    if (!dados.titulo || dados.titulo.trim() === '') {
      throw new Error('O título do filme é obrigatório.');
    }

    if (!Number.isInteger(dados.duracao) || dados.duracao <= 0) {
      throw new Error('A duração deve ser maior que zero.');
    }

    return await FilmeRepository.criar(dados);
  }

  async atualizar(id: number, dados: CriarFilmeDTO) {
    await this.buscarPorId(id);

    if (!dados.titulo || dados.titulo.trim() === '') {
      throw new Error('O título do filme é obrigatório.');
    }

    if (!Number.isInteger(dados.duracao) || dados.duracao <= 0) {
      throw new Error('A duração deve ser maior que zero.');
    }

    return await FilmeRepository.atualizar(id, dados);
  }

  async excluir(id: number) {
    await this.buscarPorId(id);

    return await FilmeRepository.excluir(id);
  }
}

export default new FilmeService();
