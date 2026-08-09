"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type SubmitState =
  | "idle"
  | "submitting"
  | "success";

export function GuildFeedback() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [allowContact, setAllowContact] =
    useState(false);
  const [submitState, setSubmitState] =
    useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 80);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function resetForm() {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setAllowContact(false);
    setError("");
    setSubmitState("idle");
  }

  function closeModal() {
    setOpen(false);

    window.setTimeout(() => {
      if (submitState === "success") {
        resetForm();
      }
    }, 150);
  }

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Choose a star rating first.");
      return;
    }

    if (!comment.trim()) {
      setError("Tell us what you think before sending.");
      textareaRef.current?.focus();
      return;
    }

    setSubmitState("submitting");
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          allowContact,
          pagePath:
            typeof window !== "undefined"
              ? window.location.pathname
              : "/",
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Your feedback could not be sent.",
        );
      }

      setSubmitState("success");
    } catch (submitError) {
      setSubmitState("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your feedback could not be sent.",
      );
    }
  }

  return (
    <>
      <section className="mt-4 border-t border-[#8d6b2c]/55 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[9px] text-[#d4ad58]">
            ✦
          </span>
          <h3 className="font-serif text-sm font-bold uppercase tracking-[0.06em] text-[#ead7a9]">
            Guild Feedback
          </h3>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#6d5125,transparent)]" />
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setOpen(true);
          }}
          className="w-full rounded-sm border border-[#a98035] bg-[#19140f] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116]"
        >
          ★ Leave Guild Feedback
        </button>

        <p className="mt-2 text-center font-serif text-[11px] italic leading-4 text-[#bba77c]">
          Ideas, bugs, confusion or praise — tell us
          anything.
        </p>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guild-feedback-title"
            className="relative w-full max-w-xl overflow-hidden rounded-[16px] border border-[#a98035] bg-[linear-gradient(180deg,#21170f_0%,#130e0a_100%)] text-[#ead7a9] shadow-[0_26px_90px_rgba(0,0,0,0.65)]"
          >
            <div className="border-b border-[#725523] bg-[#1a120c] px-5 py-5 sm:px-6">
              <div className="pr-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c39a4a]">
                  NPC Recruiter
                </p>
                <h2
                  id="guild-feedback-title"
                  className="mt-1 font-serif text-2xl font-bold text-[#f1dfb7]"
                >
                  Leave Guild Feedback
                </h2>
                <p className="mt-2 text-xs leading-5 text-[#a99672]">
                  This stays inside NPC Recruiter. It is
                  not a public review.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close feedback"
                onClick={closeModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#5e4828] bg-[#130e0a] text-lg text-[#bda878] transition hover:border-[#a98035] hover:text-[#f2dfb6]"
              >
                ×
              </button>
            </div>

            {submitState === "success" ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#876728] bg-[#20170d] text-2xl text-[#d2aa54]">
                  ★
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold text-[#f0ddb4]">
                  Thank you.
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#ad9a77]">
                  Your feedback has been sent to the
                  Guildmaster and will help shape NPC
                  Recruiter.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-7 rounded-sm border border-[#b68a36] bg-[#ae812f] px-8 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#171008] transition hover:bg-[#c0923a]"
                >
                  Return to Recruiter
                </button>
              </div>
            ) : (
              <form
                onSubmit={submitFeedback}
                className="space-y-6 px-5 py-6 sm:px-6"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b8a076]">
                    Overall Experience
                  </p>
                  <p className="mt-1 text-xs text-[#7f725c]">
                    How would you rate your experience
                    today?
                  </p>

                  <div
                    className="mt-3 flex gap-2"
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled =
                        star <=
                        (hoverRating || rating);

                      return (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star} star${
                            star === 1 ? "" : "s"
                          }`}
                          aria-pressed={
                            rating === star
                          }
                          onMouseEnter={() =>
                            setHoverRating(star)
                          }
                          onFocus={() =>
                            setHoverRating(star)
                          }
                          onBlur={() =>
                            setHoverRating(0)
                          }
                          onClick={() => {
                            setRating(star);
                            setError("");
                          }}
                          className={`text-4xl leading-none transition ${
                            filled
                              ? "scale-105 text-[#d2a340]"
                              : "text-[#51432d] hover:text-[#a77d31]"
                          }`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guild-feedback-comment"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b8a076]"
                  >
                    Tell us anything
                  </label>
                  <p className="mt-1 text-xs leading-5 text-[#7f725c]">
                    Ideas, bugs, confusing parts, things
                    you loved — whatever comes to mind.
                  </p>

                  <textarea
                    ref={textareaRef}
                    id="guild-feedback-comment"
                    value={comment}
                    maxLength={4000}
                    rows={7}
                    onChange={(event) => {
                      setComment(event.target.value);
                      setError("");
                    }}
                    placeholder="I tried NPC Recruiter today and..."
                    className="mt-3 w-full resize-y rounded-sm border border-[#624a27] bg-[#0f0b08] px-4 py-3 font-serif text-sm leading-6 text-[#ead7a9] outline-none transition placeholder:italic placeholder:text-[#5f5545] focus:border-[#b18438]"
                  />

                  <p className="mt-1 text-right text-[9px] text-[#635947]">
                    {comment.length.toLocaleString()} /
                    4,000
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-[#40311e] bg-[#130f0b] p-3">
                  <input
                    type="checkbox"
                    checked={allowContact}
                    onChange={(event) =>
                      setAllowContact(
                        event.target.checked,
                      )
                    }
                    className="mt-0.5 h-4 w-4 accent-[#b88b36]"
                  />
                  <span>
                    <span className="block text-xs font-bold text-[#cbb78d]">
                      You may contact me about this
                      feedback.
                    </span>
                    <span className="mt-1 block text-[10px] leading-4 text-[#766b57]">
                      Optional. Your account email is
                      already known to NPC Recruiter.
                    </span>
                  </span>
                </label>

                {error && (
                  <div className="rounded-sm border border-[#853f30] bg-[#2c1712] px-4 py-3 text-xs leading-5 text-[#efb4a7]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    submitState === "submitting"
                  }
                  className="w-full rounded-sm border border-[#c0923b] bg-[#b48732] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#171008] transition hover:bg-[#c79a40] disabled:cursor-wait disabled:opacity-60"
                >
                  {submitState === "submitting"
                    ? "Sending to the Guildmaster..."
                    : "Send Feedback"}
                </button>

                <p className="text-center text-[9px] leading-4 text-[#665c4c]">
                  Private product feedback for NPC
                  Recruiter. Nothing is posted publicly.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
