function handleCommand(command, gameState) {
  try {
    const parts = command.trim().toLowerCase().split(/\s+/);
    const action = parts[0];
    const params = parts.slice(1);

    // Basic command validation
    if (!action) {
      outputToDisplay("Please enter a command. Type 'help' for available commands.");
      return;
    }

    // Help command handling
    if (action === 'help' || action === '?') {
      displayHelp(params.join(' '));
      return;
    }

    // Validate game state
    if (!validateGameState(command, gameState)) {
      return;
    }

    // Command processing
    switch (action) {
      // Time management
      case 'advance':
        if (params[0] === 'time') {
          advanceTime(gameState);
        } else {
          outputToDisplay("Usage: advance time");
        }
        break;

      // Market commands
      case 'market':
      case 'marketing':
        handleMarketCommand(params, gameState);
        break;

      // Save/Load commands
      case 'save':
        if (params[0] === 'game') {
          const saveName = params[1] || prompt("Enter a name for this save:");
          if (saveName) {
            saveGame(gameState, saveName);
          }
        } else {
          outputToDisplay("Usage: save game [name]");
        }
        break;

      case 'load':
        if (params[0] === 'game') {
          const saveName = params[1] || prompt("Enter the name of the save to load:");
          if (saveName) {
            loadGame(saveName, gameState);
          }
        } else {
          outputToDisplay("Usage: load game [name]");
        }
        break;

      // Status commands
      case 'check':
        handleStatusCommand(params, gameState);
        break;

      // Project commands
      case 'start':
        handleStartGame(params, gameState);
        break;

      case 'subgenre':
        handleSubgenreSelection(params, gameState);
        break;

      case 'select':
      case 'element':
        handleElementSelection(action, params, gameState);
        break;

      case 'name':
        handleProjectNaming(params, gameState);
        break;

      case 'target':
        handleTargetAudience(params, gameState);
        break;

      case 'priority':
        handlePriorityCommand(params, gameState);
        break;

      // Development commands
      case 'test':
        if (!validatePhase(gameState, 'testing')) break;
        handleTestingPhase(gameState, params[0]);
        break;

      case 'fix':
        if (!validatePhase(gameState, 'release')) {  
          outputToDisplay("This command can only be used during the release phase.");
          return;
        }
        handleBugFixing(gameState);
        break;

      // Management commands
      case 'staff':
        handleStaffCommand(params, gameState);
        break;

      case 'hire':
        handleHireCommand(params, gameState);
        break;

      case 'fire':
        if (params.length === 0) {
          outputToDisplay("Usage: fire [staff number]");
          outputToDisplay("View staff numbers with 'staff' command");
          return;
        }
        let fireStaffId = parseInt(params[0]) - 1;
        if (isNaN(fireStaffId) || fireStaffId < 0 || fireStaffId >= gameState.staff.length) {
          outputToDisplay("Invalid staff number. Use 'staff' to see the full roster.");
          return;
        }
        handleFireStaff([params[0]], gameState);
        break;

      case 'train':
        if (params.length < 2) {
          outputToDisplay("Usage: train [staff number] [skill]");
          return;
        }
        let trainStaffId = parseInt(params[0]) - 1;
        if (isNaN(trainStaffId) || trainStaffId < 0 || trainStaffId >= gameState.staff.length) {
          outputToDisplay("Invalid staff number. Use 'staff' to see the roster.");
          return;
        }
        handleTraining(gameState.staff[trainStaffId], params[1], gameState);
        break;

      case 'research':
        handleResearchCommand(params, gameState);
        break;

      case 'exit':
        // Autosave first, but suppress its notification
        saveGame(gameState, null, true, true); // Added fourth parameter to suppress notification
        
        // Reset game state
        Object.assign(gameState, {
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
        });

        // Clear game output
        const outputDiv = document.querySelector('.game-output');
        if (outputDiv) {
          outputDiv.innerHTML = '';
          createMessageContainer(outputDiv);
        }

        // Show main menu
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
        
        outputToDisplay("Game saved and exited to main menu.");
        
        // Show a single notification with a slight delay to ensure smooth transition
        setTimeout(() => {
          showNotification('Game saved and exited to main menu!');
        }, 100);
        break;

      case 'reputation':
        displayReputation(gameState);
        break;

      case 'release':
        if (params[0] === 'confirm' && gameState.project?.bugs > 0) {
          proceedWithRelease(gameState);
        } else {
          handleReleaseCommand(gameState);
        }
        break;

      case 'launch':
        if (gameState.project?.phase === 'release') {
          handlePolishPhase(gameState, 'launch', params);
        } else {
          outputToDisplay("Launch window can only be set during the polish phase.");
        }
        break;

      case 'optimize':
        if (gameState.project?.phase === 'release') {
          handlePolishPhase(gameState, 'optimize', params);
        } else {
          outputToDisplay("Optimization can only be done during the polish phase.");
        }
        break;

      // Navigation commands
      case 'back':
        handleBackCommand(gameState);
        break;

      case 'cancel':
        if (gameState.project) {
          const confirm = window.confirm("Cancel current project? This cannot be undone.");
          if (confirm) {
            const lostInvestment = gameState.project.budget;
            gameState.moneyAmount -= lostInvestment; 
      
            outputToDisplay("=== Project Cancelled ===");
            outputToDisplay(`Cancelled project: ${gameState.project.name}`);
            outputToDisplay(`Lost investment: $${lostInvestment}`);
      
            // Reset project state
            gameState.project = null;
            // Clear any temporary project data
            if (gameState.tempProject) {
              delete gameState.tempProject;
            }
      
            // Update UI
            updatePhaseIndicator(null);
            outputToDisplay("\nYou can now start a new project with 'start game [genre]'");

            // Update the status display with new money amount
            updateStatusDisplay(gameState.companyName, gameState.weekNumber, gameState.moneyAmount);
          } else {
            outputToDisplay("Project cancellation aborted.");
          }
        } else if (gameState.tempProject) {
          if (resetProjectCreation(gameState)) {
            outputToDisplay("Project creation cancelled.");
            outputToDisplay("You can start a new project with 'start game [genre]'");
          }
        } else {
          outputToDisplay("No active project to cancel.");
        }
        break;

      case 'confirm':
        handleConfirmCommand(gameState);
        break;

      case 'feature':
        if (!validatePhase(gameState, 'planning')) break;
        handleFeatureCommand(params, gameState);
        break;

      case 'assign':
        if (!validatePhase(gameState, 'planning')) break;
        handleStaffAssignment(params, gameState);
        break;

      case 'allocate':
        if (!validatePhase(gameState, 'planning')) break;
        handleResourceAllocation(params, gameState);
        break;

      case 'milestone':
        if (!validatePhase(gameState, 'planning')) break;
        handleMilestoneCommand(params, gameState);
        break;

      case 'complete':
        if (params[0] === 'planning') {
          completePlanningPhase(gameState);
        } else {
          outputToDisplay("Usage: complete planning");
        }
        break;

      case 'metrics':
        if (!gameState.project) {
          outputToDisplay("No active project. Start a project first.");
          return;
        }
        if (!params[0]) {
          outputToDisplay("Usage: metrics [type] - View specific metrics");
          outputToDisplay("Available types: technical, design, production, market");
          return;
        }
        const metricType = params[0].toLowerCase();
        if (!METRIC_CATEGORIES[metricType]) {
          outputToDisplay("Invalid metric type. Available types:");
          outputToDisplay("- technical: Code quality, performance, bugs");
          outputToDisplay("- design: User experience, gameplay, features");
          outputToDisplay("- production: Team efficiency, milestones, risks");
          outputToDisplay("- market: Audience alignment, competition, timing");
          return;
        }
        displayDetailedMetrics(gameState.project);
        break;

      case 'workspace':
        handleWorkspaceCommand(params, gameState);
        break;

      case 'raise':
        if (params.length < 2) {
          outputToDisplay("Usage: raise [staff number] [amount]");
          return;
        }
        let raiseStaffId = parseInt(params[0]) - 1;
        let raiseAmount = parseInt(params[1]);
        if (isNaN(raiseStaffId) || raiseStaffId < 0 || raiseStaffId >= gameState.staff.length) {
          outputToDisplay("Invalid staff number. Use 'staff' to see the roster.");
          return;
        }
        handleRaise(gameState.staff[raiseStaffId], raiseAmount, gameState);
        break;

      default:
        outputToDisplay(`Unknown command: '${action}'. Type 'help' for available commands.`);
    }

    // Always update phase indicator if project exists
    if (gameState.project) {
      updatePhaseIndicator(gameState.project);
    }

  } catch (error) {
    handleError(error, command, gameState);
  }
}

