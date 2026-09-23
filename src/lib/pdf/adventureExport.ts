import { jsPDF } from "jspdf";

type Field = { label: string; value?: string | null };
type PdfSection = { title: string; body: string };

/** Browser-side, multi-page, text-selectable export. Never truncates long adventures. */
export function downloadGuildPdf(filename: string, title: string, subtitle: string, fields: Field[], sections: PdfSection[]) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const width = 210;
  const margin = 19;
  const textWidth = width - margin * 2;
  let y = 0;
  let page = 0;
  const header = () => {
    page++;
    pdf.setFillColor(32, 23, 13);
    pdf.rect(0, 0, width, 17, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(241, 223, 185);
    pdf.text("NPC RECRUITER  /  GUILD ARCHIVE", margin, 11);
    pdf.setDrawColor(160, 125, 61);
    pdf.line(margin, 282, width - margin, 282);
    pdf.setTextColor(110, 88, 52);
    pdf.setFontSize(8);
    pdf.text(`NPCRECRUITER.COM   •   ${page}`, width - margin, 288, { align: "right" });
    y = 27;
  };
  const room = (height: number) => { if (y + height > 275) { pdf.addPage(); header(); } };
  const paragraph = (body: string, fontSize = 10) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(fontSize);
    pdf.setTextColor(49, 41, 30);
    const lineHeight = fontSize === 10 ? 5.3 : 4.7;
    for (const rawLine of body.replace(/\r/g, "").split("\n")) {
      if (!rawLine.trim()) { room(3); y += 3; continue; }
      const line = rawLine.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, "");
      const wrapped = pdf.splitTextToSize(line, textWidth) as string[];
      for (const part of wrapped) { room(lineHeight); pdf.text(part, margin, y); y += lineHeight; }
    }
    y += 3;
  };
  const heading = (label: string) => {
    room(16);
    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(126, 72, 30);
    const lines = pdf.splitTextToSize(label, textWidth) as string[];
    for (const line of lines) { room(6); pdf.text(line, margin, y); y += 6; }
    pdf.setDrawColor(192, 157, 91);
    pdf.line(margin, y + 1, width - margin, y + 1);
    y += 6;
  };
  header();
  pdf.setFont("times", "bold");
  pdf.setFontSize(23);
  pdf.setTextColor(45, 32, 17);
  for (const line of pdf.splitTextToSize(title, textWidth) as string[]) { room(11); pdf.text(line, margin, y); y += 11; }
  y += 2;
  paragraph(subtitle);
  for (const field of fields) if (field.value?.trim()) { heading(field.label); paragraph(field.value); }
  for (const section of sections) if (section.body.trim()) { heading(section.title); paragraph(section.body); }
  pdf.save(`${filename.replace(/[^a-z0-9-_]/gi, "-")}.pdf`);
}

export type GuildNpc = { name: string; gender?: string; species?: string; occupation?: string; appearance?: string[]; personality?: string; roleplayingCue?: string; portraitPrompt?: string; portraitUrl?: string; questHook?: string };
export function downloadNpcPdf(npc: GuildNpc, questHook = "", fullQuest = "") {
  downloadGuildPdf(npc.name, npc.name, [npc.gender, npc.species, npc.occupation].filter(Boolean).join(" · "), [
    { label: "Appearance", value: npc.appearance?.join(", ") },
    { label: "Personality", value: npc.personality },
    { label: "At the Table", value: npc.roleplayingCue },
    { label: "Portrait Prompt", value: npc.portraitPrompt },
    { label: "Portrait URL", value: npc.portraitUrl },
    { label: "Quest Hook", value: questHook || npc.questHook },
  ], fullQuest ? [{ title: "Complete Adventure", body: fullQuest }] : []);
}
export function downloadAdventurePdf(npc: GuildNpc, questHook: string, adventure: string) {
  downloadGuildPdf(`${npc.name}-adventure`, `${npc.name}: Adventure`, "A ready-to-play quest from NPC Recruiter", [
    { label: "Quest Giver", value: `${npc.name} · ${npc.species ?? ""} · ${npc.occupation ?? ""}` },
    { label: "Quest Hook", value: questHook },
  ], [{ title: "The Adventure", body: adventure }]);
}
