"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { generatePrintableCast } from "@/lib/pdf/printableCast";
import { createClient } from "@/lib/supabase/client";

type Npc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  roleplayingCue: string;
  portraitPrompt: string;
  
  hired?: boolean;

  portraitUrl?: string;
  portraitApproved?: boolean;
};

type RecruitResponse = {
  npcs: Npc[];
};

const speciesOptions = [
  "Human",
  "Orc",
  "Elf",
  "Half-Orc",
  "Dwarf",
  "Goblin",
  "Halfling",
  "Hobgoblin",
  "Gnome",
  "Bugbear",
  "Half-Elf",
  "Kobold",
  "Dragonborn",
  "Tiefling",
  "Goliath",
  "Aasimar",
];

const locations = [
  "Any",
  "Tavern",
  "Inn",
  "Village",
  "Hamlet",
  "Town",
  "City",
  "Capital",
  "Marketplace",
  "Docks",
  "Harbour",
  "Guildhall",
  "Temple",
  "Shrine",
  "Monastery",
  "Castle",
  "Keep",
  "Palace",
  "Barracks",
  "Prison",
  "Court",
  "Library",
  "University",
  "Theatre",
  "Forest",
  "Jungle",
  "Swamp",
  "Desert",
  "Mountain Pass",
  "Cave",
  "Mine",
  "Ruins",
  "Camp",
  "Watchtower",
  "Crossroads",
  "Bridge",
  "River Crossing",
  "Island",
  "Farm",
  "Mill",
  "Dungeon",
  "Ancient Tomb",
  "Wizard's Tower",
  "Necropolis",
  "Arena",
  "Festival",
  "Caravan",
  "Battlefield",
  "Refugee Camp",
  "Custom",
];

const inspirations = [
  "Any",
  "Roman-inspired",
  "Greek-inspired",
  "Norse-inspired",
  "Celtic-inspired",
  "Anglo-Saxon-inspired",
  "Norman-inspired",
  "Scottish-inspired",
  "Irish-inspired",
  "Slavic-inspired",
  "Germanic-inspired",
  "French-inspired",
  "Spanish-inspired",
  "Italian-inspired",
  "Persian-inspired",
  "Arabic-inspired",
  "Ottoman-inspired",
  "Egyptian-inspired",
  "Berber-inspired",
  "West African-inspired",
  "Indian-inspired",
  "Chinese-inspired",
  "Japanese-inspired",
  "Korean-inspired",
  "Mongolian-inspired",
  "Tibetan-inspired",
  "Aztec-inspired",
  "Mayan-inspired",
  "Incan-inspired",
  "Polynesian-inspired",
  "Forgotten Realms-inspired",
  "Dragonlance-inspired",
  "Middle-earth-inspired",
  "The Witcher-inspired",
  "Warhammer-inspired",
  "Warcraft-inspired",
  "Elder Scrolls-inspired",
  "Runeterra-inspired",
  "Dark Souls-inspired",
  "Critical Role-inspired",
  "Custom",
];

const genders = [
  "Any",
  "Male",
  "Female",
  "Mixed",
  "Androgynous",
  "Non-binary",
  "Custom",
];

const portraitStyles = [
  "Fantasy",
  "Historical",
  "Photorealistic",
];

export default function Home() {
  const [location, setLocation] = useState("Any");
  const [customLocation, setCustomLocation] = useState("");

  const [inspiration, setInspiration] = useState("Any");
  const [customInspiration, setCustomInspiration] = useState("");

  const [selectedSpecies, setSelectedSpecies] =
    useState<string[]>(speciesOptions);
  const [customSpecies, setCustomSpecies] = useState("");

  const [gender, setGender] = useState("Any");
  const [customGender, setCustomGender] = useState("");

  const [portraitStyle, setPortraitStyle] =
  useState("Fantasy");

  const [npcs, setNpcs] = useState<Npc[]>([]);
  const [isRecruiting, setIsRecruiting] = useState(false);
  const [isGeneratingPortraits, setIsGeneratingPortraits] =
    useState(false);
    const [portraitJobId, setPortraitJobId] =
  useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSavingCast, setIsSavingCast] = useState(false);
const [saveMessage, setSaveMessage] = useState("");
  const [guildName, setGuildName] = useState<string | null>(null);
const [authChecked, setAuthChecked] = useState(false);

const [guildTokens, setGuildTokens] = useState(0);
const [guildLedger, setGuildLedger] = useState<

  {
    amount: number;
    transaction_type: string;
    description: string;
    created_at: string;
  }[]
>([]);

const [isGuildLedgerOpen, setIsGuildLedgerOpen] =
  useState(false);

const [isTreasuryOpen, setIsTreasuryOpen] =
  useState(false);

const [isStartingCheckout, setIsStartingCheckout] =
  useState(false);

  useEffect(() => {
  const savedPortraitStyle =
    window.localStorage.getItem(
      "npc-recruiter-portrait-style",
    );

  if (
    savedPortraitStyle &&
    portraitStyles.includes(savedPortraitStyle)
  ) {
    setPortraitStyle(savedPortraitStyle);
  }
}, []);