function validatePhase(gameState, requiredPhase) {
  if (!gameState.project) {
    outputToDisplay("No active project.");
    return false;
  }
  if (gameState.project.phase !== requiredPhase) {
    outputToDisplay(`This command can only be used during the ${requiredPhase} phase.`);
    return false;
  }
  return true;
}

function handleMarketCommand(params, gameState) {
  if (!gameState.marketTrends) {
    gameState.marketTrends = initializeMarketTrends(gameState);
  }

  if (params.length === 0) {
    displayMarketReport(gameState);
    return;
  }

  switch(params[0]) {
    case 'trends':
      displayMarketTrends(gameState);
      break;
    case 'report':
      displayMarketReport(gameState);
      break;
    case 'strategy':
      handleMarketingStrategy(params.slice(1), gameState);
      break;
    default:
      outputToDisplay("Available market commands:");
      outputToDisplay("- market trends - Show current market trends");
      outputToDisplay("- market report - Detailed market analysis");
      outputToDisplay("- market strategy [type] - Set marketing approach");
  }
}

function handleStatusCommand(params, gameState) {
  switch (params[0]) {
    case 'status':
      if (gameState.project) {
        displayProjectStatus(gameState.project);
      } else {
        displayCompanyStatus(gameState);
      }
      break;
    case 'history':
      displayGameHistory(gameState);
      break;
    default:
      outputToDisplay("Usage: check [status/history]");
  }
}

