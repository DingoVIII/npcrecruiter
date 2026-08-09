"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type FeedbackItem = {
  id: string;
  rating: number;
  comment: string;
  allowContact: boolean;
  pagePath: string | null;
  appVersion: string | null;
  createdAt: string;
  user: {
    id: string | null;
    name: string;
    email: string;
  };
};

type FeedbackData = {
  summary: {
    totalResponses: number;
    averageRating: number;
    contactOkay: number;
    ratingCounts: Record<string, number>;
  };
  feedback: FeedbackItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function Stars({
  rating,
  large = false,
}: {
  rating: number;
  large?: boolean;
}) {
  const rounded = Math.round(rating);

  return (
    <span
      aria-label={`${rating} out of 5 stars`}
      className={
        large
          ? "tracking-[0.08em] text-[#d4a442] text-2xl"
          : "tracking-[0.06em] text-[#d4a442]"
      }
    >
      {[1, 2, 3, 4, 5]
        .map((star) =>
          star <= rounded ? "★" : "☆",
        )
        .join("")}
    </span>
  );
}

export function GuildmasterFeedbackInbox() {
  const [data, setData] =
    useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingFilter, setRatingFilter] =
    useState<number | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/feedback",
        {
          cache: "no-store",
        },
      );

      const result = (await response.json()) as
        | FeedbackData
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "Feedback could not be loaded.",
        );
      }

      setData(result as FeedbackData);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Feedback could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    if (ratingFilter === "all") {
      return data.feedback;
    }

    return data.feedback.filter(
      (item) => item.rating === ratingFilter,
    );
  }, [data, ratingFilter]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2a1c0e_0%,#151009_43%,#0e0a07_100%)] px-4 py-6 text-[#f3e3bf] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-[#765522] bg-[linear-gradient(135deg,#25190e_0%,#17100a_58%,#28190c_100%)] p-5 shadow-2xl sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.27em] text-[#c79c49]">
                NPC Recruiter · Guildmaster
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Guild Feedback
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bbaa86]">
                Private ratings and unscripted feedback
                from the people actually using NPC
                Recruiter.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin/dashboard"
                className="rounded-lg border border-[#8f692b] bg-[#1b130c] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#dec38c] transition hover:bg-[#2a1d10]"
              >
                ← Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void load()}
                disabled={loading}
                className="rounded-lg border border-[#c39742] bg-[#b48632] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#171008] transition hover:bg-[#c89a40] disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-xl border border-[#773b2e] bg-[#2b1712] px-4 py-3 text-sm text-[#e9ab9e]">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-[#59421f] bg-[#18120c] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#8e8066]">
                  Average Rating
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="font-serif text-3xl font-bold">
                    {data.summary.averageRating.toFixed(
                      2,
                    )}
                  </span>
                  <Stars
                    rating={
                      data.summary.averageRating
                    }
                    large
                  />
                </div>
              </article>

              <article className="rounded-xl border border-[#59421f] bg-[#18120c] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#8e8066]">
                  Responses
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {data.summary.totalResponses}
                </p>
              </article>

              <article className="rounded-xl border border-[#59421f] bg-[#18120c] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#8e8066]">
                  Contact Welcome
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {data.summary.contactOkay}
                </p>
              </article>
            </section>

            <section className="mt-4 overflow-hidden rounded-xl border border-[#4a361e] bg-[#17110c]">
              <div className="flex flex-col gap-3 border-b border-[#40301c] bg-[#21170e] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold">
                    Feedback Inbox
                  </h2>
                  <p className="mt-1 text-xs text-[#95866a]">
                    Newest first.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    5,
                    4,
                    3,
                    2,
                    1,
                  ].map((value) => {
                    const active =
                      ratingFilter === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setRatingFilter(
                            value as
                              | number
                              | "all",
                          )
                        }
                        className={
                          active
                            ? "rounded-full border border-[#a98035] bg-[#9b7028] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#171008]"
                            : "rounded-full border border-[#4a381f] bg-[#130f0a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#9e8e70]"
                        }
                      >
                        {value === "all"
                          ? "All"
                          : `${value}★`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="divide-y divide-[#382a1a]">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#81745d]">
                    No feedback in this view yet.
                  </div>
                ) : (
                  filtered.map((item) => (
                    <article
                      key={item.id}
                      className="p-5 transition hover:bg-[#1c140d]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <Stars
                              rating={item.rating}
                            />
                            <span className="font-serif text-sm font-bold text-[#ead8b3]">
                              {item.user.name}
                            </span>
                            {item.allowContact && (
                              <span className="rounded-full border border-[#567450] bg-[#192418] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#9fc699]">
                                Contact OK
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[11px] text-[#81745d]">
                            {item.user.email}
                          </p>
                        </div>

                        <span className="shrink-0 text-[10px] text-[#746852]">
                          {formatDate(
                            item.createdAt,
                          )}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap font-serif text-sm leading-6 text-[#d4c19b]">
                        {item.comment}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-[#302417] pt-3 text-[9px] uppercase tracking-[0.1em] text-[#665c4b]">
                        <span>
                          Page:{" "}
                          {item.pagePath ?? "Unknown"}
                        </span>
                        {item.appVersion && (
                          <span>
                            Version:{" "}
                            {item.appVersion}
                          </span>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {!data && loading && (
          <div className="mt-4 h-80 animate-pulse rounded-xl border border-[#4a361e] bg-[#17110c]" />
        )}
      </div>
    </main>
  );
}
