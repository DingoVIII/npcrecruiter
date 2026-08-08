export type InspirationProfile = {
  description: string;
  naming: string;
  clothing: string;
  occupations: string;
  visualMotifs: string;
  avoid: string;
};

export const inspirationPrompts: Record<
  string,
  InspirationProfile
> = {
  "Roman-inspired": {
    description:
      "Ancient Roman-inspired culture shaped by civic institutions, military discipline, Mediterranean trade, engineering, agriculture, religion, and densely populated towns and cities.",
    naming:
      "Create original names influenced by Latin phonetics and naming patterns. Do not directly copy famous historical Roman names.",
    clothing:
      "Tunics, cloaks, wrapped garments, leather footwear, practical belts, wool and linen fabrics, bronze fittings, military equipment where appropriate.",
    occupations:
      "Merchants, soldiers, veterans, scribes, magistrates, priests, farmers, engineers, builders, sailors, innkeepers, craftsmen, servants.",
    visualMotifs:
      "Stone arches, columns, mosaics, tiled roofs, aqueducts, standards, laurel motifs, bronze, marble, red ochre, Mediterranean urban life.",
    avoid:
      "Avoid generic medieval fantasy clothing, exaggerated Hollywood gladiator stereotypes, and unnecessary imperial luxury for ordinary citizens.",
  },

  "Greek-inspired": {
    description:
      "Ancient Greek-inspired culture of independent city-states, maritime trade, agriculture, philosophy, warfare, craftsmanship, public debate, temples, and civic identity.",
    naming:
      "Create original names influenced by ancient Greek phonetics without directly copying famous mythological or historical figures.",
    clothing:
      "Linen and wool tunics, draped cloaks, sandals, belts, simple jewellery, bronze equipment, practical regional variation.",
    occupations:
      "Sailors, merchants, farmers, potters, soldiers, fishermen, philosophers, scribes, priests, craftsmen, athletes, innkeepers.",
    visualMotifs:
      "White stone, painted pottery, olive branches, geometric borders, bronze, coastal settlements, temples, ships, marketplaces.",
    avoid:
      "Avoid treating every character as a philosopher, hoplite, or mythological hero.",
  },

  "Norse-inspired": {
    description:
      "Viking Age Scandinavian-inspired culture shaped by farming, fishing, seafaring, trade, raiding, household loyalty, law assemblies, harsh climates, and strong regional communities.",
    naming:
      "Create original names influenced by Old Norse sounds and structure. Avoid overusing famous saga or mythological names.",
    clothing:
      "Wool tunics, trousers, cloaks, fur where practical, leather shoes, brooches, simple jewellery, layered cold-weather garments.",
    occupations:
      "Farmers, fishers, traders, shipwrights, sailors, hunters, smiths, household warriors, brewers, law speakers, craftsmen.",
    visualMotifs:
      "Longhouses, carved wood, ships, knotwork, runic carving, iron, wool, weathered timber, cold coastlines.",
    avoid:
      "Avoid horned helmets, constant fur-covered barbarian stereotypes, and making everyone a raider.",
  },

  "Celtic-inspired": {
    description:
      "Iron Age Celtic-inspired culture shaped by kinship, farming, cattle wealth, hill settlements, craftsmanship, oral tradition, warrior elites, and local religious practices.",
    naming:
      "Create original names influenced by Celtic-language sounds without directly copying famous legendary figures.",
    clothing:
      "Wool tunics, cloaks, checked or patterned textiles, leather footwear, bronze and iron jewellery, torcs for higher-status individuals.",
    occupations:
      "Farmers, herders, smiths, hunters, warriors, storytellers, healers, traders, brewers, woodworkers, priests.",
    visualMotifs:
      "Spiral patterns, torcs, hillforts, standing stones, carved wood, bronze, iron, forests, misty uplands.",
    avoid:
      "Avoid generic druid stereotypes, excessive face paint, and treating all Celtic-inspired cultures as identical.",
  },

  "Anglo-Saxon-inspired": {
    description:
      "Early medieval Anglo-Saxon-inspired culture shaped by farming villages, household loyalty, small kingdoms, monasteries, trade, craft production, and warrior retinues.",
    naming:
      "Create original names influenced by Old English phonetics and compound naming traditions.",
    clothing:
      "Wool tunics, cloaks, leggings, simple dresses, brooches, belts, leather shoes, practical layered clothing.",
    occupations:
      "Farmers, reeves, smiths, weavers, warriors, monks, traders, fishers, carpenters, herders, brewers.",
    visualMotifs:
      "Timber halls, thatched roofs, carved metalwork, knot patterns, shields, manuscripts, fields, woodland settlements.",
    avoid:
      "Avoid late-medieval plate armour, Norman aesthetics, or presenting every character as a warrior.",
  },

  "Norman-inspired": {
    description:
      "High medieval Norman-inspired culture shaped by castles, mounted warfare, feudal administration, monasteries, agricultural estates, trade, and expanding political authority.",
    naming:
      "Create original names influenced by medieval Norman French sounds and naming conventions.",
    clothing:
      "Wool tunics, fitted dresses, cloaks, hose, leather footwear, mail armour for soldiers, restrained heraldic decoration.",
    occupations:
      "Knights, stewards, masons, monks, farmers, merchants, clerks, soldiers, cooks, falconers, craftsmen.",
    visualMotifs:
      "Stone keeps, motte-and-bailey castles, Romanesque churches, heraldry, mail, horses, banners, carved stone.",
    avoid:
      "Avoid Renaissance clothing, elaborate late-medieval plate armour, and making every Norman-inspired character aristocratic.",
  },

  "Scottish-inspired": {
    description:
      "Medieval and early traditional Scottish-inspired culture shaped by clans, farming, fishing, upland and coastal communities, cattle, local loyalties, and harsh landscapes.",
    naming:
      "Create original names influenced by Gaelic and Scots phonetics without directly copying famous historical figures.",
    clothing:
      "Wool garments, cloaks, practical layered clothing, leather shoes, muted tartan-like checks where appropriate, regional variation.",
    occupations:
      "Herders, farmers, fishers, hunters, warriors, merchants, brewers, smiths, drovers, clergy, craftsmen.",
    visualMotifs:
      "Highlands, lochs, stone towers, heather, wool, carved stone, clan symbols, mist, coastal settlements.",
    avoid:
      "Avoid modern tourist tartan clichés, universal kilts, and Braveheart-style stereotypes.",
  },

  "Irish-inspired": {
    description:
      "Medieval Gaelic Irish-inspired culture shaped by kinship, cattle wealth, monasteries, poetry, farming, local kingship, craftsmanship, and strong oral traditions.",
    naming:
      "Create original names influenced by Irish Gaelic phonetics and structure.",
    clothing:
      "Wool tunics, cloaks, layered garments, leather shoes, brooches, simple jewellery, practical rural clothing.",
    occupations:
      "Farmers, herders, poets, monks, warriors, healers, smiths, fishers, brewers, messengers, craftsmen.",
    visualMotifs:
      "Round towers, monasteries, knotwork, carved crosses, green hills, boglands, cattle, manuscripts, coastal villages.",
    avoid:
      "Avoid leprechaun imagery, modern stereotypes, and excessive emerald-green clothing.",
  },

  "Slavic-inspired": {
    description:
      "Medieval Slavic-inspired culture shaped by farming villages, forests, rivers, trade routes, extended households, local princes, seasonal traditions, and craft production.",
    naming:
      "Create original names influenced by Slavic phonetics without directly copying famous rulers or modern celebrities.",
    clothing:
      "Linen shirts, wool garments, embroidered trim, fur in cold regions, leather boots, belts, layered practical clothing.",
    occupations:
      "Farmers, hunters, beekeepers, traders, soldiers, smiths, millers, healers, woodworkers, priests, boatmen.",
    visualMotifs:
      "Timber settlements, forests, rivers, carved wood, embroidery, ironwork, fur, winter landscapes.",
    avoid:
      "Avoid reducing everything to Russian imagery or generic fur-clad warriors.",
  },

  "Germanic-inspired": {
    description:
      "Early Germanic-inspired culture of farming settlements, warrior households, trade, forests, rivers, kinship networks, and local chieftains.",
    naming:
      "Create original names influenced by early Germanic compound-name patterns.",
    clothing:
      "Wool tunics, trousers, cloaks, leather footwear, brooches, belts, simple iron and bronze accessories.",
    occupations:
      "Farmers, hunters, smiths, warriors, traders, herders, brewers, carpenters, fishers, craftsmen.",
    visualMotifs:
      "Timber halls, forests, rivers, iron weapons, carved wood, animal motifs, muted wool textiles.",
    avoid:
      "Avoid automatically turning the culture into Vikings or late-medieval Germans.",
  },

  "French-inspired": {
    description:
      "Medieval French-inspired culture shaped by towns, agriculture, noble estates, monasteries, markets, courtly traditions, guilds, and regional diversity.",
    naming:
      "Create original names influenced by medieval French phonetics.",
    clothing:
      "Wool tunics, gowns, cloaks, fitted garments, hose, leather shoes, modest decorative trim depending on status.",
    occupations:
      "Farmers, bakers, vintners, merchants, knights, clerks, monks, tailors, innkeepers, masons, artisans.",
    visualMotifs:
      "Stone villages, vineyards, markets, castles, churches, heraldry, timber-framed houses, river towns.",
    avoid:
      "Avoid making everyone aristocratic, romantic, or extravagantly dressed.",
  },

  "Spanish-inspired": {
    description:
      "Medieval Iberian-inspired culture shaped by agriculture, fortified towns, Mediterranean trade, religious diversity, cavalry traditions, craftsmanship, and dry landscapes.",
    naming:
      "Create original names influenced by medieval Iberian phonetics.",
    clothing:
      "Tunics, cloaks, layered garments, leather boots, linen and wool, decorative trim influenced by Mediterranean traditions.",
    occupations:
      "Farmers, shepherds, cavalry soldiers, merchants, scribes, vintners, artisans, sailors, innkeepers, guards.",
    visualMotifs:
      "Stone fortresses, tiled courtyards, dry hills, vineyards, horses, geometric ornament, markets, Mediterranean ports.",
    avoid:
      "Avoid collapsing all Spanish-inspired imagery into conquistadors or flamenco stereotypes.",
  },

  "Italian-inspired": {
    description:
      "Medieval and early Renaissance Italian-inspired culture shaped by independent cities, banking, trade, guilds, craftsmanship, agriculture, maritime commerce, and political rivalry.",
    naming:
      "Create original names influenced by Italian phonetics without directly copying famous Renaissance figures.",
    clothing:
      "Linen shirts, fitted doublets, gowns, cloaks, practical merchant clothing, finer fabrics for wealthier citizens.",
    occupations:
      "Merchants, bankers, artisans, sailors, scribes, guards, innkeepers, craftsmen, farmers, apothecaries, guild officials.",
    visualMotifs:
      "Stone plazas, towers, canals, tiled roofs, markets, workshops, frescoes, vineyards, Mediterranean light.",
    avoid:
      "Avoid making every character a Renaissance noble, assassin, or flamboyant courtier.",
  },

  "Byzantine-inspired": {
    description:
      "Byzantine-inspired culture shaped by imperial administration, Orthodox religious traditions, Mediterranean commerce, fortified cities, court ceremony, scholarship, and long-distance trade.",
    naming:
      "Create original names influenced by Greek and eastern Mediterranean phonetics appropriate to a Byzantine-inspired setting.",
    clothing:
      "Layered tunics, robes, cloaks, patterned borders, silk for elites, practical wool and linen for ordinary people.",
    occupations:
      "Merchants, soldiers, scribes, priests, artisans, sailors, bureaucrats, guards, farmers, mosaic workers.",
    visualMotifs:
      "Domes, mosaics, gold backgrounds, icons, fortified walls, purple accents, geometric textiles, busy ports.",
    avoid:
      "Avoid treating every character as imperial royalty or covering ordinary citizens in excessive gold.",
  },

  "Venetian-inspired": {
    description:
      "Venetian-inspired maritime culture shaped by canals, merchant families, shipbuilding, trade networks, guilds, diplomacy, crowded urban districts, and cosmopolitan influences.",
    naming:
      "Create original names influenced by Venetian and northern Italian phonetics.",
    clothing:
      "Merchant robes, practical dockside clothing, cloaks, caps, fine fabrics for wealthier citizens, restrained masks mainly for festivals or specific social contexts.",
    occupations:
      "Merchants, sailors, gondoliers, shipwrights, glassmakers, scribes, bankers, dockworkers, guards, artisans, innkeepers.",
    visualMotifs:
      "Canals, bridges, stone palaces, docks, glass, merchant banners, narrow streets, lagoon light.",
    avoid:
      "Avoid making everyone masked, aristocratic, or carnival-themed.",
  },

  "Sumerian-inspired": {
    description:
      "Ancient Sumerian-inspired culture of Bronze Age city-states shaped by irrigation agriculture, temple complexes, river trade, scribal administration, brewing, and early urban life.",
    naming:
      "Create original names influenced by ancient Mesopotamian phonetics. Do not directly copy famous rulers, gods, or epic heroes.",
    clothing:
      "Layered wool garments, wrapped skirts, fringed textiles, shawls, simple sandals, copper and bronze fittings, lapis and carnelian jewellery.",
    occupations:
      "Farmers, brewers, merchants, scribes, temple workers, potters, metalworkers, shepherds, boatmen, guards, administrators.",
    visualMotifs:
      "Ziggurats, cuneiform tablets, reed boats, cylinder seals, bulls, stars, clay, copper, lapis blue.",
    avoid:
      "Avoid generic medieval clothing, modern Middle Eastern stereotypes, or direct copies of famous Sumerian historical and mythological figures.",
  },

  "Babylonian-inspired": {
    description:
      "Ancient Babylonian-inspired urban culture shaped by river agriculture, temple economies, astronomy, law, trade, craft production, scholarship, and powerful walled cities.",
    naming:
      "Create original names influenced by ancient Mesopotamian phonetics without directly copying famous kings or deities.",
    clothing:
      "Long woven garments, embroidered robes, fringed shawls, sandals, bronze accessories, lapis jewellery, carefully styled hair and beards.",
    occupations:
      "Scribes, astronomers, merchants, brewers, farmers, priests, guards, builders, potters, metalworkers, administrators.",
    visualMotifs:
      "Blue glazed brick, lions, bulls, stars, city gates, temples, cuneiform, bronze, lapis, river plains.",
    avoid:
      "Avoid Persian, Egyptian, or generic Arabian visual stereotypes unless context specifically calls for cultural blending.",
  },

  "Assyrian-inspired": {
    description:
      "Ancient Assyrian-inspired culture shaped by fortified cities, military organization, administration, long-distance trade, monumental art, agriculture, and powerful royal institutions.",
    naming:
      "Create original names influenced by ancient Assyrian and Mesopotamian sounds without directly copying famous historical figures.",
    clothing:
      "Long patterned robes, fringed garments, belts, leather and bronze military equipment, carefully curled hair and beards.",
    occupations:
      "Soldiers, scribes, merchants, chariot workers, farmers, craftsmen, guards, administrators, builders, priests.",
    visualMotifs:
      "Winged bulls, lions, stone reliefs, fortified gates, chariots, bronze, carved stone, royal roads.",
    avoid:
      "Avoid depicting every character as a brutal soldier or royal official.",
  },

  "Persian-inspired": {
    description:
      "Ancient and medieval Persian-inspired culture shaped by imperial administration, trade routes, gardens, cavalry traditions, scholarship, poetry, agriculture, and cosmopolitan cities.",
    naming:
      "Create original names influenced by Persian phonetics without directly copying famous historical or literary figures.",
    clothing:
      "Layered robes, trousers, tunics, boots, patterned textiles, sashes, jewellery, practical riding clothing.",
    occupations:
      "Merchants, cavalry soldiers, scribes, gardeners, poets, artisans, farmers, administrators, innkeepers, scholars.",
    visualMotifs:
      "Gardens, tiled halls, winged motifs, horses, patterned carpets, mountains, desert roads, turquoise and lapis accents.",
    avoid:
      "Avoid generic Arabian stereotypes and excessive royal luxury for ordinary citizens.",
  },

  "Arabic-inspired": {
    description:
      "Medieval Arabic-inspired culture shaped by trade, scholarship, agriculture, desert and urban communities, maritime commerce, craftsmanship, medicine, and thriving market cities.",
    naming:
      "Create original names influenced by Arabic phonetics without directly copying famous historical or religious figures.",
    clothing:
      "Loose practical robes, tunics, head coverings suited to climate, sandals, belts, layered fabrics, regional variation.",
    occupations:
      "Merchants, sailors, scholars, physicians, artisans, farmers, caravan workers, guards, scribes, innkeepers.",
    visualMotifs:
      "Courtyards, markets, geometric ornament, desert roads, ports, date palms, brass, textiles, stone and plaster architecture.",
    avoid:
      "Avoid exoticized harem imagery, universal desert stereotypes, and caricatured religious depictions.",
  },

  "Ottoman-inspired": {
    description:
      "Ottoman-inspired culture shaped by imperial cities, markets, military institutions, trade routes, artisan guilds, religious diversity, agriculture, and court administration.",
    naming:
      "Create original names influenced by Ottoman Turkish phonetics without directly copying famous historical rulers.",
    clothing:
      "Layered robes, kaftans, trousers, sashes, turbans or caps where appropriate, patterned textiles, practical regional clothing.",
    occupations:
      "Merchants, soldiers, scribes, artisans, cooks, sailors, guards, farmers, bathhouse workers, administrators.",
    visualMotifs:
      "Domes, tiled interiors, bazaars, coffeehouses, fountains, calligraphy-inspired ornament, patterned textiles, fortified cities.",
    avoid:
      "Avoid reducing the culture to janissaries, sultans, or palace intrigue.",
  },

  "Bedouin-inspired": {
    description:
      "Bedouin-inspired nomadic and semi-nomadic desert culture shaped by pastoralism, caravan travel, hospitality, kinship, survival in arid landscapes, animal husbandry, and trade.",
    naming:
      "Create original names influenced by Arabic phonetics while avoiding direct copies of famous historical or religious figures.",
    clothing:
      "Loose layered garments, head coverings, durable sandals or boots, belts, practical fabrics suited to heat, dust, and travel.",
    occupations:
      "Herders, caravan guides, traders, scouts, animal handlers, healers, guards, storytellers, craftspeople.",
    visualMotifs:
      "Desert camps, woven tents, camels, horses, leather, textiles, stars, dunes, campfires, caravan routes.",
    avoid:
      "Avoid portraying all characters as raiders or exoticized desert mystics.",
  },

  "Egyptian-inspired": {
    description:
      "Ancient Egyptian-inspired culture shaped by river agriculture, temple institutions, crafts, administration, trade, monumental building, and communities along a fertile river valley.",
    naming:
      "Create original names influenced by ancient Egyptian phonetics without directly copying famous pharaohs or deities.",
    clothing:
      "Linen garments, wrapped skirts, simple dresses, sandals, beadwork, broad collars for higher-status characters, practical light clothing.",
    occupations:
      "Farmers, scribes, boatmen, craftsmen, priests, guards, brewers, stoneworkers, merchants, fishermen.",
    visualMotifs:
      "River boats, reeds, papyrus, carved stone, painted walls, desert cliffs, lotus flowers, gold, blue faience.",
    avoid:
      "Avoid making everyone a pharaoh, priest, mummy, or palace noble.",
  },

  "Berber-inspired": {
    description:
      "Amazigh/Berber-inspired North African culture shaped by mountain, desert, and oasis communities, pastoralism, trade, agriculture, weaving, and strong local identities.",
    naming:
      "Create original names influenced by Amazigh phonetics without directly copying famous historical figures.",
    clothing:
      "Woven robes, cloaks, head coverings, leather footwear, silver jewellery, geometric textile patterns, practical desert and mountain clothing.",
    occupations:
      "Herders, traders, farmers, guides, weavers, metalworkers, caravan workers, guards, craftspeople.",
    visualMotifs:
      "Mountain villages, desert routes, silver jewellery, woven carpets, geometric patterns, stone and earthen architecture.",
    avoid:
      "Avoid treating the culture as generic Arab or generic desert nomad imagery.",
  },

  "West African-inspired": {
    description:
      "West African-inspired culture drawing broadly from Sahelian and forest-region traditions, shaped by trade, agriculture, metalworking, textiles, river routes, markets, and powerful local communities.",
    naming:
      "Create original names influenced by West African phonetic patterns without directly copying famous historical rulers.",
    clothing:
      "Woven textiles, robes, tunics, wrapped garments, beadwork, leather accessories, colourful but practical fabrics.",
    occupations:
      "Farmers, traders, smiths, weavers, griot-like storytellers, boatmen, guards, merchants, herders, craftspeople.",
    visualMotifs:
      "Mud-brick architecture, markets, river boats, woven cloth, bronze and ironwork, beads, savannah and forest landscapes.",
    avoid:
      "Avoid treating West Africa as a single uniform culture or relying on generic tribal stereotypes.",
  },

  "Maasai-inspired": {
    description:
      "Maasai-inspired pastoral culture shaped by cattle herding, age-set traditions, mobility, community identity, beadwork, and life across open East African grasslands.",
    naming:
      "Create original names influenced by Maa phonetics without directly copying real public figures.",
    clothing:
      "Wrapped cloth garments, beadwork, leather sandals, practical pastoral clothing, strong red and earth-tone accents.",
    occupations:
      "Herders, scouts, healers, traders, elders, hunters, guards, craftspeople.",
    visualMotifs:
      "Open savannah, cattle, beadwork, spears, red textiles, acacia landscapes, leather and wood.",
    avoid:
      "Avoid depicting everyone as a warrior or using caricatured tribal imagery.",
  },

  "Zulu-inspired": {
    description:
      "Zulu-inspired southern African culture shaped by cattle, agriculture, community organization, military traditions, beadwork, craftsmanship, and strong kinship networks.",
    naming:
      "Create original names influenced by isiZulu phonetics without directly copying famous historical figures.",
    clothing:
      "Beadwork, hides, woven garments, practical clothing, leather accessories, ceremonial elements used appropriately.",
    occupations:
      "Herders, farmers, warriors, healers, smiths, traders, craftspeople, messengers, community leaders.",
    visualMotifs:
      "Cattle kraals, shields, beadwork, grasslands, hides, woodwork, earth tones, bold geometric patterns.",
    avoid:
      "Avoid making every character a spear-carrying warrior or relying on colonial-era stereotypes.",
  },

  "Ethiopian-inspired": {
    description:
      "Ethiopian-inspired highland culture shaped by ancient kingdoms, trade, agriculture, religious traditions, stone architecture, manuscripts, cavalry, and mountain communities.",
    naming:
      "Create original names influenced by Ethiopian and Ge'ez-language phonetics without directly copying famous historical figures.",
    clothing:
      "White woven garments, shawls, cloaks, embroidered borders, leather footwear, practical highland clothing.",
    occupations:
      "Farmers, priests, scribes, merchants, soldiers, herders, craftsmen, coffee traders, guards, builders.",
    visualMotifs:
      "Highland plateaus, carved stone churches, manuscripts, crosses, woven cloth, coffee, horses, mountain fortresses.",
    avoid:
      "Avoid generic East African stereotypes or collapsing Ethiopian-inspired culture into neighbouring traditions.",
  },

  "Indian (South Asian)-inspired": {
    description:
      "South Asian-inspired culture drawing broadly from historical Indian societies, shaped by agriculture, trade, temples, craft guilds, textiles, scholarship, regional kingdoms, and dense urban life.",
    naming:
      "Create original names influenced by South Asian phonetics. Avoid directly copying famous historical, religious, or modern names.",
    clothing:
      "Wrapped garments, tunics, shawls, trousers, draped fabrics, sandals, jewellery, regional textile patterns.",
    occupations:
      "Merchants, farmers, scribes, artisans, guards, scholars, temple workers, weavers, spice traders, healers.",
    visualMotifs:
      "Temple architecture, carved stone, markets, textiles, elephants where appropriate, brass, spices, gardens, river cities.",
    avoid:
      "Avoid treating all of South Asia as a single culture or using caricatured religious imagery.",
  },

  "Chinese-inspired": {
    description:
      "Historical Chinese-inspired culture shaped by agriculture, bureaucracy, trade, scholarship, craft production, cities, river systems, family networks, and regional diversity.",
    naming:
      "Create original names influenced by Chinese phonetics without directly copying famous historical or fictional figures.",
    clothing:
      "Layered robes, tunics, trousers, sashes, practical working garments, silk for wealthier characters, regional variation.",
    occupations:
      "Farmers, merchants, scribes, officials, artisans, soldiers, boatmen, healers, cooks, scholars, innkeepers.",
    visualMotifs:
      "Tiled roofs, courtyards, river towns, paper lanterns used appropriately, calligraphy, silk, bamboo, carved wood.",
    avoid:
      "Avoid martial-arts stereotypes, universal imperial luxury, and treating every character as a monk or scholar.",
  },

  "Japanese-inspired": {
    description:
      "Historical Japanese-inspired culture shaped by agriculture, castle towns, warrior households, merchants, artisans, temples, coastal communities, and regional lords.",
    naming:
      "Create original names influenced by Japanese phonetics without directly copying famous samurai or fictional characters.",
    clothing:
      "Kimono-like robes, work jackets, hakama where appropriate, sandals, layered practical garments, armour only for military roles.",
    occupations:
      "Farmers, merchants, artisans, guards, sailors, monks, scribes, cooks, hunters, couriers, craftspeople.",
    visualMotifs:
      "Timber architecture, tiled roofs, paper screens, mountain roads, coastal villages, lacquer, banners, gardens.",
    avoid:
      "Avoid making everyone samurai, ninja, geisha, or anime-styled.",
  },

  "Korean-inspired": {
    description:
      "Historical Korean-inspired culture shaped by agriculture, scholarship, bureaucracy, fortified towns, craft production, maritime trade, village life, and courtly institutions.",
    naming:
      "Create original names influenced by Korean phonetics without directly copying modern celebrities or famous historical figures.",
    clothing:
      "Hanbok-inspired robes, jackets, trousers, skirts, layered fabrics, hats appropriate to role and status.",
    occupations:
      "Farmers, scholars, merchants, soldiers, artisans, sailors, scribes, potters, healers, cooks.",
    visualMotifs:
      "Tiled roofs, mountain fortresses, pottery, paper, wooden gates, river valleys, understated textile colours.",
    avoid:
      "Avoid blending Korean-inspired aesthetics indiscriminately with Chinese or Japanese imagery.",
  },

  "Mongolian-inspired": {
    description:
      "Mongolian steppe-inspired culture shaped by horse pastoralism, mobile households, long-distance travel, trade, archery, livestock, seasonal camps, and strong kinship networks.",
    naming:
      "Create original names influenced by Mongolian phonetics without directly copying famous khans.",
    clothing:
      "Deel-inspired robes, boots, belts, fur-lined garments in cold weather, practical riding clothing.",
    occupations:
      "Herders, horse breeders, scouts, traders, archers, hunters, messengers, craftspeople, healers.",
    visualMotifs:
      "Open steppe, horses, felt tents, leather, bows, fur, wind-swept grasslands, portable household goods.",
    avoid:
      "Avoid portraying every character as a conquering horse warrior.",
  },

  "Tibetan-inspired": {
    description:
      "Tibetan Plateau-inspired culture shaped by high-altitude pastoralism, monasteries, mountain trade, agriculture, pilgrimage, herding, and tightly knit settlements.",
    naming:
      "Create original names influenced by Tibetan phonetics without directly copying famous religious figures.",
    clothing:
      "Layered wool robes, boots, aprons, heavy textiles, practical cold-weather garments, jewellery appropriate to status.",
    occupations:
      "Herders, traders, monks, farmers, guides, craftsmen, healers, caravan workers, guards.",
    visualMotifs:
      "High mountains, monasteries, prayer flags used respectfully, yak wool, stone villages, turquoise, red and ochre textiles.",
    avoid:
      "Avoid mystical caricatures or depicting every character as a monk.",
  },

  "Khmer-inspired": {
    description:
      "Historical Khmer-inspired culture shaped by river agriculture, temple cities, hydraulic engineering, trade, royal administration, markets, and tropical environments.",
    naming:
      "Create original names influenced by Khmer phonetics without directly copying famous rulers.",
    clothing:
      "Wrapped garments, lightweight fabrics, jewellery, practical tropical clothing, ceremonial textiles for higher-status roles.",
    occupations:
      "Farmers, merchants, temple workers, boatmen, builders, guards, artisans, fishermen, administrators.",
    visualMotifs:
      "Temple towers, carved stone, reservoirs, jungle, river boats, lotus motifs, bronze, sandstone.",
    avoid:
      "Avoid reducing the culture entirely to jungle ruins or temple priests.",
  },

  "Thai-inspired": {
    description:
      "Historical Thai-inspired culture shaped by river kingdoms, rice agriculture, trade, temples, markets, craftsmanship, elephant husbandry, and tropical urban centres.",
    naming:
      "Create original names influenced by Thai phonetics without directly copying modern celebrities or royalty.",
    clothing:
      "Wrapped garments, lightweight tunics, patterned textiles, sashes, jewellery, practical tropical fabrics.",
    occupations:
      "Farmers, merchants, boatmen, craftsmen, guards, temple workers, cooks, fishermen, traders.",
    visualMotifs:
      "River settlements, gilded roofs used selectively, markets, rice fields, boats, tropical vegetation, carved wood.",
    avoid:
      "Avoid making every character associated with temples, royalty, or elephants.",
  },

  "Vietnamese-inspired": {
    description:
      "Historical Vietnamese-inspired culture shaped by wet-rice agriculture, river deltas, fortified settlements, markets, scholarship, fishing, trade, and village communities.",
    naming:
      "Create original names influenced by Vietnamese phonetics without directly copying famous historical or modern figures.",
    clothing:
      "Simple tunics, trousers, layered robes, woven hats where practical, sandals, lightweight fabrics suited to humid climates.",
    occupations:
      "Farmers, fishers, merchants, scholars, soldiers, boatmen, craftsmen, healers, cooks, guards.",
    visualMotifs:
      "Rice terraces, river boats, bamboo, tiled villages, market streets, tropical hills, lacquerware.",
    avoid:
      "Avoid modern-war imagery or reducing the culture to conical hats and rice fields.",
  },

  "Lakota (Sioux)-inspired": {
    description:
      "Lakota-inspired Northern Plains culture shaped by kinship, seasonal movement, buffalo hunting traditions, horse culture, trade, community obligations, craftsmanship, and life across open grasslands.",
    naming:
      "Create original names inspired by Lakota phonetic patterns without copying known historical people or translating stereotypical English phrases into names.",
    clothing:
      "Hide and leather garments, woven elements, beadwork, moccasins, practical layered clothing, featherwork used selectively and with attention to role and context.",
    occupations:
      "Hunters, horse handlers, scouts, healers, traders, craftspeople, storytellers, guards, community leaders.",
    visualMotifs:
      "Open plains, buffalo, horses, beadwork, leather, quillwork, earth tones, sky, grassland camps.",
    avoid:
      "Avoid Hollywood war-bonnet stereotypes, generic pan-Native imagery, broken-English caricatures, and using sacred regalia indiscriminately.",
  },

  "Apache-inspired": {
    description:
      "Apache-inspired Southwestern culture shaped by mobility, hunting, gathering, trade, desert and mountain survival, kinship, raiding traditions in some periods, and adaptable local communities.",
    naming:
      "Create original names influenced by Apache-language phonetics without copying famous historical figures or inventing stereotypical translated phrase-names.",
    clothing:
      "Leather and woven garments, moccasins, practical desert clothing, beadwork, headbands or coverings where appropriate, regional variation.",
    occupations:
      "Hunters, scouts, traders, healers, craftspeople, horse handlers, guards, gatherers, messengers.",
    visualMotifs:
      "Desert mountains, leatherwork, baskets, horses, agave, turquoise accents, arid landscapes.",
    avoid:
      "Avoid Western-film stereotypes, universal headbands, exaggerated war paint, and generic pan-Native imagery.",
  },

  "Cherokee-inspired": {
    description:
      "Cherokee-inspired Southeastern woodland culture shaped by farming, hunting, town life, trade, river valleys, political councils, craftsmanship, and extended family networks.",
    naming:
      "Create original names influenced by Cherokee phonetics without copying famous historical figures or relying on translated stereotype-names.",
    clothing:
      "Woven and hide clothing, leggings, moccasins, cloaks, beadwork, practical woodland garments, regional trade influences where appropriate.",
    occupations:
      "Farmers, hunters, traders, healers, potters, craftspeople, messengers, guards, community leaders.",
    visualMotifs:
      "Woodland towns, rivers, corn agriculture, baskets, pottery, beadwork, forests, council houses.",
    avoid:
      "Avoid Plains-style stereotypes, universal feathered headdresses, and generic pan-Native imagery.",
  },

  "Iroquois (Haudenosaunee)-inspired": {
    description:
      "Haudenosaunee-inspired woodland culture shaped by longhouse communities, agriculture, confederated politics, trade, hunting, diplomacy, kinship, and dense forest environments.",
    naming:
      "Create original names influenced by Haudenosaunee-language phonetic patterns without copying known historical figures or using stereotypical translated phrase-names.",
    clothing:
      "Deerskin garments, leggings, moccasins, woven sashes, beadwork, practical woodland clothing.",
    occupations:
      "Farmers, hunters, traders, diplomats, craftspeople, healers, messengers, guards, community leaders.",
    visualMotifs:
      "Longhouses, forests, corn-bean-squash agriculture, wampum-inspired beadwork, river routes, bark structures.",
    avoid:
      "Avoid Plains-style feathered headdresses, generic 'Mohawk warrior' clichés, and treating all Haudenosaunee nations as identical.",
  },

  "Navajo (Diné)-inspired": {
    description:
      "Diné-inspired Southwestern culture shaped by pastoralism, weaving, trade, farming, extended family networks, high desert landscapes, craftsmanship, and adaptability.",
    naming:
      "Create original names influenced by Diné phonetics without copying real historical people or inventing stereotypical translated phrase-names.",
    clothing:
      "Woven garments, practical shirts and skirts, moccasins, blankets, silver and turquoise jewellery where appropriate.",
    occupations:
      "Herders, weavers, traders, farmers, silversmiths, healers, craftspeople, scouts, community leaders.",
    visualMotifs:
      "High desert, woven blankets, turquoise, silverwork, sheep, sandstone, geometric textile patterns.",
    avoid:
      "Avoid generic pan-Native imagery, excessive turquoise on everyone, and sacred ceremonial imagery used as decoration.",
  },

  "Aztec-inspired": {
    description:
      "Aztec/Mexica-inspired imperial culture shaped by large cities, intensive agriculture, markets, military institutions, tribute networks, craft specialists, temples, and lake environments.",
    naming:
      "Create original names influenced by Nahuatl phonetics without directly copying famous rulers, gods, or historical figures.",
    clothing:
      "Cotton cloaks, wrapped garments, sandals, woven textiles, featherwork used according to status, obsidian and stone jewellery.",
    occupations:
      "Farmers, merchants, soldiers, craftsmen, scribes, priests, boatmen, market traders, builders, guards.",
    visualMotifs:
      "Lake cities, causeways, chinampa fields, obsidian, feathers, stone temples, markets, turquoise, geometric patterns.",
    avoid:
      "Avoid portraying every character as a human-sacrificing priest or feather-covered elite warrior.",
  },

  "Mayan-inspired": {
    description:
      "Classic and Postclassic Maya-inspired culture shaped by city-states, agriculture, trade, writing, astronomy, craft specialists, markets, temples, and tropical environments.",
    naming:
      "Create original names influenced by Mayan-language phonetics without directly copying famous rulers or deities.",
    clothing:
      "Woven cotton garments, wrapped skirts, tunics, sandals, beadwork, jade jewellery for higher-status characters.",
    occupations:
      "Farmers, scribes, merchants, craftsmen, soldiers, priests, builders, hunters, traders, administrators.",
    visualMotifs:
      "Stepped temples, carved stelae, jungle cities, jade, painted pottery, glyphs, maize, limestone architecture.",
    avoid:
      "Avoid treating all Maya-inspired cultures as identical or portraying everyone as priests and nobles.",
  },

  "Incan-inspired": {
    description:
      "Inca-inspired Andean culture shaped by highland agriculture, roads, state administration, terrace farming, herding, textile production, stone construction, and mountain communities.",
    naming:
      "Create original names influenced by Quechua phonetics without directly copying famous historical rulers.",
    clothing:
      "Woven tunics, cloaks, shawls, sandals, patterned textiles, wool garments suited to high altitudes.",
    occupations:
      "Farmers, herders, runners, soldiers, builders, weavers, administrators, merchants, miners, healers.",
    visualMotifs:
      "Mountain terraces, stone roads, llamas, woven textiles, fitted stonework, high valleys, gold and copper accents.",
    avoid:
      "Avoid portraying every character as imperial nobility or temple staff.",
  },

  "Polynesian-inspired": {
    description:
      "Polynesian-inspired oceanic culture shaped by navigation, fishing, agriculture, canoe travel, kinship, island communities, craftsmanship, and strong oral traditions.",
    naming:
      "Create original names influenced by Polynesian phonetic patterns without directly copying famous historical or modern figures.",
    clothing:
      "Woven and bark-cloth garments, wraps, practical island clothing, shell and bone jewellery, tattoo traditions used respectfully.",
    occupations:
      "Navigators, fishers, farmers, canoe builders, healers, traders, craftspeople, warriors, storytellers.",
    visualMotifs:
      "Ocean voyages, carved canoes, woven mats, volcanic islands, shell, wood carving, tattoo motifs, tropical vegetation.",
    avoid:
      "Avoid generic 'islander' stereotypes, oversexualized clothing, and treating all Polynesian cultures as identical.",
  },

  "Māori-inspired": {
    description:
      "Māori-inspired culture shaped by iwi and hapū relationships, horticulture, fishing, warfare, carving, ocean travel, oral tradition, fortified settlements, and strong community identity.",
    naming:
      "Create original names influenced by te reo Māori phonetics without directly copying known historical or modern people.",
    clothing:
      "Woven cloaks, flax garments, practical wraps, bone and greenstone-style ornaments, tattoo traditions used carefully and contextually.",
    occupations:
      "Fishers, farmers, carvers, navigators, healers, warriors, traders, storytellers, community leaders.",
    visualMotifs:
      "Carved meeting houses, pā fortifications, waka, woven flax, coastal landscapes, wood carving, greenstone-like ornament.",
    avoid:
      "Avoid using tā moko casually as generic face paint, haka stereotypes, or treating all Māori-inspired characters as warriors.",
  },

  "Forgotten Realms-inspired": {
    description:
      "Classic high-fantasy adventuring world aesthetic with diverse medieval-inspired societies, bustling towns, guilds, temples, merchants, adventurers, and practical magic integrated into everyday life.",
    naming:
      "Create original high-fantasy names with varied cultural phonetics. Do not copy recognizable character or place names from published settings.",
    clothing:
      "Practical medieval-fantasy clothing, cloaks, leather, wool, travel gear, regional fabrics, restrained magical ornament.",
    occupations:
      "Innkeepers, merchants, guards, priests, adventurers, scribes, smiths, farmers, guild workers, scholars, caravan workers.",
    visualMotifs:
      "Stone towns, timber inns, guild signs, roads, temples, forests, castles, restrained magical details.",
    avoid:
      "Avoid copying specific copyrighted characters, factions, heraldry, costumes, or locations.",
  },

  "Dragonlance-inspired": {
    description:
      "Heroic high-fantasy aesthetic with medieval societies, ancient ruins, dragons as legendary forces, strong knightly traditions, rustic communities, and a sense of sweeping adventure.",
    naming:
      "Create original heroic-fantasy names without copying recognizable published characters or places.",
    clothing:
      "Practical medieval-fantasy clothing, travel cloaks, mail, leather, robes, regional fabrics, restrained heroic ornament.",
    occupations:
      "Knights, farmers, innkeepers, merchants, soldiers, healers, scholars, smiths, sailors, travellers.",
    visualMotifs:
      "Ancient towers, mountain roads, medieval villages, dragons used sparingly, weathered armour, banners, ruins.",
    avoid:
      "Avoid copying specific published characters, symbols, armour designs, factions, or locations.",
  },

  "Middle-earth-inspired": {
    description:
      "Grounded mythic fantasy aesthetic emphasizing ancient landscapes, rustic communities, weathered kingdoms, deep history, craftsmanship, wilderness, and restrained supernatural elements.",
    naming:
      "Create original names using broad mythic and linguistic influences without copying recognizable Tolkien names or languages.",
    clothing:
      "Practical wool, linen, cloaks, leather boots, mail for warriors, rustic garments, natural colours.",
    occupations:
      "Farmers, rangers, smiths, innkeepers, soldiers, shepherds, merchants, healers, craftsmen, travellers.",
    visualMotifs:
      "Green hills, ancient ruins, weathered stone, forests, mountain passes, hand-crafted equipment, restrained heraldry.",
    avoid:
      "Avoid direct copies of Tolkien characters, places, languages, symbols, costumes, or distinctive faction designs.",
  },

  "The Witcher-inspired": {
    description:
      "Dark grounded fantasy aesthetic with muddy roads, war-torn villages, morally complicated societies, practical medieval clothing, folklore-inspired dangers, and harsh everyday life.",
    naming:
      "Create original Central- and Eastern-European-influenced fantasy names without copying recognizable published characters.",
    clothing:
      "Weathered wool, leather, practical cloaks, boots, patched garments, restrained armour, signs of hard use.",
    occupations:
      "Farmers, mercenaries, innkeepers, herbalists, merchants, guards, hunters, craftsmen, healers, refugees.",
    visualMotifs:
      "Muddy villages, forests, ruined keeps, weathered wood, iron, cold rivers, war damage, folk motifs.",
    avoid:
      "Avoid copying specific characters, medallions, armour designs, monsters, factions, or locations.",
  },

  "Warhammer-inspired": {
    description:
      "Grim gothic fantasy aesthetic with overcrowded cities, religious anxiety, heavy fortifications, dangerous wilderness, exaggerated social hierarchy, weathered equipment, and dark humour.",
    naming:
      "Create original grim-fantasy names influenced by Germanic and European sounds without copying recognizable published characters.",
    clothing:
      "Heavy wool, leather, layered garments, battered armour, religious tokens, practical clothing with gothic accents.",
    occupations:
      "Soldiers, rat catchers, merchants, priests, labourers, hunters, scribes, guards, craftsmen, mercenaries.",
    visualMotifs:
      "Gothic stonework, crowded streets, black powder, iron, banners, skull motifs used sparingly, mud, fog.",
    avoid:
      "Avoid copying specific factions, symbols, characters, armour designs, or distinctive proprietary imagery.",
  },

  "Warcraft-inspired": {
    description:
      "Colourful heroic fantasy aesthetic with strongly differentiated cultures, bold silhouettes, magical environments, large-scale settlements, adventurous tone, and stylized but coherent worldbuilding.",
    naming:
      "Create original heroic-fantasy names without copying recognizable Warcraft characters, clans, or locations.",
    clothing:
      "Bold but functional fantasy clothing, leather, cloth, armour, culturally distinct ornament, stronger colours than grounded historical styles.",
    occupations:
      "Warriors, merchants, hunters, shamans, craftsmen, guards, farmers, sailors, innkeepers, healers.",
    visualMotifs:
      "Large timber structures, colourful banners, oversized architecture, glowing magical accents, strong cultural silhouettes.",
    avoid:
      "Avoid copying specific characters, armour sets, faction symbols, races' proprietary visual designs, or named locations.",
  },

  "Elder Scrolls-inspired": {
    description:
      "Open-world fantasy aesthetic combining rugged provincial cultures, ancient ruins, political tension, guild life, wilderness travel, restrained magic, and practical everyday communities.",
    naming:
      "Create original fantasy names with varied cultural influences without copying recognizable Elder Scrolls characters or place names.",
    clothing:
      "Practical regional clothing, furs in cold regions, leather, wool, robes, simple armour, travelling gear.",
    occupations:
      "Farmers, miners, guards, merchants, hunters, innkeepers, scholars, priests, caravan workers, craftsmen.",
    visualMotifs:
      "Mountain towns, ancient ruins, forests, tundra, stone keeps, guild halls, mines, old roads.",
    avoid:
      "Avoid copying specific characters, faction symbols, armour sets, races' proprietary designs, or locations.",
  },

  "Runeterra-inspired": {
    description:
      "Stylized fantasy aesthetic built around strongly differentiated regions, bold silhouettes, expressive clothing, magic-infused environments, and visually distinct local cultures.",
    naming:
      "Create original fantasy names without copying recognizable League of Legends or Runeterra characters, factions, or locations.",
    clothing:
      "Bold regional clothing, practical fantasy gear, distinctive silhouettes, stronger colours, controlled magical ornament.",
    occupations:
      "Merchants, soldiers, inventors, hunters, sailors, craftsmen, guards, scholars, performers, healers.",
    visualMotifs:
      "Distinctive regional architecture, magical technology, bold banners, colourful materials, dramatic landscapes.",
    avoid:
      "Avoid direct copies of champions, faction symbols, costumes, weapons, or proprietary setting designs.",
  },

  "Dark Souls-inspired": {
    description:
      "Bleak ruined fantasy aesthetic emphasizing decaying kingdoms, ancient stonework, exhausted survivors, mysterious institutions, battered equipment, melancholy, and oppressive atmosphere.",
    naming:
      "Create original dark-fantasy names without copying recognizable characters, bosses, or locations.",
    clothing:
      "Faded cloth, battered armour, worn cloaks, practical leather, tarnished metal, visible repairs.",
    occupations:
      "Pilgrims, guards, scavengers, smiths, merchants, priests, soldiers, caretakers, hunters, wanderers.",
    visualMotifs:
      "Ruined cathedrals, ash, fog, weathered stone, rust, enormous abandoned architecture, dying fires.",
    avoid:
      "Avoid copying specific bosses, armour sets, weapons, symbols, characters, or locations.",
  },

  "Critical Role-inspired": {
    description:
      "Modern character-focused high-fantasy aesthetic with diverse cultures, adventuring societies, expressive personalities, magical cities, grounded communities, and colourful but believable fantasy design.",
    naming:
      "Create original high-fantasy names without copying recognizable Critical Role characters, factions, or locations.",
    clothing:
      "Practical fantasy clothing with expressive personal details, leather, wool, cloaks, jewellery, adventuring equipment, restrained magical accents.",
    occupations:
      "Merchants, guards, adventurers, innkeepers, scholars, sailors, artisans, priests, farmers, healers.",
    visualMotifs:
      "Lively fantasy towns, guilds, markets, magical accents, varied regional architecture, travel gear.",
    avoid:
      "Avoid copying specific characters, costumes, symbols, factions, locations, or recognizable proprietary designs.",
  },
};

export function getInspirationPrompt(
  inspiration: string,
): InspirationProfile | null {
  return inspirationPrompts[inspiration] ?? null;
}

export function formatInspirationPrompt(
  inspiration: string,
): string {
  const profile = getInspirationPrompt(inspiration);

  if (!profile) {
    return "";
  }

  return [
    `Cultural direction: ${profile.description}`,
    `Naming direction: ${profile.naming}`,
    `Clothing and appearance: ${profile.clothing}`,
    `Common occupations: ${profile.occupations}`,
    `Visual motifs: ${profile.visualMotifs}`,
    `Avoid: ${profile.avoid}`,
  ].join("\n");
}