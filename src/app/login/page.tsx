"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [guildName, setGuildName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
  (mode === "sign-up" && !guildName.trim()) ||
  !email.trim() ||
  !password
) {
      setIsError(true);
      setMessage("Enter your email address and password.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password,
  options: {
    data: {
      guild_name: guildName.trim(),
    },
  },
});

        if (error) {
          throw error;
        }

        if (data.session) {
          router.push("/");
          router.refresh();
          return;
        }

        setMessage("Account created successfully.");
        return;
      }

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "The Guild Clerk could not complete your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ded3bd] px-4 py-10 text-[#2b2925]">
      <section className="w-full max-w-md border border-[#9e834e] bg-[#f8f1e2] shadow-[6px_7px_0_rgba(72,55,28,0.16)]">
        <header className="border-b border-[#9e834e] bg-[#efe2c7] px-6 py-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#826b3d]">
            Guild Records Office
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold">
            NPC Recruiter
          </h1>

          <p className="mt-2 font-serif text-sm italic text-[#6d6252]">
            Save your casts, portraits and printable cards.
          </p>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-2 border border-[#a8956e]">
            <button
              type="button"
              onClick={() => changeMode("sign-in")}
              className={
                mode === "sign-in"
                  ? "bg-[#2f2c25] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white"
                  : "bg-[#fffdf7] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#514839] transition hover:bg-[#eee4d0]"
              }
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => changeMode("sign-up")}
              className={
                mode === "sign-up"
                  ? "bg-[#2f2c25] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white"
                  : "bg-[#fffdf7] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#514839] transition hover:bg-[#eee4d0]"
              }
            >
              Create Account
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {mode === "sign-up" && (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#574c3a]">
      Guild Name
    </span>

    <input
      type="text"
      value={guildName}
      onChange={(event) =>
        setGuildName(event.target.value)
      }
      placeholder="Example: The Silver Stag"
      required
      className="w-full border border-[#a8956e] bg-[#fffdf7] px-4 py-3 text-sm outline-none transition focus:border-[#8b6928]"
    />
  </label>
)}

<label className="block">
  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#574c3a]">
    Email address
  </span>

  <input
    type="email"
    value={email}
    onChange={(event) =>
      setEmail(event.target.value)
    }
    autoComplete="email"
    required
    className="w-full border border-[#a8956e] bg-[#fffdf7] px-4 py-3 text-sm outline-none transition focus:border-[#8b6928]"
  />
</label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#574c3a]">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete={
                  mode === "sign-up"
                    ? "new-password"
                    : "current-password"
                }
                minLength={6}
                required
                className="w-full border border-[#a8956e] bg-[#fffdf7] px-4 py-3 text-sm outline-none transition focus:border-[#8b6928]"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-[#292720] bg-[#292720] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#494337] disabled:cursor-not-allowed disabled:bg-[#aaa08b]"
            >
              {isSubmitting
                ? "Consulting the guild records..."
                : mode === "sign-up"
                  ? "Create My Account"
                  : "Sign In"}
            </button>
          </form>

          {message && (
            <div
              className={
                isError
                  ? "mt-5 border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
                  : "mt-5 border border-[#55745b] bg-[#edf4ec] px-4 py-3 text-sm text-[#315138]"
              }
            >
              {message}
            </div>
          )}

          <p className="mt-5 text-center font-serif text-xs italic leading-5 text-[#716755]">
            Accounts are free. Guild Tokens are only used for
            portrait commissions.
          </p>
        </div>
      </section>
    </main>
  );
}