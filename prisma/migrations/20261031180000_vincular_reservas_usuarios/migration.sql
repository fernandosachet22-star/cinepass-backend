ALTER TABLE "Reserva"
ADD COLUMN "usuarioId" INTEGER;

CREATE INDEX "Reserva_usuarioId_idx"
ON "Reserva"("usuarioId");

ALTER TABLE "Reserva"
ADD CONSTRAINT "Reserva_usuarioId_fkey"
FOREIGN KEY ("usuarioId")
REFERENCES "Usuario"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
