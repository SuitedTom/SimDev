function startNewGame() {
  // Reset any existing game state
  window.gameState = {
    companyName: "",
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
    workspace: 'home office'
  };

  // Switch to game screen first
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  
  // Clear any previous output
  const outputDiv = document.querySelector('.game-output');
  if (outputDiv) {
    outputDiv.innerHTML = '';
    createMessageContainer(outputDiv);
  }
  
  outputToDisplay("=== Welcome to SimDev! ===");
  outputToDisplay("What would you like to name your company?");
  outputToDisplay("\nType your company name or 'back' to return to menu");
  
  // Store original command handler
  const originalHandleCommand = window.handleCommand;
  
  // Set up temporary command handler for company naming
  window.handleCommand = function(command, gameState) {
    const action = command.trim().toLowerCase();
    
    // Allow returning to menu at any time
    if (action === 'back') {
      window.handleCommand = originalHandleCommand;
      returnToMainMenu();
      return;
    }
    
    // Validate company name
    const companyName = command.trim();
    const validation = validateCompanyName(companyName);
    
    if (!validation.valid) {
      outputToDisplay(`\nInvalid company name: ${validation.reason}`);
      outputToDisplay("Please try again or type 'back' to return to menu");
      return;
    }
    
    // Initialize new game state
    gameState.companyName = companyName;
    
    // Update UI
    updateStatusDisplay(companyName, 1, 10000);
    
    // Confirm name and show options to proceed or change
    outputToDisplay(`\nCompany "${companyName}" created successfully!`);
    outputToDisplay("Type 'confirm' to begin or 'rename' to choose a different name");
    
    // Update command handler for confirmation
    window.handleCommand = function(command, gameState) {
      const action = command.trim().toLowerCase();
      
      if (action === 'rename') {
        startNewGame();
        return;
      }
      
      if (action === 'confirm') {
        // Restore original command handler
        window.handleCommand = originalHandleCommand;
        
        // Clear output and show fresh start
        const outputDiv = document.querySelector('.game-output');
        if (outputDiv) {
          outputDiv.innerHTML = '';
          createMessageContainer(outputDiv);
        }
        
        displayGameStart(gameState);
        
        // Create autosave
        saveGame(gameState, null, true);
        return;
      }
      
      // If neither confirm nor rename, show options again
      outputToDisplay("\nPlease type 'confirm' to proceed or 'rename' to choose a different name");
    };
  };
}

function displayGameStart(gameState) {
  outputToDisplay("=== Welcome to SimDev! ===");
  outputToDisplay("The year is 2024.");
  outputToDisplay(`\nCongratulations! ${gameState.companyName} has been founded!`);
  outputToDisplay("You're starting as a solo developer working from your home office.");
  
  outputToDisplay("\n=== Current Status ===");
  outputToDisplay(`Starting Capital: $${gameState.moneyAmount}`);
  outputToDisplay(`Workspace: ${formatWorkspaceName(gameState.workspace)}`);
  outputToDisplay("Team Size: Solo Developer");
  
  outputToDisplay("\n=== Available Actions ===");
  outputToDisplay("1. Start a new game project ('start game [genre]')");
  outputToDisplay("2. Research market trends ('market')");
  outputToDisplay("3. View available technologies ('research view')");
  outputToDisplay("4. Check company status ('check status')");
  outputToDisplay("5. View help ('help')");
  
  outputToDisplay("\nTip: Start with a small puzzle or idle game to build experience!");
}

function validateCompanyName(name) {
  if (!name || name.length < 2) {
    return {
      valid: false,
      reason: "Company name must be at least 2 characters long"
    };
  }
  
  if (name.length > 30) {
    return {
      valid: false,
      reason: "Company name cannot exceed 30 characters"
    };
  }
  
  if (!/^[a-zA-Z0-9\s\-&.]+$/.test(name)) {
    return {
      valid: false,
      reason: "Company name can only contain letters, numbers, spaces, hyphens, ampersands, and periods"
    };
  }
  
  return { valid: true };
}

function returnToMainMenu() {
  // Reset game state
  window.gameState = initGameState();
  
  // Reset UI elements
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  
  // Clear game output
  const outputDiv = document.querySelector('.game-output');
  if (outputDiv) {
    outputDiv.innerHTML = '';
    createMessageContainer(outputDiv);
  }
  
  // Reset command handler to original state
  if (window.originalHandleCommand) {
    window.handleCommand = window.originalHandleCommand;
  }
}

function initGameState() {
  return {
    companyName: "",
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
    marketTrends: null
  };
}

function formatWorkspaceName(workspace) {
  return workspace.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function displayLoadGameInterface() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  
  outputToDisplay("\n=== Load Game ===");
  outputToDisplay("Select a save file to load or type 'back' to return to menu");
  
  const saves = getSavesList();
  
  if (saves.length === 0) {
    outputToDisplay("No saved games found.");
    outputToDisplay("\nType 'back' to return to main menu");
    return;
  }

  displaySavesList(saves);

  const originalHandleCommand = window.handleCommand;
  window.handleCommand = function(command, gameState) {
    const parts = command.trim().toLowerCase().split(/\s+/);
    const action = parts[0];
    const param = parts.slice(1).join(' ');

    switch(action) {
      case 'load':
        if (handleLoadCommand(param, saves, gameState)) {
          window.handleCommand = originalHandleCommand;
          return;
        }
        break;
      case 'delete':
        handleDeleteCommand(param, saves);
        break;
      case 'back':
        // Restore original command handler
        window.handleCommand = originalHandleCommand;
        // Return to main menu
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
        // Clear game output
        const outputDiv = document.querySelector('.game-output');
        if (outputDiv) {
          outputDiv.innerHTML = '';
          createMessageContainer(outputDiv);
        }
        break;
      default:
        outputToDisplay("Invalid command. Use 'load [number/name]', 'delete [number/name]', or 'back'");
    }
  };
}

// Make functions globally available
window.startNewGame = startNewGame;
window.returnToMainMenu = returnToMainMenu;
window.initGameState = initGameState;
