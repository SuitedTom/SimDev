const COMMAND_CATEGORIES = {
  BASIC: {
    name: "Basic Commands",
    description: "Essential game controls and information",
    commands: {
      help: {
        syntax: "help [command]",
        description: "Display help information. Add command name for detailed help.",
        examples: ["help", "help market"],
        details: [
          "Shows available commands and game information",
          "Use without parameters to see all command categories",
          "Specify a command to see detailed usage information",
          "You can also use 'help [category]' to see category-specific commands"
        ],
        related: ["status", "history"]
      },
      status: {
        syntax: "check status",
        description: "View current game status, finances, and project progress.",
        examples: ["check status"],
        details: [
          "Displays company overview including:",
          "- Current funds and weekly expenses",
          "- Team size and morale",
          "- Active project status (if any)",
          "- Technology and research progress",
          "- Market position and reputation"
        ],
        related: ["market", "reputation"]
      },
      time: {
        syntax: "advance time",
        description: "Progress game by one week. Updates all game systems.",
        examples: ["advance time"],
        details: [
          "Advances game time by one week",
          "Updates include:",
          "- Project development progress",
          "- Staff morale and experience",
          "- Market trends",
          "- Financial calculations",
          "Weekly costs and salaries are deducted automatically"
        ],
        requirements: ["Cannot advance time during certain events"],
        related: ["status"]
      },
      save: {
        syntax: "save game [name]",
        description: "Save current game progress. Name is optional.",
        examples: ["save game mysave"],
        details: [
          "Creates a save file of current game state",
          "Save name must be unique",
          "Game autosaves every 4 weeks",
          "Previous save with same name will be overwritten"
        ],
        related: ["load"]
      },
      load: {
        syntax: "load game [name]",
        description: "Load a previously saved game.",
        examples: ["load game mysave"],
        details: [
          "Loads a previously saved game state",
          "All current progress will be lost",
          "Use 'save list' to see available saves",
          "Can load autosaves using 'load game autosave'"
        ],
        related: ["save"]
      },
      market: {
        syntax: "market [action]",
        description: "View market trends and make marketing decisions.",
        examples: ["market view", "market report"],
        details: [
          "Available actions:",
          "- view: Show current market trends",
          "- report: Detailed market analysis",
          "- strategy [type]: Set marketing strategy",
          "- budget [amount]: Set marketing budget",
          "Provides insights on:",
          "- Genre popularity trends",
          "- Market saturation",
          "- Competitor activities",
          "- Release timing recommendations"
        ],
        related: ["reputation", "status"]
      },
      exit: {
        syntax: "exit",
        description: "Save game and return to main menu",
        examples: ["exit"],
        details: [
          "Automatically saves your current game",
          "Returns to the main menu",
          "Game can be continued later using 'Load Game'"
        ],
        related: ["save", "load"]
      }
    }
  },
  
  DEVELOPMENT: {
    name: "Development Commands",
    description: "Game development and project management",
    commands: {
      "start game": {
        syntax: "start game [genre]",
        description: "Begin development of a new game project.",
        examples: ["start game rpg", "start game puzzle"],
        details: [
          "Initiates new game project development",
          "Available genres: RPG, Puzzle, Adventure, etc.",
          "Process includes:",
          "1. Genre selection",
          "2. Subgenre choice",
          "3. Feature selection",
          "4. Project setup",
          "Requirements:",
          "- Sufficient starting budget",
          "- No active project",
          "- Appropriate workspace"
        ],
        related: ["status", "market"],
        notes: "Available genres: RPG, Puzzle, Adventure, etc."
      },
      subgenre: {
        syntax: "subgenre [type]",
        description: "Select subgenre for current project.",
        examples: ["subgenre action", "subgenre match3"],
        details: [
          "Choose project subgenre specialization",
          "Each genre has unique subgenres",
          "Affects:",
          "- Development complexity",
          "- Target audience",
          "- Required resources",
          "- Feature options"
        ],
        requirements: ["Must be in planning phase", "Genre must be selected first"],
        phase: "Planning",
        related: ["start game", "feature"]
      },
      feature: {
        syntax: "feature add [name] [size]",
        description: "Add feature to current project. Size: small/medium/large",
        examples: ["feature add multiplayer large"],
        details: [
          "Add features to project scope",
          "Size options:",
          "- small: Quick to implement, low impact",
          "- medium: Balanced option",
          "- large: Major feature, high impact",
          "Affects:",
          "- Development time",
          "- Resource requirements",
          "- Project quality",
          "- Final game appeal"
        ],
        phase: "Planning",
        related: ["subgenre", "status"]
      },
      test: {
        syntax: "test [type]",
        description: "Run tests on current project. Types: unit/integration/playtest",
        examples: ["test playtest"],
        details: [
          "Available test types:",
          "- unit: Basic functionality testing",
          "- integration: System compatibility",
          "- playtest: User experience testing",
          "Each type provides different insights",
          "Affects quality and bug detection",
          "Testing consumes development time"
        ],
        phase: "Testing",
        related: ["fix"]
      },
      fix: {
        syntax: "fix bugs",
        description: "Attempt to fix detected bugs in current project.",
        examples: ["fix bugs"],
        details: [
          "Resolve detected project issues",
          "Success rate depends on:",
          "- Team skill level",
          "- Bug complexity",
          "- Available resources",
          "More testing = better bug detection"
        ],
        phase: "Testing",
        related: ["test"]
      },
      release: {
        syntax: "release",
        description: "Release completed game to market.",
        examples: ["release"],
        details: [
          "Launch finished game to market",
          "Requirements:",
          "- All phases completed",
          "- Quality checks passed",
          "- Marketing strategy set",
          "- Release window chosen",
          "Final success depends on:",
          "- Game quality",
          "- Market timing",
          "- Marketing effectiveness",
          "- Brand reputation"
        ],
        phase: "Release",
        related: ["market", "status"]
      },
      genres: {
        syntax: "help genres",
        description: "View detailed information about available game genres",
        examples: ["help genres"],
        details: [
          "Shows all available game genres and their characteristics:",
          "- Genre descriptions and target audiences",
          "- Market size and fan loyalty metrics",
          "- Development cost multipliers",
          "- Available subgenres",
          "This information is crucial for project planning"
        ],
        related: ["start game", "market"]
      },
      priority: {
        syntax: "priority [type]",
        description: "Set development focus priority",
        examples: [
          "priority quality",
          "priority balanced",
          "priority speed"
        ],
        details: [
          "Sets the development focus for your project",
          "Available priorities:",
          "- quality: Slower development but higher quality",
          "- balanced: Standard development approach",
          "- speed: Faster development but lower quality",
          "Affects:",
          "- Development speed",
          "- Bug rate",
          "- Team morale",
          "- Final quality"
        ],
        phase: "Development",
        requirements: ["Active project", "Development phase"],
        related: ["status", "check"]
      },
    }
  },
  
  MANAGEMENT: {
    name: "Management Commands",
    description: "Team and resource management",
    commands: {
      staff: {
        syntax: "staff [number] [action]",
        description: "View or manage staff members.",
        examples: [
          "staff",
          "staff 1 train",
          "staff 2 raise 100"
        ],
        details: [
          "Available actions:",
          "- view: Show staff roster",
          "- train [skill]: Improve specific skill",
          "- raise [amount]: Adjust salary",
          "- assign [project]: Assign to project",
          "Staff affects:",
          "- Development speed",
          "- Project quality",
          "- Operating costs",
          "Regular training improves effectiveness"
        ],
        related: ["hire", "workspace"]
      },
      hire: {
        syntax: "hire [action] [params]",
        description: "Manage hiring process.",
        examples: [
          "hire view",
          "hire view programmer",
          "hire 1"
        ],
        details: [
          "Available actions:",
          "- view: Show candidates",
          "- view [role]: Filter by role",
          "- info [number]: Detailed candidate info",
          "- [number]: Hire specific candidate",
          "Consider:",
          "- Salary requirements",
          "- Skill levels",
          "- Team balance",
          "- Workspace capacity"
        ],
        related: ["staff", "workspace"]
      },
      research: {
        syntax: "research [action] [tech]",
        description: "Research and purchase new technologies.",
        examples: [
          "research view",
          "research buy ide_upgrade"
        ],
        details: [
          "Available actions:",
          "- view: Show available technologies",
          "- buy [tech]: Purchase specific technology",
          "Technologies provide:",
          "- Productivity boosts",
          "- Quality improvements",
          "- New capabilities",
          "Some technologies require prerequisites"
        ],
        related: ["status"]
      },
      workspace: {
        syntax: "workspace [action]",
        description: "Manage office space and facilities.",
        examples: [
          "workspace view",
          "workspace upgrade"
        ],
        details: [
          "Available actions:",
          "- view: Show current workspace",
          "- upgrade: Improve facilities",
          "Better workspace provides:",
          "- Larger team capacity",
          "- Productivity bonuses",
          "- Team morale benefits",
          "Upgrades require investment"
        ],
        related: ["staff", "hire"]
      },
      assign: {
        syntax: "assign [staff] [role] [allocation]",
        description: "Assign staff to project roles.",
        examples: ["assign 1 programmer 100"],
        details: [
          "Allocate staff to project tasks",
          "Allocation range: 0-100%",
          "Affects:",
          "- Development speed",
          "- Work quality",
          "- Staff satisfaction",
          "Match roles to staff skills"
        ],
        phase: "Planning",
        related: ["staff"]
      },
      allocate: {
        syntax: "allocate [resource] [amount]",
        description: "Allocate resources to project areas.",
        examples: ["allocate coding 60"],
        details: [
          "Distribute resources across project",
          "Resource types:",
          "- coding",
          "- design",
          "- testing",
          "- marketing",
          "Balance affects project success",
          "Total allocation must be 100%"
        ],
        phase: "Planning",
        related: ["staff", "status"]
      }
    }
  },
  
  INFORMATION: {
    name: "Information Commands",
    description: "Game analysis and reporting",
    commands: {
      history: {
        syntax: "check history",
        description: "View history of completed games.",
        examples: ["check history"],
        details: [
          "Shows all completed game projects",
          "Information includes:",
          "- Game details",
          "- Success metrics",
          "- Revenue generated",
          "- Market reception",
          "- Development timeline",
          "Useful for strategy planning"
        ],
        related: ["status", "market"]
      },
      reputation: {
        syntax: "reputation",
        description: "Check company reputation and fan base.",
        examples: ["reputation"],
        details: [
          "Shows company standing including:",
          "- Overall brand strength",
          "- Audience segments",
          "- Fan loyalty",
          "- Market presence",
          "- Recent reception",
          "Affects future game success"
        ],
        related: ["market", "history"]
      },
      trends: {
        syntax: "market trends",
        description: "Analyze current market trends.",
        examples: ["market trends"],
        details: [
          "Shows market analysis including:",
          "- Genre popularity",
          "- Market saturation",
          "- Competitor activities",
          "- Growth predictions",
          "Updated weekly",
          "Critical for project planning"
        ],
        related: ["market", "status"]
      },
      metrics: {
        syntax: "metrics [type]",
        description: "View detailed project metrics.",
        examples: ["metrics technical", "metrics design"],
        details: [
          "Available metric types:",
          "- technical: Code quality, performance",
          "- design: User experience, features",
          "- production: Team efficiency, progress",
          "- market: Appeal, competition",
          "Updated throughout development"
        ],
        phase: "Development",
        related: ["status", "market"]
      }
    }
  }
};

