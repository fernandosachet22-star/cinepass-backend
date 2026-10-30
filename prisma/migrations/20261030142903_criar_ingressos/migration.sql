-- CreateTable
CREATE TABLE "Ingresso" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilizadoEm" TIMESTAMP(3),
    "reservaAssentoId" INTEGER NOT NULL,

    CONSTRAINT "Ingresso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingresso_codigo_key" ON "Ingresso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Ingresso_reservaAssentoId_key" ON "Ingresso"("reservaAssentoId");

-- CreateIndex
CREATE INDEX "Ingresso_codigo_idx" ON "Ingresso"("codigo");

-- AddForeignKey
ALTER TABLE "Ingresso" ADD CONSTRAINT "Ingresso_reservaAssentoId_fkey" FOREIGN KEY ("reservaAssentoId") REFERENCES "ReservaAssento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
