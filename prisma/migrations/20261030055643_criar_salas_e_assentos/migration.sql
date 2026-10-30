-- CreateTable
CREATE TABLE "Sala" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "fileiras" INTEGER NOT NULL,
    "assentosPorFileira" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "fileira" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,

    CONSTRAINT "Assento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sala_nome_key" ON "Sala"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Assento_salaId_codigo_key" ON "Assento"("salaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Assento_salaId_fileira_numero_key" ON "Assento"("salaId", "fileira", "numero");

-- AddForeignKey
ALTER TABLE "Assento" ADD CONSTRAINT "Assento_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
