import { jsPDF } from "jspdf";

export type PrintableNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  roleplayingCue: string;
  portraitUrl?: string;
  hired?: boolean;
};

const PAGE_WIDTH = 8.5;
const PAGE_HEIGHT = 11;

const COLUMNS = 3;
const ROWS = 3;

const CARD_WIDTH = 2.5;
const CARD_HEIGHT = 3.3;

const GRID_WIDTH = CARD_WIDTH * COLUMNS;
const GRID_HEIGHT = CARD_HEIGHT * ROWS;

const GRID_LEFT = (PAGE_WIDTH - GRID_WIDTH) / 2;
const GRID_TOP = (PAGE_HEIGHT - GRID_HEIGHT) / 2;

const CARD_INSET = 0.1;
const CONTENT_INSET = 0.15;

const PAPER_RGB = {
  r: 255,
  g: 253,
  b: 248,
};

const INK_RGB = {
  r: 42,
  g: 40,
  b: 35,
};

const GOLD_RGB = {
  r: 169,
  g: 132,
  b: 61,
};

const PALE_GOLD_RGB = {
  r: 240,
  g: 226,
  b: 197,
};

const RULE_RGB = {
  r: 188,
  g: 173,
  b: 143,
};

function getCardPosition(index: number) {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;

  return {
    x: GRID_LEFT + column * CARD_WIDTH,
    y: GRID_TOP + row * CARD_HEIGHT,
    row,
    column,
  };
}

function setInk(doc: jsPDF) {
  doc.setTextColor(INK_RGB.r, INK_RGB.g, INK_RGB.b);
  doc.setDrawColor(INK_RGB.r, INK_RGB.g, INK_RGB.b);
}

function setGold(doc: jsPDF) {
  doc.setTextColor(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b);
  doc.setDrawColor(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b);
}

function drawPageBackground(doc: jsPDF) {
  doc.setFillColor(PAPER_RGB.r, PAPER_RGB.g, PAPER_RGB.b);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
}

function drawCutGuides(doc: jsPDF) {
  doc.setDrawColor(RULE_RGB.r, RULE_RGB.g, RULE_RGB.b);
  doc.setLineWidth(0.008);
  doc.setLineDashPattern([0.06, 0.05], 0);

  doc.rect(
    GRID_LEFT,
    GRID_TOP,
    GRID_WIDTH,
    GRID_HEIGHT,
  );

  for (let column = 1; column < COLUMNS; column += 1) {
    const x = GRID_LEFT + column * CARD_WIDTH;

    doc.line(
      x,
      GRID_TOP,
      x,
      GRID_TOP + GRID_HEIGHT,
    );
  }

  for (let row = 1; row < ROWS; row += 1) {
    const y = GRID_TOP + row * CARD_HEIGHT;

    doc.line(
      GRID_LEFT,
      y,
      GRID_LEFT + GRID_WIDTH,
      y,
    );
  }

  doc.setLineDashPattern([], 0);
}

function truncateText(
  doc: jsPDF,
  value: string,
  maxWidth: number,
) {
  if (doc.getTextWidth(value) <= maxWidth) {
    return value;
  }

  let shortened = value;

  while (
    shortened.length > 1 &&
    doc.getTextWidth(`${shortened}...`) > maxWidth
  ) {
    shortened = shortened.slice(0, -1);
  }

  return `${shortened.trim()}...`;
}

function drawSectionLabel(
  doc: jsPDF,
  label: string,
  x: number,
  y: number,
) {
  setGold(doc);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.text(label.toUpperCase(), x, y);
}

