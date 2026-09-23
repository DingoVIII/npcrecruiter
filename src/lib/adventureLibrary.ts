// Add new free adventures here. Place their media in public/downloads.
export type FreeAdventure = {
  slug: string;
  name: string;
  species: string;
  occupation: string;
  title: string;
  description: string;
  portrait: string;
  video: string;
  pdf: string;
  package: string;
};

export const freeAdventures: FreeAdventure[] = [
  {
    slug: "sorrel-nema",
    name: "Sorrel Nema",
    species: "Goblin",
    occupation: "Quest Giver",
    title: "Sorrel Nema's Adventure",
    description: "A goblin with a proposition. Hear Sorrel's quest and take her adventure to your own table.",
    portrait: "/downloads/sorrel-nema-portrait.png",
    video: "/downloads/sorrel-nema.mp4",
    pdf: "/downloads/sorrel-nema-adventure.pdf",
    package: "/downloads/sorrel-nema-complete-quest.zip",
  },
  {
    slug: "odrik-ironbraid",
    name: "Odrik Ironbraid",
    species: "Dwarf",
    occupation: "Weaponsmith",
    title: "The Bloom Beneath the Breaker",
    description: "Race the tide into a collapsed coastal mine to recover rare drowned-ore, guarded by a water-wight and unstable rock.",
    portrait: "/downloads/odrik-ironbraid-portrait.webp",
    video: "/downloads/odrik-ironbraid.mp4",
    pdf: "/downloads/odrik-ironbraid-adventure.pdf",
    package: "/downloads/odrik-ironbraid-complete-quest.zip",
  },
];
