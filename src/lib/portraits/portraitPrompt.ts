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

- Use the full natural range of human skin tones, facial structures, hair textures, ages, builds and physical features.
- Reflect the supplied culture, occupation and environment rather than defaulting to generic north-western European fantasy.
- Preserve ordinary imperfections, asymmetry, maturity and signs of lived experience.
- Avoid making every human young, attractive, athletic or heroic.
`.trim();

    case "orc":
      return `
ORC VISUAL IDENTITY

- Large, broad-shouldered and heavily muscular.
- Thick neck, broad chest and physically imposing frame.
- Skin should be deep green, olive green, grey-green, moss green or slate green.
- Broad nose, heavy brow, powerful jaw and clearly visible lower tusks.
- Medium-sized pointed ears.
- The character must remain unmistakably orcish regardless of gender.
- Female orcs should retain strong orcish facial anatomy and visible tusks rather than appearing like green-skinned humans or elves.
`.trim();

    case "half orc":
      return `
HALF-ORC VISUAL IDENTITY

- A believable blend of human and orc ancestry.
- Athletic, strong and broad-shouldered, but leaner and less massive than a full orc.
- Skin should be olive, muted grey-green, weathered tan or subdued bronze.
- Primarily human facial proportions with a stronger jaw, subtle heavy brow and smaller lower tusks.
- Ears should be only slightly pointed.
- The character should be visibly orc-blooded without being visually identical to a full orc.
`.trim();

    case "hobgoblin":
  return `
HOBGOBLIN VISUAL IDENTITY

- Tall, lean and athletic rather than bulky.
- Burnished bronze, copper, russet, ochre, burnt orange or deep red skin.
- Do not use green or grey-green orc colouring.
- Strong brow ridge.
- Square jaw.
- Broad nose.
- Slight lower tusks or noticeably enlarged lower canines.
- Large pointed ears.
- Clearly goblinoid facial anatomy.
- Intelligent, disciplined and intimidating.
- Strong military posture and composed bearing.
- More human in proportion than an orc, but more goblinoid than an elf.
- Do not resemble a red-skinned elf.
- Do not use delicate elven facial features, fine bone structure or graceful elven beauty.
- Preserve a lean build without losing the heavier brow, jaw and goblinoid face.
`.trim();

    case "goblin":
      return `
GOBLIN VISUAL IDENTITY

- Small, short, thin, wiry and agile.
- Built for speed and nimbleness rather than strength.
- Skin should be yellow-green, olive, brown-green or muddy green.
- Very large pointed ears.
- Sharp narrow features, prominent nose, alert eyes and a narrow chin.
- The character should appear clever, quick and resourceful.
- Do not give the goblin the heavy musculature or broad facial structure of an orc.
`.trim();

    case "dwarf":
      return `
DWARF VISUAL IDENTITY

- Short, broad, dense and powerfully built.
- Thick torso, sturdy limbs, broad shoulders and a low centre of gravity.
- The body should look naturally compact rather than like a scaled-down human.
- Skin may range through ordinary human tones, including fair, ruddy, weathered and deeply tanned complexions.
- Strong brow, substantial nose, broad jaw and heavy facial structure.
- Hair should usually be thick and coarse.
- Beards are common among male dwarves but should vary naturally in length, texture and grooming.
- Female dwarves should remain clearly adult, strong-featured and distinctly dwarven.
- Avoid making every dwarf elderly, bearded or dressed as a miner.
`.trim();

    case "elf":
      return `
ELF VISUAL IDENTITY

- Tall, graceful and slender with believable anatomy.
- Fine bone structure, high cheekbones and elegant facial proportions.
- Long pointed ears that are clearly visible but not excessively oversized.
- Skin may use the full natural human range, from pale through deep brown.
- Elves should vary meaningfully in facial shape, age, complexion, hair texture and body type.
- Their appearance should feel refined and poised rather than fragile.
- Preserve natural imperfections, maturity and individuality.
- Full-blooded elves are naturally beardless and should not have moustaches, stubble, sideburns or other facial hair.
- Long head hair, brows and eyelashes are normal, but the lower face should remain clean-shaven.
- Do not make every elf young, pale, blond, flawless or conventionally beautiful.
`.trim();

    case "half elf":
      return `
HALF-ELF VISUAL IDENTITY

- A believable blend of human and elven ancestry.
- Human facial proportions with subtly refined bone structure and slightly pointed ears.
- Ears should be shorter and less dramatic than those of a full elf.
- Build may range from ordinary human proportions to gently slender and graceful.
- Skin, hair and eye colours should use the full natural human range.
- The character should appear visibly touched by elven ancestry without looking identical to a full elf.
- Avoid making every half-elf youthful, flawless or exceptionally beautiful.
`.trim();

    case "halfling":
      return `
HALFLING VISUAL IDENTITY

- A small adult humanoid with compact, naturally proportioned anatomy.
- Shorter and somewhat softer or rounder in build than a gnome.
- Friendly, expressive facial features and often rounded cheeks.
- Skin, hair and eye colours should use the full natural human range.
- Hair is often thick, wavy or curly, but should vary between individuals.
- The character should feel warm, practical and approachable without becoming comic.
- Halflings must look like adults, never children.
- Avoid oversized heads, childlike facial proportions and exaggerated cartoon features.
- Do not make every halfling cheerful, plump or barefoot.
`.trim();

    case "gnome":
      return `