function handleStartGame(params, gameState) {
  if (params.length < 1 || params[0].toLowerCase() !== 'game') {
    outputToDisplay("Usage: start game [genre]");
    displayAvailableGenres();
    return;
  }

  const genreInput = params[1];
  
  if (!genreInput) {
    outputToDisplay("Usage: start game [genre]");
    displayAvailableGenres();
    return;
  }

  const selectedGenre = validateGenreInput(genreInput);
  if (!selectedGenre) {
    outputToDisplay("Invalid genre. Available genres:");
    displayAvailableGenres();
    return;
  }

  if (gameState.project) {
    outputToDisplay("Already developing a game. Complete or cancel current project first.");
    return;
  }

  // Initialize tempProject if it doesn't exist
  gameState.tempProject = {};

  const genreData = getGenreData(selectedGenre);
  if (!genreData) {
    outputToDisplay("Error: Invalid genre data");
    return;
  }

  // Set the initial project data
  gameState.tempProject = {
    genre: selectedGenre,
    genreName: genreData.name,
    step: PROJECT_STEPS.GENRE
  };

  // Display subgenre selection
  outputToDisplay(`\nSelected genre: ${genreData.name}`);
  outputToDisplay("Choose a subgenre:");
  Object.entries(genreData.subgenres).forEach(([key, data]) => {
    outputToDisplay(`- ${data.name} (use: subgenre ${key})`);
    outputToDisplay(`  ${data.description}`);
  });
}