function drawTextCard(
  doc: jsPDF,
  npc: PrintableNpc,
  index: number,
) {
  const { x, y } = getCardPosition(index);

  const innerX = x + CARD_INSET;
  const innerY = y + CARD_INSET;
  const innerWidth = CARD_WIDTH - CARD_INSET * 2;
  const innerHeight = CARD_HEIGHT - CARD_INSET * 2;

  doc.setFillColor(PAPER_RGB.r, PAPER_RGB.g, PAPER_RGB.b);
  doc.rect(innerX, innerY, innerWidth, innerHeight, "F");

  doc.setDrawColor(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b);
  doc.setLineWidth(0.018);
  doc.rect(innerX, innerY, innerWidth, innerHeight);

  const contentX = innerX + CONTENT_INSET;
  const contentWidth = innerWidth - CONTENT_INSET * 2;

  const titleHeight = 0.45;

  doc.setFillColor(
    PALE_GOLD_RGB.r,
    PALE_GOLD_RGB.g,
    PALE_GOLD_RGB.b,
  );

  doc.rect(
    innerX,
    innerY,
    innerWidth,
    titleHeight,
    "F",
  );

  doc.setDrawColor(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b);
  doc.line(
    innerX,
    innerY + titleHeight,
    innerX + innerWidth,
    innerY + titleHeight,
  );

  setInk(doc);
  doc.setFont("times", "bold");
  doc.setFontSize(11);

  const displayName = truncateText(
    doc,
    npc.name.toUpperCase(),
    contentWidth,
  );

  doc.text(
    displayName,
    innerX + innerWidth / 2,
    innerY + 0.285,
    {
      align: "center",
    },
  );

  let cursorY = innerY + titleHeight + 0.22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const identity = `${npc.gender} - ${npc.species}`;

  doc.text(
    truncateText(doc, identity, contentWidth),
    innerX + innerWidth / 2,
    cursorY,
    {
      align: "center",
    },
  );

  cursorY += 0.17;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);

  const occupationLines = doc.splitTextToSize(
    npc.occupation,
    contentWidth,
  ) as string[];

  const displayedOccupation = occupationLines.slice(0, 2);

  doc.text(
    displayedOccupation,
    innerX + innerWidth / 2,
    cursorY,
    {
      align: "center",
      lineHeightFactor: 1.15,
    },
  );

  cursorY += displayedOccupation.length * 0.13 + 0.11;

  doc.setDrawColor(RULE_RGB.r, RULE_RGB.g, RULE_RGB.b);
  doc.setLineWidth(0.008);
  doc.line(
    contentX,
    cursorY,
    contentX + contentWidth,
    cursorY,
  );

  cursorY += 0.18;

  drawSectionLabel(
    doc,
    "Personality",
    contentX,
    cursorY,
  );

  cursorY += 0.15;

  setInk(doc);
  doc.setFont("times", "bold");
  doc.setFontSize(8.5);

  const personalityLines = doc.splitTextToSize(
    npc.personality,
    contentWidth,
  ) as string[];

  const displayedPersonality =
    personalityLines.slice(0, 2);

  doc.text(
    displayedPersonality,
    contentX,
    cursorY,
    {
      lineHeightFactor: 1.18,
    },
  );

  cursorY += displayedPersonality.length * 0.16 + 0.11;

  doc.setDrawColor(RULE_RGB.r, RULE_RGB.g, RULE_RGB.b);
  doc.line(
    contentX,
    cursorY,
    contentX + contentWidth,
    cursorY,
  );

  cursorY += 0.18;

  drawSectionLabel(
    doc,
    "Roleplaying Cue",
    contentX,
    cursorY,
  );

  cursorY += 0.16;

  setInk(doc);
  doc.setFont("times", "italic");
  doc.setFontSize(8.2);

  const cueText = `"${npc.roleplayingCue}"`;

  const cueLines = doc.splitTextToSize(
    cueText,
    contentWidth,
  ) as string[];

  const maximumCueLines = Math.max(
    1,
    Math.floor(
      (innerY + innerHeight - 0.16 - cursorY) / 0.16,
    ),
  );

  const displayedCue = cueLines.slice(
    0,
    maximumCueLines,
  );

  if (cueLines.length > maximumCueLines) {
    const finalIndex = displayedCue.length - 1;

    displayedCue[finalIndex] = truncateText(
      doc,
      displayedCue[finalIndex],
      contentWidth,
    );
  }

  doc.text(
    displayedCue,
    contentX,
    cursorY,
    {
      lineHeightFactor: 1.25,
    },
  );
}