GNOME VISUAL IDENTITY

- A small adult humanoid, generally slimmer and more angular than a halfling.
- Compact but lightly built, with lively posture and expressive movement.
- Large, curious eyes and an alert, intelligent expression.
- A slightly prominent nose is common, but it should remain believable rather than cartoonish.
- Ears may be subtly pointed.
- Hair may be unruly, practical, unusual or creatively styled while still matching the culture and occupation.
- Skin, hair and eye colours should use the full natural human range.
- Gnomes must look like adults, never children.
- Avoid steampunk clichés, novelty clothing and comic proportions unless explicitly requested.
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

      const skinColour = chooseStableOption(skinColours, seed);
      const hornStyle = chooseStableOption(hornStyles, seed, 2);
      const eyeStyle = chooseStableOption(eyeStyles, seed, 4);

      return `
TIEFLING VISUAL IDENTITY

- This Tiefling has ${skinColour} skin.
- Include ${hornStyle}.
- Include ${eyeStyle}.
- The character should have unmistakably infernal ancestry while retaining varied humanoid facial structures.
- A tail should be present where composition permits, but it should remain a natural part of the body rather than dominating the portrait.
- Horns should emerge naturally from the skull and remain consistent in material, texture and shape.
- Tieflings should vary in face, build, age, hair, horns and complexion.
- Do not make every Tiefling red-skinned, seductive, glamorous or villainous.
- Do not add wings unless the supplied appearance explicitly requests them.
`.trim();
    }

    case "aasimar":
      return `
AASIMAR VISUAL IDENTITY

- Use believable humanoid anatomy and the full natural range of human skin tones, facial structures and body types.
- Suggest celestial heritage through presence, composure and striking eyes rather than constant glowing effects.
- The character may have unusually clear, bright or subtly luminous-looking eyes without emitting visible beams or magical light.
- Their bearing may feel calm, dignified, intense or quietly commanding.
- Preserve natural skin texture, age, scars, wrinkles and ordinary physical imperfections.
- Do not make every Aasimar pale, blond, youthful or conventionally beautiful.
- Do not add halos, wings, radiant backgrounds or visible magical effects unless explicitly requested.
`.trim();

    case "goliath":
      return `
GOLIATH VISUAL IDENTITY

- Very tall, massive and powerfully built.
- Broad shoulders, thick neck, large hands and visibly heavy bone structure.
- Skin should range through stone-like greys, muted blue-greys, ash tones and weathered slate.
- Natural darker markings, mottling or culturally meaningful skin patterns may be present.
- Facial features should be strong, broad and mature.
- Hair may be sparse, shaved or practical, but should vary between individuals.
- Scars, weather exposure and signs of an outdoor life are appropriate.
- Avoid making every Goliath bald, tattooed, expressionless or dressed as a barbarian.
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

      const colour = chooseStableOption(dragonbornColours, seed);

      return `
DRAGONBORN VISUAL IDENTITY

- This Dragonborn has a ${colour} draconic lineage.
- Use a natural range of shades appropriate to ${colour} scales.
- Keep this one colour lineage consistent across the face, neck and visible body.
- Subtle variation in scale shade and pattern is welcome, but do not mix several unrelated dragon colours.
- Use clearly reptilian draconic facial anatomy rather than a human face with scales.
- Include a strong muzzle, defined brow, species-appropriate horns or cranial ridges and layered scales.
- Vary horn shape, scale pattern and facial structure naturally between individuals.
- The character must remain unmistakably Dragonborn regardless of gender.
- Do not add wings unless the supplied appearance explicitly requests them.
`.trim();
    }

    case "bugbear":
      return `
BUGBEAR VISUAL IDENTITY

- Large, long-limbed and powerfully built with a heavy goblinoid frame.
- Covered in coarse fur ranging through brown, russet, black, grey or tawny shades.
- Broad goblinoid face, deep-set eyes, strong jaw and large pointed ears.
- Arms may appear slightly longer than human proportions.
- The character should look naturally stealthy and predatory without becoming a generic ape or bear.
- Preserve individual grooming, scars, fur patterns and cultural details.
`.trim();

    case "kobold":
      return `
KOBOLD VISUAL IDENTITY

- Small, lightly built and clearly reptilian.
- Narrow draconic muzzle, alert eyes, small horns or cranial ridges and fine scales.
- Scale colours may vary naturally through earthy reds, rust, ochre, brown, grey, black, green or muted metallic tones.
- The character should look quick, clever and physically slight rather than muscular.
- Do not make the kobold look like a miniature Dragonborn; proportions should be smaller, sharper and more delicate.
`.trim();

    default:
      return `
SPECIES VISUAL IDENTITY

Follow the supplied species and appearance description closely.

Use recognisable, species-appropriate anatomy, colouring, facial structure,
ears, skin, scales, fur, horns and body proportions where applicable.

Do not replace the requested species with a generic human, elf or orc.
`.trim();
  }
}

export function buildPortraitPrompt(
  npc: PortraitNpc,
  style: string,
) {
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