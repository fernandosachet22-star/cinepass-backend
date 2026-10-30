
import prisma from '../database/prisma';

export type RelatorioSessao = {
  sessaoId: number;
  filme: string;
  sala: string;
  dataHora: Date;
  precoIngresso: number;
  ingressosVendidos: number;
  capacidade: number;
  ocupacaoPercentual: number;
  faturamento: number;
};

class RelatorioRepository {
  async buscarVendasEOcupacao(): Promise<RelatorioSessao[]> {
    return prisma.$queryRaw<RelatorioSessao[]>`
      SELECT
        se.id AS "sessaoId",
        f.titulo AS "filme",
        sl.nome AS "sala",
        se."dataHora" AS "dataHora",
        se.preco::double precision AS "precoIngresso",

        COUNT(i.id)::integer AS "ingressosVendidos",

        (
          sl.fileiras * sl."assentosPorFileira"
        )::integer AS "capacidade",

        CASE
          WHEN sl.fileiras * sl."assentosPorFileira" > 0 THEN
            ROUND(
              (
                COUNT(i.id)::numeric /
                (sl.fileiras * sl."assentosPorFileira")::numeric
              ) * 100,
              2
            )::double precision
          ELSE 0::double precision
        END AS "ocupacaoPercentual",

        (
          COUNT(i.id)::numeric * se.preco
        )::double precision AS "faturamento"

      FROM "Sessao" se

      INNER JOIN "Filme" f
        ON f.id = se."filmeId"

      INNER JOIN "Sala" sl
        ON sl.id = se."salaId"

      LEFT JOIN "ReservaAssento" ra
        ON ra."sessaoId" = se.id
        AND ra.status = 'VENDIDO'

      LEFT JOIN "Ingresso" i
        ON i."reservaAssentoId" = ra.id

      GROUP BY
        se.id,
        se."dataHora",
        se.preco,
        f.titulo,
        sl.nome,
        sl.fileiras,
        sl."assentosPorFileira"

      ORDER BY
        se."dataHora" DESC,
        se.id DESC
    `;
  }
}

export default new RelatorioRepository();
