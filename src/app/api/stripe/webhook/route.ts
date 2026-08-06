import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET;

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY in .env.local.",
  );
}

if (!stripeWebhookSecret) {
  throw new Error(
    "Missing STRIPE_WEBHOOK_SECRET in .env.local.",
  );
}

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL in .env.local.",
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
}

const stripe = new Stripe(stripeSecretKey);

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(request: Request) {
  const signature = request.headers.get(
    "stripe-signature",
  );

  if (!signature) {
    return NextResponse.json(
      {
        error: "Missing Stripe signature.",
      },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      stripeWebhookSecret!,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Invalid Stripe webhook signature.",
      },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const userId =
        session.metadata?.user_id ??
        session.client_reference_id;

      const tokenAmount = Number(
        session.metadata?.token_amount,
      );

      const tokenPackName =
        session.metadata?.token_pack_name ??
        "Guild Token Pack";

      if (
        !userId ||
        !Number.isInteger(tokenAmount) ||
        tokenAmount <= 0
      ) {
        throw new Error(
          "Stripe checkout session is missing valid token metadata.",
        );
      }

      const { error } = await supabaseAdmin.rpc(
        "credit_guild_tokens",
        {
          target_user_id: userId,
          token_amount: tokenAmount,
          transaction_description: tokenPackName,
          checkout_session_id: session.id,
        },
      );

      if (error) {
        const duplicatePayment =
          error.code === "23505" ||
          error.message
            .toLowerCase()
            .includes("duplicate");

        if (!duplicatePayment) {
          throw error;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Stripe webhook processing failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guild Treasury could not process the payment.",
      },
      { status: 500 },
    );
  }
}