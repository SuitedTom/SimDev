function initializeGameState() {
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

// Update gameState validation function
function validateGameState(command, gameState) {
  // Ensure gameState exists and has required properties
  if (!gameState) {
    console.error('Game state is undefined');
    return false;
  }

  const requiredProperties = [
    'companyName',
    'weekNumber',
    'moneyAmount',
    'reputation',
    'workspace'
  ];

  const missingProperties = requiredProperties.filter(prop => !gameState.hasOwnProperty(prop));
  if (missingProperties.length > 0) {
    console.error('Missing required game state properties:', missingProperties);
    gameState = { ...gameState, ...initializeGameState() };
  }

  // Ensure reputation object is properly initialized
  if (!gameState.reputation || !gameState.reputation.casual || !gameState.reputation.hardcore || !gameState.reputation.critics) {
    gameState.reputation = {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    };
  }

  // Command-specific validation
  const projectState = validateProjectState(gameState);
  
  switch(command.split(' ')[0]) {
    case 'start':
      if (!projectState.canStartNewProject) {
        if (projectState.hasActiveProject) {
          outputToDisplay("Already working on a project. Use 'cancel' to abandon current project.");
        } else {
          outputToDisplay("Project creation in progress. Use 'cancel' to start over.");
        }
        return false;
      }
      break;
      
    case 'cancel':
      if (!projectState.hasActiveProject && !projectState.hasTemporaryProject) {
        outputToDisplay("No project to cancel.");
        return false;
      }
      break;
  }
  
  return true;
}

// Export the initialization function
window.initializeGameState = initializeGameState;

let polishPhaseHandlers = {
  marketing: handleMarketingDecision,
  launch: handleLaunchWindow, 
  optimize: handleOptimization,
  release: handleGameRelease
};

function getGenreData(genre) {
  if (!genre) return null;
  return GENRE_DATA[genre.toLowerCase()];
}

function getSubgenreData(genre, subgenre) {
  if (!genre || !subgenre) return null;
  const genreData = getGenreData(genre);
  return genreData ? genreData.subgenres[subgenre.toLowerCase()] : null;
}

function calculateProjectStats(genre, subgenre, elements, gameState) {
  // Input validation with detailed errors
  if (!genre || !subgenre || !elements) {
    console.error('Missing required parameters:', { genre, subgenre, elements });
    throw new Error("Incomplete project parameters");
  }

  const subgenreData = getSubgenreData(genre, subgenre);
  if (!subgenreData) {
    console.error('Invalid subgenre data for:', { genre, subgenre });
    throw new Error("Invalid genre/subgenre combination");
  }

  // Base calculations
  let costMultiplier = subgenreData.baseCost || 1;
  let timeMultiplier = subgenreData.baseTime || 1;
  
  // Resource multipliers based on genre
  const genreData = getGenreData(genre);
  costMultiplier *= genreData.baseCost;
  timeMultiplier *= genreData.baseTime;

  // Calculate element complexity
  if (Array.isArray(elements)) {
    elements.forEach((element) => {
      costMultiplier += 0.1;
      timeMultiplier += 0.1;
    });
  }

  // Apply technology modifiers
  const developmentCost = gameState?.modifiers?.development_cost || 1;
  const developmentSpeed = gameState?.modifiers?.development_speed || 1;

  costMultiplier *= developmentCost;
  timeMultiplier /= developmentSpeed;

  // Calculate resource requirements
  const initialBudget = Math.floor(1000 * costMultiplier);
  const weeklyMaintenance = Math.floor(100 * costMultiplier);
  const estimatedWeeks = Math.floor(16 * timeMultiplier);
  const totalCost = initialBudget + (weeklyMaintenance * estimatedWeeks);

  return {
    initialBudget,
    weeklyMaintenance,
    estimatedWeeks,
    totalCost,
    resourceRequirements: {
      minimumStaff: Math.ceil(costMultiplier * 0.5),
      recommendedStaff: Math.ceil(costMultiplier),
      workspaceRequired: calculateWorkspaceRequirement(costMultiplier)
    }
  };
}

function calculateWorkspaceRequirement(complexity) {
  if (complexity <= 1) return 'home office';
  if (complexity <= 2) return 'small studio';
  if (complexity <= 3) return 'medium office';
  return 'large studio';
}

function validateProjectRequirements(stats, gameState) {
  // Initialize issues as an array to prevent "filter is not a function" error
  const issues = [];

  // Check financial requirements
  if (gameState.moneyAmount < stats.initialBudget) {
    issues.push({
      type: 'critical',
      message: `Insufficient funds: Need $${stats.initialBudget}, have $${gameState.moneyAmount}`,
      shortfall: stats.initialBudget - gameState.moneyAmount
    });
  }

  // Check workspace requirements
  const currentWorkspace = WORKSPACES[gameState.workspace];
  const requiredWorkspace = WORKSPACES[stats.resourceRequirements.workspaceRequired];
  if (currentWorkspace.capacity < stats.resourceRequirements.minimumStaff) {
    issues.push({
      type: 'warning',
      message: `Workspace too small: Need capacity for ${stats.resourceRequirements.minimumStaff} staff`,
      recommendation: `Consider upgrading to ${stats.resourceRequirements.workspaceRequired}`
    });
  }

  // Check staff requirements
  const currentStaff = gameState.staff.length;
  if (currentStaff < stats.resourceRequirements.minimumStaff) {
    issues.push({
      type: 'warning',
      message: `Understaffed: Have ${currentStaff}, need ${stats.resourceRequirements.minimumStaff}`,
      shortfall: stats.resourceRequirements.minimumStaff - currentStaff
    });
  }

  // Check ongoing costs
  const weeklyIncome = estimateWeeklyIncome(gameState);
  const weeklyCosts = stats.weeklyMaintenance + calculateStaffCosts(gameState);
  if (weeklyIncome < weeklyCosts) {
    issues.push({
      type: 'warning',
      message: `Weekly costs ($${weeklyCosts}) exceed estimated income ($${weeklyIncome})`,
      shortfall: weeklyCosts - weeklyIncome
    });
  }

  // Ensure we return an array even if there are no issues
  return issues;
}

function estimateWeeklyIncome(gameState) {
  // Simple estimation based on company stats
  return 1000 * (1 + (gameState.reputation.marketPresence || 0));
}

function calculateStaffCosts(gameState) {
  return gameState.staff.reduce((total, staff) => total + staff.salary, 0);
}

function calculateGameSuccess(project) {
  let successScore = 0;
  const genreData = GENRE_DATA[project.genre.toLowerCase()];
  const subgenreData = genreData?.subgenres[project.subgenre.toLowerCase()];
  
  if (genreData && subgenreData) {
    successScore += (genreData.marketSize * 20);
    successScore += (genreData.fanLoyalty * 15);
    successScore += (subgenreData.elements.length * 5);
    
    const qualityBonus = (project.budget / (1000 * subgenreData.baseCost)) * 10;
    const timeBonus = Math.max(0, 20 - (project.estimatedCompletionWeeks - (project.progress / 10)));
    
    successScore += qualityBonus + timeBonus;
  }
  
  return Math.max(0, Math.floor(successScore));
}

function validateGenreSelection(input, gameState) {
  // Handle numeric selection
  if (!input) {
    const index = parseInt(input) - 1;
    const genres = Object.keys(GENRE_DATA);
    if (index >= 0 && index < genres.length) {
      return genres[index];
    }
  }
  
  // Handle text selection
  const genreName = input.toLowerCase();
  if (GENRE_DATA[genreName]) {
    return genreName;
  }
  
  return null;
}

function validateSubgenreSelection(input, genre, gameState) {
  const genreData = getGenreData(genre);
  if (!genreData) return null;
  
  // Handle numeric selection
  if (!isNaN(input)) {
    const index = parseInt(input) - 1;
    const subgenres = Object.keys(genreData.subgenres);
    if (index >= 0 && index < subgenres.length) {
      return subgenres[index];
    }
  }
  
  // Handle text selection
  const subgenreName = input.toLowerCase();
  if (genreData.subgenres[subgenreName]) {
    return subgenreName;
  }
  
  return null;
}

function validateGenreInput(genre) {
  if (!genre) return null;
  
  // Handle numeric selection
  if (!isNaN(genre)) {
    const index = parseInt(genre) - 1;
    const genres = Object.keys(GENRE_DATA);
    if (index >= 0 && index < genres.length) {
      return genres[index];
    }
  }
  
  // Handle text selection
  return GENRE_DATA[genre.toLowerCase()] ? genre.toLowerCase() : null;
}

function validateProjectSetup(projectData) {
  const requiredFields = [
    'genre',
    'genreName',
    'subgenre',
    'subgenreName',
    'elements',
    'projectName',
    'estimates'
  ];

  const missing = requiredFields.filter(field => !projectData[field]);
  
  if (missing.length > 0) {
    outputToDisplay("Project setup incomplete. Missing:");
    missing.forEach(field => {
      outputToDisplay(`- ${formatFieldName(field)}`);
    });
    outputToDisplay("\nPlease complete all required information.");
    return false;
  }

  if (!Array.isArray(projectData.elements) || projectData.elements.length !== 3) {
    outputToDisplay("Error: Project must have exactly 3 gameplay elements.");
    return false;
  }

  if (projectData.estimates.initialBudget > gameState.moneyAmount) {
    outputToDisplay("Error: Insufficient funds for project start.");
    outputToDisplay(`Required: $${projectData.estimates.initialBudget}`);
    outputToDisplay(`Available: $${gameState.moneyAmount}`);
    return false;
  }

  return true;
}

function formatFieldName(field) {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function initializeProject(projectData, gameState) {
  // Validate all required data
  if (!validateProjectSetup(projectData)) {
    throw new Error("Invalid project setup data");
  }

  // Calculate project stats and validate resources
  const stats = calculateProjectStats(
    projectData.genre,
    projectData.subgenre,
    projectData.elements,
    gameState
  );

  const issues = validateProjectRequirements(stats, gameState);
  // Ensure issues is an array before filtering
  const criticalIssues = Array.isArray(issues) ? issues.filter(issue => issue.type === 'critical') : [];
  
  if (criticalIssues.length > 0) {
    throw new Error(criticalIssues[0].message);
  }

  // Create the project with all necessary properties
  let project = {
    name: projectData.projectName,
    genre: projectData.genreName,
    subgenre: projectData.subgenreName,
    elements: projectData.elements,
    progress: 0,
    phase: 'planning',
    phaseProgress: 0,
    status: 'development',
    budget: stats.initialBudget,
    weeklyMaintenance: stats.weeklyMaintenance,
    teamMorale: 100,
    estimatedCompletionWeeks: stats.estimatedWeeks,
    quality: 1.0,
    features: [],
    bugs: 0,
    targetAudience: '',
    marketingBudget: 0,
    completedMilestones: [],
    developmentHistory: [],
    lastMilestone: 0,
    resourceStats: stats.resourceRequirements,
    issues: Array.isArray(issues) ? issues.filter(issue => issue.type === 'warning') : [],
    startDate: gameState.weekNumber,
    metrics: {
      totalCost: 0,
      bugsFixed: 0,
      milestones: 0,
      qualityScore: 100
    }
  };

  // Initialize planning phase
  project = initializePlanningPhase(project);

  // Display project initialization summary
  outputToDisplay("\n=== Project Initialization ===");
  outputToDisplay(`Project: ${project.name}`);
  outputToDisplay(`Genre: ${project.genre} (${project.subgenre})`);
  outputToDisplay(`Initial Budget: $${project.budget}`);
  outputToDisplay(`Weekly Maintenance: $${project.weeklyMaintenance}`);
  outputToDisplay(`Estimated Timeline: ${project.estimatedCompletionWeeks} weeks`);

  if (Array.isArray(project.issues) && project.issues.length > 0) {
    outputToDisplay("\nWarnings:");
    project.issues.forEach(issue => {
      outputToDisplay(`- ${issue.message}`);
    });
  }

  return project;
}

function initializePlanningPhase(project) {
  // TO DO: Add code for initializing the planning phase
  return project;
}

const PROJECT_STEPS = {
  GENRE: 'genre',
  SUBGENRE: 'subgenre', 
  FEATURES: 'features',
  NAME: 'name',
  BUDGET: 'budget',
  READY: 'ready'
};

const STEP_SEQUENCE = [
  PROJECT_STEPS.GENRE,
  PROJECT_STEPS.SUBGENRE,
  PROJECT_STEPS.FEATURES,
  PROJECT_STEPS.NAME,
  PROJECT_STEPS.BUDGET,
  PROJECT_STEPS.READY
];

function validateSequentialState(step, gameState) {
  if (!gameState.tempProject) {
    return { valid: false, error: "No project in progress. Start with 'start game [genre]'" };
  }

  const currentStepIndex = STEP_SEQUENCE.indexOf(step);
  if (currentStepIndex === -1) {
    return { valid: false, error: "Invalid project step" };
  }

  // Check all previous steps are complete
  for (let i = 0; i < currentStepIndex; i++) {
    const requiredStep = STEP_SEQUENCE[i];
    if (!validateStep(requiredStep, gameState.tempProject)) {
      return { 
        valid: false, 
        error: `Incomplete previous step: ${getStepDescription(requiredStep)}`,
        missingStep: requiredStep
      };
    }
  }

  return { valid: true };
}

function validateStep(step, tempProject) {
  switch (step) {
    case PROJECT_STEPS.GENRE:
      return tempProject.genre && tempProject.genreName;
    case PROJECT_STEPS.SUBGENRE:
      return tempProject.subgenre && tempProject.subgenreName;
    case PROJECT_STEPS.FEATURES:
      return Array.isArray(tempProject.elements) && tempProject.elements.length === 3;
    case PROJECT_STEPS.NAME:
      return tempProject.projectName && tempProject.projectName.length >= 3;
    case PROJECT_STEPS.BUDGET:
      return tempProject.estimates && tempProject.estimates.initialBudget > 0;
    case PROJECT_STEPS.READY:
      return true; // All previous validations passed
    default:
      return false;
  }
}

function getStepDescription(step) {
  const descriptions = {
    [PROJECT_STEPS.GENRE]: "Select game genre",
    [PROJECT_STEPS.SUBGENRE]: "Choose subgenre",
    [PROJECT_STEPS.FEATURES]: "Select game features",
    [PROJECT_STEPS.NAME]: "Set project name",
    [PROJECT_STEPS.BUDGET]: "Calculate budget",
    [PROJECT_STEPS.READY]: "Ready for confirmation"
  };
  return descriptions[step] || "Unknown step";
}

function resetProjectCreation(gameState) {
  if (gameState.tempProject) {
    delete gameState.tempProject;
    return true;
  }
  
  if (gameState.project) {
    gameState.project = null;
    return true;
  }
  
  return false;
}

function goToPreviousStep(gameState) {
  if (!gameState.tempProject) return null;

  const currentStep = getCurrentStep(gameState.tempProject);
  const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
  
  if (currentIndex <= 0) {
    return resetProjectCreation(gameState);
  }

  const previousStep = STEP_SEQUENCE[currentIndex - 1];
  switch (previousStep) {
    case PROJECT_STEPS.GENRE:
      delete gameState.tempProject.subgenre;
      delete gameState.tempProject.subgenreName;
      delete gameState.tempProject.elements;
      delete gameState.tempProject.projectName;
      delete gameState.tempProject.estimates;
      break;
    case PROJECT_STEPS.subgenre:
      delete gameState.tempProject.elements;
      delete gameState.tempProject.projectName;
      delete gameState.tempProject.estimates;
      break;
    case PROJECT_STEPS.FEATURES:
      delete gameState.tempProject.projectName;
      delete gameState.tempProject.estimates;
      break;
    case PROJECT_STEPS.NAME:
      delete gameState.tempProject.estimates;
      break;
  }

  outputToDisplay(`Returning to: ${getStepDescription(previousStep)}`);
  displayCurrentStep(gameState);
  return previousStep;
}

function getCurrentStep(tempProject) {
  for (let step of STEP_SEQUENCE) {
    if (!validateStep(step, tempProject)) {
      return step;
    }
  }
  return PROJECT_STEPS.READY;
}

function displayCurrentStep(gameState) {
  if (!gameState.tempProject) return;

  const currentStep = getCurrentStep(gameState.tempProject);
  outputToDisplay("\n=== Project Creation Progress ===");
  
  STEP_SEQUENCE.forEach((step, index) => {
    const stepIndex = index + 1;
    const isComplete = validateStep(step, gameState.tempProject);
    const isCurrent = step === currentStep;
    
    const status = isComplete ? "✓" : (isCurrent ? "►" : "○");
    outputToDisplay(`${status} ${stepIndex}. ${getStepDescription(step)}`);
  });

  outputToDisplay("\nAvailable Commands:");
  switch(currentStep) {
    case PROJECT_STEPS.GENRE:
      outputToDisplay("'start game [genre]' - Select game genre");
      outputToDisplay("'back' - Cancel project creation");
      break;
    case PROJECT_STEPS.SUBGENRE:
      outputToDisplay("'subgenre [type]' - Choose subgenre");
      outputToDisplay("'back' - Return to genre selection");
      break;
    case PROJECT_STEPS.FEATURES:
      outputToDisplay("'select 1,2,3' - Choose game features");
      outputToDisplay("'back' - Return to subgenre selection");
      break;
    case PROJECT_STEPS.NAME:
      outputToDisplay("'name [project name]' - Set project name");
      outputToDisplay("'back' - Return to feature selection");
      break;
    case PROJECT_STEPS.BUDGET:
      outputToDisplay("'confirm' - Start project development");
      outputToDisplay("'back' - Return to project naming");
      break;
  }

  outputToDisplay("\nType 'status' to see current progress");
  outputToDisplay("Type 'cancel' to abort project creation");
}

function displayGameHistory(gameState) {
  if (!gameState.gameHistory || gameState.gameHistory.length === 0) {
    outputToDisplay("No completed games in history.");
    return;
  }

  outputToDisplay("\n=== Game Development History ===");
  
  gameState.gameHistory.forEach((game, index) => {
    outputToDisplay(`\nGame #${index + 1}`);
    outputToDisplay(`Title: ${game.name || 'Untitled Game'}`);
    outputToDisplay(`Genre: ${game.genre} (${game.subgenre})`);
    outputToDisplay(`Success Score: ${game.successScore}/100`);
    outputToDisplay(`Revenue: $${game.revenue}`);
    
    if (game.targetAudience) {
      outputToDisplay(`Target Audience: ${game.targetAudience}`);
    }
    
    if (game.marketingBudget) {
      outputToDisplay(`Marketing Budget: $${game.marketingBudget}`);
    }

    // Show key features if available
    if (game.elements && game.elements.length > 0) {
      outputToDisplay("Key Features:");
      game.elements.forEach(element => outputToDisplay(`- ${element}`));
    }

    // Show development timeline if available
    if (game.developmentTime) {
      outputToDisplay(`Development Time: ${game.developmentTime} weeks`);
    }

    // Show reception data if available
    if (game.reception) {
      outputToDisplay("\nReception:");
      Object.entries(game.reception).forEach(([audience, score]) => {
        outputToDisplay(`${audience}: ${score}/100`);
      });
    }

    outputToDisplay("───────────────────");
  });

  // Show company progression
  const totalRevenue = gameState.gameHistory.reduce((sum, game) => sum + game.revenue, 0);
  const averageScore = gameState.gameHistory.reduce((sum, game) => sum + game.successScore, 0) / 
    gameState.gameHistory.length;

  outputToDisplay("\nCompany Statistics:");
  outputToDisplay(`Total Games Released: ${gameState.gameHistory.length}`);
  outputToDisplay(`Total Revenue: $${totalRevenue}`);
  outputToDisplay(`Average Success Score: ${averageScore.toFixed(1)}/100`);

  // Show genre expertise
  const genreExpertise = calculateGenreExpertise(gameState);
  if (Object.keys(genreExpertise).length > 0) {
    outputToDisplay("\nGenre Experience:");
    Object.entries(genreExpertise)
      .sort(([,a], [,b]) => b.score - a.score)
      .forEach(([genre, data]) => {
        outputToDisplay(`${genre}: ${getExpertiseLevel(data.score)} (${data.games} games)`);
      });
  }
}

function calculateGenreExpertise(gameState) {
  const genreExpertise = {};

  gameState.gameHistory.forEach(game => {
    const genre = game.genre;
    if (!genreExpertise[genre]) {
      genreExpertise[genre] = {
        score: 0,
        games: 0
      };
    }

    genreExpertise[genre].score += game.successScore;
    genreExpertise[genre].games++;
  });

  Object.keys(genreExpertise).forEach(genre => {
    genreExpertise[genre].score /= genreExpertise[genre].games;
  });

  return genreExpertise;
}

function getExpertiseLevel(score) {
  if (score < 50) return 'Novice';
  if (score < 75) return 'Intermediate';
  return 'Expert';
}

function handleError(error, context, gameState) {
  try {
    console.error('Error:', {
      message: error.message,
      context: context,
      stack: error.stack,
      gameState: {
        hasProject: !!gameState.project,
        hasTempProject: !!gameState.tempProject,
        currentStep: gameState.tempProject ? getCurrentStep(gameState.tempProject) : null,
        moneyAmount: gameState.moneyAmount
      }
    });

    // Create user-friendly error message
    let userMessage = "An error occurred";
    let recoveryOptions = [];

    switch(error.code) {
      case 'INVALID_GENRE':
        userMessage = "Invalid genre selection";
        recoveryOptions = ['View available genres with "help genres"'];
        break;
      case 'INVALID_SUBGENRE':
        userMessage = "Invalid subgenre selection for this genre";
        recoveryOptions = ['View subgenres with "subgenre help"', 'Go back to genre selection'];
        break;
      case 'INCOMPLETE_PROJECT':
        userMessage = "Project setup is incomplete";
        recoveryOptions = ['View current progress with "status"', 'Cancel with "cancel"'];
        break;
      case 'INSUFFICIENT_FUNDS':
        userMessage = `Insufficient funds (Need: $${error.required}, Have: $${gameState.moneyAmount})`;
        recoveryOptions = ['Choose a smaller project scope', 'Cancel project creation'];
        break;
      default:
        userMessage = error.message || "An unexpected error occurred";
        recoveryOptions = ['Try again', 'Type "help" for assistance', 'Cancel with "cancel"'];
    }

    // Display error to user
    outputToDisplay("\n=== Error ===");
    outputToDisplay(userMessage);
    
    if (error.details) {
      outputToDisplay("\nDetails:");
      outputToDisplay(error.details);
    }

    if (recoveryOptions.length > 0) {
      outputToDisplay("\nSuggested actions:");
      recoveryOptions.forEach(option => outputToDisplay(`- ${option}`));
    }

    // Offer to restart project creation if in progress
    if (gameState.tempProject) {
      outputToDisplay("\nWould you like to:");
      outputToDisplay("1. Continue from last valid step (type 'continue')");
      outputToDisplay("2. Restart project creation (type 'restart')");
      outputToDisplay("3. Cancel project creation (type 'cancel')");
    }

    return {
      handled: true,
      canRecover: !!gameState.tempProject,
      severity: error.code ? 'recoverable' : 'critical'
    };
  } catch (innerError) {
    // If error handling itself fails, provide basic error message
    console.error('Error handler failed:', innerError);
    outputToDisplay("A critical error occurred. Please try restarting the game.");
    return {
      handled: false,
      canRecover: false,
      severity: 'critical'
    };
  }
}

class GameError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'GameError';
  }
}