function displayHelp(command) {
  if (command) {
    displayCommandHelp(command);
    return;
  }

  outputToDisplay("\n=== SimDev Help System ===");
  outputToDisplay("Type 'help [command]' for detailed information about specific commands.\n");

  // Display each category with all commands
  Object.entries(COMMAND_CATEGORIES).forEach(([categoryKey, category]) => {
    outputToDisplay(`\n=== ${category.name} ===`);
    outputToDisplay(category.description);
    
    // Display each command in the category
    Object.entries(category.commands).forEach(([cmdName, cmd]) => {
      outputToDisplay(`\n${cmdName}`);
      outputToDisplay(`  ${cmd.description}`);
      if (cmd.syntax) {
        outputToDisplay(`  Usage: ${cmd.syntax}`);
      }
      if (cmd.phase) {
        outputToDisplay(`  Phase: ${cmd.phase}`);
      }
    });
  });

  // Add helpful footer
  outputToDisplay("\nTip: Use 'help [category]' to see detailed category help (e.g., 'help basic')");
  outputToDisplay("     Use 'help [command]' to see detailed command help (e.g., 'help market')");
  outputToDisplay("\nCommon categories:");
  outputToDisplay("- basic: Essential game controls");
  outputToDisplay("- development: Game development commands");
  outputToDisplay("- management: Team and resource management");
  outputToDisplay("- information: Game analysis and reporting");
}

