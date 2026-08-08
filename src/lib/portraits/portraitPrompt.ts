import { formatInspirationPrompt } from "@/lib/inspirationPrompts";

export type PortraitNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  portraitPrompt: string;
};

function getPortraitStyle(style: string) {
  switch (style) {
    case "Fantasy":
      return `
ART DIRECTION

Create a premium fantasy illustration suitable for a modern tabletop RPG sourcebook.

STYLE

• Beautiful painterly realism
• Rich cinematic lighting
• Warm natural colour palette
• Elegant brushwork
• Realistic anatomy
• Medieval-inspired clothing and armour
• Slightly idealised but believable people
• Premium fantasy book illustration quality

DO NOT

• Anime
• Manga
• Comic book style
• Cel shading
• 3D render appearance
• Plastic skin
• Cartoon proportions
• Multiple characters
`.trim();

    case "Historical":
      return `
ART DIRECTION

Create a museum-quality historical reconstruction portrait.

STYLE

• Authentic medieval clothing
• Historically grounded equipment
• Restrained colours
• Earth tones
• Natural lighting
• Ordinary believable people
• Painterly realism
• Museum illustration quality

DO NOT

• High fantasy armour
• Magical effects
• Glamour photography
• Heroic exaggeration
• Fantasy clichés
`.trim();

    case "Photorealistic":
      return `
ART DIRECTION

Create an ultra-photorealistic portrait of a believable medieval person.

STYLE

• Documentary photography
• Natural lighting
• Authentic skin texture
• Wrinkles, scars and imperfections
• Real fabrics
• Shallow depth of field
• Premium portrait photography

DO NOT

• Painterly effects
• CGI appearance
• Digital painting
• Beauty filters
• Plastic skin
`.trim();

    default:
      return style;
  }
}