function handleSubgenreSelection(params, gameState) {
  const validation = validateSequentialState(PROJECT_STEPS.SUBGENRE, gameState);
  if (!validation.valid) {
    outputToDisplay(validation.error);
    return;
  }

  const subgenre = params[0];
  if (!subgenre) {
    outputToDisplay("Usage: subgenre [type]");
    return;
  }

  const subgenreData = getSubgenreData(gameState.tempProject.genre, subgenre);
  if (!subgenreData) {
    outputToDisplay("Invalid subgenre. Available subgenres:");
    const genreData = getGenreData(gameState.tempProject.genre);
    Object.entries(genreData.subgenres).forEach(([key, data]) => {
      outputToDisplay(`- ${data.name} (${key})`);
    });
    return;
  }

  gameState.tempProject.subgenre = subgenre;
  gameState.tempProject.subgenreName = subgenreData.name;
  
  outputToDisplay(`\nSelected subgenre: ${subgenreData.name}`);
  outputToDisplay("Choose 3 gameplay elements:");
  subgenreData.elements.forEach((element, index) => {
    outputToDisplay(`${index + 1}. ${element}`);
  });
  outputToDisplay("\nUse 'select 1,2,3' to choose elements");
}

function handleElementSelection(action, params, gameState) {
  const validation = validateSequentialState(PROJECT_STEPS.FEATURES, gameState);
  if (!validation.valid) {
    outputToDisplay(validation.error);
    return;
  }

  // Convert selection input to array of numbers
  const selections = action === 'select' ? 
    params.join('').split(',').map(Number) :
    [parseInt(params[0])];

  if (selections.some(isNaN)) {
    outputToDisplay("Invalid format. Use numbers separated by commas (e.g., 'select 1,3,5')");
    return;
  }

  const subgenreData = getSubgenreData(gameState.tempProject.genre, gameState.tempProject.subgenre);
  if (!subgenreData) {
    outputToDisplay("Error: Invalid subgenre data");
    return;
  }

  // Validate selections
  if (selections.length !== 3 || 
      new Set(selections).size !== 3 || 
      selections.some(n => n < 1 || n > subgenreData.elements.length)) {
    outputToDisplay(`Please select exactly three different numbers between 1 and ${subgenreData.elements.length}`);
    return;
  }

  // Store selected elements
  gameState.tempProject.elements = selections.map(n => subgenreData.elements[n - 1]);

  outputToDisplay("\nSelected elements:");
  gameState.tempProject.elements.forEach(element => {
    outputToDisplay(`- ${element}`);
  });

  // Proceed to naming
  outputToDisplay("\nEnter project name using 'name [project name]'");
}

function handleProjectNaming(params, gameState) {
  const validation = validateSequentialState(PROJECT_STEPS.NAME, gameState);
  if (!validation.valid) {
    outputToDisplay(validation.error);
    return;
  }

  const projectName = params.join(' ');
  if (!projectName || projectName.length < 3) {
    outputToDisplay("Please enter a valid project name (minimum 3 characters)");
    return;
  }

  gameState.tempProject.projectName = projectName;

  // Calculate and display project estimates
  const stats = calculateProjectStats(
    gameState.tempProject.genre,
    gameState.tempProject.subgenre,
    gameState.tempProject.elements,
    gameState
  );

  gameState.tempProject.estimates = stats;

  outputToDisplay("\n=== Project Summary ===");
  outputToDisplay(`Name: ${projectName}`);
  outputToDisplay(`Genre: ${gameState.tempProject.genreName}`);
  outputToDisplay(`Subgenre: ${gameState.tempProject.subgenreName}`);
  outputToDisplay("\nResource Requirements:");
  outputToDisplay(`Initial Budget: $${stats.initialBudget}`);
  outputToDisplay(`Weekly Maintenance: $${stats.weeklyMaintenance}`);
  outputToDisplay(`Estimated Timeline: ${stats.estimatedWeeks} weeks`);
  
  // Show warnings if resources are insufficient
  if (stats.initialBudget > gameState.moneyAmount) {
    outputToDisplay("\nWARNING: Insufficient funds for project start!");
    outputToDisplay(`Required: $${stats.initialBudget}`);
    outputToDisplay(`Available: $${gameState.moneyAmount}`);
  }

  outputToDisplay("\nType 'confirm' to start project or 'back' to make changes");
}