function safelyGetGenreData(genre) {
  if (!genre) {
    throw new GameError('INVALID_GENRE', 'No genre specified');
  }

  const genreData = GENRE_DATA[genre.toLowerCase()];
  if (!genreData) {
    throw new GameError('INVALID_GENRE', 'Genre not found', 
      `Available genres: ${Object.keys(GENRE_DATA).join(', ')}`);
  }

  return genreData;
}

function safelyGetSubgenreData(genre, subgenre) {
  const genreData = safelyGetGenreData(genre);
  
  if (!subgenre) {
    throw new GameError('INVALID_SUBGENRE', 'No subgenre specified');
  }

  const subgenreData = genreData.subgenres[subgenre.toLowerCase()];
  if (!subgenreData) {
    throw new GameError('INVALID_SUBGENRE', 'Subgenre not found', 
      `Available subgenres: ${Object.keys(genreData.subgenres).join(', ')}`);
  }

  return subgenreData;
}

function validateProjectData(projectData) {
  if (!projectData) {
    throw new GameError('INVALID_PROJECT', 'No project data available');
  }

  const requiredFields = [
    'genre',
    'genreName',
    'subgenre',
    'subgenreName',
    'elements',
    'projectName'
  ];

  const missing = requiredFields.filter(field => !projectData[field]);
  
  if (missing.length > 0) {
    throw new GameError('INCOMPLETE_PROJECT', 'Project data incomplete', 
      `Missing fields: ${missing.join(', ')}`);
  }

  if (!Array.isArray(projectData.elements) || projectData.elements.length !== 3) {
    throw new GameError('INVALID_ELEMENTS', 'Invalid gameplay elements',
      'Project must have exactly 3 unique gameplay elements');
  }

  return true;
}

