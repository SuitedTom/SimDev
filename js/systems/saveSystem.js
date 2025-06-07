function getDefaultSaveName(gameState) {
  const date = new Date();
  const formatted = date.toISOString().split('T')[0];
  return `${gameState.companyName}_${formatted}`;
}

function saveGame(gameState, saveName, isAutosave = false, suppressNotification = false) {
  try {
    // If no name provided, prompt for one with default suggestion
    if (!saveName && !isAutosave) {
      const defaultName = getDefaultSaveName(gameState);
      saveName = prompt("Name your save file:", defaultName);
      if (!saveName) {
        outputToDisplay("Save cancelled.");
        return; // User cancelled
      }
    }

    // For autosaves, use special naming
    if (isAutosave) {
      saveName = `autosave_${gameState.companyName}`;
    }

    // Add metadata to save
    const saveData = {
      data: gameState,
      metadata: {
        timestamp: new Date().toISOString(),
        companyName: gameState.companyName,
        weekNumber: gameState.weekNumber,
        money: gameState.moneyAmount,
        projectStatus: gameState.project ? {
          name: gameState.project.name,
          phase: gameState.project.phase,
          progress: gameState.project.progress
        } : null,
        staff: gameState.staff.length,
        technologies: Object.keys(gameState.technologies).length
      }
    };

    localStorage.setItem(saveName, JSON.stringify(saveData));
    
    // Only show outputs if not suppressing notifications
    if (!suppressNotification) {
      outputToDisplay(isAutosave ? 'Game autosaved!' : `Game saved as: ${saveName}`);
      showNotification(isAutosave ? 'Game autosaved!' : 'Game saved!');
    }
    
  } catch (error) {
    console.error('Save failed:', error);
    if (!suppressNotification) {
      outputToDisplay('Failed to save game! Please try again.');
      showNotification('Failed to save game!', 'error');
    }
  }
}

function validateSaveData(saveData) {
  // Required top-level properties
  const requiredProps = [
    'companyName', 
    'weekNumber', 
    'moneyAmount', 
    'staff',
    'gameHistory',
    'modifiers',
    'reputation',
    'workspace'
  ];

  const missingProps = requiredProps.filter(prop => !(prop in saveData));
  if (missingProps.length > 0) {
    throw new Error(`Save data missing required properties: ${missingProps.join(', ')}`);
  }

  // Validate project data if exists
  if (saveData.project) {
    validateProjectData(saveData.project);
  }

  // Validate staff data
  if (!Array.isArray(saveData.staff)) {
    throw new Error('Invalid staff data structure');
  }

  // Validate reputation data
  const requiredReputation = ['casual', 'hardcore', 'critics', 'marketPresence'];
  const missingRep = requiredReputation.filter(prop => !(prop in saveData.reputation));
  if (missingRep.length > 0) {
    throw new Error(`Invalid reputation data: missing ${missingRep.join(', ')}`);
  }

  return true;
}

function validateProjectData(project) {
  const requiredProjectProps = [
    'name',
    'genre',
    'subgenre',
    'phase',
    'progress',
    'budget'
  ];

  const missingProps = requiredProjectProps.filter(prop => !(prop in project));
  if (missingProps.length > 0) {
    throw new Error(`Project data missing required properties: ${missingProps.join(', ')}`);
  }

  // Initialize development cycle if missing
  if (!project.developmentCycle) {
    project.developmentCycle = {
      currentPhase: project.phase,
      phaseProgress: project.phaseProgress || 0,
      cycleMetrics: {
        technical: {},
        design: {},
        production: {},
        market: {}
      },
      milestones: [],
      risks: [],
      decisions: [],
      qualityGates: {
        planning: false,
        development: false,
        testing: false,
        release: false
      }
    };
  }

  // Validate phase-specific data
  validatePhaseData(project);

  return true;
}

function validatePhaseData(project) {
  const phaseValidators = {
    planning: validatePlanningPhase,
    development: validateDevelopmentPhase,
    testing: validateTestingPhase,
    release: validateReleasePhase
  };

  const validator = phaseValidators[project.phase];
  if (validator) {
    validator(project);
  }
}

