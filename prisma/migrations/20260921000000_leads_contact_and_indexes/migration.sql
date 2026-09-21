-- Formularios de contato/orcamento passam a ser gravados (antes eram descartados).
ALTER TABLE "Lead" ADD COLUMN "name" TEXT;
ALTER TABLE "Lead" ADD COLUMN "subject" TEXT;
ALTER TABLE "Lead" ADD COLUMN "message" TEXT;

-- Indices para as consultas do painel e do webhook de pagamento.
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_providerId_idx" ON "Order"("providerId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "ProductKey_orderId_idx" ON "ProductKey"("orderId");
