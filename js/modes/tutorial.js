function startTutorial() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  
  // Initialize tutorial state
  Object.assign(gameState, {
    companyName: "Tutorial Company",
    weekNumber: 1,
    moneyAmount: 10000,
    project: null,
    gameHistory: [],
    staff: [],
    candidates: [],
    totalSalaries: 0,
    modifiers: {
      development_speed: 1,
      development_cost: 1,
      bug_rate: 1,
      testing_effectiveness: 1,
      visual_quality: 1,
      team_effectiveness: 1,
      market_reach: 0.5,
      innovation: 1
    },
    technologies: {},
    reputation: {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    },
    tutorialCompleted: false,
    workspace: 'home office',
    tutorialStep: 0
  });
  
  updateStatusDisplay(gameState.companyName, 1, 10000);
  
  // Tutorial sequence
  const tutorialSteps = [
    {
      message: "=== Welcome to the SimDev Tutorial! ===\nLet's learn how to run your game development company.",
      delay: 1000
    },
    {
      message: "First, let's understand the basic commands:\n- 'help' shows available commands\n- 'check status' shows your current status\n- 'advance time' progresses the game by one week",
      delay: 2000
    },
    {
      message: "Let's start by creating your first game.\nType 'start game puzzle' to begin development of a simple puzzle game.",
      delay: 2000
    }
  ];
  
  tutorialSteps.forEach((step, index) => {
    setTimeout(() => {
      outputToDisplay(step.message);
      if (index === tutorialSteps.length - 1) {
        const commandLine = document.getElementById('command-line');
        if (commandLine) {
          commandLine.focus();
        }
      }
    }, step.delay);
  });
  
  // Add tutorial command handler
  const originalHandleCommand = handleCommand;
  handleCommand = function(command, gameState) {
    // Tutorial-specific command validation
    if (gameState.tutorialStep === 0 && command.toLowerCase() === 'start game puzzle') {
      outputToDisplay("Great choice! Puzzle games are perfect for beginners.");
      outputToDisplay("They're quick to develop and have broad market appeal.");
      outputToDisplay("Plus, they're a great way to learn the basics of game development!");
      gameState.tutorialStep++;
      
      // Initialize temporary project with genre data
      const genreData = getGenreData('puzzle');
      gameState.tempProject = {
        genre: 'puzzle',
        genreName: genreData.name
      };
      
      outputToDisplay("\nNow let's choose a subgenre for your puzzle game.");
      outputToDisplay("Available Subgenres:");
      Object.entries(genreData.subgenres).forEach(([key, data]) => {
        outputToDisplay(`- ${data.name} (use: subgenre ${key})`);
        outputToDisplay(`  ${data.description}`);
      });
      
    } else if (gameState.tutorialStep === 1 && command.toLowerCase() === 'subgenre match3') {
      outputToDisplay("Perfect! Match-3 games have broad appeal and simpler development.");
      outputToDisplay("These games are popular with casual players and can be very addictive!");
      gameState.tutorialStep++;
      
      // Get subgenre data and show available elements
      const subgenreData = getSubgenreData('puzzle', 'match3');
      gameState.tempProject.subgenre = 'match3';
      gameState.tempProject.subgenreName = subgenreData.name;
      
      outputToDisplay("\nNow, let's choose some gameplay elements for your Match-3 game.");
      outputToDisplay("These will define the core features of your game.");
      outputToDisplay("\nAvailable elements (choose 3):");
      subgenreData.elements.forEach((element, index) => {
        outputToDisplay(`${index + 1}. ${element}`);
      });
      outputToDisplay("\nType 'select' followed by three numbers to choose your elements.");
      outputToDisplay("Example: 'select 1,2,3' or 'select 2,4,6'");
      
    } else if (gameState.tutorialStep === 2 && /^select\s*\d+(,\d+){2}$/.test(command.toLowerCase())) {
      const subgenreData = getSubgenreData('puzzle', 'match3');
      const selections = command.toLowerCase().replace('select', '').trim().split(',').map(Number);
      
      if (selections.length !== 3 || new Set(selections).size !== 3 || 
          selections.some(n => n < 1 || n > subgenreData.elements.length)) {
        outputToDisplay(`Invalid selection. Please choose exactly three unique numbers between 1 and ${subgenreData.elements.length}.`);
        outputToDisplay("Example: 'select 1,4,6'");
        return;
      }
      
      // Convert selections to actual elements
      gameState.tempProject.elements = selections.map(n => subgenreData.elements[n - 1]);
      
      outputToDisplay("\nGreat choices! Selected elements:");
      gameState.tempProject.elements.forEach(element => {
        outputToDisplay(`- ${element}`);
      });

      // Create the project with selected elements
      const stats = calculateProjectStats(
        gameState.tempProject.genre,
        gameState.tempProject.subgenre,
        gameState.tempProject.elements,
        gameState
      );

      gameState.project = {
        genre: gameState.tempProject.genreName,
        subgenre: gameState.tempProject.subgenreName,
        elements: gameState.tempProject.elements,
        progress: 0,
        phase: 'planning',
        phaseProgress: 0,
        status: 'development',
        budget: stats.initialBudget,
        teamMorale: 100,
        estimatedCompletionWeeks: stats.estimatedWeeks,
        quality: 'initial',
        features: [],
        bugs: 0,
        targetAudience: '',
        marketingBudget: 0,
        completedMilestones: []
      };

      delete gameState.tempProject;
      
      outputToDisplay("\nProject created successfully!");
      outputToDisplay(`Genre: ${gameState.project.genre} (${gameState.project.subgenre})`);
      outputToDisplay(`Initial Budget: $${stats.initialBudget}`);
      outputToDisplay(`Estimated Development Time: ${stats.estimatedWeeks} weeks`);
      outputToDisplay("\nNow we need to choose our target audience.");
      outputToDisplay("Who should we make this game for?");
      outputToDisplay("Options:");
      outputToDisplay("- casual: Casual gamers who prefer simple, fun games");
      outputToDisplay("- hardcore: Experienced gamers who want a challenge");
      outputToDisplay("- all: Try to appeal to everyone (harder to achieve)");
      outputToDisplay("\nUse 'target [audience]' to choose. Example: 'target casual'");
      
      gameState.tutorialStep++;
      
    } else if (gameState.tutorialStep === 3 && command.toLowerCase().startsWith('target')) {
      const params = command.trim().split(/\s+/);
      const audience = params[1];
      if (!['casual', 'hardcore', 'all'].includes(audience)) {
        outputToDisplay("Valid targets: casual, hardcore, or all");
        return;
      }
      gameState.project.targetAudience = audience;
      gameState.project.completedMilestones.push('target_audience');
      outputToDisplay(`Excellent! Target audience set to: ${audience}`);
      outputToDisplay("This will affect how we market the game and what features we prioritize.");
      checkPhaseCompletion(gameState);
      gameState.tutorialStep++;
      
    } else {
      // Pass through to regular command handler
      originalHandleCommand(command, gameState);
    }
    
    // Check for tutorial completion
    if (gameState.project && gameState.project.status === 'development' && !gameState.tutorialCompleted) {
      outputToDisplay("\n=== Tutorial Complete! ===");
      outputToDisplay("You now know the basics of game development in SimDev.");
      outputToDisplay("Continue with this project or start a new one with 'new game'.");
      outputToDisplay("\nKey things to remember:");
      outputToDisplay("- Use 'check status' to monitor your progress");
      outputToDisplay("- Use 'help' to see available commands");
      outputToDisplay("- Watch your budget and development time");
      outputToDisplay("- Don't forget to test for bugs!");
      gameState.tutorialCompleted = true;
      
      // Restore original command handler
      handleCommand = originalHandleCommand;
    }
    
    // Update phase indicator after any command
    if (gameState.project) {
      updatePhaseIndicator(gameState.project);
    }
  };
}

// Make startTutorial accessible globally
window.startTutorial = startTutorial;
