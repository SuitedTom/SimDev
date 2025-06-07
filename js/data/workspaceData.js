const WORKSPACES = {
  'home office': {
    cost: 0,
    capacity: 1,
    productivity: 1,
    description: "A humble beginning in your home office."
  },
  'small studio': {
    cost: 2000,
    capacity: 5,
    productivity: 1.2,
    description: "A small but professional workspace."
  },
  'medium office': {
    cost: 5000,
    capacity: 12,
    productivity: 1.4,
    description: "A proper office with room to grow."
  },
  'large studio': {
    cost: 12000,
    capacity: 25,
    productivity: 1.6,
    description: "A full-fledged game development studio."
  }
};

const STAFF_SKILLS = {
  technical: {
    coding: "Code writing ability",
    debugging: "Bug finding and fixing",
    optimization: "Performance improvement",
    architecture: "System design"
  },
  creative: {
    graphics: "Visual asset creation",
    animation: "Character and object animation",
    sound: "Audio design and implementation",
    ui_design: "Interface design"
  },
  soft: {
    teamwork: "Collaboration effectiveness",
    leadership: "Team management",
    communication: "Information sharing",
    mentoring: "Skill transfer to others"
  }
};

const STAFF_TYPES = {
  programmer: {
    name: "Programmer",
    baseSalary: 200,
    skills: {
      coding: { min: 1, max: 5, category: "technical" },
      debugging: { min: 1, max: 5, category: "technical" },
      optimization: { min: 1, max: 5, category: "technical" },
      teamwork: { min: 1, max: 5, category: "soft" }
    },
    affects: ["development_speed", "bug_rate"],
    progression: {
      junior: { experience: 0, multiplier: 1.0 },
      intermediate: { experience: 180, multiplier: 1.2 },
      senior: { experience: 365, multiplier: 1.5 },
      lead: { experience: 730, multiplier: 1.8 }
    }
  },
  artist: {
    name: "Artist",
    baseSalary: 180,
    skills: {
      graphics: { min: 1, max: 5, category: "creative" },
      animation: { min: 1, max: 5, category: "creative" },
      ui_design: { min: 1, max: 5, category: "creative" },
      communication: { min: 1, max: 5, category: "soft" }
    },
    affects: ["visual_quality", "polish"],
    progression: {
      junior: { experience: 0, multiplier: 1.0 },
      intermediate: { experience: 180, multiplier: 1.2 },
      senior: { experience: 365, multiplier: 1.5 },
      lead: { experience: 730, multiplier: 1.8 }
    }
  },
  writer: {
    name: "Writer",
    baseSalary: 150,
    skills: {
      story: { min: 1, max: 5, category: "creative" },
      dialogue: { min: 1, max: 5, category: "creative" },
      world_building: { min: 1, max: 5, category: "creative" },
      mentoring: { min: 1, max: 5, category: "soft" }
    },
    affects: ["narrative_quality", "immersion"],
    progression: {
      junior: { experience: 0, multiplier: 1.0 },
      intermediate: { experience: 180, multiplier: 1.2 },
      senior: { experience: 365, multiplier: 1.5 },
      lead: { experience: 730, multiplier: 1.8 }
    }
  },
  qa: {
    name: "QA Tester",
    baseSalary: 120,
    skills: {
      testing: { min: 1, max: 5, category: "technical" },
      bug_finding: { min: 1, max: 5, category: "technical" },
      user_experience: { min: 1, max: 5, category: "creative" },
      teamwork: { min: 1, max: 5, category: "soft" }
    },
    affects: ["bug_detection", "polish"],
    progression: {
      junior: { experience: 0, multiplier: 1.0 },
      intermediate: { experience: 180, multiplier: 1.2 },
      senior: { experience: 365, multiplier: 1.5 },
      lead: { experience: 730, multiplier: 1.8 }
    }
  }
};

