import { culturalIntegrationPrompt } from "./culturalintegration";

export type RecruitNpcInput = {
  location: string;
  inspiration: string;
  species: string[];
  genderMix: string;
  count?: number;
  existingNames?: string[];
};

export function buildNpcGenerationPrompt({
  location,
  inspiration,
  species,
  genderMix,
  count = 9,
  existingNames = [],
}: RecruitNpcInput) {
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

RECRUITMENT RULES

- Obey every user constraint.
- Use only the allowed species.
- Make all nine NPCs distinct from one another.
- All nine should feel as though they belong naturally in the same location and society.
- Choose occupations that make sense for the selected location.
- Blend species and cultural inspiration when creating every name.
- Let the selected cultural naming system dominate, with species identity influencing it subtly.
- Do not preserve stereotypical species phonetics unless they naturally fit the selected inspiration.
- Do not use generic fantasy names that ignore the selected inspiration.
- Do not repeat names, occupations, personalities, or roleplaying cues.
- Every full name must be clearly distinct from every other name in the set.
- Avoid names that share the same dominant sound, prefix, suffix, or rhythm.
- Each of the nine given names must begin with a different letter.
- Avoid comedy names unless the selected inspiration clearly calls for comedy.
- Keep the characters immediately usable at the table.

VISIBLE CARD INFORMATION

Each NPC must include:

- name
- gender
- species
- occupation
- personality
- roleplayingCue

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

  Across the full set of nine NPCs, do not overuse one kind of roleplaying cue.

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

It should describe the same person as the visible card and include only visually useful details, such as:

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
      "personality": "string",
      "roleplayingCue": "string",
      "portraitPrompt": "string"
    }
  ]
}

The "npcs" array must contain exactly ${count} objects.
`;
}