function handleConfirmCommand(gameState) {
  if (!gameState.tempProject || !validateProjectSetup(gameState.tempProject)) {
    outputToDisplay("Cannot confirm - project setup is incomplete");
    return;
  }

  try {
    gameState.project = initializeProject(gameState.tempProject, gameState);
    delete gameState.tempProject;
    
    outputToDisplay("\nProject initialized successfully!");
    outputToDisplay("Choose development priority:");
    outputToDisplay("- quality: Focus on polish (slower but better quality)");
    outputToDisplay("- balanced: Standard approach");
    outputToDisplay("- speed: Focus on fast development (faster but lower quality)");
    outputToDisplay("\nUse 'priority [type]' to set development focus");
    
  } catch (error) {
    handleError(error, 'confirm', gameState);
  }
}

function handleBackCommand(gameState) {
  if (!gameState.tempProject) {
    outputToDisplay("No project in progress.");
    return;
  }

  const previousStep = goToPreviousStep(gameState);
  if (previousStep) {
    outputToDisplay(`Returned to ${getStepDescription(previousStep)}`);
  }
}

function handleCancelCommand(gameState) {
  if (resetProjectCreation(gameState)) {
    outputToDisplay("Project creation cancelled.");
  }
}

function handleResearchCommand(params, gameState) {
  if (params[0] === 'view') {
    displayTechnologies(gameState);
  } else if (params[0] === 'buy' && params[1]) {
    purchaseTechnology(gameState, params[1]);
  } else {
    outputToDisplay("Usage: research view - Show available technologies");
    outputToDisplay("       research buy [tech-id] - Purchase technology");
  }
}

function handleTargetAudience(params, gameState) {
  // target audience logic here
}

function handleMarketingBudget(params, gameState) {
  const budget = parseInt(params[0]);
  if (isNaN(budget) || budget < 0) {
    outputToDisplay("Usage: market budget [amount]");
    return;
  }
  
  if (budget > gameState.moneyAmount) {
    outputToDisplay("Insufficient funds for marketing budget!");
    return;
  }
  
  gameState.project.marketingBudget = budget;
  gameState.moneyAmount -= budget;
  outputToDisplay(`Marketing budget set to: $${budget}`);
  
  // Show estimated impact
  const impact = calculateMarketingImpact(budget, gameState);
  outputToDisplay("\nEstimated Impact:");
  outputToDisplay(`Market Reach: +${impact.reachBonus}%`);
  outputToDisplay(`Sales Potential: +${impact.salesBonus}%`);
}

function calculateMarketingImpact(budget, gameState) {
  const baseReach = Math.log10(budget + 1) * 10;
  const marketPresence = gameState.reputation?.marketPresence || 0;
  const reachBonus = Math.floor(baseReach * (1 + marketPresence));
  const salesBonus = Math.floor(baseReach * 0.7);
  const roi = ((salesBonus / 100) * gameState.project.budget) / budget;

  return {
    reachBonus,
    salesBonus,
    roi: roi.toFixed(1)
  };
}

function handleFeatureCommand(params, gameState) {
  if (!params[0] || !params[1]) {
    outputToDisplay("Usage: feature add [name] [size](small/medium/large)");
    return;
  }

  const [action, ...nameParts] = params;
  const size = nameParts.pop();
  const name = nameParts.join(' ');

  if (action !== 'add') {
    outputToDisplay("Invalid feature command. Use 'feature add [name] [size]'");
    return;
  }

  if (!['small', 'medium', 'large'].includes(size)) {
    outputToDisplay("Invalid size. Use 'small', 'medium', or 'large'");
    return;
  }

  const decision = {
    type: 'feature',
    feature: name,
    size: size
  };

  gameState.project = updateProjectPlan(gameState.project, decision);
  outputToDisplay(`Added ${size} feature: ${name}`);
  displayPlanningStatus(gameState.project);
}

