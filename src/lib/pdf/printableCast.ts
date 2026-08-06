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

const PAGE_WIDTH = 11;
const PAGE_HEIGHT = 8.5;

const PAGE_MARGIN = 0.28;
const FOLD_X = PAGE_WIDTH / 2;

const HALF_WIDTH = PAGE_WIDTH / 2;

const HALF_CONTENT_WIDTH =
  HALF_WIDTH - PAGE_MARGIN * 2;

const GRID_GAP = 0.14;

const CELL_WIDTH =
  (HALF_CONTENT_WIDTH - GRID_GAP) / 2;

const CELL_HEIGHT = 3.65;

const GRID_TOP = 0.72;

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

function setInk(doc: jsPDF) {
  doc.setTextColor(
    INK_RGB.r,
    INK_RGB.g,
    INK_RGB.b,
  );

  doc.setDrawColor(
    INK_RGB.r,
    INK_RGB.g,
    INK_RGB.b,
  );
}

function setGold(doc: jsPDF) {
  doc.setTextColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.setDrawColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );
}

function drawPageBackground(doc: jsPDF) {
  doc.setFillColor(
    PAPER_RGB.r,
    PAPER_RGB.g,
    PAPER_RGB.b,
  );

  doc.rect(
    0,
    0,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    "F",
  );
}

function drawFoldGuide(doc: jsPDF) {
  doc.setDrawColor(
    RULE_RGB.r,
    RULE_RGB.g,
    RULE_RGB.b,
  );

  doc.setLineWidth(0.01);
  doc.setLineDashPattern([0.08, 0.06], 0);

  doc.line(
    FOLD_X,
    0.2,
    FOLD_X,
    PAGE_HEIGHT - 0.2,
  );

  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);

  doc.setTextColor(
    RULE_RGB.r,
    RULE_RGB.g,
    RULE_RGB.b,
  );

  doc.text(
    "FOLD",
    FOLD_X,
    PAGE_HEIGHT - 0.12,
    {
      align: "center",
    },
  );
}

function drawHalfHeading(
  doc: jsPDF,
  title: string,
  centreX: number,
) {
  setInk(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(15);

  doc.text(
    title.toUpperCase(),
    centreX,
    0.38,
    {
      align: "center",
    },
  );

  doc.setDrawColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.setLineWidth(0.018);

  doc.line(
    centreX - 1.35,
    0.49,
    centreX + 1.35,
    0.49,
  );

  doc.setFont("times", "italic");
  doc.setFontSize(7.5);

  doc.setTextColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.text(
    "NPC Recruiter",
    centreX,
    0.61,
    {
      align: "center",
    },
  );
}

function getCellPosition(
  index: number,
  halfStartX: number,
) {
  const row = Math.floor(index / 2);
  const column = index % 2;

  return {
    x:
      halfStartX +
      PAGE_MARGIN +
      column * (CELL_WIDTH + GRID_GAP),

    y:
      GRID_TOP +
      row * (CELL_HEIGHT + GRID_GAP),
  };
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
    doc.getTextWidth(`${shortened}...`) >
      maxWidth
  ) {
    shortened = shortened.slice(0, -1);
  }

  return `${shortened.trim()}...`;
}

function drawNumberBadge(
  doc: jsPDF,
  number: number,
  x: number,
  y: number,
) {
  doc.setFillColor(
    INK_RGB.r,
    INK_RGB.g,
    INK_RGB.b,
  );

  doc.circle(
    x,
    y,
    0.13,
    "F",
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);

  doc.text(
    String(number),
    x,
    y + 0.025,
    {
      align: "center",
    },
  );
}

function drawSectionLabel(
  doc: jsPDF,
  label: string,
  x: number,
  y: number,
) {
  setGold(doc);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);

  doc.text(
    label.toUpperCase(),
    x,
    y,
  );
}