useEffect(() => {
  const supabase = createClient();

  async function loadGuildName() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const savedGuildName =
  session?.user.user_metadata?.guild_name;

setGuildName(
  typeof savedGuildName === "string"
    ? savedGuildName
    : null,
);

if (session?.user) {
  const { data, error } = await supabase
    .from("guild_token_accounts")
    .select("balance")
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    console.error(
      "Guild Token balance could not be loaded:",
      error,
    );
  } else {
    setGuildTokens(data.balance);
    const ledgerResponse = await fetch(
  "/api/tokens/history",
);

if (ledgerResponse.ok) {
  const ledger =
    (await ledgerResponse.json()) as {
      transactions: {
        amount: number;
        transaction_type: string;
        description: string;
        created_at: string;
      }[];
    };

  setGuildLedger(
    ledger.transactions ?? [],
  );
}
  }
}
try {
  const response = await fetch("/api/casts/active");

  if (response.ok) {
    const result = await response.json();

    if (result.cast) {
      setLocation(result.cast.location);
      setInspiration(result.cast.inspiration);
      setSelectedSpecies(result.cast.species);
      setPortraitStyle(
        result.cast.portrait_style ?? "Fantasy",
      );
      setNpcs(result.cast.npcs ?? []);
    }
  }
} catch (error) {
  console.error(
    "Active cast could not be restored:",
    error,
  );
}
try {
  const response = await fetch(
    "/api/portraits/jobs",
  );

  if (response.ok) {
    const result = (await response.json()) as {
      job?: {
  id: string;
  status:
    | "queued"
    | "generating"
    | "completed";
  completed_portraits?: {
    name: string;
    imageUrl: string;
  }[];
} | null;
    };

    if (result.job) {
  if (
    result.job.status === "queued" ||
    result.job.status === "generating"
  ) {
    setPortraitJobId(result.job.id);
    setIsGeneratingPortraits(true);
  }

  if (
    result.job.status === "completed" &&
    Array.isArray(result.job.completed_portraits)
  ) {
    const portraitMap = new Map(
      result.job.completed_portraits.map(
        (portrait: {
          name: string;
          imageUrl: string;
        }) => [
          portrait.name,
          portrait.imageUrl,
        ],
      ),
    );

    setNpcs((current) =>
      current.map((npc) => ({
        ...npc,
        portraitUrl:
          portraitMap.get(npc.name) ??
          npc.portraitUrl,
        portraitApproved: false,
      })),
    );

    setIsGeneratingPortraits(false);
  }
}
  }
} catch (error) {
  console.error(
    "Active portrait commission could not be restored:",
    error,
  );
}

setAuthChecked(true);
  }

  void loadGuildName();
}, []);

   function toggleSpecies(option: string) {
    setSelectedSpecies((current) =>
      current.includes(option)
        ? current.filter((species) => species !== option)
        : [...current, option],
    );
  }

  function selectAllSpecies() {
    setSelectedSpecies(speciesOptions);
  }

  function deselectAllSpecies() {
    setSelectedSpecies([]);
  }

  function getRecruitmentSpecies() {
    const trimmedCustomSpecies = customSpecies.trim();

    if (!trimmedCustomSpecies) {
      return selectedSpecies;
    }

    return [...selectedSpecies, trimmedCustomSpecies];
  }

  function toggleHire(index: number) {
  setNpcs((current) =>
    current.map((npc, i) =>
      i === index
        ? {
            ...npc,
            hired: !npc.hired,
          }
        : npc,
    ),
  );
}
function togglePortraitApproval(index: number) {
  setNpcs((current) =>
    current.map((npc, i) =>
      i === index
        ? {
            ...npc,
            portraitApproved:
              !npc.portraitApproved,
          }
        : npc,
    ),
  );
}
function updateNpc(index: number, updatedNpc: Npc) {
  setNpcs((current) =>
    current.map((npc, i) =>
      i === index
        ? {
            ...updatedNpc,
            hired: npc.hired,
            portraitUrl: npc.portraitUrl,
          }
        : npc,
    ),
  );
}

  async function recruitNpcs() {
    const recruitmentSpecies = getRecruitmentSpecies();

    if (recruitmentSpecies.length === 0 || isRecruiting) {
      return;
    }

    if (location === "Custom" && !customLocation.trim()) {
      setErrorMessage("Please describe your custom location.");
      return;
    }

    if (inspiration === "Custom" && !customInspiration.trim()) {
      setErrorMessage("Please describe your custom inspiration.");
      return;
    }

    if (gender === "Custom" && !customGender.trim()) {
      setErrorMessage("Please describe your preferred gender mix.");
      return;
    }

    setIsRecruiting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/recruit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location:
            location === "Custom"
              ? customLocation.trim()
              : location,
          inspiration:
            inspiration === "Custom"
              ? customInspiration.trim()
              : inspiration,
          species: recruitmentSpecies,
          genderMix:
            gender === "Custom"
              ? customGender.trim()
              : gender,
        }),
      });

      if (!response.ok) {
        const errorResult = (await response.json()) as {
          error?: string;
        };

        throw new Error(
          errorResult.error ??
            "The recruiter could not complete the interviews.",
        );
      }

      const result = (await response.json()) as RecruitResponse;

      setNpcs(
  result.npcs.slice(0, 4).map((npc) => ({
    ...npc,
    hired: false,
  })),
);
    } catch (error) {
      console.error("Recruitment failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The recruiter could not complete the interviews.",
      );
    } finally {
      setIsRecruiting(false);
    }
  }

  async function generatePortraits() {
  const hiredNpcs = npcs.filter((npc) => npc.hired);

  if (hiredNpcs.length !== 4 || isGeneratingPortraits) {
    return;
  }

  setIsGeneratingPortraits(true);

  try {
    const response = await fetch("/api/portraits/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        style: portraitStyle,
        npcs: hiredNpcs,
      }),
    });

    const result = (await response.json()) as {
  jobId?: string;
  balance?: number;
  error?: string;
};

if (typeof result.balance === "number") {
  setGuildTokens(result.balance);
}

if (!response.ok) {
  throw new Error(
    result.error ?? "Portrait generation failed.",
  );
}

    if (!result.jobId) {
  throw new Error("No portrait job was created.");
}

setPortraitJobId(result.jobId);
    } catch (error) {
    console.error("Portrait generation failed:", error);

    setIsGeneratingPortraits(false);

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Portrait generation failed.",
    );
  }
}

async function replaceUnwantedPortraits() {
  const unwantedNpcs = npcs.filter(
    (npc) =>
      Boolean(npc.portraitUrl) &&
      !npc.portraitApproved,
  );

  if (
    unwantedNpcs.length === 0 ||
    guildTokens < unwantedNpcs.length ||
    isGeneratingPortraits
  ) {
    return;
  }

  setIsGeneratingPortraits(true);
  setErrorMessage("");

  try {
    const response = await fetch("/api/portraits/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        style: portraitStyle,
        npcs: unwantedNpcs,
        reroll: true,
      }),
    });

    const result = (await response.json()) as {
      portraits?: {
        name: string;
        imageUrl: string;
      }[];
      balance?: number;
      error?: string;
    };

    if (typeof result.balance === "number") {
      setGuildTokens(result.balance);
    }

    if (!response.ok) {
      throw new Error(
        result.error ??
          "The artists could not replace the selected portraits.",
      );
    }

    if (!Array.isArray(result.portraits)) {
      throw new Error(
        "No replacement portraits were returned.",
      );
    }

    const portraitMap = new Map(
      result.portraits.map((portrait) => [
        portrait.name,
        portrait.imageUrl,
      ]),
    );

    setNpcs((current) =>
      current.map((npc) => {
        const replacementPortrait =
          portraitMap.get(npc.name);

        if (!replacementPortrait) {
          return npc;
        }

        return {
          ...npc,
          portraitUrl: replacementPortrait,
          portraitApproved: false,
        };
      }),
    );
  } catch (error) {
    console.error(
      "Portrait replacement failed:",
      error,
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "The artists could not replace the selected portraits.",
    );
  } finally {
    setIsGeneratingPortraits(false);
  }
}

