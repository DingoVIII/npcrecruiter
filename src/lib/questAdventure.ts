const titleLine = /^\s*(?:#{1,3}\s*)?Title:\s*([^\r\n]+)(?:\r?\n|$)/i;

export function extractAdventureTitle(text: string): string {
  return text.match(titleLine)?.[1].trim() || "Your adventure";
}

export function stripAdventureTitle(text: string): string {
  return text.replace(titleLine, "");
}

export function withAdventureTitle(text: string, title: string): string {
  const body = stripAdventureTitle(text).replace(/^\s+/, "");
  return `Title: ${title.trim() || "Your adventure"}\n\n${body}`;
}