function handleStaffAssignment(params, gameState) {
  if (params.length < 3) {
    outputToDisplay("Usage: assign [staff_id] [role] [allocation]");
    return;
  }

  const [staffId, role, allocation] = params;
  const allocationPercent = parseInt(allocation);

  if (isNaN(allocationPercent) || allocationPercent < 0 || allocationPercent > 100) {
    outputToDisplay("Allocation must be between 0 and 100 percent");
    return;
  }

  const decision = {
    type: 'staff',
    staffId: staffId,
    role: role,
    allocation: allocationPercent
  };

  gameState.project = updateProjectPlan(gameState.project, decision);
  outputToDisplay(`Assigned staff member ${staffId} to ${role} at ${allocationPercent}%`);
  displayPlanningStatus(gameState.project);
}

function handleResourceAllocation(params, gameState) {
  if (params.length < 2) {
    outputToDisplay("Usage: allocate [resource] [amount]");
    return;
  }

  const [resource, amount] = params;
  const allocation = parseInt(amount);

  if (isNaN(allocation) || allocation < 0 || allocation > 100) {
    outputToDisplay("Allocation must be between 0 and 100 percent");
    return;
  }

  const decision = {
    type: 'resource',
    resource: resource,
    amount: allocation
  };

  gameState.project = updateProjectPlan(gameState.project, decision);
  outputToDisplay(`Set ${resource} allocation to ${allocation}%`);
  displayPlanningStatus(gameState.project);
}

function handleMilestoneCommand(params, gameState) {
  if (params[0] !== 'add' || params.length < 3) {
    outputToDisplay("Usage: milestone add [week] [name]");
    return;
  }

  const [_, weekStr, ...nameParts] = params;
  const week = parseInt(weekStr);
  const name = nameParts.join(' ');

  if (isNaN(week) || week < 1) {
    outputToDisplay("Week must be a positive number");
    return;
  }

  const decision = {
    type: 'milestone',
    name: name,
    week: week,
    goals: []
  };

  gameState.project = updateProjectPlan(gameState.project, decision);
  outputToDisplay(`Added milestone: ${name} for week ${week}`);
  displayPlanningStatus(gameState.project);
}

function completePlanningPhase(gameState) {
  if (!gameState.project?.planningData) {
    outputToDisplay("No project in planning phase");
    return;
  }

  // Validate minimum requirements
  const validation = validatePlanningCompletion(gameState.project); 
  if (!validation.valid) {
    outputToDisplay("Cannot complete planning phase:");
    validation.errors.forEach(error => outputToDisplay(`- ${error}`));
    return;
  }

  // Transition to development phase
  gameState.project.phase = 'development';
  gameState.project.phaseProgress = 0;
  outputToDisplay("\n=== Planning Phase Complete ===");
  outputToDisplay("Project is now entering development phase!");
  displayPlanningStatus(gameState.project);
}