function validatePlanningPhase(project) {
  if (!project.planningData) {
    throw new Error('Missing planning phase data');
  }

  const requiredPlanning = ['features', 'assignedStaff', 'resourceAllocation', 'milestones'];
  const missingPlanning = requiredPlanning.filter(prop => !(prop in project.planningData));
  if (missingPlanning.length > 0) {
    throw new Error(`Incomplete planning data: missing ${missingPlanning.join(', ')}`);
  }
}

function validateDevelopmentPhase(project) {
  if (!project.developmentCycle) {
    throw new Error('Missing development cycle data');
  }

  const requiredDev = ['cycleMetrics', 'milestones', 'decisions'];
  const missingDev = requiredDev.filter(prop => !(prop in project.developmentCycle));
  if (missingDev.length > 0) {
    throw new Error(`Incomplete development data: missing ${missingDev.join(', ')}`);
  }
}

function validateTestingPhase(project) {
  if (!project.testingMetrics) {
    // Initialize testing metrics if missing
    project.testingMetrics = {
      bugsFound: 0,
      bugsFixed: 0,
      playtestScore: 0,
      testsConducted: {
        unit: false,
        integration: false,
        playtest: false
      },
      bugSeverity: {
        critical: Math.floor((project.bugs || 0) * 0.2),
        major: Math.floor((project.bugs || 0) * 0.3),
        minor: Math.ceil((project.bugs || 0) * 0.5)
      },
      qualityMetrics: {
        performance: 50,
        stability: 50,
        usability: 50
      },
      playtestResults: []
    };
  }

  // Don't throw error for missing metrics, just return valid
  return { valid: true };
}

function validateReleasePhase(project) {
  const requiredRelease = [];
  
  if (!project.releaseData && !project.marketingStrategy && !project.launchWindow) {
    project.releaseData = {
      marketingStrategy: null,
      launchWindow: null,
      optimizationFocus: null,
      finalPolish: true
    };
  }
  
  if (project.marketingStrategy || project.launchWindow) {
    project.releaseData = {
      marketingStrategy: project.marketingStrategy || null,
      launchWindow: project.launchWindow || null,
      optimizationFocus: project.optimizationFocus || null,
      finalPolish: true
    };
  }

  return {
    valid: true,
    migratedData: true
  };
}

function restoreGameState(gameState, loadedState) {
  try {
    for (const key in gameState) {
      if (gameState.hasOwnProperty(key)) {
        delete gameState[key];
      }
    }

    for (const key in loadedState) {
      if (loadedState.hasOwnProperty(key)) {
        gameState[key] = JSON.parse(JSON.stringify(loadedState[key]));
      }
    }

    restoreFunctionReferences(gameState);

    initializeRequiredSystems(gameState);

    validateSaveData(gameState);

    return true;
  } catch (error) {
    console.error('Error restoring game state:', error);
    throw new Error(`Failed to restore game state: ${error.message}`);
  }
}

function restoreFunctionReferences(gameState) {
  if (gameState.project) {
    gameState.project.calculateProgress = calculateProjectProgress;
    gameState.project.updateMetrics = updateProjectMetrics;

    if (!gameState.project.developmentCycle) {
      gameState.project.developmentCycle = {
        currentPhase: gameState.project.phase || 'planning',
        phaseProgress: gameState.project.phaseProgress || 0,
        cycleMetrics: {
          technical: {},
          design: {},
          production: {},
          market: {}
        },
        milestones: [],
        risks: [],
        decisions: [],
        qualityGates: {
          planning: false,
          development: false,
          testing: false,
          release: false
        }
      };
    }
  }

  if (gameState.staff) {
    gameState.staff.forEach(staff => {
      staff.calculateEfficiency = calculateStaffEfficiency;
      staff.updateMorale = updateStaffMorale;
    });
  }
}