function drawTextCard(
  doc: jsPDF,
  npc: PrintableNpc,
  index: number,
) {
  const { x, y } = getCellPosition(
    index,
    FOLD_X,
  );

  const innerInset = 0.08;

  const innerX = x + innerInset;
  const innerY = y + innerInset;

  const innerWidth =
    CELL_WIDTH - innerInset * 2;

  const innerHeight =
    CELL_HEIGHT - innerInset * 2;

  doc.setFillColor(
    PAPER_RGB.r,
    PAPER_RGB.g,
    PAPER_RGB.b,
  );

  doc.rect(
    innerX,
    innerY,
    innerWidth,
    innerHeight,
    "F",
  );

  doc.setDrawColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.setLineWidth(0.02);

  doc.rect(
    innerX,
    innerY,
    innerWidth,
    innerHeight,
  );

  drawNumberBadge(
    doc,
    index + 1,
    innerX + 0.17,
    innerY + 0.18,
  );

  const titleHeight = 0.55;

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

  doc.setDrawColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.line(
    innerX,
    innerY + titleHeight,
    innerX + innerWidth,
    innerY + titleHeight,
  );

  const contentX = innerX + 0.16;

  const contentWidth =
    innerWidth - 0.32;

  setInk(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(12.5);

  const displayName = truncateText(
    doc,
    npc.name.toUpperCase(),
    contentWidth - 0.28,
  );

  doc.text(
    displayName,
    innerX + innerWidth / 2,
    innerY + 0.24,
    {
      align: "center",
    },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const identity =
    `${npc.gender} · ${npc.species}`;

  doc.text(
    truncateText(
      doc,
      identity,
      contentWidth,
    ),
    innerX + innerWidth / 2,
    innerY + 0.42,
    {
      align: "center",
    },
  );

  let cursorY =
    innerY + titleHeight + 0.22;

  drawSectionLabel(
    doc,
    "Occupation",
    contentX,
    cursorY,
  );

  cursorY += 0.17;

  setInk(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(9.5);

  const occupationLines =
    doc.splitTextToSize(
      npc.occupation,
      contentWidth,
    ) as string[];

  doc.text(
    occupationLines.slice(0, 2),
    contentX,
    cursorY,
    {
      lineHeightFactor: 1.15,
    },
  );

  cursorY +=
    Math.min(
      occupationLines.length,
      2,
    ) *
      0.17 +
    0.1;

  doc.setDrawColor(
    RULE_RGB.r,
    RULE_RGB.g,
    RULE_RGB.b,
  );

  doc.setLineWidth(0.008);

  doc.line(
    contentX,
    cursorY,
    contentX + contentWidth,
    cursorY,
  );

  cursorY += 0.19;

  drawSectionLabel(
    doc,
    "Personality",
    contentX,
    cursorY,
  );

  cursorY += 0.18;

  setInk(doc);

  doc.setFont("times", "normal");
  doc.setFontSize(9);

  const personalityLines =
    doc.splitTextToSize(
      npc.personality,
      contentWidth,
    ) as string[];

  doc.text(
    personalityLines.slice(0, 4),
    contentX,
    cursorY,
    {
      lineHeightFactor: 1.2,
    },
  );

  cursorY +=
    Math.min(
      personalityLines.length,
      4,
    ) *
      0.17 +
    0.11;

  doc.setDrawColor(
    RULE_RGB.r,
    RULE_RGB.g,
    RULE_RGB.b,
  );

  doc.line(
    contentX,
    cursorY,
    contentX + contentWidth,
    cursorY,
  );

  cursorY += 0.19;

  drawSectionLabel(
    doc,
    "Roleplaying Cue",
    contentX,
    cursorY,
  );

  cursorY += 0.18;

  setInk(doc);

  doc.setFont("times", "italic");
  doc.setFontSize(9);

  const cueLines =
    doc.splitTextToSize(
      `"${npc.roleplayingCue}"`,
      contentWidth,
    ) as string[];

  const availableHeight =
    innerY +
    innerHeight -
    0.14 -
    cursorY;

  const maximumCueLines = Math.max(
    1,
    Math.floor(
      availableHeight / 0.18,
    ),
  );

  const displayedCue =
    cueLines.slice(
      0,
      maximumCueLines,
    );

  if (
    cueLines.length >
    maximumCueLines
  ) {
    const finalIndex =
      displayedCue.length - 1;

    displayedCue[finalIndex] =
      truncateText(
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
      lineHeightFactor: 1.22,
    },
  );
}

function getImageFormat(
  imageUrl: string,
) {
  if (
    imageUrl.startsWith(
      "data:image/png",
    )
  ) {
    return "PNG";
  }

  if (
    imageUrl.startsWith(
      "data:image/jpeg",
    ) ||
    imageUrl.startsWith(
      "data:image/jpg",
    )
  ) {
    return "JPEG";
  }

  return "WEBP";
}

async function imageUrlToDataUrl(
  imageUrl: string,
) {
  if (
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  const response = await fetch(
    imageUrl,
  );

  if (!response.ok) {
    throw new Error(
      "One of the portrait images could not be downloaded.",
    );
  }

  const blob = await response.blob();

  return await new Promise<string>(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (
          typeof reader.result ===
          "string"
        ) {
          resolve(reader.result);
        } else {
          reject(
            new Error(
              "A portrait image could not be prepared for printing.",
            ),
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "A portrait image could not be prepared for printing.",
          ),
        );
      };

      reader.readAsDataURL(blob);
    },
  );
}

function drawPortraitCard(
  doc: jsPDF,
  npc: PrintableNpc,
  index: number,
  portraitDataUrl: string,
) {
  const { x, y } = getCellPosition(
    index,
    0,
  );

  const innerInset = 0.08;

  const innerX = x + innerInset;
  const innerY = y + innerInset;

  const innerWidth =
    CELL_WIDTH - innerInset * 2;

  const innerHeight =
    CELL_HEIGHT - innerInset * 2;

  doc.setFillColor(
    PAPER_RGB.r,
    PAPER_RGB.g,
    PAPER_RGB.b,
  );

  doc.rect(
    innerX,
    innerY,
    innerWidth,
    innerHeight,
    "F",
  );

  const frameInset = 0.055;

  const imageX =
    innerX + frameInset;

  const imageY =
    innerY + frameInset;

  const imageWidth =
    innerWidth -
    frameInset * 2;

  const imageHeight =
    innerHeight -
    frameInset * 2;

  doc.addImage(
    portraitDataUrl,
    getImageFormat(
      portraitDataUrl,
    ),
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    undefined,
    "FAST",
  );

  doc.setDrawColor(
    GOLD_RGB.r,
    GOLD_RGB.g,
    GOLD_RGB.b,
  );

  doc.setLineWidth(0.025);

  doc.rect(
    innerX,
    innerY,
    innerWidth,
    innerHeight,
  );

  drawNumberBadge(
    doc,
    index + 1,
    innerX + 0.17,
    innerY + 0.18,
  );

  doc.setFillColor(
    PAPER_RGB.r,
    PAPER_RGB.g,
    PAPER_RGB.b,
  );

  doc.roundedRect(
    innerX + 0.36,
    innerY +
      innerHeight -
      0.34,
    innerWidth - 0.72,
    0.24,
    0.04,
    0.04,
    "F",
  );

  setInk(doc);

  doc.setFont("times", "bold");
  doc.setFontSize(8.5);

  doc.text(
    truncateText(
      doc,
      npc.name,
      innerWidth - 0.82,
    ),
    innerX +
      innerWidth / 2,
    innerY +
      innerHeight -
      0.18,
    {
      align: "center",
    },
  );
}

function validatePrintableCast(
  npcs: PrintableNpc[],
) {
  if (npcs.length !== 4) {
    throw new Error(
      "The printable cast requires exactly four NPCs.",
    );
  }

  const unhiredNpc =
    npcs.find(
      (npc) => !npc.hired,
    );

  if (unhiredNpc) {
    throw new Error(
      "All four NPCs must be hired before downloading the cast.",
    );
  }

  const npcWithoutPortrait =
    npcs.find(
      (npc) =>
        !npc.portraitUrl,
    );

  if (npcWithoutPortrait) {
    throw new Error(
      `A portrait has not been generated for ${npcWithoutPortrait.name}.`,
    );
  }
}

export async function generatePrintableCast(
  npcs: PrintableNpc[],
) {
  validatePrintableCast(npcs);

  const portraitDataUrls =
    await Promise.all(
      npcs.map((npc) =>
        imageUrlToDataUrl(
          npc.portraitUrl!,
        ),
      ),
    );

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: "letter",
    compress: true,
  });

  doc.setProperties({
    title:
      "NPC Recruiter Printable Cast",

    subject:
      "Four-person printable NPC cast",

    author:
      "NPC Recruiter",

    creator:
      "NPC Recruiter",
  });

  drawPageBackground(doc);

  drawHalfHeading(
    doc,
    "Portraits",
    HALF_WIDTH / 2,
  );

  drawHalfHeading(
    doc,
    "NPC Cast",
    FOLD_X + HALF_WIDTH / 2,
  );

  npcs.forEach(
    (npc, index) => {
      drawPortraitCard(
        doc,
        npc,
        index,
        portraitDataUrls[index],
      );

      drawTextCard(
        doc,
        npc,
        index,
      );
    },
  );

  drawFoldGuide(doc);

  doc.save(
    "npc-recruiter-cast.pdf",
  );
}