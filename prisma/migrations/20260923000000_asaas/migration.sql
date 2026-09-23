-- Integracao Asaas (pagamentos em reais: Pix, boleto e cartao BR).
ALTER TABLE "User" ADD COLUMN "cpfCnpj" TEXT;
ALTER TABLE "User" ADD COLUMN "asaasCustomerId" TEXT;
CREATE UNIQUE INDEX "User_asaasCustomerId_key" ON "User"("asaasCustomerId");

ALTER TABLE "Product" ADD COLUMN "priceBrlCents" INTEGER;

ALTER TABLE "Order" ADD COLUMN "paymentUrl" TEXT;

CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt");
