// uiManager.js - UI management functions

function updateStatusDisplay(companyName, weekNumber, moneyAmount) {
  document.getElementById('company-name').textContent = companyName;
  document.getElementById('week-number').textContent = weekNumber;
  document.getElementById('money-amount').textContent = moneyAmount;
}

function updatePhaseIndicator(project) {
  const phaseIndicator = document.getElementById('phase-indicator');
  if (!project) {
    phaseIndicator.classList.add('hidden');
    return;
  }

  phaseIndicator.classList.remove('hidden');
  const phases = ['planning', 'development', 'testing', 'release'];
  const currentPhaseIndex = phases.indexOf(project.phase);

  phases.forEach((phase, index) => {
    const phaseElement = phaseIndicator.querySelector(`[data-phase="${phase}"]`);
    phaseElement.classList.remove('active', 'completed');
    
    if (index < currentPhaseIndex) {
      phaseElement.classList.add('completed');
    } else if (index === currentPhaseIndex) {
      phaseElement.classList.add('active');
    }
  });
}

function outputToDisplay(message) {
  const outputDiv = document.querySelector('.game-output');
  const messageContainer = outputDiv.querySelector('.message-container') || createMessageContainer(outputDiv);

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  // Handle message type detection
  if (message.startsWith('Error:')) {
    messageElement.classList.add('error');
  } else if (message.startsWith('Success:')) {
    messageElement.classList.add('success');
  } else if (message.startsWith('Warning:')) {
    messageElement.classList.add('warning');
  } else if (message.startsWith('===')) {
    messageElement.classList.add('section-header');
  }

  // Process message content
  const processedMessage = message.replace(/`([^`]+)`/g, '<code>$1</code>');
  messageElement.innerHTML = processedMessage;

  // Check for overflow potential
  if (message.includes(' ') === false && message.length > 50) {
    messageElement.classList.add('overflow');
  }

  messageContainer.appendChild(messageElement);

  // Manage message history - increase limit
  const messages = messageContainer.children;
  if (messages.length > 1000) { 
    messages[0].remove();
  }

  // Improved scroll handling
  const shouldScroll = outputDiv.scrollTop + outputDiv.clientHeight >= 
    outputDiv.scrollHeight - 50;
    
  if (shouldScroll) {
    setTimeout(() => {
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }, 10);
  }
}

function createMessageContainer(outputDiv) {
  if (outputDiv.querySelector('.message-container')) {
    return outputDiv.querySelector('.message-container');
  }
  
  const container = document.createElement('div');
  container.classList.add('message-container');
  outputDiv.appendChild(container);
  return container;
}

function displayGenreSelection() {
  outputToDisplay("\n=== Start New Game Project ===");
  outputToDisplay("What type of game would you like to develop?\n");
  
  Object.entries(GENRE_DATA).forEach(([key, data], index) => {
    outputToDisplay(`${index + 1}. ${data.name}`);
    outputToDisplay(`   ${data.description}`);
    outputToDisplay(`   Base Cost: ${data.baseCost}x | Market Size: ${data.marketSize * 100}%`);
    outputToDisplay(`   Fan Loyalty: ${data.fanLoyalty * 100}%\n`);
  });
  
  outputToDisplay("Use 'start game [genre]' or 'start game [number]' to begin");
  outputToDisplay("Type 'back' to cancel selection");
}

function displaySubgenreConfirmation(subgenreData, genre) {
  outputToDisplay(`\n=== Confirm Subgenre Selection ===`);
  outputToDisplay(`Genre: ${GENRE_DATA[genre].name}`);
  outputToDisplay(`Subgenre: ${subgenreData.name}`);
  outputToDisplay(`\nDescription: ${subgenreData.description}`);
  
  outputToDisplay("\nDevelopment Factors:");
  outputToDisplay(`- Base Cost: ${subgenreData.baseCost}x`);
  outputToDisplay(`- Development Time: ${subgenreData.baseTime}x`);
  
  outputToDisplay("\nCore Features:");
  subgenreData.elements.forEach((element, index) => {
    if (index < 3) outputToDisplay(`- ${element}`);
  });
  
  outputToDisplay("\nType 'confirm' to proceed or 'back' to select different subgenre");
}

function displayElementOptions(gameState) {
  const subData = getSubgenreData(gameState.tempProject.genre, gameState.tempProject.subgenre);
  
  outputToDisplay(`\n=== Select Core Features for your ${subData.name} ===`);
  outputToDisplay("Choose 3 elements that will define your game:");
  
  subData.elements.forEach((element, index) => {
    outputToDisplay(`\n${index + 1}. ${element}`);
    outputToDisplay(`   Impact: ${getElementImpact(element, subData)}`);
    
    // Show compatibility hints
    const compatibles = getCompatibleElements(element, subData);
    if (compatibles) {
      outputToDisplay(`   Works well with: ${compatibles}`);
    }
  });
  
  outputToDisplay("\nType three numbers separated by commas (e.g., 1,4,6)");
  outputToDisplay("Or type 'back' to return to subgenre selection");
}

function getElementImpact(element, subData) {
  // Define impact descriptions for different elements
  const impacts = {
    "Grid System": "Affects complexity and development time",
    "Combo System": "Increases engagement but adds testing time",
    "Power-ups": "Adds variety but requires balance testing",
    "Level Generator": "Extends playtime but increases technical complexity",
    "Score System": "Essential for retention, moderate development cost",
    "Progress Tracking": "Improves player engagement, low complexity",
    "Special Tiles": "Adds depth but requires additional art and testing",
    "Daily Quests": "Boosts retention but needs backend support"
    // Add more as needed
  };
  
  return impacts[element] || "Standard feature, balanced impact";
}

function getCompatibleElements(element, subData) {
  // Define natural combinations
  const compatibilityMap = {
    "Grid System": ["Combo System", "Power-ups", "Special Tiles"],
    "Combo System": ["Score System", "Power-ups"],
    "Power-ups": ["Special Tiles", "Score System"],
    "Level Generator": ["Progress Tracking", "Score System"],
    "Score System": ["Progress Tracking", "Combo System"],
    "Progress Tracking": ["Daily Quests", "Score System"],
    "Special Tiles": ["Grid System", "Power-ups"],
    "Daily Quests": ["Progress Tracking", "Score System"]
    // Add more as needed
  };
  
  return compatibilityMap[element]?.join(", ") || "All features";
}

function checkElementCompatibility(elements, subData) {
  const warnings = [];
  
  // Check for potentially problematic combinations
  if (elements.includes("Level Generator") && elements.includes("Special Tiles")) {
    warnings.push("Level Generator with Special Tiles increases development complexity");
  }
  
  if (elements.includes("Daily Quests") && !elements.includes("Progress Tracking")) {
    warnings.push("Daily Quests work better with Progress Tracking");
  }
  
  // Add more compatibility checks as needed
  
  return warnings;
}

function displayErrorMessage(command, error, context = '') {
  const errorMessages = {
    "insufficient_funds": "Insufficient funds! Required: $",
    "invalid_phase": "This action can't be performed during the current phase.",
    "workspace_full": "No room in current workspace for more staff.",
    "invalid_input": "Invalid input format.",
    "project_required": "No active project. Start a new game project first.",
    "project_exists": "Already working on a project. Complete or cancel it first."
  };

  const message = errorMessages[error] || error;
  outputToDisplay(`Error: ${message} ${context}`);
  
  // Show relevant help
  if (command) {
    outputToDisplay(`Type 'help ${command}' for usage information.`);
  }
}

function validateGameState(command, gameState) {
  const validations = {
    "start game": () => {
      if (gameState.project) throw new Error("project_exists");
      if (gameState.moneyAmount < 1000) throw new Error("insufficient_funds");
      return true;
    },
    "hire": () => {
      const workspace = WORKSPACES[gameState.workspace];
      if (gameState.staff.length >= workspace.capacity) throw new Error("workspace_full");
      return true;
    }
    // Add more validations as needed
  };

  try {
    return validations[command] ? validations[command]() : true;
  } catch (error) {
    displayErrorMessage(command, error.message);
    return false;
  }
}

function truncateMessage(message, maxLength = 120) {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + '...';
}

function displayMarketTrends(gameState) {
  if (!gameState.marketTrends) {
    gameState.marketTrends = initializeMarketTrends(gameState);
  }

  outputToDisplay("\n=== Current Market Trends ===");
  
  Object.entries(gameState.marketTrends).forEach(([genre, data]) => {
    const genreData = GENRE_DATA[genre];
    if (!genreData) return;

    outputToDisplay(`\n${genreData.name}`);
    outputToDisplay(`Current Popularity: ${(data.popularity * 100).toFixed(1)}%`);
    outputToDisplay(`Market Growth: ${(data.growth * 100).toFixed(1)}%`);
    outputToDisplay(`Saturation: ${(data.saturation * 100).toFixed(1)}%`);
    
    if (data.competitorReleases.length > 0) {
      outputToDisplay("Upcoming Competitors:");
      data.competitorReleases.forEach(release => {
        outputToDisplay(`- Week ${release.week}: ${release.company}`);
      });
    }
  });
}

function displayMarketReport(gameState) {
  if (!gameState.marketTrends) {
    gameState.marketTrends = initializeMarketTrends(gameState);
  }

  outputToDisplay("\n=== Full Market Analysis ===");
  outputToDisplay("Available at any development stage");
  
  // Overall Market Status
  const marketCycle = determineOverallMarketCycle(gameState.marketTrends);
  outputToDisplay(`Market Cycle: ${marketCycle}`);

  // Genre Analysis
  outputToDisplay("\nGenre Trends:");
  Object.entries(gameState.marketTrends).forEach(([genre, data]) => {
    const genreData = GENRE_DATA[genre];
    if (!genreData) return;

    const trendIndicator = getTrendIndicator(data.growth);
    outputToDisplay(`\n${genreData.name}:`);
    outputToDisplay(`Popularity: ${(data.popularity * 100).toFixed(1)}% ${trendIndicator}`);
    outputToDisplay(`Market Saturation: ${(data.saturation * 100).toFixed(1)}%`);
    
    // Show upcoming competitor releases
    const upcomingReleases = data.competitorReleases
      .filter(release => release.week > gameState.weekNumber)
      .slice(0, 2);
    
    if (upcomingReleases.length > 0) {
      outputToDisplay("Upcoming Releases:");
      upcomingReleases.forEach(release => {
        const weeksUntil = release.week - gameState.weekNumber;
        outputToDisplay(`- ${release.company} (in ${weeksUntil} weeks)`);
      });
    }
  });

  // Opportunities Analysis
  outputToDisplay("\nMarket Opportunities:");
  const opportunities = findMarketOpportunities(gameState);
  opportunities.forEach(opp => {
    outputToDisplay(`- ${opp}`);
  });

  // Recommendations
  outputToDisplay("\nRecommendations:");
  const recommendations = generateMarketRecommendations(gameState);
  recommendations.forEach(rec => {
    outputToDisplay(`- ${rec}`);
  });
}

function determineOverallMarketCycle(trends) {
  let growthSum = 0;
  let count = 0;

  Object.values(trends).forEach(data => {
    growthSum += data.growth;
    count++;
  });

  const avgGrowth = growthSum / count;

  if (avgGrowth > 0.1) return "Expansion ";
  if (avgGrowth > 0.05) return "Growth ";
  if (avgGrowth > -0.05) return "Stable ";
  if (avgGrowth > -0.1) return "Decline ";
  return "Recession ";
}

function getTrendIndicator(growth) {
  if (growth > 0.1) return "";
  if (growth > 0.05) return "";
  if (growth > -0.05) return "";
  if (growth > -0.1) return "";
  return "";
}

function findMarketOpportunities(gameState) {
  const opportunities = [];
  const trends = gameState.marketTrends;

  Object.entries(trends).forEach(([genre, data]) => {
    const genreData = GENRE_DATA[genre];
    if (!genreData) return;

    if (data.popularity > 1.2 && data.saturation < 0.3) {
      opportunities.push(`High demand for ${genreData.name} games with low market saturation`);
    }
    if (data.growth > 0.15) {
      opportunities.push(`${genreData.name} market showing strong growth potential`);
    }
    if (data.competitorReleases.length === 0) {
      opportunities.push(`No major competitors planning ${genreData.name} releases`);
    }
  });

  return opportunities;
}

function generateMarketRecommendations(gameState) {
  const recommendations = [];
  const trends = gameState.marketTrends;

  // Find best genre opportunity
  let bestGenre = null;
  let bestScore = 0;

  Object.entries(trends).forEach(([genre, data]) => {
    const score = (data.popularity * (1 - data.saturation)) + (data.growth * 2);
    if (score > bestScore) {
      bestScore = score;
      bestGenre = genre;
    }
  });

  if (bestGenre) {
    const genreData = GENRE_DATA[bestGenre];
    recommendations.push(`Consider developing a ${genreData.name} game in the current market`);
  }

  // General recommendations based on market state
  if (determineOverallMarketCycle(trends).includes("Recession")) {
    recommendations.push("Focus on smaller, lower-risk projects during market downturn");
  }

  // Add timing recommendation
  recommendations.push(getTimingRecommendation(gameState));

  return recommendations;
}

function getTimingRecommendation(gameState) {
  const month = Math.floor((gameState.weekNumber % 52) / 4);
  
  if (month >= 9 && month <= 11) {
    return "Holiday season approaching - consider timing release accordingly";
  }
  if (month >= 3 && month <= 5) {
    return "Spring release window optimal for new IPs";
  }
  if (month >= 6 && month <= 8) {
    return "Summer lull - good time for casual games";
  }
  return "Current period suitable for any release strategy";
}

function displayProjectStatus(project) {
  if (!project) {
    outputToDisplay("No active project.");
    return;
  }

  outputToDisplay(`\n=== Project Status: ${project.name || "Unnamed Project"} ===`);
  outputToDisplay(`Type: ${project.genre || "Unknown"} (${project.subgenre || "Unknown"})`);
  outputToDisplay(`Phase: ${capitalizeFirst(project.phase)}`);
  
  // Show progress based on phase
  const progress = project.progress || 0;
  outputToDisplay(`Progress: ${Math.floor(progress)}%`);
  
  // Phase-specific details
  switch(project.phase) {
    case 'planning':
      if (project.planningData) {
        displayPlanningStatus(project);
      } else {
        outputToDisplay("Planning phase initialized. Use planning commands to set up your project.");
      }
      break;
    case 'development':
      outputToDisplay(`Development Time: Week ${project.startDate ? (gameState.weekNumber - project.startDate) : "?"}/${project.estimatedCompletionWeeks || "?"}`);
      outputToDisplay(`Team Morale: ${project.teamMorale || 0}%`);
      outputToDisplay(`Quality Rating: ${Math.floor(project.quality || 0)}%`);
      break;
    case 'testing':
      if (project.testingMetrics) {
        outputToDisplay(`Bugs Found: ${project.testingMetrics.bugsFound || 0}`);
        outputToDisplay(`Bugs Fixed: ${project.testingMetrics.bugsFixed || 0}`);
        
        const testsDone = Object.entries(project.testingMetrics.testsConducted || {})
          .filter(([_, done]) => done)
          .map(([test, _]) => capitalizeFirst(test))
          .join(", ");
        
        outputToDisplay(`Tests Completed: ${testsDone || "None"}`);
      }
      break;
    case 'release':
      outputToDisplay(`Bugs Remaining: ${project.bugs || 0}`);
      if (project.bugs > 0 && project.testingMetrics?.bugSeverity) {
        outputToDisplay(`- Critical: ${project.testingMetrics.bugSeverity.critical || 0}`);
        outputToDisplay(`- Major: ${project.testingMetrics.bugSeverity.major || 0}`);
        outputToDisplay(`- Minor: ${project.testingMetrics.bugSeverity.minor || 0}`);
      }
      break;
  }
  
  // Show current command options
  outputToDisplay("\nAvailable Commands:");
  if (project.phase === 'planning') {
    outputToDisplay("- feature add [name] [size] - Add new feature");
    outputToDisplay("- complete planning - Finish planning phase");
  } else if (project.phase === 'development') {
    outputToDisplay("- advance time - Continue development");
    outputToDisplay("- check status - Check current status");
  } else if (project.phase === 'testing') {
    outputToDisplay("- test [type] - Run tests (unit/integration/playtest)");
  } else if (project.phase === 'release') {
    outputToDisplay("- fix bugs - Address remaining issues");
    outputToDisplay("- release - Launch the game");
  }
}

window.displayErrorMessage = displayErrorMessage;
window.validateGameState = validateGameState;
window.displayProjectStatus = displayProjectStatus;