const TECHNOLOGIES = {
  development: {
    ide_upgrade: {
      name: "Advanced IDE",
      cost: 1000,
      timeCost: 2, 
      effects: {
        development_speed: 1.2,
        bug_rate: 0.9
      },
      requirements: [],
      description: "Improves code writing efficiency and catches common errors",
      details: [
        "20% faster development speed",
        "10% fewer bugs during development",
        "Improved code completion and analysis"
      ]
    },
    version_control: {
      name: "Version Control System",
      cost: 800,
      timeCost: 1,
      effects: {
        team_effectiveness: 1.15,
        bug_rate: 0.85
      },
      requirements: ["ide_upgrade"],
      description: "Better code management and collaboration",
      details: [
        "15% better team effectiveness",
        "15% fewer merge conflicts",
        "Improved code tracking"
      ]
    },
    continuous_integration: {
      name: "Continuous Integration",
      cost: 2000,
      timeCost: 3,
      effects: {
        development_speed: 1.3,
        bug_rate: 0.8,
        quality: 1.1
      },
      requirements: ["version_control"],
      description: "Automated build and test pipeline",
      details: [
        "30% faster development cycles",
        "20% fewer production bugs",
        "10% higher overall quality"
      ]
    }
  },
  graphics: {
    rendering_engine: {
      name: "Enhanced Rendering Engine",
      cost: 2000,
      timeCost: 3,
      effects: {
        visual_quality: 1.3,
        development_cost: 1.1
      },
      requirements: [],
      description: "Improved graphics capabilities and visual effects",
      details: [
        "30% better visual quality",
        "Support for advanced shaders",
        "Optimized rendering pipeline"
      ]
    },
    animation_tools: {
      name: "Advanced Animation Suite",
      cost: 1500,
      timeCost: 2,
      effects: {
        visual_quality: 1.2,
        development_speed: 1.1
      },
      requirements: ["rendering_engine"],
      description: "Better animation tools and workflow",
      details: [
        "20% improved animations",
        "10% faster development",
        "Advanced rigging tools"
      ]
    },
    motion_capture: {
      name: "Motion Capture System",
      cost: 3000,
      timeCost: 4,
      effects: {
        visual_quality: 1.4,
        development_speed: 1.2,
        quality: 1.15
      },
      requirements: ["animation_tools"],
      description: "Professional motion capture capabilities",
      details: [
        "40% better character animations",
        "20% faster animation development",
        "15% higher overall quality"
      ]
    }
  },
  testing: {
    automated_testing: {
      name: "Automated Testing Framework",
      cost: 1200,
      timeCost: 2,
      effects: {
        testing_effectiveness: 1.25,
        bug_detection: 1.2
      },
      requirements: [],
      description: "Automated bug detection and regression testing",
      details: [
        "25% better testing coverage",
        "20% better bug detection",
        "Automated regression tests"
      ]
    },
    performance_tools: {
      name: "Performance Analysis Tools",
      cost: 1000,
      timeCost: 2,
      effects: {
        optimization: 1.2,
        quality: 1.1
      },
      requirements: ["automated_testing"],
      description: "Better performance monitoring and optimization",
      details: [
        "20% better optimization",
        "10% higher quality",
        "Advanced profiling tools"
      ]
    },
    qa_suite: {
      name: "Professional QA Suite",
      cost: 2500,
      timeCost: 3,
      effects: {
        testing_effectiveness: 1.4,
        bug_detection: 1.3,
        quality: 1.2
      },
      requirements: ["performance_tools"],
      description: "Comprehensive quality assurance toolkit",
      details: [
        "40% more effective testing",
        "30% better bug detection",
        "20% higher overall quality"
      ]
    }
  }
};

function generateCandidates() {
  const candidates = [];
  const firstNames = ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Robin", "Pat"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];

  Object.entries(STAFF_TYPES).forEach(([type, data]) => {
    // Generate 1-2 candidates per type
    const count = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const skills = {};
      Object.keys(data.skills).forEach(skill => {
        skills[skill] = Math.floor(Math.random() * 4) + 1; // 1-5 skill level
      });

      const experience = Math.floor(Math.random() * 1000); // Days of experience
      const baseMultiplier = 1 + (Math.random() * 0.4 - 0.2); // ±20% variance
      const skillBonus = Object.values(skills).reduce((sum, val) => sum + val, 0) / 15; // Skill bonus up to 33%
      
      candidates.push({
        name: `${firstName} ${lastName}`,
        type: type,
        skills: skills,
        experience: experience,
        salary: Math.floor(data.baseSalary * (baseMultiplier + skillBonus)),
        mood: 100 // Starting mood
      });
    }
  });

  return candidates;
}

// Export functions
window.STAFF_TYPES = STAFF_TYPES;
window.WORKSPACES = WORKSPACES;
window.TECHNOLOGIES = TECHNOLOGIES;
window.STAFF_SKILLS = STAFF_SKILLS;
window.generateCandidates = generateCandidates;
