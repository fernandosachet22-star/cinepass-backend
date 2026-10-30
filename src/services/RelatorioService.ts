
import RelatorioRepository from '../repositories/RelatorioRepository';

class RelatorioService {
  async listar() {
    const sessoes = await RelatorioRepository.buscarVendasEOcupacao();

    const resumo = sessoes.reduce(
      (total, sessao) => {
        total.ingressosVendidos += sessao.ingressosVendidos;
        total.capacidadeTotal += sessao.capacidade;
        total.faturamentoTotal += sessao.faturamento;
        return total;
      },
      {
        totalSessoes: sessoes.length,
        ingressosVendidos: 0,
        capacidadeTotal: 0,
        faturamentoTotal: 0,
      }
    );

    const ocupacaoGeral =
      resumo.capacidadeTotal > 0
        ? (resumo.ingressosVendidos / resumo.capacidadeTotal) * 100
        : 0;

    return {
      resumo: {
        ...resumo,
        faturamentoTotal: Number(
          resumo.faturamentoTotal.toFixed(2)
        ),
        ocupacaoGeral: Number(ocupacaoGeral.toFixed(2)),
      },
      sessoes,
    };
  }
}

export default new RelatorioService();