function initializeRequiredSystems(gameState) {
  if (!gameState.marketTrends) {
    gameState.marketTrends = initializeMarketTrends(gameState);
  }

  if (!gameState.modifiers) {
    gameState.modifiers = {
      development_speed: 1,
      development_cost: 1,
      bug_rate: 1,
      testing_effectiveness: 1,
      visual_quality: 1,
      team_effectiveness: 1,
      market_reach: 0.5,
      innovation: 1
    };
  }

  if (!gameState.reputation) {
    gameState.reputation = {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    };
  }

  if (gameState.project) {
    if (!gameState.project.developmentCycle) {
      gameState.project.developmentCycle = {
        currentPhase: gameState.project.phase,
        phaseProgress: gameState.project.phaseProgress || 0,
        cycleMetrics: {
          technical: {},
          design: {},
          production: {},
          market: {}
        },
        milestones: [],
        risks: [],
        decisions: [],
        qualityGates: {
          planning: false,
          development: false,
          testing: false,
          release: false
        }
      };
    }

    if (!gameState.project.releaseData) {
      gameState.project.releaseData = {
        marketingStrategy: gameState.project.marketingStrategy || null,
        launchWindow: gameState.project.launchWindow || null,
        optimizationFocus: gameState.project.optimizationFocus || null,
        finalPolish: true
      };
    }

    // Initialize testing metrics if missing
    if (!gameState.project.testingMetrics) {
      gameState.project.testingMetrics = {
        bugsFound: 0,
        bugsFixed: 0,
        playtestScore: 0,
        testsConducted: {
          unit: false,
          integration: false,
          playtest: false
        },
        bugSeverity: {
          critical: Math.floor((gameState.project.bugs || 0) * 0.2),
          major: Math.floor((gameState.project.bugs || 0) * 0.3),
          minor: Math.ceil((gameState.project.bugs || 0) * 0.5)
        },
        qualityMetrics: {
          performance: 50,
          stability: 50,
          usability: 50
        },
        playtestResults: []
      };
    }

    // Ensure all required testing metric properties exist
    const requiredMetrics = ['bugsFound', 'bugsFixed', 'playtestScore', 'testsConducted', 'bugSeverity', 'qualityMetrics', 'playtestResults'];
    requiredMetrics.forEach(metric => {
      if (!gameState.project.testingMetrics[metric]) {
        switch(metric) {
          case 'testsConducted':
            gameState.project.testingMetrics.testsConducted = {
              unit: false,
              integration: false,
              playtest: false
            };
            break;
          case 'bugSeverity':
            gameState.project.testingMetrics.bugSeverity = {
              critical: Math.floor((gameState.project.bugs || 0) * 0.2),
              major: Math.floor((gameState.project.bugs || 0) * 0.3),
              minor: Math.ceil((gameState.project.bugs || 0) * 0.5)
            };
            break;
          case 'qualityMetrics':
            gameState.project.testingMetrics.qualityMetrics = {
              performance: 50,
              stability: 50,
              usability: 50
            };
            break;
          case 'playtestResults':
            gameState.project.testingMetrics.playtestResults = [];
            break;
          default:
            gameState.project.testingMetrics[metric] = 0;
        }
      }
    });

    // Ensure target audience is set
    if (!gameState.project.targetAudience) {
      gameState.project.targetAudience = 'all';
    }
  }
}

function loadGame(saveName, gameState) {
  try {
    const savedGame = localStorage.getItem(saveName);
    if (!savedGame) {
      throw new Error(`Save file "${saveName}" not found`);
    }

    const saveData = JSON.parse(savedGame);
    const loadedState = saveData.data;
    const metadata = saveData.metadata;

    if (!loadedState || !metadata) {
      throw new Error('Invalid save file structure');
    }

    restoreGameState(gameState, loadedState);

    updateInterface(gameState);

    displayLoadConfirmation(metadata);

    setupCommandHandling(gameState);

    // Only show a single notification
    showNotification('Game loaded successfully!');
    
    // Don't create another autosave immediately after loading
    // Remove or comment out this line:
    // saveGame(gameState, null, true);
    
    return true;

  } catch (error) {
    console.error('Load failed:', error);
    outputToDisplay('Failed to load game!');
    outputToDisplay(`Error: ${error.message}`);
    showNotification('Failed to load game!', 'error');
    return false;
  }
}

