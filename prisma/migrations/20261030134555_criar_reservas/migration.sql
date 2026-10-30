-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('ATIVA', 'EXPIRADA', 'CONFIRMADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusAssentoReserva" AS ENUM ('RESERVADO', 'VENDIDO');

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'ATIVA',
    "sessaoId" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaAssento" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "sessaoId" INTEGER NOT NULL,
    "assentoId" INTEGER NOT NULL,
    "status" "StatusAssentoReserva" NOT NULL DEFAULT 'RESERVADO',

    CONSTRAINT "ReservaAssento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reserva_expiraEm_idx" ON "Reserva"("expiraEm");

-- CreateIndex
CREATE INDEX "Reserva_sessaoId_status_idx" ON "Reserva"("sessaoId", "status");

-- CreateIndex
CREATE INDEX "ReservaAssento_reservaId_idx" ON "ReservaAssento"("reservaId");

-- CreateIndex
CREATE INDEX "ReservaAssento_sessaoId_status_idx" ON "ReservaAssento"("sessaoId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaAssento_sessaoId_assentoId_key" ON "ReservaAssento"("sessaoId", "assentoId");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaAssento" ADD CONSTRAINT "ReservaAssento_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaAssento" ADD CONSTRAINT "ReservaAssento_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaAssento" ADD CONSTRAINT "ReservaAssento_assentoId_fkey" FOREIGN KEY ("assentoId") REFERENCES "Assento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
