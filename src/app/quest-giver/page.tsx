"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PENDING_NPC_KEY,
  QUEST_GIVER_PREFILL_KEY,
} from "@/lib/anonymous/pending";
import {
  extractAdventureTitle,
  stripAdventureTitle,
  withAdventureTitle,
} from "@/lib/questAdventure";
import { trackEvent } from "@/lib/analytics";
import { genders, inspirations, locations, speciesOptions } from "@/lib/generationOptions";
import { portraitStyles, type PortraitStyle } from "@/lib/portraitStyles";
import styles from "./quest-giver.module.css";

type Npc = { name: string; gender: string; species: string; occupation: string; appearance: string[]; personality: string; roleplayingCue: string; portraitPrompt: string; portraitUrl?: string };
type Pending = { npc: Npc; questHook: string; fullQuest: string };
const slug = (value: string) => value.replace(/[^a-z0-9-]/gi, "-");

function downloadText(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(name)}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function AdventureText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return <div className={styles.adventureText}>{lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className={styles.paragraphGap} />;
    if (/^#{1,3}\s/.test(trimmed)) return <h3 key={index}>{trimmed.replace(/^#{1,3}\s*/, "")}</h3>;
    if (/^(summary|situation|objective|scene\s+\d|rewards|possible endings|follow-up hooks|optional twists|running the quest|npc motivations|meaningful player choices|quick maps|clues & where|ready-to-play|final notes|the locked chest)/i.test(trimmed) && trimmed.length < 95) return <h3 key={index}>{trimmed}</h3>;
    if (/^[-•*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) return <p key={index} className={styles.bullet}>{trimmed}</p>;
    return <p key={index}>{line}</p>;
  })}</div>;
}

