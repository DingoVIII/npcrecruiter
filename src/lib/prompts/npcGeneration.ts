import { culturalIntegrationPrompt } from "./culturalintegration";

export type RecruitNpcInput = {
  location: string;
  inspiration: string;
  species: string[];
  genderMix: string;
  count?: number;
  includeQuestHook?: boolean;
  existingNames?: string[];
  existingQuestHooks?: string[];
};

export function buildNpcGenerationPrompt({
  location,
  inspiration,
  species,
  genderMix,
  count = 9,
  includeQuestHook = true,
  existingNames = [],
  existingQuestHooks = [],
}: RecruitNpcInput) {
  const existingQuestHooksText = existingQuestHooks.length > 0
    ? existingQuestHooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n")
    : "None";

  const existingNamesText =
    existingNames.length > 0
      ? existingNames.join(", ")
      : "None";

  return `
${culturalIntegrationPrompt}

TASK

Recruit exactly ${count} original NPCs for a tabletop roleplaying game.

USER CONSTRAINTS

Location:
${location}

Cultural or fantasy inspiration:
${inspiration}

Allowed species:
${species.join(", ")}

Gender mix:
${genderMix}

Names already in this recruitment set:
${existingNamesText}

Do not repeat or closely imitate any existing name listed above.

Quest hooks already in this cast (including hooks from characters being refreshed):
${existingQuestHooksText}

RECRUITMENT RULES

- Obey every user constraint.
- Use only the allowed species.
- Make every NPC distinct from the other characters in the cast.
- All characters should feel as though they belong naturally in the same location and society.
- Choose occupations that make sense for the selected location.
- Blend species and cultural inspiration when creating every name.
- Let the selected cultural naming system dominate, with species identity influencing it subtly.
- Do not preserve stereotypical species phonetics unless they naturally fit the selected inspiration.
- Do not use generic fantasy names that ignore the selected inspiration.
- Do not repeat names, occupations, personalities, or roleplaying cues.
- Every full name must be clearly distinct from every other name in the set.
- Avoid duplicate or confusingly similar names.
- Given names should not all begin with the same letter.
- Avoid obvious alphabetical sequences such as A, B, C, D.
- Choose a natural variety of starting letters that suits the selected cultural inspiration.
- Similar naming rhythms are acceptable when they reflect the chosen culture, but the names should remain easy for a Game Master to distinguish during play.
- Avoid comedy names unless the selected inspiration clearly calls for comedy.  
- Keep the characters immediately usable at the table.

QUEST HOOK

Write one original, concise, actionable quest hook for EACH NPC. The hook is mandatory, even for a single-character recruitment.

- Make the hook arise from THIS character’s occupation, personality, relationships, access, or a believable problem in the selected location. Give the DM a concrete situation, a specific request or discovery, and an intriguing complication or choice.
- Write 1–2 short sentences, about 20–45 words total. Include a specific detail the DM can use immediately.
- Vary the type and stakes: an investigation, rescue, negotiation, delivery, social dispute, unusual discovery, moral dilemma, strange local occurrence, or personal request can all work. Not every hook needs a villain, theft, missing person, ancient relic, or monster.
- Avoid generic interchangeable errands, repeated plot templates, and hooks that could be swapped between NPCs without changing anything.
- Do not repeat or paraphrase the existing hooks listed above. Change the central problem, the requested action, and the twist, not merely the names or objects.
- Keep the quest appropriate to the location and inspiration, without relying on stereotypes.
- Return an actual quest hook, never an empty string, placeholder, or instruction to invent one.

VISIBLE CARD INFORMATION

Each NPC must include:

- name
- gender
- species
- occupation
- appearance
- personality
- roleplayingCue
- questHook

The appearance field must contain exactly three short descriptors.

Rules:

- exactly three items
- each descriptor must be 2–5 words
- never write full sentences
- only include immediately visible physical characteristics
- include a variety of features rather than repeating the same type
- reflect the selected species
- reflect the selected cultural inspiration
- remain consistent with the portrait

Good examples:

Human
- Dark curly hair
- Hazel eyes
- Weathered skin

Dwarf
- Thick auburn braid
- Broad broken nose
- Amber eyes

Elf
- Silver-white hair
- Emerald eyes
- Elegant cheekbones

Orc
- Olive-green skin
- Short ivory tusks
- Braided topknot

These three appearance descriptors are the canonical visual description of the NPC and must always agree with the portraitPrompt.

The personality must:

- use 2 to 5 words
- be immediately readable at the table
- describe temperament rather than backstory
- avoid full sentences and long character summaries

Good personality:

"Meticulous and reserved"

Bad personality:

"Refined and meticulous, quietly proud of her blends, businesslike with regular customers."

The roleplaying cue must:

- be one short sentence
- be immediately playable by a DM
- describe something the NPC visibly does, repeatedly says, or habitually avoids
- contain no backstory
- contain no secret lore
- usually remain under 14 words
- differ clearly from every other roleplaying cue in the set
- vary across different cue types, including speech, gesture, posture,
  interaction, ritual, avoidance and physical habit

  Across the full set of four NPCs, do not overuse one kind of roleplaying cue.

The set should include a natural mix of spoken habits, gestures, posture,
social interactions, rituals, avoidance behaviours and physical habits.

Do not generate multiple cues that are essentially variations of humming,
tapping, counting, polishing, inspecting or repeating the same action.

Good roleplaying cue:

"Never stops polishing the same mug."

Bad roleplaying cue:

"Lost his family during the war and secretly seeks revenge."

HIDDEN PORTRAIT INFORMATION

Each NPC must also include a portraitPrompt.

The portraitPrompt is internal production information and must not be written as player-facing prose.

It must faithfully describe the same NPC shown on the visible card.

The portraitPrompt MUST include and obey the three Appearance descriptors exactly.

Those descriptors take precedence over any inferred visual details.

The portrait may add additional compatible details, but it must never contradict or replace the Appearance descriptors.

The portraitPrompt should then include visually useful details such as:

- apparent age
- build
- facial features
- skin, hair and eye appearance
- grooming and hairstyle
- clothing
- culturally appropriate adornment
- occupation-related objects
- posture and expression

The portraitPrompt must:

- reflect the selected species
- reflect the selected inspiration
- remain consistent with the NPC's occupation and personality
- avoid camera instructions
- avoid naming an art style
- avoid mentioning copyrighted characters or settings
- describe one person only
- contain no written text, labels or typography

OUTPUT FORMAT

Return valid JSON only.

Do not use Markdown.

Do not include an explanation before or after the JSON.

Return an object with this exact structure:

{
  "npcs": [
    {
  "name": "string",
  "gender": "string",
  "species": "string",
  "occupation": "string",
  "appearance": [
    "string",
    "string",
    "string"
  ],
  "personality": "string",
  "roleplayingCue": "string",
  "questHook": "string",
  "portraitPrompt": "string"
}
  ]
}

The "npcs" array must contain exactly ${count} objects.
`;
}