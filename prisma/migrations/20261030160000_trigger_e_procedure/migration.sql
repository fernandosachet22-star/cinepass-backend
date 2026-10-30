
-- TRIGGER: valida a reserva antes de reservar um assento

CREATE OR REPLACE FUNCTION validar_reserva_assento()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_sessao_id INTEGER;
    v_status TEXT;
    v_expira_em TIMESTAMP;
    v_data_sessao TIMESTAMP;
BEGIN
    IF NEW.status = 'RESERVADO' THEN

        SELECT
            r."sessaoId",
            r.status::TEXT,
            r."expiraEm",
            s."dataHora"
        INTO
            v_sessao_id,
            v_status,
            v_expira_em,
            v_data_sessao
        FROM "Reserva" r
        JOIN "Sessao" s ON s.id = r."sessaoId"
        WHERE r.id = NEW."reservaId";

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Reserva não encontrada.';
        END IF;

        IF v_sessao_id <> NEW."sessaoId" THEN
            RAISE EXCEPTION 'A reserva não pertence à sessão informada.';
        END IF;

        IF v_status <> 'ATIVA' THEN
            RAISE EXCEPTION 'A reserva não está ativa.';
        END IF;

        IF v_expira_em <= CURRENT_TIMESTAMP THEN
            RAISE EXCEPTION 'A reserva está expirada.';
        END IF;

        IF v_data_sessao <= CURRENT_TIMESTAMP THEN
            RAISE EXCEPTION 'Não é possível reservar assentos para sessões iniciadas.';
        END IF;

    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_validar_reserva_assento
BEFORE INSERT OR UPDATE ON "ReservaAssento"
FOR EACH ROW
EXECUTE FUNCTION validar_reserva_assento();


-- STORED PROCEDURE: relatório de ocupação e vendas por sessão

CREATE OR REPLACE PROCEDURE relatorio_ocupacao_sessoes(
    IN p_sessao_id INTEGER,
    INOUT p_resultado REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_resultado FOR
        SELECT
            s.id AS sessao_id,
            f.titulo AS filme,
            sa.nome AS sala,
            s."dataHora" AS data_hora,
            s.preco AS preco_ingresso,
            (sa.fileiras * sa."assentosPorFileira") AS total_assentos,

            COUNT(ra.id) FILTER (
                WHERE ra.status = 'VENDIDO'
            ) AS assentos_vendidos,

            COUNT(ra.id) FILTER (
                WHERE r.status = 'ATIVA'
                  AND r."expiraEm" > CURRENT_TIMESTAMP
                  AND ra.status = 'RESERVADO'
            ) AS assentos_reservados,

            (
                sa.fileiras * sa."assentosPorFileira"
                - COUNT(ra.id) FILTER (
                    WHERE ra.status IN ('VENDIDO', 'RESERVADO')
                      AND (
                          ra.status = 'VENDIDO'
                          OR (
                              r.status = 'ATIVA'
                              AND r."expiraEm" > CURRENT_TIMESTAMP
                          )
                      )
                )
            ) AS assentos_disponiveis,

            ROUND(
                COUNT(ra.id) FILTER (
                    WHERE ra.status = 'VENDIDO'
                ) * 100.0
                / NULLIF(
                    sa.fileiras * sa."assentosPorFileira",
                    0
                ),
                2
            ) AS percentual_ocupacao,

            COALESCE(
                SUM(
                    CASE
                        WHEN ra.status = 'VENDIDO'
                        THEN s.preco
                        ELSE 0
                    END
                ),
                0
            ) AS faturamento

        FROM "Sessao" s
        JOIN "Filme" f ON f.id = s."filmeId"
        JOIN "Sala" sa ON sa.id = s."salaId"
        LEFT JOIN "ReservaAssento" ra ON ra."sessaoId" = s.id
        LEFT JOIN "Reserva" r ON r.id = ra."reservaId"

        WHERE p_sessao_id IS NULL OR s.id = p_sessao_id

        GROUP BY
            s.id,
            f.titulo,
            sa.nome,
            sa.fileiras,
            sa."assentosPorFileira",
            s."dataHora",
            s.preco

        ORDER BY s."dataHora";
END;
$$;