function recoveryMode(gameState) {
  // Attempt to recover last valid state
  let lastValidStep = null;
  
  try {
    // Check each step sequentially
    if (gameState.tempProject?.genre) {
      lastValidStep = PROJECT_STEPS.GENRE;
      safelyGetGenreData(gameState.tempProject.genre);
      
      if (gameState.tempProject?.subgenre) {
        lastValidStep = PROJECT_STEPS.SUBGENRE;
        safelyGetSubgenreData(gameState.tempProject.genre, gameState.tempProject.subgenre);
        
        if (gameState.tempProject?.elements) {
          lastValidStep = PROJECT_STEPS.FEATURES;
          if (validateElementSelection(gameState.tempProject.elements)) {
            
            if (gameState.tempProject?.projectName) {
              lastValidStep = PROJECT_STEPS.NAME;
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Recovery stopped at:', lastValidStep, error);
  }

  return lastValidStep;
}

function validateElementSelection(elements) {
  if (!Array.isArray(elements)) {
    throw new GameError('INVALID_ELEMENTS', 'Invalid element selection format');
  }

  if (elements.length !== 3) {
    throw new GameError('INVALID_ELEMENTS', 'Must select exactly 3 elements');
  }

  if (new Set(elements).size !== elements.length) {
    throw new GameError('INVALID_ELEMENTS', 'Elements must be unique');
  }

  return true;
}

function validateProjectState(gameState) {
  // Check for invalid state where both tempProject and project exist
  if (gameState.tempProject && gameState.project) {
    console.warn("Invalid state: Both tempProject and project exist");
    delete gameState.tempProject; // Clean up temporary state
  }
  
  return {
    hasActiveProject: !!gameState.project,
    hasTemporaryProject: !!gameState.tempProject,
    canStartNewProject: !gameState.project && !gameState.tempProject
  };
}

function displayCompanyStatus(gameState) {
  outputToDisplay("\n=== Company Status ===");
  outputToDisplay(`Company Name: ${gameState.companyName}`);
  outputToDisplay(`Week: ${gameState.weekNumber}`);
  outputToDisplay(`Available Funds: $${gameState.moneyAmount}`);
  
  // Workspace Info
  const workspace = WORKSPACES[gameState.workspace];
  outputToDisplay("\nWorkspace:");
  outputToDisplay(`Type: ${formatWorkspaceName(gameState.workspace)}`);
  outputToDisplay(`Capacity: ${gameState.staff.length}/${workspace.capacity} positions filled`);
  outputToDisplay(`Productivity Modifier: ${((workspace.productivity - 1) * 100).toFixed(0)}%`);
  
  // Staff Overview
  if (gameState.staff.length > 0) {
    outputToDisplay("\nStaff Overview:");
    const departments = {};
    gameState.staff.forEach(staff => {
      departments[staff.type] = (departments[staff.type] || 0) + 1;
    });
    
    Object.entries(departments).forEach(([dept, count]) => {
      outputToDisplay(`${STAFF_TYPES[dept].name}s: ${count}`);
    });
    
    outputToDisplay(`Weekly Salaries: $${gameState.totalSalaries}`);
    outputToDisplay(`Average Team Morale: ${calculateAverageMorale(gameState.staff)}%`);
  } else {
    outputToDisplay("\nNo staff hired yet");
  }
  
  // Technology Overview
  const ownedTechs = Object.keys(gameState.technologies).length;
  if (ownedTechs > 0) {
    outputToDisplay("\nTechnology:");
    outputToDisplay(`Owned Technologies: ${ownedTechs}`);
    outputToDisplay("Active Modifiers:");
    Object.entries(gameState.modifiers).forEach(([mod, value]) => {
      if (value !== 1) {
        const percentage = ((value - 1) * 100).toFixed(0);
        outputToDisplay(`- ${formatModifierName(mod)}: ${percentage}%`);
      }
    });
  }

  // Market Position
  outputToDisplay("\nMarket Position:");
  outputToDisplay(`Market Presence: ${(gameState.reputation.marketPresence * 100).toFixed(1)}%`);
  outputToDisplay(`Brand Strength: ${getBrandTier(calculateBrandStrength(gameState))}`);
  
  // Game History
  if (gameState.gameHistory && gameState.gameHistory.length > 0) {
    outputToDisplay("\nGame History:");
    outputToDisplay(`Released Games: ${gameState.gameHistory.length}`);
    const totalRevenue = gameState.gameHistory.reduce((sum, game) => sum + game.revenue, 0);
    outputToDisplay(`Total Revenue: $${totalRevenue}`);
    const avgSuccess = gameState.gameHistory.reduce((sum, game) => sum + game.successScore, 0) / 
      gameState.gameHistory.length;
    outputToDisplay(`Average Success Score: ${avgSuccess.toFixed(1)}/100`);
    
    // Most recent game
    const lastGame = gameState.gameHistory[gameState.gameHistory.length - 1];
    outputToDisplay("\nLast Release:");
    outputToDisplay(`Title: ${lastGame.name}`);
    outputToDisplay(`Genre: ${lastGame.genre}`);
    outputToDisplay(`Success Score: ${lastGame.successScore}/100`);
  }

  // Available Actions
  outputToDisplay("\nAvailable Actions:");
  outputToDisplay("- start game [genre] - Start new project");
  outputToDisplay("- market - Check market trends");
  outputToDisplay("- hire view - View candidates");
  outputToDisplay("- research view - View technologies");
}

function formatWorkspaceName(workspace) {
  return workspace.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatModifierName(modifier) {
  return modifier.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function calculateAverageMorale(staff) {
  if (staff.length === 0) return 0;
  return staff.reduce((sum, staffMember) => sum + staffMember.morale, 0) / staff.length;
}

function calculateBrandStrength(gameState) {
  const reputation = gameState.reputation;
  const marketPresence = reputation.marketPresence;
  const fanLoyalty = reputation.casual.fans + reputation.hardcore.fans + reputation.critics.fans;
  return marketPresence * fanLoyalty;
}

function getBrandTier(score) {
  if (score < 100) return 'Unknown';
  if (score < 500) return 'Newcomer';
  if (score < 2000) return 'Established';
  return 'Legendary';
}

// New functions
function isReadyForRelease(project) {
  if (!project) return false;
  
  const hasRequiredDecisions = !!(
    project.marketingStrategy && 
    project.launchWindow && 
    project.optimizationFocus
  );
  
  const validationResult = validateReleaseReadiness(project);
  
  return hasRequiredDecisions && validationResult.valid;
}

function validateReleaseReadiness(project) {
  const issues = [];

  // Ensure all required data structures exist
  if (!project.testingMetrics) {
    project.testingMetrics = {
      bugsFound: 0,
      bugsFixed: 0,
      playtestScore: 0,
      testsConducted: { unit: false, integration: false, playtest: false },
      bugSeverity: { critical: 0, major: 0, minor: 0 },
      qualityMetrics: { performance: 50, stability: 50, usability: 50 }
    };
  }

  if (!project.targetAudience) {
    project.targetAudience = 'all';
  }

  // Check for critical issues that don't block release but should be warned about
  if (project.bugs > 0) {
    issues.push({
      type: 'warning',
      message: 'Project has unfixed bugs',
      detail: `${project.bugs} remaining bugs`
    });
  }

  // Verify test completion
  if (project.testingMetrics.playtestScore < 50) {
    issues.push({
      type: 'warning',
      message: 'Low playtest score',
      detail: `Current score: ${project.testingMetrics.playtestScore}`
    });
  }

  return {
    valid: true, // Allow release but with warnings
    issues: issues
  };
}

function validateProjectState(gameState) {
  // Keep existing validation
  const baseValidation = {
    hasActiveProject: !!gameState.project,
    hasTemporaryProject: !!gameState.tempProject,
    canStartNewProject: !gameState.project && !gameState.tempProject
  };

  // Add new validation details
  if (gameState.project) {
    baseValidation.projectDetails = {
      phase: gameState.project.phase,
      hasRequiredData: validateProjectRequirements(gameState.project),
      readyForRelease: isReadyForRelease(gameState.project)
    };
  }

  return baseValidation;
}

function validateProjectRequirements(project) {
  const requiredBaseProps = ['name', 'genre', 'subgenre', 'phase', 'progress'];
  const missingBaseProps = requiredBaseProps.filter(prop => !project[prop]);

  // Don't throw error, just return validation status
  return {
    valid: missingBaseProps.length === 0,
    missing: missingBaseProps,
    hasTestingMetrics: !!project.testingMetrics,
    hasReleaseData: !!project.releaseData,
    hasTargetAudience: !!project.targetAudience
  };
}

function validateSaveData(saveData) {
  // DO NOT MODIFY EXISTING VALIDATION CODE - START
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

  // Original project data validation
  if (saveData.project) {
    validateProjectData(saveData.project);
  }
  // DO NOT MODIFY EXISTING VALIDATION CODE - END

  // NEW: Extended Studio-Specific Validation
  validateStudioData(saveData);
  
  // NEW: Additional Release Data Validation
  if (saveData.project?.phase === 'release') {
    validateReleaseData(saveData.project);
  }

  return true;
}

// New validation helper functions
function validateStudioData(saveData) {
  // Ensure base studio data structures exist
  if (!saveData.reputation) {
    saveData.reputation = {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    };
  }

  if (!saveData.marketTrends) {
    saveData.marketTrends = {};
    Object.keys(GENRE_DATA).forEach(genre => {
      saveData.marketTrends[genre] = {
        popularity: 1.0,
        growth: 0,
        saturation: 0.5
      };
    });
  }

  // Ensure game history array exists
  if (!Array.isArray(saveData.gameHistory)) {
    saveData.gameHistory = [];
  }

  // Validate reputation segments
  ['casual', 'hardcore', 'critics'].forEach(segment => {
    if (!saveData.reputation[segment]) {
      saveData.reputation[segment] = { fans: 0, loyalty: 0.5, expectations: 50 };
    }
  });
}

function validateReleaseData(project) {
  // Ensure release data exists
  if (!project.releaseData) {
    project.releaseData = {
      marketingStrategy: project.marketingStrategy || null,
      launchWindow: project.launchWindow || null,
      optimizationFocus: project.optimizationFocus || null,
      finalPolish: true
    };
  }

  // Ensure testing metrics exist
  if (!project.testingMetrics) {
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

  // Ensure target audience exists
  if (!project.targetAudience) {
    project.targetAudience = 'all';
  }

  // Add any missing release phase properties
  const requiredProps = [
    'marketingStrategy',
    'launchWindow',
    'optimizationFocus'
  ];

  // Don't throw error, just log if properties are missing
  const missingProps = requiredProps.filter(prop => !project[prop]);
  if (missingProps.length > 0) {
    console.log('Missing release properties:', missingProps);
  }
}

function handleMarketingDecision(gameState, params) {
  const strategy = params[0]?.toLowerCase();
  if (!strategy || !['casual', 'balanced', 'hardcore'].includes(strategy)) {
    displayPolishOptions(gameState);
    return;
  }

  if (!gameState.project?.phase === 'release') {
    outputToDisplay("Marketing strategy can only be set during the polish phase.");
    return;
  }

  gameState.project.marketingStrategy = strategy;
  outputToDisplay(`Marketing strategy set to: ${strategy}`);
}

function handleLaunchWindow(gameState, params) {
  const window = params[0]?.toLowerCase();
  if (!window || !['immediate', 'optimal', 'delayed'].includes(window)) {
    outputToDisplay("Invalid launch window. Choose: immediate, optimal, or delayed");
    return;
  }

  gameState.project.launchWindow = window;
  outputToDisplay(`Launch window set to: ${window}`);
}

function handleOptimization(gameState, params) {
  const focus = params[0]?.toLowerCase();
  if (!focus || !['performance', 'features', 'balance'].includes(focus)) {
    outputToDisplay("Invalid optimization focus. Choose: performance, features, or balance");
    return;
  }

  gameState.project.optimizationFocus = focus;
  outputToDisplay(`Optimization focus set to: ${focus}`);
}

function updatePolishProgress(gameState) {
  if (!gameState?.project || gameState.project.phase !== 'release') {
    return;
  }

  // Calculate progress
  const requiredDecisions = ['marketingStrategy', 'launchWindow', 'optimizationFocus'];
  const completedDecisions = requiredDecisions.filter(decision => gameState.project[decision]);
  const progress = (completedDecisions.length / requiredDecisions.length) * 100;

  gameState.project.phaseProgress = progress;

  // Show remaining decisions only if there are any left and this is a new state
  const remaining = requiredDecisions.filter(decision => !gameState.project[decision]);
  const decisionsState = JSON.stringify(remaining);
  
  // Only show messages if we haven't shown them before for this state
  if (gameState.project.lastDecisionState !== decisionsState) {
    if (remaining.length > 0 && !gameState.project.messageShown) {
      outputToDisplay("\nRemaining decisions needed:");
      remaining.forEach(decision => {
        const formattedDecision = decision.replace(/([A-Z])/g, ' $1').toLowerCase();
        outputToDisplay(`- Set ${formattedDecision}`);
      });
      gameState.project.messageShown = true;
    } else if (remaining.length === 0 && !gameState.project.completionMessageShown) {
      // Only show completion message once
      outputToDisplay("\nAll release decisions complete!");
      outputToDisplay("Use 'release' command to launch your game");
      gameState.project.completionMessageShown = true;
    }
    // Store current decisions state
    gameState.project.lastDecisionState = decisionsState;
  }
}

function validateTestingToRelease(project) {
  const maxBugs = Math.ceil(project.planningData.features.length / 2);
  
  if (project.bugs > maxBugs) {
    return {
      valid: false,
      reason: 'Too many unresolved bugs',
      current: project.bugs,
      maximum: maxBugs
    };
  }

  if (!project.testingMetrics.playtestScore || 
      project.testingMetrics.playtestScore < 70) {
    return {
      valid: false,
      reason: 'Insufficient playtest results',
      score: project.testingMetrics.playtestScore
    };
  }

  return {
    valid: true,
    metrics: collectTestingMetrics(project)
  };
}

function collectTestingMetrics(project) {
  // TO DO: Implement logic to collect testing metrics
  return {};
}

function validatePlanningToDevelopment(project) {
  // TO DO: Implement logic to validate planning to development transition
  return true;
}

function validateDevelopmentToTesting(project) {
  // TO DO: Implement logic to validate development to testing transition
  return true;
}

function handleGameRelease(gameState) {
  if (!isReadyForRelease(gameState.project)) {
    outputToDisplay("Project not ready for release! Complete all required decisions:");
    if (!gameState.project.marketingStrategy) outputToDisplay("- Set marketing strategy");
    if (!gameState.project.launchWindow) outputToDisplay("- Choose launch window");
    if (!gameState.project.optimizationFocus) outputToDisplay("- Select optimization focus");
    return;
  }

  proceedWithRelease(gameState);
}

function proceedWithRelease(gameState) {
  // TO DO: Implement logic to proceed with game release
}

function handleReleaseCommand(gameState) {
  if (!isReadyForRelease(gameState.project)) {
    outputToDisplay("Project not ready for release! Complete all required decisions:");
    if (!gameState.project.marketingStrategy) outputToDisplay("- Set marketing strategy");
    if (!gameState.project.launchWindow) outputToDisplay("- Choose launch window");
    if (!gameState.project.optimizationFocus) outputToDisplay("- Select optimization focus");
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
    outputToDisplay("- Final game quality");
    outputToDisplay("- Review scores");
    outputToDisplay("- Sales potential");
    outputToDisplay("\nType 'release confirm' to release anyway, or continue fixing bugs.");
    return;
  }

  proceedWithRelease(gameState);
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

  outputToDisplay("\nHint: Use 'advance time' to begin development!");

  gameState.project.completedMilestones.push('priority_set');
  checkPhaseCompletion(gameState);
}

function formatEffectName(effect) {
  return effect.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function handleMarketingStrategy(params, gameState) {
  if (!params.length) {
    outputToDisplay("Please specify a marketing strategy:");
    outputToDisplay("- casual: Focus on casual gamers");
    outputToDisplay("- balanced: Appeal to all audiences");
    outputToDisplay("- hardcore: Target hardcore gamers");
    return;
  }

  const strategy = params[0].toLowerCase();
  if (!['casual', 'balanced', 'hardcore'].includes(strategy)) {
    outputToDisplay("Invalid strategy. Choose:");
    outputToDisplay("- casual: Focus on casual gamers");
    outputToDisplay("- balanced: Appeal to all audiences"); 
    outputToDisplay("- hardcore: Target hardcore gamers");
    return;
  }

  gameState.project.marketingStrategy = strategy;
  outputToDisplay(`\nMarketing strategy set to: ${strategy}`);
  
  switch(strategy) {
    case 'casual':
      outputToDisplay("Targeting casual players - Higher appeal to casual audience");
      outputToDisplay("Lower development costs but potentially lower hardcore appeal");
      break;
    case 'balanced':
      outputToDisplay("Balanced approach - Moderate appeal to all audiences");
      outputToDisplay("Standard development costs and market reach");
      break;
    case 'hardcore':
      outputToDisplay("Targeting hardcore players - Higher appeal to hardcore audience");
      outputToDisplay("Higher development costs but potentially lower casual appeal");
      break;
  }
}

window.handleReleaseCommand = handleReleaseCommand;
window.handleGameRelease = handleGameRelease;
window.isReadyForRelease = isReadyForRelease;
window.proceedWithRelease = proceedWithRelease;
window.updatePolishProgress = updatePolishProgress;
window.handleMarketingDecision = handleMarketingDecision;
window.handleLaunchWindow = handleLaunchWindow;
window.handleOptimization = handleOptimization;
window.validatePhaseTransition = validatePhaseTransition;
window.handlePriorityCommand = handlePriorityCommand;
window.handleMarketingStrategy = handleMarketingStrategy;

function initializeBaseReception() {
  return {
    casual: { fans: 0, loyalty: 0.5, expectations: 50 },
    hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
    critics: { fans: 0, loyalty: 0.5, expectations: 50 }
  };
}

function ensureMarketData(gameState) {
  // Initialize missing market data if needed
  if (!gameState.marketTrends) {
    gameState.marketTrends = {};
    Object.keys(GENRE_DATA).forEach(genre => {
      gameState.marketTrends[genre] = {
        popularity: 1.0,
        growth: 0,
        saturation: 0.5
      };
    });
  }
  return gameState.marketTrends;
}

function ensureReputationData(gameState) {
  if (!gameState.reputation) {
    gameState.reputation = {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },  
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    };
  }
  return gameState.reputation;
}

function calculateReceptionValues(project, gameState) {
  // Get base reception
  let reception = {
    casual: 50,
    hardcore: 50, 
    critics: 50
  };

  // Get audience preferences safely
  const targetAudience = project.targetAudience || 'all';
  const audienceData = AUDIENCE_SEGMENTS[targetAudience] || AUDIENCE_SEGMENTS.all;
  const preferences = audienceData.preferences || {};

  // Get genre multiplier with fallback
  const genreMultiplier = preferences[project.genre.toLowerCase()] || 1;
  
  // Calculate reception based on marketing strategy
  switch(project.marketingStrategy || 'balanced') {
    case 'casual':
      reception.casual = Math.min(100, reception.casual * 1.2 * genreMultiplier);
      reception.hardcore = Math.min(100, reception.hardcore * 0.8 * genreMultiplier);
      reception.critics = Math.min(100, reception.critics * 0.9 * genreMultiplier);
      break;
    case 'hardcore':
      reception.casual = Math.min(100, reception.casual * 0.8 * genreMultiplier);
      reception.hardcore = Math.min(100, reception.hardcore * 1.2 * genreMultiplier);
      reception.critics = Math.min(100, reception.critics * 1.1 * genreMultiplier);
      break;
    default: // balanced
      reception.casual = Math.min(100, reception.casual * genreMultiplier);
      reception.hardcore = Math.min(100, reception.hardcore * genreMultiplier);
      reception.critics = Math.min(100, reception.critics * genreMultiplier);
  }

  return reception;
}

function calculateReleaseStats(gameState, finalQuality) {
  const project = gameState.project;
  
  // Ensure market data exists
  const marketTrends = ensureMarketData(gameState);
  
  // Calculate base success score from quality
  let successScore = finalQuality;

  // Calculate marketing impact
  const marketingImpact = calculateMarketingEffectiveness(project, gameState);
  
  // Calculate timing impact with fallback
  const genreData = marketTrends[project.genre.toLowerCase()] || { popularity: 1.0, growth: 0 };
  const timingImpact = calculateTimingImpact(project.launchWindow, genreData);

  // Apply effects
  successScore *= marketingImpact;
  successScore *= timingImpact;

  // Apply optimization effects
  if (project.optimizationEffects) {
    Object.values(project.optimizationEffects).forEach(effect => {
      successScore *= effect;
    });
  }

  // Calculate revenue with fallbacks
  const baseRevenue = (successScore / 100) * (project.budget || 10000) * 2;
  const reputation = ensureReputationData(gameState);
  const revenueMultiplier = (1 + (reputation.marketPresence || 0));
  const revenue = Math.floor(baseRevenue * revenueMultiplier);

  // Calculate reception
  const reception = calculateReceptionValues(project, gameState);

  // Keep success score in valid range
  successScore = Math.round(Math.min(100, Math.max(0, successScore)));

  return {
    successScore,
    revenue,
    marketingImpact,
    timingImpact,
    reception
  };
}

function validatePhaseTransition(fromPhase, toPhase, project) {
  const validTransitions = {
    planning: {
      to: ['development'],
      requires: ['features', 'staffAssignments', 'resourceAllocation']
    },
    development: {
      to: ['testing'],
      requires: ['progress', 'quality', 'bugRate']
    },
    testing: {
      to: ['release'],
      requires: ['testingMetrics', 'playtestScore']
    },
    release: {
      to: [],
      requires: ['marketingStrategy', 'launchWindow', 'optimizationFocus']
    }
  };

  // Validate phase exists
  if (!validTransitions[fromPhase]) {
    return { 
      valid: false, 
      reason: `Invalid phase: ${fromPhase}` 
    };
  }

  // Validate transition is allowed
  if (!validTransitions[fromPhase].to.includes(toPhase)) {
    return {
      valid: false,
      reason: `Cannot transition from ${fromPhase} to ${toPhase}`
    };
  }

  // Check required data exists
  const missingData = validTransitions[fromPhase].requires.filter(req => !project[req]);
  
  if (missingData.length > 0) {
    return {
      valid: false,
      reason: 'Missing required data',
      missing: missingData 
    };
  }

  if (fromPhase === 'testing' && toPhase === 'release') {
    // Ensure bug tracking metrics exist
    if (!project.testingMetrics) {
      project.testingMetrics = {
        bugSeverity: {
          critical: Math.floor((project.bugs || 0) * 0.2),
          major: Math.floor((project.bugs || 0) * 0.3),
          minor: Math.ceil((project.bugs || 0) * 0.5)
        },
        bugsFound: project.bugs || 0,
        bugsFixed: 0,
        playtestScore: 70 
      };
    }
  }

  return { valid: true };
}
