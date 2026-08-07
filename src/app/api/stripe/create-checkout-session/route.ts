import Stripe from "stripe";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY in .env.local.",
  );
}

const stripe = new Stripe(stripeSecretKey);

const tokenPacks = {
  starter: {
    priceId: "price_1U1bcSCX3nzlqgsd9lfljsi3",
    tokens: 20,
    name: "Bronze Chest",
  },
  adventurer: {
    priceId: "price_1U1bazCX3nzlqgsdY41XNq11",
    tokens: 75,
    name: "Iron Strongbox",
  },
  guildmaster: {
    priceId: "price_1U1ElKCX3nzlqgsd65yoov1k",
    tokens: 200,
    name: "Golden Guild Vault",
  },
} as const;

type TokenPackKey = keyof typeof tokenPacks;

type CheckoutRequest = {
  pack?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to purchase Guild Tokens.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as CheckoutRequest;
    const packKey = body.pack as TokenPackKey;

    if (!packKey || !(packKey in tokenPacks)) {
      return NextResponse.json(
        {
          error: "Please select a valid Guild Token pack.",
        },
        { status: 400 },
      );
    }

    const selectedPack = tokenPacks[packKey];
    const origin = new URL(request.url).origin;

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: selectedPack.priceId,
            quantity: 1,
          },
        ],
        success_url:
          `${origin}/?checkout=success` +
          "&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: `${origin}/?checkout=cancelled`,
        client_reference_id: user.id,
        customer_email: user.email ?? undefined,
        metadata: {
          user_id: user.id,
          token_pack: packKey,
          token_amount: String(selectedPack.tokens),
          token_pack_name: selectedPack.name,
        },
      });

    if (!checkoutSession.url) {
      throw new Error(
        "Stripe did not return a checkout URL.",
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error(
      "Stripe Checkout Session creation failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guild Treasury could not open checkout.",
      },
      { status: 500 },
    );
  }
}