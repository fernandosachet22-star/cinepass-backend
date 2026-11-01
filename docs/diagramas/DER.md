erDiagram
    USUARIO {
        int id PK
        string nome
        string email UK
        string senhaHash
        string perfil
    }

    FILME {
        int id PK
        string titulo
        string descricao
        int duracao
        string classificacao
        string genero
        string imagem
    }

    SALA {
        int id PK
        string nome UK
        int fileiras
        int assentosPorFileira
    }

    ASSENTO {
        int id PK
        string codigo
        string fileira
        int numero
        int salaId FK
    }

    SESSAO {
        int id PK
        datetime dataHora
        decimal preco
        int filmeId FK
        int salaId FK
    }

    RESERVA {
        int id PK
        datetime criadaEm
        datetime expiraEm
        string status
        int sessaoId FK
        int usuarioId FK
    }

    RESERVA_ASSENTO {
        int id PK
        int reservaId FK
        int sessaoId FK
        int assentoId FK
        string status
    }

    INGRESSO {
        int id PK
        string codigo UK
        datetime criadoEm
        datetime utilizadoEm
        int reservaAssentoId FK
    }

    USUARIO o|--o{ RESERVA : realiza
    FILME ||--o{ SESSAO : possui
    SALA ||--o{ SESSAO : recebe
    SALA ||--o{ ASSENTO : possui
    SESSAO ||--o{ RESERVA : recebe
    RESERVA ||--o{ RESERVA_ASSENTO : contem
    SESSAO ||--o{ RESERVA_ASSENTO : controla
    ASSENTO ||--o{ RESERVA_ASSENTO : selecionado
    RESERVA_ASSENTO ||--o| INGRESSO : gera