function validatePlanningCompletion(project) {
  const errors = [];
  const planningData = project.planningData;

  if (planningData.features.length === 0) {
    errors.push("No features planned");
  }

  if (planningData.assignedStaff.length === 0) {
    errors.push("No staff assigned");
  }

  const totalAllocation = Object.values(planningData.resourceAllocation)
    .reduce((sum, val) => sum + val, 0);
  if (totalAllocation === 0) {
    errors.push("No resources allocated");
  }

  if (planningData.milestones.length === 0) {
    errors.push("No milestones set");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function handlePriorityCommand(params, gameState) {
  if (!gameState.project) {
    outputToDisplay("No active project. Start a project first.");
    return;
  }

  const priority = params[0]?.toLowerCase();
  const validPriorities = ['quality', 'balanced', 'speed'];

  if (!priority || !validPriorities.includes(priority)) {
    outputToDisplay("Please specify a valid development priority:");
    outputToDisplay("- quality: Focus on polish (slower but better quality)");
    outputToDisplay("- balanced: Standard approach");
    outputToDisplay("- speed: Focus on fast development (faster but lower quality'");
    return;
  }

  const priorityData = DEVELOPMENT_PRIORITIES[priority];
  gameState.project.priority = priority;
  
  // Apply priority effects to game modifiers
  Object.entries(priorityData.effects).forEach(([effect, value]) => {
    if (!gameState.modifiers[effect]) {
      gameState.modifiers[effect] = 1;
    }
    gameState.modifiers[effect] *= value;
  });
  
  outputToDisplay(`\n=== Development Priority: ${priorityData.name} ===`);
  outputToDisplay("\nEffects applied:");
  Object.entries(priorityData.effects).forEach(([effect, value]) => {
    const changePercent = ((value - 1) * 100).toFixed(0);
    const direction = changePercent >= 0 ? "+" : "";
    outputToDisplay(`- ${formatEffectName(effect)}: ${direction}${changePercent}%`);
  });

  if (priority === 'speed') {
    outputToDisplay("\nWarning: Speed focus may increase bug rate and reduce quality!");
  } else if (priority === 'quality') {
    outputToDisplay("\nNote: Quality focus will extend development time but produce better results.");
  }

  gameState.project.completedMilestones.push('priority_set');
  checkPhaseCompletion(gameState);
}

function formatEffectName(effect) {
  return effect.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function handleWorkspaceCommand(params, gameState) {
  if (!params || params.length === 0) {
    displayWorkspaceStatus(gameState);
    return;
  }

  const action = params[0].toLowerCase();

  switch(action) {
    case 'view':
      displayWorkspaceStatus(gameState);
      break;
    case 'upgrade':
      handleWorkspaceUpgrade(gameState);
      break;
    default:
      outputToDisplay("Usage: workspace [view/upgrade]");
      outputToDisplay("- view: Show current workspace details");
      outputToDisplay("- upgrade: Upgrade to next workspace tier");
  }
}

function displayWorkspaceStatus(gameState) {
  const currentWorkspace = WORKSPACES[gameState.workspace];
  const nextWorkspace = getNextWorkspace(gameState.workspace);

  outputToDisplay("\n=== Workspace Status ===");
  outputToDisplay(`Current: ${formatWorkspaceName(gameState.workspace)}`);
  outputToDisplay(`Staff Capacity: ${gameState.staff.length}/${currentWorkspace.capacity} positions`);
  outputToDisplay(`Productivity Modifier: +${((currentWorkspace.productivity - 1) * 100).toFixed(0)}%`);
  outputToDisplay(`Monthly Cost: $${currentWorkspace.cost}`);

  if (nextWorkspace) {
    outputToDisplay("\nNext Available Upgrade:");
    outputToDisplay(`${formatWorkspaceName(nextWorkspace.key)}`);
    outputToDisplay(`- Capacity: ${nextWorkspace.capacity} positions`);
    outputToDisplay(`- Productivity: +${((nextWorkspace.productivity - 1) * 100).toFixed(0)}%`);
    outputToDisplay(`- Upgrade Cost: $${nextWorkspace.cost}`);
    outputToDisplay("\nUse 'workspace upgrade' to upgrade");
  } else {
    outputToDisplay("\nMaximum workspace level reached!");
  }
}

function handleWorkspaceUpgrade(gameState) {
  const nextWorkspace = getNextWorkspace(gameState.workspace);
  
  if (!nextWorkspace) {
    outputToDisplay("Already at maximum workspace level!");
    return;
  }

  if (gameState.moneyAmount < nextWorkspace.cost) {
    outputToDisplay(`Insufficient funds for upgrade!`);
    outputToDisplay(`Required: $${nextWorkspace.cost}`);
    outputToDisplay(`Available: $${gameState.moneyAmount}`);
    return;
  }

  // Apply upgrade
  gameState.moneyAmount -= nextWorkspace.cost;
  gameState.workspace = nextWorkspace.key;

  outputToDisplay("\n=== Workspace Upgraded! ===");
  outputToDisplay(`New Workspace: ${formatWorkspaceName(nextWorkspace.key)}`);
  outputToDisplay(`Staff Capacity: ${nextWorkspace.capacity} positions`);
  outputToDisplay(`Productivity Bonus: +${((nextWorkspace.productivity - 1) * 100).toFixed(0)}%`);
  
  // Update status display
  updateStatusDisplay(gameState.companyName, gameState.weekNumber, gameState.moneyAmount);
}

function getNextWorkspace(currentWorkspace) {
  const workspaceOrder = ['home office', 'small studio', 'medium office', 'large studio'];
  const currentIndex = workspaceOrder.indexOf(currentWorkspace);
  
  if (currentIndex === -1 || currentIndex === workspaceOrder.length - 1) {
    return null;
  }

  const nextKey = workspaceOrder[currentIndex + 1];
  return { key: nextKey, ...WORKSPACES[nextKey] };
}

function formatWorkspaceName(workspace) {
  return workspace.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function displayAvailableGenres() {
  outputToDisplay("\nAvailable Genres:");
  Object.entries(GENRE_DATA).forEach(([key, data], index) => {
    outputToDisplay(`\n${index + 1}. ${data.name}`);
    outputToDisplay(`   ${data.description}`);
    outputToDisplay(`   Base Cost: ${data.baseCost}x | Market Size: ${data.marketSize * 100}%`);
    outputToDisplay(`   Fan Loyalty: ${data.fanLoyalty * 100}%`);
  });
  outputToDisplay("\nUse 'start game [genre]' or 'start game [number]' to begin");
}

function handlePolishPhase(gameState, command, params) {
  if (!validatePhase(gameState, 'release')) {
    return false;
  }

  switch(command) {
    case 'fix':
      handleBugFixing(gameState);
      break;
    case 'release':
      handleReleaseCommand(gameState);
      break;
    default:
      displayPolishOptions(gameState);
  }

  return true;
}

function displayPolishOptions(gameState) {
  outputToDisplay("\n=== Polish Phase Options ===");
  
  if (gameState.project.bugs > 0) {
    outputToDisplay("\nBugs Remaining:");
    const severity = gameState.project.testingMetrics.bugSeverity;
    outputToDisplay(`Critical: ${severity.critical}`);
    outputToDisplay(`Major: ${severity.major}`);
    outputToDisplay(`Minor: ${severity.minor}`);
    outputToDisplay("\nCommands:");
    outputToDisplay("- fix bugs - Continue fixing bugs");
    outputToDisplay("- release - Release game with current bugs");
  } else {
    outputToDisplay("\n All bugs fixed!");
    outputToDisplay("Use 'release' command to launch your game");
  }
}

function handleReleaseCommand(gameState) {
  if (!gameState.project || gameState.project.phase !== 'release') {
    outputToDisplay("Not ready for release yet!");
    return;
  }

  // Show warning if there are remaining bugs
  if (gameState.project.bugs > 0) {
    const severity = gameState.project.testingMetrics.bugSeverity;
    outputToDisplay("\n=== Release Warning ===");
    outputToDisplay("There are still unfixed bugs in the project:");
    outputToDisplay(`- Critical: ${severity.critical}`);
    outputToDisplay(`- Major: ${severity.major}`);
    outputToDisplay(`- Minor: ${severity.minor}`);
    outputToDisplay("\nReleasing with bugs will impact:");
    outputToDisplay("- Game quality and reviews");
    outputToDisplay("- Sales potential");
    outputToDisplay("- Company reputation");
    outputToDisplay("\nType 'release confirm' to release anyway, or continue fixing bugs.");
    return;
  }

  proceedWithRelease(gameState);
}

window.handleCommand = handleCommand;
window.displayAvailableGenres = displayAvailableGenres;