export default function QuestGiverPage() {
  const [location, setLocation] = useState("Tavern");
  const [inspiration, setInspiration] = useState("Any");
  const [genderMix, setGenderMix] = useState("Any");
  const [chosenSpecies, setChosenSpecies] = useState("Human");
  const [customSpecies, setCustomSpecies] = useState("");
  const [npc, setNpc] = useState<Npc | null>(null);
  const [questHook, setQuestHook] = useState("");
  const [fullQuest, setFullQuest] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingQuest, setEditingQuest] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [prefilled, setPrefilled] = useState(false);
  const [adventureTitle, setAdventureTitle] = useState("Your adventure");
  const questHookRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedNpcId = new URLSearchParams(window.location.search).get("savedNpc");
    const prefill = sessionStorage.getItem(QUEST_GIVER_PREFILL_KEY);
    if (savedNpcId) {
      void fetch("/api/npcs").then(async response => {
        if (!response.ok) return;
        const data = await response.json() as { npcs?: Array<{ id: string; npc: Npc; quest_hook?: string | null; full_quest?: string | null }> };
        const saved = data.npcs?.find(item => item.id === savedNpcId);
        if (!saved) return;
        setNpc(saved.npc);
        setQuestHook(saved.quest_hook || "");
        setFullQuest(saved.full_quest || "");
        setAdventureTitle(extractAdventureTitle(saved.full_quest || ""));
        setPrefilled(true);
        setShowOptions(true);
      }).catch(() => {});
    } else if (prefill) {
      try {
        const value = JSON.parse(prefill) as { npc: Npc };
        setNpc(value.npc);
        setQuestHook("");
        setFullQuest("");
        setAdventureTitle("Your adventure");
        setPrefilled(true);
        setShowOptions(true);
        sessionStorage.removeItem(QUEST_GIVER_PREFILL_KEY);
      } catch {}
    } else {
      const saved = sessionStorage.getItem("npc-recruiter-quest-session");
      if (saved) { try { const value = JSON.parse(saved) as Pending; setNpc(value.npc); setQuestHook(value.questHook); setFullQuest(value.fullQuest); setAdventureTitle(extractAdventureTitle(value.fullQuest)); setShowOptions(false); } catch {} }
    }
    void createClient().auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);
  useEffect(() => { if (npc) sessionStorage.setItem("npc-recruiter-quest-session", JSON.stringify({ npc, questHook, fullQuest })); }, [npc, questHook, fullQuest]);
  useEffect(() => {
    const textarea = questHookRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [questHook]);

  async function api(url: string, body: unknown) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Request failed"); return null; }
    finally { setBusy(false); }
  }
  async function generate() {
    const selectedSpecies = chosenSpecies === "Custom" ? [customSpecies.trim()] : [chosenSpecies];
    if (!selectedSpecies[0]) { setMessage("Describe your custom species first."); return; }
    const data = await api("/api/quest-givers", { location, inspiration, genderMix, species: selectedSpecies });
    if (data) { trackEvent("quest_giver_character_generated", { location, inspiration, genderMix, species: chosenSpecies }); setNpc(data.npc); setQuestHook(data.questHook); setFullQuest(""); setAdventureTitle("Your adventure"); setEditing(false); setEditingQuest(false); setShowOptions(false); }
  }
  async function generateQuestHook() {
    if (!npc || busy) return;
    if (fullQuest && !window.confirm("This will replace the current adventure. Continue?")) return;
    const data = await api("/api/quest-givers/hook", { npc, previousHook: questHook });
    if (data) {
      trackEvent("quest_hook_generated");
      setQuestHook(data.questHook);
      if (fullQuest) setFullQuest("");
    }
  }
  function signInToSave() {
    if (!npc) return;
    sessionStorage.setItem(PENDING_NPC_KEY, JSON.stringify({ npc, questHook, fullQuest }));
    window.location.href = "/login?next=/quest-giver";
  }
  async function save() {
    if (!npc) return;
    if (!signedIn) { signInToSave(); return; }
    const savedQuest = fullQuest ? withAdventureTitle(fullQuest, adventureTitle) : fullQuest;
    const data = await api("/api/npcs", { npc, questHook, fullQuest: savedQuest });
    if (data) { trackEvent("quest_giver_saved"); setMessage(data.message || `${npc.name} has joined your guild.`); }
  }
  useEffect(() => {
    if (!signedIn) return;
    const pending = sessionStorage.getItem(PENDING_NPC_KEY);
    if (!pending) return;
    try {
      const value = JSON.parse(pending) as Pending;
      setNpc(value.npc); setQuestHook(value.questHook); setFullQuest(value.fullQuest); setAdventureTitle(extractAdventureTitle(value.fullQuest)); setShowOptions(false);
      void fetch("/api/npcs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }).then(async r => {
        const data = await r.json(); if (r.ok) { sessionStorage.removeItem(PENDING_NPC_KEY); setMessage(data.message); } else setMessage(data.error || "Could not save NPC");
      }).catch(() => setMessage("Could not save your NPC. Please try Save NPC again."));
    } catch { setMessage("Could not restore the NPC you selected."); }
  }, [signedIn]);
  function download() {
    if (!npc) return;
    const savedQuest = fullQuest ? withAdventureTitle(fullQuest, adventureTitle) : fullQuest;
    downloadText(npc.name, `${npc.name}\n${npc.gender} ${npc.species} | ${npc.occupation}\nAppearance: ${npc.appearance?.join(", ")}\nPersonality: ${npc.personality}\nRoleplaying cue: ${npc.roleplayingCue}\nPortrait prompt: ${npc.portraitPrompt}\n\nQuest hook: ${questHook}\n\n${savedQuest}`);
  }
  async function developQuest() {
    if (!npc || fullQuest || busy) return;
    if (!signedIn) { signInToSave(); return; }
    let hook = questHook.trim();
    if (!hook) {
      const hookData = await api("/api/quest-givers/hook", { npc, previousHook: questHook });
      if (!hookData?.questHook) return;
      hook = hookData.questHook;
      setQuestHook(hook);
    }
    const data = await api("/api/quest-givers/quest", { npc, questHook: hook });
    if (data) { trackEvent("full_adventure_generated"); setFullQuest(data.quest); setAdventureTitle(extractAdventureTitle(data.quest)); }
  }
  async function commissionPortrait(style: PortraitStyle) {
    if (!npc || busy) return;
    if (!signedIn) { signInToSave(); return; }
    const data = await api("/api/quest-givers/portrait", { npc, style });
    if (data) { trackEvent("quest_giver_portrait_commissioned", { style }); setNpc({ ...npc, portraitUrl: data.portraitUrl }); }
  }
  const editField = (field: Exclude<keyof Npc, "appearance" | "portraitUrl">, value: string) => { if (npc) setNpc({ ...npc, [field]: value }); };
  const adventureBody = stripAdventureTitle(fullQuest);

  return <main className={styles.page}>
    <div className={styles.shell}>
      <header className={styles.header}><div className={styles.eyebrow}>THE GUILDMASTER&apos;S WORKSHOP</div><h1>Quest <em>Giver</em></h1><p>Give a stranger a story. Give your players a reason to care.</p></header>
      <div className={styles.topBar}><span className={styles.tag}>✧ ONE CHARACTER · ONE ADVENTURE</span><span className={styles.allowance}>{!signedIn ? "Free text generation · Sign in to save" : "Your guild awaits"}</span></div>
      <section className={styles.generator} aria-label="Create a quest giver">
        <div className={styles.generatorTitle}><div><span className={styles.kicker}>THE SUMMONING</span><h2>Create your character</h2></div>{npc && <button className={styles.textButton} onClick={() => setShowOptions(!showOptions)}>{showOptions ? "Hide options ↑" : "New character options ↓"}</button>}</div>
        {showOptions && <div className={styles.generatorBody}><div className={styles.options}><label>Location<select value={location} onChange={e => setLocation(e.target.value)}>{locations.map(option => <option key={option}>{option}</option>)}</select></label><label>Cultural / Fantasy Inspiration<select value={inspiration} onChange={e => setInspiration(e.target.value)}>{inspirations.map(option => <option key={option}>{option}</option>)}</select></label><label>Species<select value={chosenSpecies} onChange={e => setChosenSpecies(e.target.value)}>{speciesOptions.map(option => <option key={option}>{option}</option>)}<option>Custom</option></select>{chosenSpecies === "Custom" && <input maxLength={70} placeholder="Custom species" value={customSpecies} onChange={e => setCustomSpecies(e.target.value)} />}</label><label>Gender<select value={genderMix} onChange={e => setGenderMix(e.target.value)}>{genders.map(option => <option key={option}>{option}</option>)}</select></label></div><button className={styles.primaryButton} disabled={busy} onClick={generate}>{busy ? "Working your magic…" : "Generate quest giver ✦"}</button></div>}
      </section>
      {message && <p role="status" className={styles.notice}>{message}</p>}
      {npc ? <div className={styles.workspace}>
        <aside className={styles.character} aria-label="Quest giver character">
          <div className={styles.sectionLabel}>✦ YOUR QUEST GIVER <span>01 / CHARACTER</span></div>
          <div className={styles.characterHeading}><div className={styles.nameRule}>✦ ✦ ✦</div><h2>{npc.name}</h2><p className={styles.subtitle}>{npc.gender} {npc.species} <span>·</span> {npc.occupation}</p></div>
          <div className={styles.portraitFrame}>
            {npc.portraitUrl ? <img className={styles.portrait} src={npc.portraitUrl} alt={`Portrait of ${npc.name}`} /> : <div className={styles.portraitPlaceholder}><span className={styles.sigil}>✧</span><span className={styles.portraitOverline}>A FACE FOR THE LEGEND</span><p>Every story deserves<br />a face to remember.</p><div className={styles.portraitStyleButtons}>{portraitStyles.map(style => <button key={style} disabled={busy} onClick={() => commissionPortrait(style)} className={styles.portraitButton}>{style}<span>2 Guild Tokens</span></button>)}</div></div>}
            <span className={styles.cornerTL}>✦</span><span className={styles.cornerTR}>✦</span><span className={styles.cornerBL}>✦</span><span className={styles.cornerBR}>✦</span>
          </div>
          {npc.portraitUrl && <div className={styles.portraitActions}><a href={npc.portraitUrl} target="_blank" rel="noopener noreferrer">View portrait ↗</a><div className={styles.portraitStyleButtons}>{portraitStyles.map(style => <button key={style} disabled={busy} onClick={() => commissionPortrait(style)}>New {style} · 2 tokens</button>)}</div></div>}
          <div className={styles.characterInfo}>
            <div className={styles.characterActions}><button onClick={() => setEditing(!editing)}>{editing ? "Done editing ✓" : "Edit character ✎"}</button><button disabled={busy} onClick={save}>Save NPC ♡</button><button onClick={download}>Download ↓</button></div>
            {editing ? <div className={styles.editFields}>{(["name", "gender", "species", "occupation", "personality", "roleplayingCue", "portraitPrompt"] as const).map(field => <label key={field}>{field.replace(/([A-Z])/g, " $1")}<textarea value={npc[field]} onChange={e => editField(field, e.target.value)} /></label>)}<label>Appearance<textarea value={npc.appearance.join(", ")} onChange={e => setNpc({ ...npc, appearance: e.target.value.split(",").map(s => s.trim()) })} /></label></div> : <><div className={styles.detail}><h3>Appearance</h3><p>{npc.appearance.join(", ")}</p></div><div className={styles.detail}><h3>Personality</h3><p>{npc.personality}</p></div><div className={styles.detail}><h3>At the table</h3><p>{npc.roleplayingCue}</p></div><div className={styles.hook}><span>✧ THE QUEST HOOK</span><textarea ref={questHookRef} aria-label="Quest hook" className={styles.questHookEditor} rows={1} value={questHook} onChange={e => setQuestHook(e.target.value)} /><div className={styles.hookActions}><button type="button" className={styles.primaryButton} disabled={busy} onClick={generateQuestHook}>{busy ? "Generating Quest Hook..." : "New Quest Hook"}</button></div></div></>}
            <div className={styles.portraitControls}>{!npc.portraitUrl && <p>Portraits are optional. Your character and quest can be saved without one.</p>}</div>
          </div>
        </aside>
        <section className={styles.journal} aria-label="Adventure journal"><div className={styles.journalTop}><div><span className={styles.kicker}>02 / THE ADVENTURE</span><h2>Adventure Journal</h2></div><span className={styles.journalEmblem}>✧</span></div>
          <div className={styles.paper}><div className={styles.paperInner}>{fullQuest ? <><div className={styles.paperEyebrow}>A QUEST FOR YOUR TABLE</div><input aria-label="Adventure title" className={styles.adventureTitleEditor} value={adventureTitle} onChange={e => setAdventureTitle(e.target.value)} maxLength={120} /><p className={styles.adventureByline}>Featuring {npc.name} · Ready to play</p><div className={styles.ornament}>❧</div><AdventureText text={adventureBody} /></> : <div className={styles.emptyAdventure}><div className={styles.emptyMark}>❧</div><div className={styles.paperEyebrow}>AN UNWRITTEN TALE</div><h2>Every legend begins<br />with a choice.</h2><p>{npc.name} has a story to tell. Develop the full adventure to discover the characters, locations, complications and choices waiting for your players.</p><div className={styles.hookPreview}><span>THE FIRST THREAD</span><p>{questHook}</p></div></div>}</div></div>
          <div className={styles.journalFooter}>{fullQuest ? <><span>✦ Adventure complete</span><button onClick={() => { const savedQuest = withAdventureTitle(fullQuest, adventureTitle); downloadText(`${npc.name}-adventure`, savedQuest); }}>Download adventure ↓</button><button onClick={() => setEditingQuest(!editingQuest)}>{editingQuest ? "Finish editing ✓" : "Edit adventure ✎"}</button></> : <><span>Full adventure · 1 Guild Token</span><button className={styles.primaryButton} disabled={busy} onClick={developQuest}>{busy ? "Writing your adventure…" : "Develop full quest ✦"}</button></>}</div>
          {editingQuest && fullQuest && <div className={styles.questEditor}><label htmlFor="quest-text">Edit the complete adventure</label><textarea id="quest-text" value={fullQuest} onChange={e => setFullQuest(e.target.value)} rows={20} /><p>Your edits are kept in this browser session. Save your NPC to preserve the adventure in your guild.</p></div>}
        </section>
      </div> : <div className={styles.welcome}><span>✧</span><h2>A stranger is waiting to be discovered.</h2><p>Choose a setting above and summon your first quest giver. The quick quest hook is free.</p></div>}
      <footer className={styles.footer}>NPC RECRUITER <span>✦</span> STORIES BEGIN WITH SOMEONE</footer>
    </div>
  </main>;
}