function updateInterface(gameState) {
  document.getElementById('home-screen')?.classList.add('hidden');
  document.getElementById('game-screen')?.classList.remove('hidden');

  const outputDiv = document.querySelector('.game-output');
  if (outputDiv) {
    outputDiv.innerHTML = '';
    createMessageContainer(outputDiv);
  }

  updateStatusDisplay(
    gameState.companyName,
    gameState.weekNumber,
    gameState.moneyAmount
  );

  if (gameState.project) {
    updatePhaseIndicator(gameState.project);
  }
}

function displayLoadConfirmation(metadata) {
  outputToDisplay("\n=== Game Loaded Successfully ===");
  outputToDisplay(`Company: ${metadata.companyName}`);
  outputToDisplay(`Week: ${metadata.weekNumber}`);
  outputToDisplay(`Available Funds: $${metadata.money}`);

  if (metadata.projectStatus) {
    outputToDisplay(`\nActive Project: ${metadata.projectStatus.name}`);
    outputToDisplay(`Phase: ${metadata.projectStatus.phase}`);
    outputToDisplay(`Progress: ${metadata.projectStatus.progress.toFixed(1)}%`);
  }

  if (metadata.staff > 0) {
    outputToDisplay(`\nTeam Size: ${metadata.staff} employees`);
  }

  if (metadata.technologies > 0) {
    outputToDisplay(`Owned Technologies: ${metadata.technologies}`);
  }

  outputToDisplay(`\nLast Saved: ${new Date(metadata.timestamp).toLocaleString()}`);
  outputToDisplay("\nType 'help' to see available commands");
}

function setupCommandHandling(gameState) {
  document.getElementById('command-line')?.focus();

  if (gameState.project?.phase === 'development') {
    outputToDisplay("\nDevelopment in Progress:");
    displayProjectStatus(gameState.project);
  }

  // saveGame(gameState, null, true);
}

function deleteSave(saveName) {
  try {
    const savedGame = localStorage.getItem(saveName);
    if (savedGame) {
      const confirmDelete = confirm(`Are you sure you want to delete save: ${saveName}?`);
      if (confirmDelete) {
        localStorage.removeItem(saveName);
        outputToDisplay(`Save file "${saveName}" deleted successfully.`);
        showNotification('Save file deleted!');
        displaySaves(); 
      } else {
        outputToDisplay("Delete cancelled.");
      }
    } else {
      outputToDisplay(`Save file "${saveName}" not found.`);
      outputToDisplay("Available saves:");
      displaySaves();
    }
  } catch (error) {
    console.error('Delete failed:', error);
    outputToDisplay('Failed to delete save file!');
    showNotification('Failed to delete save!', 'error');
  }
}

function displaySaves() {
  outputToDisplay("\n=== Saved Games ===");
  const saves = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const saveData = JSON.parse(localStorage.getItem(key));
      if (saveData.metadata) { 
        saves.push({
          name: key,
          ...saveData.metadata
        });
      }
    } catch (error) {
      console.warn('Invalid save data:', key);
    }
  }

  if (saves.length === 0) {
    outputToDisplay("No saves available.");
    return;
  }

  saves.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach(save => {
      const isAutosave = save.name.startsWith('autosave_');
      const timestamp = new Date(save.timestamp).toLocaleString();
      
      outputToDisplay(`\n${isAutosave ? '[AUTOSAVE]' : ''} ${save.name}`);
      outputToDisplay(`Company: ${save.companyName}`);
      outputToDisplay(`Week: ${save.weekNumber}`);
      outputToDisplay(`Money: $${save.money}`);
      
      if (save.projectStatus) {
        outputToDisplay(`Project: ${save.projectStatus.name} (${save.projectStatus.phase} - ${save.projectStatus.progress.toFixed(1)}%)`);
      }
      
      if (save.staff > 0) {
        outputToDisplay(`Team Size: ${save.staff} employees`);
      }
      
      outputToDisplay(`Last Saved: ${timestamp}`);
      outputToDisplay("Commands:");
      outputToDisplay(`- load game ${save.name}`);
      outputToDisplay(`- delete save ${save.name}`);
      outputToDisplay("──────────────────");
    });
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
        if (!gameState.companyName) {
          returnToMainMenu();
        } else {
          window.handleCommand = originalHandleCommand;
          outputToDisplay("Returning to game...");
          displayCompanyStatus(gameState);
        }
        break;
      default:
        if (!gameState.companyName) {
          outputToDisplay("Invalid command. Use 'load [number/name]', 'delete [number/name]', or 'back'");
        } else {
          originalHandleCommand(command, gameState);
        }
    }
  };
}