async function replaceUnhiredNpcs() {
  const unhiredIndexes = npcs
      .map((npc, index) => (!npc.hired ? index : -1))
      .filter((index) => index !== -1);

    const requestedCount = unhiredIndexes.length;

    if (requestedCount === 0 || isRecruiting) {
      return;
    }

    setIsRecruiting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/recruit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location:
            location === "Custom"
              ? customLocation.trim()
              : location,
          inspiration:
            inspiration === "Custom"
              ? customInspiration.trim()
              : inspiration,
          species: getRecruitmentSpecies(),
          genderMix:
            gender === "Custom"
              ? customGender.trim()
              : gender,
          count: requestedCount,
          existingNames: npcs.map((npc) => npc.name),
        }),
      });

      const result = (await response.json()) as RecruitResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "The recruiter could not find new candidates.",
        );
      }

      if (
        !Array.isArray(result.npcs) ||
        result.npcs.length !== requestedCount
      ) {
        throw new Error(
          `Expected ${requestedCount} candidates but received ${
            result.npcs?.length ?? 0
          }.`,
        );
      }

      setNpcs((current) => {
        const updated = [...current];

        unhiredIndexes.forEach(
          (cardIndex, replacementIndex) => {
            updated[cardIndex] = {
              ...result.npcs[replacementIndex],
              hired: false,
            };
          },
        );

        return updated;
      });
    } catch (error) {
      console.error("Replacement recruitment failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The recruiter could not find new candidates.",
      );
    } finally {
      setIsRecruiting(false);
    }
  }

  
  const hasSpecies =
    selectedSpecies.length > 0 ||
    customSpecies.trim().length > 0;

  const replacementCount = npcs.filter(
    (npc) => !npc.hired,
  ).length;

  const hiredCount = npcs.filter((npc) => npc.hired).length;

const portraitsGenerated = npcs.some((npc) =>
  Boolean(npc.portraitUrl),
);
const unwantedPortraitCount = npcs.filter(
  (npc) =>
    Boolean(npc.portraitUrl) &&
    !npc.portraitApproved,
).length;

  async function saveCast() {
  if (npcs.length !== 4 || isSavingCast) {
    return;
  }

  if (!guildName) {
    window.location.href = "/login";
    return;
  }

  const suggestedTitle =
    inspiration !== "Any" || location !== "Any"
      ? `${inspiration === "Any" ? "" : inspiration.replace("-inspired", "")} ${
          location === "Any" ? "Cast" : location
        }`.trim()
      : "My NPC Cast";

  const title = window.prompt(
    "Name this cast:",
    suggestedTitle,
  );

  if (!title?.trim()) {
    return;
  }

  setIsSavingCast(true);
  setSaveMessage("");
  setErrorMessage("");

  try {
    const response = await fetch("/api/casts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        location:
          location === "Custom"
            ? customLocation.trim()
            : location,
        inspiration:
          inspiration === "Custom"
            ? customInspiration.trim()
            : inspiration,
        genderMix:
          gender === "Custom"
            ? customGender.trim()
            : gender,
        species: getRecruitmentSpecies(),
        portraitStyle,
        npcs,
      }),
    });

    const result = (await response.json()) as {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(
        result.error ?? "The Guild Archive could not save this cast.",
      );
    }

    setSaveMessage(
      result.message ?? "Cast saved to the Guild Archive.",
    );
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "The Guild Archive could not save this cast.",
    );
  } finally {
    setIsSavingCast(false);
  }
}
useEffect(() => {
  if (!portraitJobId) {
    return;
  }

  const pollPortraitJob = async () => {
    try {
      const response = await fetch(
        `/api/portraits/jobs/${portraitJobId}`,
      );

      const result = (await response.json()) as {
        status?: "queued" | "generating" | "completed" | "failed";
        completed_portraits?: {
          name: string;
          imageUrl: string;
        }[];
        error_message?: string | null;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "The portrait commission could not be checked.",
        );
      }

      if (
        result.status === "queued" ||
        result.status === "generating"
      ) {
        return;
      }

      if (result.status === "failed") {
        setPortraitJobId(null);
        setIsGeneratingPortraits(false);

        throw new Error(
          result.error_message ??
            "The portrait commission failed.",
        );
      }

      if (
        result.status === "completed" &&
        Array.isArray(result.completed_portraits)
      ) {
        const portraitMap = new Map(
          result.completed_portraits.map((portrait) => [
            portrait.name,
            portrait.imageUrl,
          ]),
        );

        setNpcs((current) =>
          current.map((npc) => ({
            ...npc,
            portraitUrl:
              portraitMap.get(npc.name) ??
              npc.portraitUrl,
            portraitApproved: false,
          })),
        );

        setPortraitJobId(null);
        setIsGeneratingPortraits(false);
      }
    } catch (error) {
      console.error(
        "Portrait job polling failed:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The portrait commission could not be checked.",
      );
    }
  };

  void pollPortraitJob();

  const intervalId = window.setInterval(
    () => {
      void pollPortraitJob();
    },
    3000,
  );

  return () => {
    window.clearInterval(intervalId);
  };
}, [portraitJobId]);

useEffect(() => {
  if (!guildName) {
    return;
  }

  if (npcs.length !== 4) {
    return;
  }

  const saveActiveCast = async () => {
    try {
      await fetch("/api/casts/active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Current Cast",
          location:
            location === "Custom"
              ? customLocation.trim()
              : location,
          inspiration:
            inspiration === "Custom"
              ? customInspiration.trim()
              : inspiration,
          genderMix:
            gender === "Custom"
              ? customGender.trim()
              : gender,
          species: getRecruitmentSpecies(),
          portraitStyle,
          npcs,
        }),
      });
    } catch (error) {
      console.error(
        "Active cast autosave failed:",
        error,
      );
    }
  };

  void saveActiveCast();
}, [
  guildName,
  npcs,
  location,
  customLocation,
  inspiration,
  customInspiration,
  gender,
  customGender,
  portraitStyle,
]);