function createStableSeed(value: string) {
  return Array.from(value).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

function chooseStableOption<T>(
  options: readonly T[],
  seed: number,
  offset = 0,
) {
  return options[(seed + offset) % options.length];
}

function normalizeSpecies(species: string) {
  return species
    .trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ");
}

function getSpeciesVisualProfile(npc: PortraitNpc) {
  const species = normalizeSpecies(npc.species);
  const seed = createStableSeed(`${npc.name}-${species}`);

  switch (species) {
    case "human":
      return `
HUMAN VISUAL IDENTITY

- Use genuinely human anatomy and natural human craniofacial proportions.
- Use the full natural range of human skin tones, facial structures, hair textures, ages, body types and physical features.
- Reflect the supplied culture, occupation and environment rather than defaulting to north-western European fantasy.
- Preserve ordinary imperfections, asymmetry, maturity, scars, weathering and signs of lived experience.
- Do not make every human young, attractive, athletic or heroic.
`.trim();

    case "dwarf":
      return `
DWARF VISUAL IDENTITY

- The character must be unmistakably dwarven before clothing, beard or hairstyle are considered.
- Use a broad, compact skull with heavy bone structure.
- Use a shorter, compressed midface, wide cheekbones, substantial nose, heavy brow and broad powerful jaw.
- The neck should be thick and short, with the head sitting heavily between broad shoulders.
- The visible torso should feel dense, compact and unusually powerful.
- Facial proportions should be wider, heavier and more compressed than ordinary human proportions.
- Do not create an ordinary human face and simply add a beard.
- Do not rely on beard length to communicate dwarf ancestry.
- Male dwarves may have beards, but beard length, texture and grooming should vary naturally.
- Female dwarves should have the same strong dwarven bone structure and should not simply look like short human women.
- Avoid making every dwarf elderly, bearded, gruff or dressed as a miner.
`.trim();

    case "elf":
      return `
ELF VISUAL IDENTITY

- The character must be unmistakably elven before the ears are noticed.
- Use distinctly non-human but believable facial proportions.
- Use an elongated face, high cheekbones, narrower jaw, refined cranial structure and slightly larger almond-shaped eyes.
- The nose bridge should be fine and elegant without becoming tiny or doll-like.
- The ears should be long and clearly pointed, but they must not be the only feature communicating elf ancestry.
- The visible build should feel long-framed, lightly built and naturally graceful rather than merely thin.
- Preserve natural age, scars, freckles, asymmetry and individuality.
- Full-blooded elves are completely beardless.
- Do not give full-blooded elves beards, moustaches, stubble, sideburns or any other facial hair.
- Do not create an ordinary human face and simply attach pointed ears.
- Do not make every elf young, pale, blond, flawless or conventionally beautiful.
`.trim();

    case "half elf":
      return `
HALF-ELF VISUAL IDENTITY

- Create a believable intermediate anatomy between human and elf.
- The face should remain primarily human in proportion, but with subtly higher cheekbones, slightly finer bone structure, a somewhat narrower jaw and gently almond-shaped eyes.
- Ears should be modestly pointed and clearly shorter than those of a full elf.
- The character should look visibly touched by elven ancestry without appearing identical to a full elf.
- Build may range from ordinary human proportions to slightly more slender and graceful.
- Skin, hair and eye colours should use the full natural human range.
- Half-elves may have facial hair depending on human ancestry and age.
- Avoid making every half-elf youthful, flawless, delicate or conventionally beautiful.
`.trim();

    case "orc":
      return `
ORC VISUAL IDENTITY

- The character must be unmistakably orcish from facial anatomy alone.
- Use clearly non-human craniofacial structure.
- Use a broad skull, heavy projecting brow, deep-set eyes, wide flattened nose, massive jaw and pronounced lower facial structure.
- Lower tusks must emerge naturally from the jaw and visibly alter the shape of the mouth.
- The neck should be thick and powerful, with the head sitting heavily into broad shoulders.
- The visible frame should be massive, dense and muscular.
- Skin may be deep green, olive green, grey-green, moss green or slate green, but skin colour alone must never define the species.
- Do not create an ordinary human face and simply recolour the skin green.
- Do not preserve ordinary human facial proportions.
- Female orcs should retain strong orcish craniofacial anatomy and visible tusks rather than appearing as green-skinned human women.
`.trim();

    case "half orc":
      return `
HALF-ORC VISUAL IDENTITY

- Create genuinely intermediate anatomy between human and orc.
- Use primarily human proportions but with a visibly heavier brow, wider jaw, broader nose, thicker neck and more robust facial bone structure.
- Include small but clear lower tusks that naturally affect the mouth shape.
- The character should appear strong and broad-shouldered without reaching full-orc mass.
- Skin may be muted olive, grey-green, weathered tan, bronze or subdued green.
- Ears may be only slightly pointed.
- Do not create a muscular human and simply add green skin or tiny tusks.
- Do not make the character visually identical to either a full human or full orc.
`.trim();

    case "goblin":
      return `
GOBLIN VISUAL IDENTITY

- The character must be visibly goblinoid from facial proportions alone.
- Use a small, narrow skull with sharp facial structure.
- Include very large pointed ears, a prominent or hooked nose, alert eyes, narrow cheeks and a pointed or reduced chin.
- The visible build should be short, wiry, light and agile rather than muscular.
- Skin may be yellow-green, olive, muddy green, brown-green or ochre-green.
- Do not create a small human face and recolour it green.
- Do not give the goblin the broad skull, massive jaw or heavy musculature of an orc.
- The overall impression should be quick, clever and resourceful.
`.trim();

    case "hobgoblin":
      return `
HOBGOBLIN VISUAL IDENTITY

- The character must look goblinoid rather than elven or human.
- Use a tall, lean, athletic frame.
- Use a strong brow ridge, square jaw, broad nose, large pointed ears and subtly enlarged lower canines or small tusks.
- Facial structure should be heavier and more angular than human anatomy.
- Skin should be burnished bronze, copper, russet, ochre, burnt orange or deep red.
- Do not use green or grey-green orc colouring.
- Preserve disciplined posture and composed bearing.
- Do not create a red-skinned elf.
- Do not use delicate elven bone structure or graceful elven facial proportions.
- Do not rely on skin colour alone to communicate species.
`.trim();

    case "bugbear":
      return `
BUGBEAR VISUAL IDENTITY

- The character must be unmistakably bugbear rather than a hairy human.
- Use a large goblinoid skull with heavy brow, broad jaw, deep-set eyes and large pointed ears.
- The visible frame should be large, long-limbed, powerful and slightly predatory in proportion.
- Arms may appear longer than ordinary human proportions.
- Cover visible skin with coarse fur ranging through brown, russet, black, grey or tawny shades.
- Facial fur should integrate naturally with goblinoid anatomy rather than resembling a beard pasted onto a human face.
- Preserve individual fur pattern, grooming, scars and cultural details.
- Do not make the character resemble an ape, bear or ordinary human.
`.trim();

    case "halfling":
      return `
HALFLING VISUAL IDENTITY

- The character must look like a small adult humanoid, never a child.
- Use compact adult proportions with a relatively broad face, softer jaw and sturdy neck.
- The visible frame should feel naturally compact rather than like a scaled-down human child.
- Facial proportions should remain adult and mature.
- Skin, hair and eye colours should use the full natural human range.
- Hair is often thick, wavy or curly but should vary naturally.
- Do not use oversized heads, childlike eyes or juvenile facial proportions.
- Do not make every halfling cheerful, round-faced, plump or barefoot.
`.trim();

    case "gnome":
      return `
GNOME VISUAL IDENTITY

- The character must look like a small adult humanoid, never a child.
- Use a smaller, slimmer and more angular build than a halfling.
- The face should be narrow and lively, with alert eyes, a somewhat prominent nose and expressive features.
- Ears may be subtly pointed.
- The visible body should feel lightly built and energetic rather than soft or rounded.
- Skin, hair and eye colours should use the full natural human range.
- Do not make the character look like a child-sized human.
- Do not default to steampunk goggles, novelty inventions or comic proportions.
- Make the gnome clearly distinct from a halfling through slimmer anatomy and sharper facial structure.
`.trim();

    case "tiefling": {
      const skinColours = [
        "deep crimson",
        "dark burgundy",
        "ash grey",
        "muted violet",
        "deep blue",
        "charcoal black",
        "pale lavender",
      ] as const;

      const hornStyles = [
        "backward-sweeping horns",
        "curled ram-like horns",
        "slender gazelle-like horns",
        "spiralled horns",
        "short ridged horns",
      ] as const;

      const eyeStyles = [
        "solid gold eyes",
        "solid white eyes",
        "luminous amber eyes",
        "deep red eyes",
        "solid violet eyes",
      ] as const;

      const skinColour = chooseStableOption(
        skinColours,
        seed,
      );
      const hornStyle = chooseStableOption(
        hornStyles,
        seed,
        2,
      );
      const eyeStyle = chooseStableOption(
        eyeStyles,
        seed,
        4,
      );

      return `
TIEFLING VISUAL IDENTITY

- This Tiefling has ${skinColour} skin.
- Include ${hornStyle}.
- Include ${eyeStyle}.
- Horns must emerge naturally from the skull and visibly alter the silhouette of the head.
- The horn bases should feel anatomically integrated rather than attached like costume pieces.
- Facial structure may remain broadly humanoid but should include subtle infernal traits such as unusual brow structure, cheekbones, eyes or ear shape.
- A tail should be present where composition permits, but it should remain a natural anatomical feature rather than dominating the portrait.
- Tieflings should vary strongly in age, build, face, hair, horns and complexion.
- Do not create an ordinary human face and merely add horns.
- Do not make every Tiefling seductive, glamorous, villainous or conventionally beautiful.
- Do not add wings unless the supplied appearance explicitly requests them.
`.trim();
    }

    case "aasimar":
      return `
AASIMAR VISUAL IDENTITY

- Aasimar should remain fundamentally humanoid and may closely resemble humans.
- Use believable human anatomy and the full natural range of human skin tones, facial structures, ages and body types.
- Suggest celestial ancestry primarily through unusual eyes, striking presence, subtle symmetry or an almost uncanny composure.
- The eyes may appear unusually clear, bright, metallic or faintly luminous without emitting visible magical light.
- Preserve scars, wrinkles, asymmetry and ordinary physical imperfections.
- Do not automatically make the character pale, blond, youthful, flawless or conventionally beautiful.
- Do not add halos, wings, radiant backgrounds or visible magical effects unless explicitly requested.
`.trim();

    case "goliath":
      return `
GOLIATH VISUAL IDENTITY

- The character must look physically enormous even in a chest-up portrait.
- Use extremely heavy bone structure, a broad skull, wide cheekbones, strong jaw, thick neck and massive shoulders.
- The head should sit deeply between the shoulders rather than on a long human neck.
- Facial proportions should feel larger, broader and heavier than ordinary human anatomy.
- Skin should range through stone-like greys, muted blue-greys, ash tones and weathered slate.
- Natural darker markings, mottling or culturally meaningful skin patterns may be present.
- Do not create a large human and simply add grey skin or tattoos.
- Avoid making every Goliath bald, expressionless, scarred or dressed as a barbarian.
`.trim();

    case "dragonborn": {
      const dragonbornColours = [
        "black",
        "blue",
        "brass",
        "bronze",
        "copper",
        "gold",
        "green",
        "red",
        "silver",
        "white",
      ] as const;

      const colour = chooseStableOption(
        dragonbornColours,
        seed,
      );

      return `
DRAGONBORN VISUAL IDENTITY

- This Dragonborn has a ${colour} draconic lineage.
- Use clearly reptilian draconic anatomy rather than human facial structure.
- The skull must include a strong muzzle, pronounced brow, layered scales and species-appropriate horns, crests or cranial ridges.
- The jaw should be reptilian and robust rather than human-shaped.
- Eyes should sit naturally within a draconic skull.
- Keep the ${colour} lineage consistent across visible scales.
- Subtle variation in shade and scale pattern is welcome, but do not mix unrelated dragon colours.
- The visible neck and shoulders should retain scaled, draconic anatomy.
- Do not create a human face and add scales.
- Do not make the Dragonborn look like a human wearing a reptile mask.
- Do not make the character resemble a kobold.
- Do not add wings unless explicitly requested.
`.trim();
    }

    case "kobold":
      return `
KOBOLD VISUAL IDENTITY

- The character must be clearly reptilian and distinctly smaller and lighter than a Dragonborn.
- Use a narrow draconic skull, small muzzle, alert eyes, fine scales and delicate horns or cranial ridges.
- The visible frame should be slight, narrow and agile.
- Scale colours may vary naturally through earthy reds, rust, ochre, brown, grey, black, green or muted metallic tones.
- The skull should feel sharper and more delicate than Dragonborn anatomy.
- Do not create a small human face with scales.
- Do not make the kobold look like a miniature Dragonborn.
- Avoid broad shoulders, massive jaws and heavy dragon-like musculature.
`.trim();

    default:
      return `
SPECIES VISUAL IDENTITY

- Follow the supplied species and appearance description closely.
- The requested species must be recognizable from anatomy and proportions before clothing, colour, ears, horns, facial hair or accessories are considered.
- Use species-appropriate skull shape, facial structure, neck, ears, skin, scales, fur, horns and visible body proportions where applicable.
- If the species is non-human, do not begin with an ordinary human face and add species markers afterward.
- Do not replace the requested species with a generic human, elf or orc.
`.trim();
  }
}

export function buildPortraitPrompt(
  npc: PortraitNpc,
  style: string,
  inspiration?: string,
) {
  const inspirationGuidance =
  inspiration
    ? formatInspirationPrompt(inspiration)
    : "";
  return `
Create a polished vertical fantasy character portrait for a tabletop
roleplaying game NPC.

ART STYLE

${getPortraitStyle(style)}

CHARACTER

Name:
${npc.name}

Gender:
${npc.gender}

Species:
${npc.species}

SPECIES VISUAL PROFILE

${getSpeciesVisualProfile(npc)}

Occupation:
${npc.occupation}

Personality:
${npc.personality}

APPEARANCE AND CULTURAL DETAILS

${npc.portraitPrompt}

${
  inspirationGuidance
    ? `CULTURAL REFERENCE

${inspirationGuidance}`
    : ""
}

COMPOSITION

- Show the head and upper torso, approximately chest-up.
- The character should look generally toward the viewer, though they do not
  need to face the viewer perfectly straight-on.
- Use a neutral, uncluttered background with subtle atmosphere.
- Depict exactly one character.
- Keep the face clearly visible and expressive.
- Use a calm portrait pose rather than an action scene.
- Do not use dramatic action poses.
- Do not point weapons or other objects toward the viewer.

CHARACTER CONSISTENCY

- Species must be communicated primarily through anatomy and proportions.
- Do not rely on skin colour, ears, horns, facial hair or accessories alone to communicate species.
- If the requested species is non-human, build the skull, face, neck and visible body using the species profile first.
- If the portrait would still look human after removing colour, ears, horns, hair and accessories, the non-human anatomy is not strong enough.
- Preserve the supplied species-specific physical features.
- Preserve the culturally integrated clothing, grooming and adornment.
- Reflect the occupation through clothing, posture or one appropriate object.
- Let the personality subtly influence the expression and posture.
- Follow the supplied appearance description closely.
- Do not replace the character with a generic fantasy stereotype.

INDIVIDUAL VARIATION

This character must look like a distinct individual rather than a repeated
template for their species.

Vary species-appropriate details naturally, including:

- facial shape
- brow
- nose or muzzle
- jaw and chin
- eye shape
- ear shape
- hairstyle and hair texture
- age
- height and body weight
- complexion
- markings
- scars
- freckles
- wrinkles
- teeth
- asymmetry
- grooming

Do not make members of the same species look like clones wearing different
clothes.

Do not rely on one exaggerated feature alone to communicate species.

The character should remain recognisable as their species while still looking
like a unique person.

LIVED-IN REALISM

This character is an ordinary member of their society, not a legendary hero
or fashion model.

Allow natural human or species-appropriate imperfections where appropriate,
including:

- wrinkles
- freckles
- scars
- weathered skin
- uneven noses
- missing or imperfect teeth
- calloused hands
- dirt, soot or signs of honest work
- practical hairstyles
- simple jewellery
- patched, repaired or worn clothing
- age and maturity
- subtle asymmetry

Beauty should occur naturally rather than universally.

The character should look believable, experienced and grounded in their
occupation and culture.

Avoid glamour photography, fashion poses, flawless skin and idealized beauty
unless those traits are specifically implied by the character description.

SOCIAL STATUS

The clothing, grooming and equipment should realistically reflect the
character's occupation, wealth and place within their society.

A blacksmith should not resemble a noble.

A noble should not resemble a labourer.

A fisherman should show signs of outdoor work.

A scholar should show signs of study rather than combat.

The portrait should immediately communicate the character's life before a
single word is read.

SIGNS OF A LIVED LIFE

Include subtle evidence that this character has lived their profession for
many years.

Examples include:

- faded clothing
- repaired garments
- worn leather
- ink-stained fingers
- flour dust
- soot
- old scars
- sun-darkened skin
- weather exposure
- callouses
- laugh lines
- practical jewellery
- work tools carried naturally

Avoid making every outfit appear new or ceremonial.

OUTPUT RULES

- Create one vertical portrait suitable for an NPC card.
- Do not include text, names, captions, logos or typography.
- Do not include a decorative frame or card border.
- Do not depict additional people, creatures or background figures.
- Do not imitate an existing copyrighted character.
`.trim();
}