function displayCategoryHelp(category) {
  outputToDisplay(`\n=== ${category.name} ===`);
  outputToDisplay(category.description);
  outputToDisplay("\nAvailable Commands:");

  Object.entries(category.commands).forEach(([name, cmd]) => {
    outputToDisplay(`\n${name}`);
    outputToDisplay(`  Usage: ${cmd.syntax}`);
    outputToDisplay(`  ${cmd.description}`);
    
    if (cmd.examples && cmd.examples.length > 0) {
      outputToDisplay("  Examples:");
      cmd.examples.forEach(example => outputToDisplay(`    ${example}`));
    }
    
    if (cmd.phase) {
      outputToDisplay(`  Available in ${cmd.phase} phase`);
    }
    
    if (cmd.requirements) {
      outputToDisplay("  Requirements:");
      if (Array.isArray(cmd.requirements)) {
        cmd.requirements.forEach(req => outputToDisplay(`    - ${req}`));
      } else {
        outputToDisplay(`    - ${cmd.requirements}`);
      }
    }
  });
}

function displayCommandHelp(command) {
  // Check for category help first
  const categoryHelp = {
    basic: COMMAND_CATEGORIES.BASIC,
    development: COMMAND_CATEGORIES.DEVELOPMENT,
    management: COMMAND_CATEGORIES.MANAGEMENT,
    information: COMMAND_CATEGORIES.INFORMATION
  };

  if (categoryHelp[command.toLowerCase()]) {
    displayCategoryHelp(categoryHelp[command.toLowerCase()]);
    return;
  }

  // Look for specific command in all categories
  let foundCommand = null;
  let foundIn = null;

  Object.values(COMMAND_CATEGORIES).forEach(category => {
    if (category.commands[command]) {
      foundCommand = category.commands[command];
      foundIn = category.name;
    }
  });

  if (foundCommand) {
    outputToDisplay(`\n=== ${command.toUpperCase()} ===`);
    outputToDisplay(`Category: ${foundIn}`);
    outputToDisplay(`\nDescription: ${foundCommand.description}`);
    outputToDisplay(`\nUsage: ${foundCommand.syntax}`);
    
    if (foundCommand.phase) {
      outputToDisplay(`Phase: ${foundCommand.phase}`);
    }
    
    if (foundCommand.details && foundCommand.details.length > 0) {
      outputToDisplay("\nDetails:");
      foundCommand.details.forEach(detail => {
        outputToDisplay(`- ${detail}`);
      });
    }
    
    if (foundCommand.examples && foundCommand.examples.length > 0) {
      outputToDisplay("\nExamples:");
      foundCommand.examples.forEach(example => {
        outputToDisplay(`  ${example}`);
      });
    }
    
    if (foundCommand.requirements) {
      outputToDisplay("\nRequirements:");
      if (Array.isArray(foundCommand.requirements)) {
        foundCommand.requirements.forEach(req => {
          outputToDisplay(`- ${req}`);
        });
      } else {
        outputToDisplay(`- ${foundCommand.requirements}`);
      }
    }
    
    if (foundCommand.related && foundCommand.related.length > 0) {
      outputToDisplay("\nRelated Commands:");
      outputToDisplay(foundCommand.related.join(", "));
    }
  } else {
    outputToDisplay(`Command '${command}' not found. Type 'help' for command list.`);
  }
}

// Make functions available globally
window.displayHelp = displayHelp;
window.displayCommandHelp = displayCommandHelp;
window.displayCategoryHelp = displayCategoryHelp;