async function downloadPrintableCast() {
  try {
    setErrorMessage("");

    await generatePrintableCast(npcs);
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "The printable cast could not be created.",
    );
  }
}

async function startTokenCheckout(
  pack: "starter" | "adventurer" | "guildmaster",
) {
  if (isStartingCheckout) {
    return;
  }

  setIsStartingCheckout(true);
  setErrorMessage("");

  try {
    const response = await fetch(
      "/api/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pack }),
      },
    );

    const result = (await response.json()) as {
      url?: string;
      error?: string;
    };

    if (!response.ok || !result.url) {
      throw new Error(
        result.error ??
          "The Guild Treasury could not open checkout.",
      );
    }

    window.location.href = result.url;
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "The Guild Treasury could not open checkout.",
    );

    setIsTreasuryOpen(false);
    setIsStartingCheckout(false);
  }
}

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setGuildName(null);
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#d7c8aa] text-[#211d17] xl:h-screen xl:overflow-hidden">
      <div className="grid min-h-screen w-full gap-3 p-3 [@media(max-height:800px)]:gap-2 [@media(max-height:800px)]:p-2 xl:h-screen xl:min-h-0 xl:grid-cols-[30fr_35fr_35fr] xl:items-stretch">
  <aside className="relative flex min-h-0 flex-col overflow-hidden rounded-[18px] border-2 border-[#7f5f24] bg-[radial-gradient(circle_at_20%_0%,rgba(111,79,31,0.28),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(75,48,18,0.2),transparent_34%),linear-gradient(180deg,#1c150f_0%,#17110c_48%,#120d09_100%)] text-[#ead7a9] shadow-[inset_0_0_0_2px_rgba(220,172,72,0.14),inset_0_0_28px_rgba(0,0,0,0.55),5px_6px_0_rgba(42,29,13,0.28)]">
    <span className="pointer-events-none absolute left-1 top-1 z-20 h-5 w-5 rounded-full border border-[#c49a46] bg-[#2a1d10] shadow-[inset_0_0_0_2px_rgba(219,171,72,0.16)]" />
          <span className="pointer-events-none absolute right-1 top-1 z-20 h-5 w-5 rounded-full border border-[#c49a46] bg-[#2a1d10] shadow-[inset_0_0_0_2px_rgba(219,171,72,0.16)]" />
          <span className="pointer-events-none absolute bottom-1 left-1 z-20 h-5 w-5 rounded-full border border-[#c49a46] bg-[#2a1d10] shadow-[inset_0_0_0_2px_rgba(219,171,72,0.16)]" />
          <span className="pointer-events-none absolute bottom-1 right-1 z-20 h-5 w-5 rounded-full border border-[#c49a46] bg-[#2a1d10] shadow-[inset_0_0_0_2px_rgba(219,171,72,0.16)]" />
         <div className="relative border-b border-[#8d6b2c] px-5 py-4 [@media(max-height:800px)]:py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-[#c19b4c] bg-[#241b12] text-xl shadow-[inset_0_0_0_2px_rgba(193,155,76,0.12)]">
                ⚔
              </div>
              <div>
                <h1 className="font-serif text-[1.08rem] font-bold uppercase tracking-[0.055em] text-[#f0d58e] 2xl:text-xl">
                  Guild Recruitment Ledger
                </h1>
                <p className="mt-0.5 font-serif text-[11px] italic text-[#cbb98d]">
                  Recruit memorable NPCs for tonight&apos;s session.
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-4 [scrollbar-color:#8d6b2c_#17110c] [scrollbar-width:thin]">
            <section className="space-y-2 border-b border-[#745a2c] pb-3.5">
              {guildName ? (
                <>
                  <div className="flex items-center justify-between rounded-sm border border-[#9c7732] bg-[linear-gradient(180deg,#2b2117_0%,#211810_100%)] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(215,170,77,0.08)]">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b99a59]">
                        Guild Member
                      </p>
                      <p className="mt-1 font-serif text-lg font-bold text-[#f3dfaa]">
                        ⚜ {guildName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b99a59]">
                        Guild Tokens
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold text-[#f3dfaa]">
  {guildTokens}
</p>
</div>
</div>

<button
  type="button"
  onClick={() => setIsTreasuryOpen(true)}
  className="mt-3 w-full rounded-sm border border-[#c49a46] bg-[linear-gradient(180deg,#c49a46_0%,#a67b2d_100%)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#22170d] transition hover:brightness-110"
>
  Buy Guild Tokens
</button>
{guildLedger.length > 0 && (
  <div className="mt-3 rounded-sm border border-[#8d6b2c] bg-[#19140f]">
    <button
      type="button"
      onClick={() =>
        setIsGuildLedgerOpen((current) => !current)
      }
      className="flex w-full items-center gap-2 p-3 text-left"
    >
      <span className="text-[10px] text-[#c59b47]">
        ✦
      </span>

      <p className="font-serif text-[11px] font-bold uppercase tracking-[0.08em] text-[#e6c87d]">
        Guild Ledger
      </p>

      <div className="h-px flex-1 bg-[#745a2c]" />

      <span className="text-[11px] text-[#c59b47]">
        {isGuildLedgerOpen ? "▲" : "▼"}
      </span>
    </button>

    {isGuildLedgerOpen && (
      <div className="space-y-1.5 border-t border-[#4f3c22] px-3 pb-3 pt-2">
        {guildLedger.slice(0, 5).map((transaction) => (
          <div
            key={`${transaction.created_at}-${transaction.description}`}
            className="flex items-start justify-between gap-3 border-b border-[#4f3c22] pb-1.5 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="text-[10px] text-[#ead7a9]">
                {transaction.description}
              </p>

              <p className="mt-0.5 text-[9px] text-[#8f8067]">
                {new Date(
                  transaction.created_at,
                ).toLocaleDateString()}
              </p>
            </div>

            <p
              className={
                transaction.amount > 0
                  ? "shrink-0 font-serif text-sm font-bold text-[#8fc18f]"
                  : "shrink-0 font-serif text-sm font-bold text-[#d78b78]"
              }
            >
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/my-casts"
                      className="rounded-sm border border-[#8d6b2c] bg-[#19140f] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116]"
                    >
                      My Saved Casts
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="rounded-sm border border-[#8d6b2c] bg-[#19140f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116]"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : authChecked ? (
                <Link
                  href="/login"
                  className="block rounded-sm border border-[#b05a3d] bg-[linear-gradient(180deg,#a03924_0%,#812818_100%)] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition hover:bg-[#a83a25]"
                >
                  Sign In / Join the Guild
                </Link>
              ) : null}
            </section>

            <LedgerSection title="Generation Options">
              <div className="space-y-3">
                <DarkDropdown
                  label="Location"
                  value={location}
                  options={locations}
                  onChange={setLocation}
                />

                {location === "Custom" && (
                  <DarkCustomField
                    label="Custom location"
                    value={customLocation}
                    onChange={setCustomLocation}
                    placeholder="A fortified trading town built across an ancient bridge."
                    guidance="Describe the location as specifically as you can."
                  />
                )}

                <DarkDropdown
                  label="Cultural / Fantasy Inspiration"
                  value={inspiration}
                  options={inspirations}
                  onChange={setInspiration}
                />

                {inspiration === "Custom" && (
                  <DarkCustomField
                    label="Custom inspiration"
                    value={customInspiration}
                    onChange={setCustomInspiration}
                    placeholder="A declining bronze-age civilisation ruled by merchant-priests."
                    guidance="Describe the inspiration as specifically as you can."
                  />
                )}

                <div>
                  <div className="mb-2 flex items-end justify-between gap-2">
                    <label className="text-[11px] font-bold text-[#ead7a9]">
                      Species <span className="font-normal text-[#bba77c]">(recruitment pool)</span>
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={selectAllSpecies}
                        className="border border-[#8d6b2c] px-2 py-1 text-[9px] font-bold uppercase hover:bg-[#2c2116]"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllSpecies}
                        className="border border-[#8d6b2c] px-2 py-1 text-[9px] font-bold uppercase hover:bg-[#2c2116]"
                      >
                        None
                      </button>
                    </div>
                  </div>

                  <div className="max-h-44 overflow-y-auto rounded-sm border border-[#8d6b2c] bg-[#1f1710] p-3 shadow-[inset_0_0_14px_rgba(0,0,0,0.35)] [scrollbar-color:#8d6b2c_#17110c] [scrollbar-width:thin]">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                      {speciesOptions.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-2 text-[11px] text-[#ead7a9]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSpecies.includes(option)}
                            onChange={() => toggleSpecies(option)}
                            className="h-4 w-4 accent-[#a98035]"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <DarkCustomField
                    label="Custom Species"
                    value={customSpecies}
                    onChange={setCustomSpecies}
                    placeholder="Add one custom species"
                    guidance="Add one custom species to the recruitment pool."
                    rows={1}
                  />

                  {!hasSpecies && (
                    <p className="mt-2 border border-[#9b3c2e] bg-[#2c1713] px-3 py-2 text-xs text-[#f0b0a6]">
                      Select or describe at least one species.
                    </p>
                  )}
                </div>

                <DarkDropdown
                  label="Gender Mix"
                  value={gender}
                  options={genders}
                  onChange={setGender}
                />

                {gender === "Custom" && (
                  <DarkCustomField
                    label="Custom gender mix"
                    value={customGender}
                    onChange={setCustomGender}
                    placeholder="Mostly women, with several non-binary characters."
                    guidance="Describe the gender distribution you would like."
                  />
                )}
              </div>
            </LedgerSection>

            <LedgerSection title="Guild Archive">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={saveCast}
                  disabled={npcs.length !== 4 || isSavingCast}
                  className="w-full rounded-sm border border-[#a98035] bg-[#19140f] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116] disabled:cursor-not-allowed disabled:border-[#594b39] disabled:text-[#756a58]"
                >
                  {isSavingCast
                    ? "Saving Cast..."
                    : guildName
                      ? "Save Cast to My Account"
                      : "Join the Guild to Save Cast"}
                </button>
                <Link
                  href={guildName ? "/my-casts" : "/login"}
                  className="block w-full rounded-sm border border-[#8d6b2c] bg-[#19140f] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116]"
                >
                  View My Saved Casts
                </Link>
                {saveMessage && (
                  <div className="border border-[#55745b] bg-[#17261b] px-3 py-2 text-center text-xs text-[#b7d4ba]">
                    {saveMessage}
                  </div>
                )}
              </div>
            </LedgerSection>

            <LedgerSection title="Printing">
              <button
                type="button"
                onClick={downloadPrintableCast}
                disabled={
  npcs.length !== 4 ||
  hiredCount !== 4 ||
  npcs.some((npc) => !npc.portraitUrl)
}
                className="w-full rounded-sm border border-[#a98035] bg-[#19140f] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ead7a9] transition hover:bg-[#2c2116] disabled:cursor-not-allowed disabled:border-[#594b39] disabled:text-[#756a58]"
              >
                Download Printable Cast
              </button>
              <p className="mt-2 text-center font-serif text-[11px] italic text-[#bba77c]">
                Downloads a single-page foldable PDF when all portraits are ready.
              </p>
            </LedgerSection>

            {errorMessage && (
              <div className="mt-3 border border-[#9b3c2e] bg-[#2c1713] px-3 py-2 text-sm text-[#f0b0a6]">
                {errorMessage}
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-[#9e834e] bg-[#f3e5c8] shadow-[4px_5px_0_rgba(72,55,28,0.18)]">
          <CreamHeading
            title={npcs.length > 0 && hiredCount === 4 ? "Hired Personnel" : "Candidate Roster"}
            subtitle={npcs.length > 0 ? `${hiredCount} of ${npcs.length} candidates hired` : "Review your candidates. Hire the best."}
          />

          <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-4">
  <div className="mb-3 shrink-0">
    <p className="mb-2 text-xs font-bold">
      Text Recruitment
    </p>

    <div className="flex h-[34px] items-center justify-center border border-[#a9946d] bg-[#fff9ec] px-3 text-center font-serif text-[11px] italic text-[#625744]">
      Generates four text NPCs. Text recruitment is free.
    </div>
  </div>

  <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#8d6b2c_#17110c] [scrollbar-width:thin]">
    {npcs.length === 0 ? (
      <EmptyRoster />
    ) : (
     <div className="grid grid-cols-2 gap-3">
  {npcs.slice(0, 4).map((npc, index) => (
  <CompactNpcCard
    key={`${npc.name}-${index}`}
    npc={npc}
    number={index + 1}
    editable={!portraitsGenerated && !isGeneratingPortraits}
    onToggleHire={() => toggleHire(index)}
    onUpdate={(updatedNpc) =>
      updateNpc(index, updatedNpc)
    }
  />
))}
      </div>
    )}
  </div>

  <div className="flex h-24 shrink-0 items-center">
  <button
    type="button"
    onClick={recruitNpcs}
      disabled={!hasSpecies || isRecruiting}
      className="w-full border border-[#7e2518] bg-[#8f2e1d] px-4 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83a25] disabled:cursor-not-allowed disabled:border-[#aaa08b] disabled:bg-[#c7baa3] disabled:text-[#7b6e5a]"
    >
      {isRecruiting
        ? "Interviewing Candidates..."
        : "Recruit New Candidates — Free"}
    </button>

    
  </div>
</div>
        </section>

        <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[18px] border border-[#9e834e] bg-[#f3e5c8] shadow-[4px_5px_0_rgba(72,55,28,0.18)]">
          <CreamHeading
            title="Portrait Commissions"
            subtitle="Bring your cast to life."
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-4">
            <p className="mb-2 text-xs font-bold">Portrait Style</p>
            <div className="grid grid-cols-3 gap-2">
              {portraitStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => {
  setPortraitStyle(style);

  window.localStorage.setItem(
    "npc-recruiter-portrait-style",
    style,
  );
}}
                  className={
                    portraitStyle === style
                      ? "border border-[#292720] bg-[#292720] px-2 py-2 text-[11px] font-bold text-white"
                      : "border border-[#a9946d] bg-[#fff9ec] px-2 py-2 text-[11px] font-bold text-[#352f26] transition hover:bg-[#eee0c2]"
                  }
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
  {Array.from({ length: 4 }, (_, index) => {
                const npc = npcs[index];
                return (
                  <PortraitSlot
  key={index}
  number={index + 1}
  name={npc?.name}
  ready={Boolean(npc?.hired)}
  portraitUrl={npc?.portraitUrl}
/>
                );
              })}
            </div>
</div>

           <div className="flex h-24 shrink-0 items-center">
  <button
    type="button"
    onClick={generatePortraits}
    disabled={
      hiredCount !== 4 ||
      guildTokens < 5 ||
      isGeneratingPortraits
    }
    className="w-full border border-[#7e2518] bg-[#8f2e1d] px-4 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83a25] disabled:cursor-not-allowed disabled:border-[#aaa08b] disabled:bg-[#c7baa3] disabled:text-[#7b6e5a]"
  >
    {isGeneratingPortraits
      ? "The Artists Are Painting..."
      : hiredCount !== 4
        ? `Hire ${4 - hiredCount} More ${
            4 - hiredCount === 1
              ? "Candidate"
              : "Candidates"
          }`
        : guildTokens < 5
          ? "Requires 5 Guild Tokens"
          : "Commission Artwork — 5 Guild Tokens"}
  </button>
</div>
        </aside>
            </div>

      {isTreasuryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-[18px] border-2 border-[#8d6b2c] bg-[#f3e5c8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#9e834e] bg-[linear-gradient(180deg,#2b2117_0%,#17110c_100%)] px-6 py-4 text-[#ead7a9]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b99a59]">
                  Guild Treasury
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#f3dfaa]">
                  Purchase Guild Tokens
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsTreasuryOpen(false)}
                disabled={isStartingCheckout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8d6b2c] text-lg text-[#ead7a9] transition hover:bg-[#3a2b1c] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close Guild Treasury"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <TokenPackCard
                title="🥉 Bronze Chest"
                tokens={20}
                price="$5.99 USD"
                description="Perfect for a single adventure."
                disabled={isStartingCheckout}
                onPurchase={() =>
                  startTokenCheckout("starter")
                }
              />

              <TokenPackCard
                title="🥈 Iron Strongbox"
                tokens={75}
                price="$19.99 USD"
                description="Ideal for ongoing campaigns."
                featured
                disabled={isStartingCheckout}
                onPurchase={() =>
                  startTokenCheckout("adventurer")
                }
              />

              <TokenPackCard
                title="🥇 Golden Guild Vault"
                tokens={200}
                price="$39.99 USD"
                description="Best value for worldbuilders and professional GMs."
                disabled={isStartingCheckout}
                onPurchase={() =>
                  startTokenCheckout("guildmaster")
                }
              />
            </div>

            <div className="border-t border-[#b89d67] bg-[#eadbbd] px-6 py-3 text-center font-serif text-xs italic text-[#625744]">
              Portrait commissions cost 5 Guild Tokens.
              Individual portrait rerolls cost 1 Guild Token.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type TokenPackCardProps = {
  title: string;
  tokens: number;
  price: string;
  description: string;
  disabled: boolean;
  featured?: boolean;
  onPurchase: () => void;
};

function TokenPackCard({
  title,
  tokens,
  price,
  description,
  disabled,
  featured = false,
  onPurchase,
}: TokenPackCardProps) {
  return (
    <article
      className={
        featured
          ? "relative flex flex-col border-2 border-[#8f2e1d] bg-[#fff9ec] p-5 shadow-[3px_4px_0_rgba(72,55,28,0.16)]"
          : "relative flex flex-col border border-[#a9946d] bg-[#fff9ec] p-5 shadow-[3px_4px_0_rgba(72,55,28,0.12)]"
      }
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8f2e1d] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
          Best Value
        </span>
      )}

      <h3 className="text-center font-serif text-lg font-bold text-[#292720]">
        {title}
      </h3>

      <p className="mt-4 text-center font-serif text-4xl font-bold text-[#8f2e1d]">
        {tokens}
      </p>

      <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d6252]">
        Guild Tokens
      </p>

      <p className="mt-4 text-center font-serif text-xl font-bold">
        {price}
      </p>

      <p className="mt-3 min-h-10 text-center text-xs leading-5 text-[#625744]">
        {description}
      </p>

      <button
        type="button"
        onClick={onPurchase}
        disabled={disabled}
        className="mt-5 border border-[#7e2518] bg-[#8f2e1d] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83a25] disabled:cursor-wait disabled:bg-[#9f8e76]"
      >
        {disabled ? "Opening Checkout..." : "Purchase"}
      </button>
    </article>
  );
}

type LedgerSectionProps = {
  title: string;
  children: React.ReactNode;
};

function LedgerSection({ title, children }: LedgerSectionProps) {
  return (
    <section className="border-b border-[#745a2c] py-3.5 last:border-b-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] text-[#c59b47]">✦</span>
        <h2 className="font-serif text-[13px] font-bold uppercase tracking-[0.055em] text-[#e6c87d]">
          {title}
        </h2>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,#745a2c_0%,rgba(116,90,44,0.2)_100%)]" />
      </div>
      {children}
    </section>
  );
}

type CreamHeadingProps = {
  title: string;
  subtitle: string;
};

function CreamHeading({ title, subtitle }: CreamHeadingProps) {
  return (
    <div className="relative border-b border-[#9e834e] bg-[linear-gradient(180deg,#fbefd7_0%,#f2dfbb_100%)] px-5 py-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.45)]">
      <div className="pointer-events-none absolute inset-x-4 top-1.5 flex items-center gap-2 opacity-70">
        <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#ad8c4e)]" />
        <span className="text-[8px] text-[#8f6e32]">◆</span>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,#ad8c4e,transparent)]" />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#aa8747] bg-[#efe0bf] font-serif text-sm font-bold text-[#5b4321] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]">
          ✦
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold uppercase leading-none tracking-[0.055em] text-[#241d14]">
            {title}
          </h2>
          <p className="mt-1.5 font-serif text-xs italic text-[#625744]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

type CompactNpcCardProps = {
  npc: Npc;
  number: number;
  editable: boolean;
  onToggleHire: () => void;
  onUpdate: (updatedNpc: Npc) => void;
};

function CompactNpcCard({
  npc,
  number,
  editable,
  onToggleHire,
  onUpdate,
}: CompactNpcCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftNpc, setDraftNpc] = useState<Npc>(npc);

  function beginEditing() {
    setDraftNpc({ ...npc });
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftNpc({ ...npc });
    setIsEditing(false);
  }

  function saveEditing() {
    onUpdate({
      ...draftNpc,
      name: draftNpc.name.trim() || npc.name,
      gender: draftNpc.gender.trim() || npc.gender,
      species: draftNpc.species.trim() || npc.species,
      occupation:
        draftNpc.occupation.trim() || npc.occupation,
      personality:
        draftNpc.personality.trim() || npc.personality,
      roleplayingCue:
        draftNpc.roleplayingCue.trim() ||
        npc.roleplayingCue,
      portraitPrompt:
        draftNpc.portraitPrompt.trim() ||
        npc.portraitPrompt,
    });

    setIsEditing(false);
  }

  function updateDraft(
    field: keyof Npc,
    value: string,
  ) {
    setDraftNpc((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <article
      className={
        npc.hired
          ? "relative flex aspect-[20/23] flex-col overflow-hidden border-2 border-[#58705a] bg-[#fff9ec] p-4 shadow-[2px_3px_0_rgba(44,64,46,0.14)]"
          : "relative flex aspect-[20/23] flex-col overflow-hidden border border-[#8f713b] bg-[#fff9ec] p-4 shadow-[2px_3px_0_rgba(72,55,28,0.12)]"
      }
    >
      <span className="pointer-events-none absolute inset-[4px] border border-[#c7a86c]" />
      <span className="pointer-events-none absolute inset-[7px] border border-[#6f5733]/45" />

      <span className="pointer-events-none absolute left-[7px] top-[7px] h-3 w-3 border-l-2 border-t-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute right-[7px] top-[7px] h-3 w-3 border-r-2 border-t-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute bottom-[7px] left-[7px] h-3 w-3 border-b-2 border-l-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute bottom-[7px] right-[7px] h-3 w-3 border-b-2 border-r-2 border-[#8f713b]" />

      <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#292720] font-serif text-sm font-bold text-white">
        {number}
      </span>

      <button
        type="button"
        onClick={onToggleHire}
        title={
          npc.hired
            ? "Unhire candidate"
            : "Hire candidate"
        }
        className={
          npc.hired
            ? "absolute right-2 top-2 text-lg text-[#3d6043]"
            : "absolute right-2 top-2 text-lg text-[#6c6252] hover:text-[#8f2e1d]"
        }
      >
        {npc.hired ? "⬟" : "♢"}
      </button>

      <div className="mt-7 text-center">
        <h3 className="font-serif text-base font-bold leading-tight">
          {npc.name}
        </h3>

        <p className="mt-1 text-[11px] text-[#625744]">
          {npc.gender} · {npc.species}
        </p>
      </div>

      <div className="mt-3 space-y-2 text-center text-[11px] leading-4">
        <div>
          <p className="font-serif font-bold">
            Occupation
          </p>
          <p>{npc.occupation}</p>
        </div>

        <div>
          <p className="font-serif font-bold">
            Personality
          </p>
          <p>{npc.personality}</p>
        </div>

        <div>
          <p className="font-serif font-bold">
            Roleplaying Cue
          </p>
          <p className="font-serif italic">
            “{npc.roleplayingCue}”
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onToggleHire}
          className={
            npc.hired
              ? "border border-[#456149] bg-[#456149] px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-white"
              : "border border-[#8d7751] bg-[#fff9ec] px-1 py-2 text-[9px] font-bold uppercase tracking-wide hover:bg-[#efe1c5]"
          }
        >
          {npc.hired ? "Hired — Keep" : "Hire"}
        </button>

        {editable ? (
          <button
            type="button"
            onClick={beginEditing}
            className="border border-[#8d7751] bg-[#efe1c5] px-1 py-2 text-[9px] font-bold uppercase tracking-wide hover:bg-[#e4d3b2]"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center justify-center border border-[#b4a58a] bg-[#e5dac5] px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-[#847762]">
            Text Locked
          </div>
        )}
      </div>

      {isEditing && editable && (
        <div className="absolute inset-2 z-40 flex flex-col overflow-hidden border-2 border-[#8f713b] bg-[#fff9ec] shadow-lg">
          <div className="border-b border-[#b89d67] bg-[#efe0bf] px-3 py-2 text-center">
            <p className="font-serif text-sm font-bold uppercase tracking-wide">
              Edit Candidate
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
            <NpcEditField
              label="Name"
              value={draftNpc.name}
              onChange={(value) =>
                updateDraft("name", value)
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <NpcEditField
                label="Gender"
                value={draftNpc.gender}
                onChange={(value) =>
                  updateDraft("gender", value)
                }
              />

              <NpcEditField
                label="Species"
                value={draftNpc.species}
                onChange={(value) =>
                  updateDraft("species", value)
                }
              />
            </div>

            <NpcEditField
              label="Occupation"
              value={draftNpc.occupation}
              onChange={(value) =>
                updateDraft("occupation", value)
              }
            />

            <NpcEditField
              label="Personality"
              value={draftNpc.personality}
              onChange={(value) =>
                updateDraft("personality", value)
              }
              multiline
            />

            <NpcEditField
              label="Roleplaying Cue"
              value={draftNpc.roleplayingCue}
              onChange={(value) =>
                updateDraft("roleplayingCue", value)
              }
              multiline
            />

            <NpcEditField
              label="Appearance Description"
              value={draftNpc.portraitPrompt}
              onChange={(value) =>
                updateDraft("portraitPrompt", value)
              }
              multiline
            />
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[#b89d67] bg-[#f1e4cc] p-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="border border-[#8d7751] bg-[#fff9ec] px-2 py-2 text-[9px] font-bold uppercase tracking-wide hover:bg-[#efe1c5]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveEditing}
              className="border border-[#456149] bg-[#456149] px-2 py-2 text-[9px] font-bold uppercase tracking-wide text-white hover:bg-[#527158]"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

type NpcEditFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
};

function NpcEditField({
  label,
  value,
  onChange,
  multiline = false,
}: NpcEditFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-[#5f513d]">
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={2}
          className="w-full resize-none border border-[#ad9872] bg-white px-2 py-1.5 text-[10px] leading-4 outline-none focus:border-[#7e2518]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full border border-[#ad9872] bg-white px-2 py-1.5 text-[10px] outline-none focus:border-[#7e2518]"
        />
      )}
    </label>
  );
}

function EmptyRoster() {
  return (
    <div className="grid grid-cols-2 gap-3">
  {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="relative aspect-[20/23] w-full overflow-hidden border border-[#8f713b] bg-[#e9ddc5] p-[7px] shadow-[2px_3px_0_rgba(72,55,28,0.12)]"
        >
          <span className="pointer-events-none absolute inset-[3px] z-20 border border-[#c7a86c]" />
          <span className="pointer-events-none absolute inset-[6px] z-20 border border-[#6f5733]/55" />

          <span className="pointer-events-none absolute left-[6px] top-[6px] z-20 h-3 w-3 border-l-2 border-t-2 border-[#8f713b]" />
          <span className="pointer-events-none absolute right-[6px] top-[6px] z-20 h-3 w-3 border-r-2 border-t-2 border-[#8f713b]" />
          <span className="pointer-events-none absolute bottom-[6px] left-[6px] z-20 h-3 w-3 border-b-2 border-l-2 border-[#8f713b]" />
          <span className="pointer-events-none absolute bottom-[6px] right-[6px] z-20 h-3 w-3 border-b-2 border-r-2 border-[#8f713b]" />

          <span className="absolute left-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#292720] font-serif text-sm font-bold text-white">
            {index + 1}
          </span>

          <div className="flex h-full flex-col items-center justify-center border border-dashed border-[#b7a98d] bg-[#f8f0df] text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#b89d67] bg-[#f3e4c5] font-serif text-xl text-[#5d4b31]">
              ?
            </div>

            <h3 className="mt-4 font-serif text-lg font-bold text-[#352b1d]">
              Awaiting
            </h3>

            <p className="font-serif text-sm italic text-[#6d6252]">
              Candidate
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

type PortraitSlotProps = {
  number: number;
  name?: string;
  ready: boolean;
  portraitUrl?: string;
};

function PortraitSlot({
  number,
  name,
  ready,
  portraitUrl,
}: PortraitSlotProps) {
  return (
    <div className="relative aspect-[20/23] overflow-hidden border border-[#8f713b] bg-[#e9ddc5] p-[7px] text-left shadow-[2px_3px_0_rgba(72,55,28,0.12)]">
      <span className="pointer-events-none absolute inset-[3px] z-20 border border-[#c7a86c]" />
      <span className="pointer-events-none absolute inset-[6px] z-20 border border-[#6f5733]/55" />

      <span className="pointer-events-none absolute left-[6px] top-[6px] z-20 h-3 w-3 border-l-2 border-t-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute right-[6px] top-[6px] z-20 h-3 w-3 border-r-2 border-t-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute bottom-[6px] left-[6px] z-20 h-3 w-3 border-b-2 border-l-2 border-[#8f713b]" />
      <span className="pointer-events-none absolute bottom-[6px] right-[6px] z-20 h-3 w-3 border-b-2 border-r-2 border-[#8f713b]" />

      <span className="absolute left-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#292720] font-serif text-sm font-bold text-white">
        {number}
      </span>

            {portraitUrl ? (
        <img
          src={portraitUrl}
          alt={`Portrait of ${name ?? `NPC ${number}`}`}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center border border-dashed border-[#b7a98d] bg-[#f8f0df] text-center">
          <p className="mt-2 px-1 text-[9px] font-bold uppercase tracking-wide text-[#776a55]">
            {ready ? "Awaiting Commission" : "Open Frame"}
          </p>
        </div>
      )}
    </div>
  );
}
type DarkDropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function DarkDropdown({ label, value, options, onChange }: DarkDropdownProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold text-[#ead7a9]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-sm border border-[#8d6b2c] bg-[#1f1710] px-3 py-2 text-xs text-[#ead7a9] outline-none shadow-[inset_0_0_10px_rgba(0,0,0,0.26)] focus:border-[#c59b47]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "Any" ? "Any" : option === "Custom" ? "Custom..." : option}
          </option>
        ))}
      </select>
    </label>
  );
}

type DarkCustomFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  guidance: string;
  onChange: (value: string) => void;
  rows?: number;
};

function DarkCustomField({
  label,
  value,
  placeholder,
  guidance,
  onChange,
  rows = 2,
}: DarkCustomFieldProps) {
  return (
    <label className="mt-3 block">
      <span className="mb-1 block text-[11px] font-bold text-[#ead7a9]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-sm border border-[#8d6b2c] bg-[#1f1710] px-3 py-2 text-xs text-[#ead7a9] outline-none shadow-[inset_0_0_10px_rgba(0,0,0,0.26)] placeholder:text-[#756957] focus:border-[#c59b47]"
      />
      <span className="mt-1 block font-serif text-[10px] italic text-[#bba77c]">{guidance}</span>
    </label>
  );
}