function getImageFormat(imageUrl: string) {
  if (imageUrl.startsWith("data:image/png")) {
    return "PNG";
  }

  if (
    imageUrl.startsWith("data:image/jpeg") ||
    imageUrl.startsWith("data:image/jpg")
  ) {
    return "JPEG";
  }

  return "WEBP";
}

function drawPortraitCard(
  doc: jsPDF,
  npc: PrintableNpc,
  destinationIndex: number,
) {
  if (!npc.portraitUrl) {
    throw new Error(
      `Missing portrait for ${npc.name}.`,
    );
  }

  const { x, y } = getCardPosition(destinationIndex);

  const innerX = x + CARD_INSET;
  const innerY = y + CARD_INSET;
  const innerWidth = CARD_WIDTH - CARD_INSET * 2;
  const innerHeight = CARD_HEIGHT - CARD_INSET * 2;

  doc.setFillColor(PAPER_RGB.r, PAPER_RGB.g, PAPER_RGB.b);
  doc.rect(innerX, innerY, innerWidth, innerHeight, "F");

  const frameInset = 0.055;

  const imageX = innerX + frameInset;
  const imageY = innerY + frameInset;
  const imageWidth = innerWidth - frameInset * 2;
  const imageHeight = innerHeight - frameInset * 2;

  doc.addImage(
    npc.portraitUrl,
    getImageFormat(npc.portraitUrl),
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    undefined,
    "FAST",
  );

  doc.setDrawColor(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b);
  doc.setLineWidth(0.025);
  doc.rect(
    innerX,
    innerY,
    innerWidth,
    innerHeight,
  );

  doc.setDrawColor(PAPER_RGB.r, PAPER_RGB.g, PAPER_RGB.b);
  doc.setLineWidth(0.035);
  doc.rect(
    imageX,
    imageY,
    imageWidth,
    imageHeight,
  );
}

function validatePrintableCast(npcs: PrintableNpc[]) {
  if (npcs.length !== 9) {
    throw new Error(
      "The printable cast requires exactly nine NPCs.",
    );
  }

  const unhiredNpc = npcs.find((npc) => !npc.hired);

  if (unhiredNpc) {
    throw new Error(
      "All nine NPCs must be hired before downloading the cast.",
    );
  }

  const npcWithoutPortrait = npcs.find(
    (npc) => !npc.portraitUrl,
  );

  if (npcWithoutPortrait) {
    throw new Error(
      `A portrait has not been generated for ${npcWithoutPortrait.name}.`,
    );
  }
}

export function generatePrintableCast(
  npcs: PrintableNpc[],
) {
  validatePrintableCast(npcs);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
    compress: true,
  });

  doc.setProperties({
    title: "NPC Recruiter Printable Cast",
    subject:
      "Nine double-sided printable NPC cards",
    author: "NPC Recruiter",
    creator: "NPC Recruiter",
  });

  drawPageBackground(doc);

  npcs.forEach((npc, index) => {
    drawTextCard(doc, npc, index);
  });

  drawCutGuides(doc);

  doc.addPage("letter", "portrait");

  drawPageBackground(doc);

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const frontIndex = row * COLUMNS + column;

      const mirroredColumn =
        COLUMNS - 1 - column;

      const backDestinationIndex =
        row * COLUMNS + mirroredColumn;

      drawPortraitCard(
        doc,
        npcs[frontIndex],
        backDestinationIndex,
      );
    }
  }

  drawCutGuides(doc);

  doc.save("npc-recruiter-cast.pdf");
}