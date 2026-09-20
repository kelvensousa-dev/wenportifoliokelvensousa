"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutButton({ productId, price }: { productId: string; price: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar sessão de checkout");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o Stripe
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao iniciar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Processando..." : `Comprar por ${(price / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
    </button>
  );
}