function displaySavesList(saves) {
  saves.forEach((save, index) => {
    const saveNumber = index + 1;
    const date = new Date(save.metadata.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    outputToDisplay(`\n${saveNumber}. ${save.name}`);
    outputToDisplay(`   Company: ${save.metadata.companyName}`);
    outputToDisplay(`   Week: ${save.metadata.weekNumber}`);
    outputToDisplay(`   Funds: $${save.metadata.money}`);
    outputToDisplay(`   Saved: ${formattedDate}`);
    
    if (save.metadata.projectStatus) {
      outputToDisplay(`   Project: ${save.metadata.projectStatus.name} (${save.metadata.projectStatus.phase} - ${save.metadata.projectStatus.progress.toFixed(1)}%)`);
    }
    
    if (save.metadata.staff > 0) {
      outputToDisplay(`   Staff: ${save.metadata.staff} employees`);
    }
  });

  outputToDisplay("\nCommands:");
  outputToDisplay("- load [number/name] : Load specific save");
  outputToDisplay("- delete [number/name] : Delete save");
  outputToDisplay("- back : Return to main menu");
}

function handleLoadCommand(param, saves, gameState) {
  const saveIndex = parseInt(param) - 1;
  let targetSave;

  if (!isNaN(saveIndex) && saveIndex >= 0 && saveIndex < saves.length) {
    targetSave = saves[saveIndex];
  } else {
    targetSave = saves.find(save => save.name.toLowerCase() === param.toLowerCase());
  }

  if (!targetSave) {
    outputToDisplay("Invalid save number or name.");
    return false;
  }

  try {
    if (loadGame(targetSave.name, gameState)) {
      outputToDisplay("\nGame loaded successfully. Type 'help' for available commands.");
      return true;
    }
  } catch (error) {
    outputToDisplay("Error loading save file:");
    outputToDisplay(error.message);
    outputToDisplay("\nThe save file may be corrupted.");
  }
  return false;
}

function handleDeleteCommand(param, saves) {
  const saveIndex = parseInt(param) - 1;
  let targetSave;

  if (!isNaN(saveIndex) && saveIndex >= 0 && saveIndex < saves.length) {
    targetSave = saves[saveIndex];
  } else {
    targetSave = saves.find(save => save.name.toLowerCase() === param.toLowerCase());
  }

  if (!targetSave) {
    outputToDisplay("Invalid save number or name.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete save: ${targetSave.name}?`);
  if (confirmDelete) {
    try {
      localStorage.removeItem(targetSave.name);
      outputToDisplay(`Save file "${targetSave.name}" deleted successfully.`);
      displayLoadGameInterface();
    } catch (error) {
      outputToDisplay("Error deleting save file:");
      outputToDisplay(error.message);
    }
  } else {
    outputToDisplay("Delete cancelled.");
  }
}

function returnToMainMenu() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  const outputDiv = document.querySelector('.game-output');
  if (outputDiv) {
    outputDiv.innerHTML = '';
    createMessageContainer(outputDiv);
  }
}

function getSavesList() {
  const saves = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const saveData = JSON.parse(localStorage.getItem(key));
      if (saveData.metadata) { 
        saves.push({
          name: key,
          ...saveData
        });
      }
    } catch (error) {
      console.warn('Invalid save data:', key);
    }
  }

  return saves.sort((a, b) => 
    new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp)
  );
}

window.saveGame = saveGame;
window.loadGame = loadGame;
window.deleteSave = deleteSave;
window.displaySaves = displaySaves;
window.validateSaveData = validateSaveData;
window.displayLoadGameInterface = displayLoadGameInterface;
