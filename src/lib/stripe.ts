import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // latest typical version for 16.x
  appInfo: {
    name: "Kelven Digital Platform",
    version: "0.1.0",
  },
});
