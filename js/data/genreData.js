const GENRE_DATA = {
  rpg: {
    name: "RPG",
    description: "Deep storytelling with high fan loyalty. Expensive but rewarding.",
    baseCost: 1.4,
    baseTime: 1.4,
    marketSize: 0.8,
    fanLoyalty: 1.5,
    subgenres: {
      action: {
        name: "Action RPG",
        description: "Fast-paced combat with real-time mechanics",
        elements: [
          "Real-time Combat",
          "Skill Trees",
          "Loot System",
          "Open World",
          "Character Customization",
          "Crafting System"
        ],
        baseCost: 1.2,
        baseTime: 1.3
      },
      turnbased: {
        name: "Turn-based RPG",
        description: "Strategic combat with party management",
        elements: [
          "Strategic Combat",
          "Party Management",
          "Equipment System",
          "Quest System",
          "Story Branches",
          "Class System"
        ],
        baseCost: 1.1,
        baseTime: 1.2
      },
      openworld: {
        name: "Open World RPG",
        description: "Vast worlds with freedom of exploration",
        elements: [
          "World Map",
          "Side Quests",
          "Fast Travel",
          "Dynamic Events",
          "NPC Schedules",
          "Weather System"
        ],
        baseCost: 1.5,
        baseTime: 1.6
      },
      tactical: {
        name: "Tactical RPG",
        description: "Deep combat systems with strategic elements",
        elements: [
          "Grid Combat",
          "Unit Classes",
          "Status Effects",
          "Formation System",
          "Terrain Effects",
          "Action Points"
        ],
        baseCost: 1.3,
        baseTime: 1.4
      }
    }
  },
  adventure: {
    name: "Adventure",
    description: "Story-driven experiences with good replayability.",
    baseCost: 1.0,
    baseTime: 1.0,
    marketSize: 0.9,
    fanLoyalty: 1.2,
    subgenres: {
      point_and_click: {
        name: "Point & Click",
        description: "Classic puzzle-solving adventure",
        elements: [
          "Inventory System",
          "Dialog Trees",
          "Puzzle Design",
          "Story Scripting",
          "Scene Navigation",
          "Item Interaction"
        ],
        baseCost: 0.9,
        baseTime: 0.8
      },
      metroidvania: {
        name: "Metroidvania",
        description: "Exploration with ability-based progression",
        elements: [
          "Ability Upgrades",
          "Interconnected Map",
          "Backtracking",
          "Boss Battles",
          "Secret Areas",
          "Power Progression"
        ],
        baseCost: 1.1,
        baseTime: 1.2
      },
      visual_novel: {
        name: "Visual Novel",
        description: "Rich storytelling with branching choices",
        elements: [
          "Character Portraits",
          "Choice System",
          "Multiple Endings",
          "Scene Transitions",
          "Music System",
          "Save States"
        ],
        baseCost: 0.8,
        baseTime: 0.9
      },
      interactive_fiction: {
        name: "Interactive Fiction",
        description: "Text-based narrative adventures",
        elements: [
          "Text Parser",
          "State Tracking",
          "Branching Stories",
          "Item Management",
          "Location System",
          "Command System"
        ],
        baseCost: 0.7,
        baseTime: 0.8
      }
    }
  },
  simulation: {
    name: "Simulation",
    description: "Complex systems with steady market appeal.",
    baseCost: 1.2,
    baseTime: 1.2,
    marketSize: 0.7,
    fanLoyalty: 1.3,
    subgenres: {
      life_sim: {
        name: "Life Simulation",
        description: "Character-driven life management",
        elements: [
          "Character AI",
          "Social Systems",
          "Career Paths",
          "Home Building",
          "Relationship System",
          "Daily Activities"
        ],
        baseCost: 1.1,
        baseTime: 1.1
      },
      business: {
        name: "Business Simulation",
        description: "Economic and management focus",
        elements: [
          "Economy System",
          "Resource Management",
          "Market Simulation",
          "Staff Management",
          "Research Tree",
          "Competition AI"
        ],
        baseCost: 1.2,
        baseTime: 1.3
      },
      vehicle: {
        name: "Vehicle Simulation",
        description: "Technical and physics-based gameplay",
        elements: [
          "Physics Engine",
          "Control Systems",
          "Weather Effects",
          "Damage Model",
          "Camera Systems",
          "Technical Stats"
        ],
        baseCost: 1.4,
        baseTime: 1.3
      },
      farming: {
        name: "Farming Simulation",
        description: "Resource management with progression",
        elements: [
          "Crop System",
          "Animal Care",
          "Weather Cycle",
          "Tool Usage",
          "Market Prices",
          "Land Management"
        ],
        baseCost: 1.0,
        baseTime: 1.1
      }
    }
  },
  puzzle: {
    name: "Puzzle",
    description: "Quick to develop with broad market appeal.",
    baseCost: 0.7,
    baseTime: 0.7,
    marketSize: 1.2,
    fanLoyalty: 0.8,
    subgenres: {
      match3: {
        name: "Match-3",
        description: "Pattern matching with casual appeal",
        elements: [
          "Grid System",
          "Combo System",
          "Power-ups",
          "Level Generator",
          "Score System",
          "Progress Tracking"
        ],
        baseCost: 0.6,
        baseTime: 0.6
      },
      logic: {
        name: "Logic Puzzle",
        description: "Brain teasers and problem solving",
        elements: [
          "Puzzle Generator",
          "Difficulty Scaling",
          "Hint System",
          "Solution Checker",
          "Progress Save",
          "Level Editor"
        ],
        baseCost: 0.7,
        baseTime: 0.7
      },
      physics: {
        name: "Physics Puzzle",
        description: "Physics-based problem solving",
        elements: [
          "Physics Engine",
          "Object Interaction",
          "Particle Effects",
          "Level Creation",
          "Replay System",
          "Score Calculator"
        ],
        baseCost: 0.8,
        baseTime: 0.8
      },
      escape: {
        name: "Escape Room",
        description: "Environmental puzzle solving",
        elements: [
          "Room Designer",
          "Item Interaction",
          "Clue System",
          "Inventory Management",
          "Save Progress",
          "Hint Timer"
        ],
        baseCost: 0.7,
        baseTime: 0.7
      }
    }
  },
  sports: {
    name: "Sports",
    description: "High licensing costs but seasonal market peaks.",
    baseCost: 1.3,
    baseTime: 1.1,
    marketSize: 1.0,
    fanLoyalty: 1.1,
    subgenres: {
      team: {
        name: "Team Sports",
        description: "Competitive team-based gameplay",
        elements: [
          "Team AI",
          "Player Stats",
          "Match Engine",
          "Season Mode",
          "Multiplayer",
          "Commentary"
        ],
        baseCost: 1.4,
        baseTime: 1.2
      },
      individual: {
        name: "Individual Sports",
        description: "Personal skill and achievement focus",
        elements: [
          "Character Physics",
          "Career Mode",
          "Tournament System",
          "Training Mode",
          "Replay System",
          "Skill Progression"
        ],
        baseCost: 1.2,
        baseTime: 1.1
      },
      management: {
        name: "Sports Management",
        description: "Strategic team and resource management",
        elements: [
          "Team Management",
          "Transfer System",
          "Finance System",
          "Scout Network",
          "Training Programs",
          "Match Simulation"
        ],
        baseCost: 1.1,
        baseTime: 1.0
      },
      extreme: {
        name: "Extreme Sports",
        description: "Action-focused athletic challenges",
        elements: [
          "Trick System",
          "Physics Engine",
          "Level Designer",
          "Character Creator",
          "Competition Mode",
          "Replay Editor"
        ],
        baseCost: 1.3,
        baseTime: 1.2
      }
    }
  },
  fighting: {
    name: "Fighting",
    description: "Competitive focus with multiplayer emphasis.",
    baseCost: 1.1,
    baseTime: 1.0,
    marketSize: 0.7,
    fanLoyalty: 1.4,
    subgenres: {
      arena: {
        name: "Arena Fighter",
        description: "3D combat with free movement",
        elements: [
          "3D Combat",
          "Arena Design",
          "Character Roster",
          "Move System",
          "Power Ups",
          "Match Types"
        ],
        baseCost: 1.2,
        baseTime: 1.1
      },
      beatemup: {
        name: "Beat 'em up",
        description: "Combat against multiple opponents",
        elements: [
          "Combo System",
          "Enemy AI",
          "Level Progress",
          "Power Moves",
          "Item Drops",
          "Co-op Mode"
        ],
        baseCost: 1.0,
        baseTime: 0.9
      },
      platform: {
        name: "Platform Fighter",
        description: "Movement-based combat mechanics",
        elements: [
          "Platform Physics",
          "Move Sets",
          "Stage Hazards",
          "Item System",
          "Character Balance",
          "Match Rules"
        ],
        baseCost: 1.1,
        baseTime: 1.0
      },
      traditional: {
        name: "Traditional Fighter",
        description: "Technical combat systems",
        elements: [
          "Combat Engine",
          "Move Lists",
          "Frame Data",
          "Training Mode",
          "Network Code",
          "Tournament Mode"
        ],
        baseCost: 1.2,
        baseTime: 1.1
      }
    }
  },
  horror: {
    name: "Horror",
    description: "Niche audience with strong marketing potential.",
    baseCost: 1.0,
    baseTime: 0.9,
    marketSize: 0.6,
    fanLoyalty: 1.3,
    subgenres: {
      survival: {
        name: "Survival Horror",
        description: "Resource management and tension",
        elements: [
          "Inventory System",
          "Enemy AI",
          "Resource Management",
          "Save Points",
          "Map System",
          "Health Management"
        ],
        baseCost: 1.1,
        baseTime: 1.0
      },
      psychological: {
        name: "Psychological Horror",
        description: "Mind-bending narrative focus",
        elements: [
          "Story System",
          "Sanity Meter",
          "Environmental Effects",
          "Character Development",
          "Branching Paths",
          "Sound Design"
        ],
        baseCost: 0.9,
        baseTime: 0.9
      },
      jumpscare: {
        name: "Jump Scare Horror",
        description: "Reaction-based fear mechanics",
        elements: [
          "Scare System",
          "Audio Triggers",
          "Visual Effects",
          "AI Director",
          "Tension Meter",
          "Heart Rate System"
        ],
        baseCost: 0.8,
        baseTime: 0.7
      },
      cosmic: {
        name: "Cosmic Horror",
        description: "Atmospheric and existential horror",
        elements: [
          "Lore System",
          "Atmosphere Engine",
          "Investigation Tools",
          "Sanity Effects",
          "Discovery System",
          "Reality Alterations"
        ],
        baseCost: 1.0,
        baseTime: 1.1
      }
    }
  },
  survival: {
    name: "Survival",
    description: "Trending market with early access potential.",
    baseCost: 1.0,
    baseTime: 1.1,
    marketSize: 0.8,
    fanLoyalty: 1.2,
    subgenres: {
      crafting: {
        name: "Crafting Survival",
        description: "Building and resource gathering",
        elements: [
          "Crafting System",
          "Resource Gathering",
          "Base Building",
          "Tool System",
          "World Generation",
          "Inventory Management"
        ],
        baseCost: 1.1,
        baseTime: 1.2
      },
      zombie: {
        name: "Zombie Survival",
        description: "Combat-focused survival",
        elements: [
          "Enemy AI",
          "Weapon System",
          "Safe Zones",
          "Infection Mechanics",
          "Scavenging",
          "Group Management"
        ],
        baseCost: 1.0,
        baseTime: 1.1
      },
      battle_royale: {
        name: "Battle Royale",
        description: "Competitive survival gameplay",
        elements: [
          "Match System",
          "Loot System",
          "Map Shrinking",
          "Equipment Balance",
          "Network Code",
          "Anti-Cheat"
        ],
        baseCost: 1.2,
        baseTime: 1.3
      },
      resource: {
        name: "Resource Management",
        description: "Strategic survival planning",
        elements: [
          "Resource System",
          "Need Meters",
          "Weather Effects",
          "Event System",
          "Tech Tree",
          "Trading System"
        ],
        baseCost: 0.9,
        baseTime: 1.0
      }
    }
  },
  racing: {
    name: "Racing",
    description: "High production value, physics-focused gameplay.",
    baseCost: 1.3,
    baseTime: 1.2,
    marketSize: 0.7,
    fanLoyalty: 1.0,
    subgenres: {
      arcade: {
        name: "Arcade Racing",
        description: "Accessible, fun-focused racing",
        elements: [
          "Power-up System",
          "Track Generator",
          "Boost Mechanics",
          "Vehicle Selection",
          "Tournament Mode",
          "Score System"
        ],
        baseCost: 1.2,
        baseTime: 1.1
      },
      simulation: {
        name: "Racing Simulation",
        description: "Realistic racing experience",
        elements: [
          "Physics Engine",
          "Car Setup",
          "Weather System",
          "Damage Model",
          "Career Mode",
          "Telemetry Data"
        ],
        baseCost: 1.4,
        baseTime: 1.3
      },
      kart: {
        name: "Kart Racing",
        description: "Family-friendly competitive racing",
        elements: [
          "Character System",
          "Item Mechanics",
          "Track Design",
          "Battle Mode",
          "Split Screen",
          "Challenge Mode"
        ],
        baseCost: 1.1,
        baseTime: 1.0
      },
      openworld: {
        name: "Open World Racing",
        description: "Free-roam racing experience",
        elements: [
          "World Design",
          "Event System",
          "Car Customization",
          "Fast Travel",
          "Side Activities",
          "Progression System"
        ],
        baseCost: 1.5,
        baseTime: 1.4
      }
    }
  },
  idle: {
    name: "Idle",
    description: "Low development cost, focus on retention.",
    baseCost: 0.6,
    baseTime: 0.6,
    marketSize: 1.1,
    fanLoyalty: 0.9,
    subgenres: {
      clicker: {
        name: "Clicker Game",
        description: "Simple but addictive mechanics",
        elements: [
          "Click System",
          "Upgrade Tree",
          "Achievement System",
          "Offline Progress",
          "Statistics",
          "Prestige System"
        ],
        baseCost: 0.5,
        baseTime: 0.5
      },
      management: {
        name: "Idle Management",
        description: "Strategic resource optimization",
        elements: [
          "Resource Chain",
          "Automation",
          "Time Management",
          "Production Line",
          "Research Tree",
          "Milestone System"
        ],
        baseCost: 0.7,
        baseTime: 0.7
      },
      incremental: {
        name: "Incremental Game",
        description: "Number-focused progression",
        elements: [
          "Number System",
          "Multiplier System",
          "Challenge Mode",
          "Reset Mechanics",
          "Achievement Tree",
          "Meta Progression"
        ],
        baseCost: 0.6,
        baseTime: 0.6
      },
      automation: {
        name: "Automation Game",
        description: "System building and optimization",
        elements: [
          "Production Chain",
          "Logic System",
          "Efficiency Tracking",
          "Blueprint System",
          "Resource Flow",
          "Optimization Tools"
        ],
        baseCost: 0.8,
        baseTime: 0.8
      }
    }
  }
};

function getGenreData(genre) {
  return GENRE_DATA[genre.toLowerCase()];
}

function getSubgenreData(genre, subgenre) {
  const genreData = getGenreData(genre);
  return genreData ? genreData.subgenres[subgenre.toLowerCase()] : null;
}
