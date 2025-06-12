// Constants for production phase
const PRODUCTION_MILESTONES = {
  DESIGN_REVIEW: 0.25,
  FEATURE_COMPLETE: 0.5,
  ALPHA: 0.75,
  BETA: 0.9
};

const DEVELOPMENT_RISKS = {
  SCOPE_CREEP: { probability: 0.15, impact: -10, description: "Feature creep is slowing development" },
  TECHNICAL_DEBT: { probability: 0.2, impact: -5, description: "Technical debt is accumulating" },
  BREAKTHROUGH: { probability: 0.1, impact: 15, description: "Team made a technical breakthrough!" }
};

const PHASE_SEQUENCE = ['planning', 'development', 'testing', 'release'];

const PHASE_REQUIREMENTS = {
  planning: {
    required: ['features', 'staffAssignments', 'resourceAllocation'],
    transition: ['projectPlan', 'teamSetup']
  },
  development: {
    required: ['codeProgress', 'featureProgress', 'teamMorale'],
    transition: ['developmentMetrics', 'milestoneProgress']
  },
  testing: {
    required: ['bugsFound', 'qualityMetrics', 'playtestResults'],
    transition: ['testingReport', 'optimizationData']
  },
  release: {
    required: [],  
    transition: []
  }
};

const METRIC_CATEGORIES = {
  technical: {
    codeQuality: { min: 0, max: 100, weight: 0.3 },
    bugDensity: { min: 0, max: 100, weight: 0.2 },
    performance: { min: 0, max: 100, weight: 0.2 },
    architecture: { min: 0, max: 100, weight: 0.3 }
  },
  design: {
    userExperience: { min: 0, max: 100, weight: 0.25 },
    gameplayBalance: { min: 0, max: 100, weight: 0.25 },
    featureCompletion: { min: 0, max: 100, weight: 0.25 },
    contentQuality: { min: 0, max: 100, weight: 0.25 }
  },
  production: {
    teamVelocity: { min: 0, max: 100, weight: 0.2 },
    resourceEfficiency: { min: 0, max: 100, weight: 0.2 },
    milestoneAdherence: { min: 0, max: 100, weight: 0.3 },
    riskManagement: { min: 0, max: 100, weight: 0.3 }
  },
  market: {
    audienceAlignment: { min: 0, max: 100, weight: 0.3 },
    competitivePosition: { min: 0, max: 100, weight: 0.2 },
    marketTiming: { min: 0, max: 100, weight: 0.2 },
    brandLeverage: { min: 0, max: 100, weight: 0.3 }
  }
};

// Add this helper function near the top of the file with other utility functions
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

// Add new function to resolve reference
function updateProjectMetrics(project) {
  // Initialize metrics if missing
  if (!project.metrics) {
    project.metrics = {
      technical: {},
      design: {},
      production: {},
      market: {}
    };
  }

  // Update technical metrics
  project.metrics.technical = {
    codeQuality: Math.floor(Math.random() * 20 + 80),
    bugDensity: project.bugs > 0 ? Math.min(100, (project.bugs / 50)*100) : 0,
    performance: Math.floor(Math.random() * 20 + 75),
    architecture: 85
  };

  // Return updated metrics for save/load purposes
  return project.metrics;
}

// Add to exports
window.updateProjectMetrics = updateProjectMetrics;

function calculateProjectProgress(project) {
  if (!project) return 0;
  
  // Get base progress
  let progress = project.progress || 0;
  
  // Factor in phase-specific progress
  switch(project.phase) {
    case 'planning':
      const planningMilestones = ['features', 'staffAssignments', 'resourceAllocation'].filter(m => 
        project.completedMilestones?.includes(m)
      ).length;
      progress = (planningMilestones / 3) * 100;
      break;
      
    case 'development':
      // Development progress is already tracked in project.progress
      break;
      
    case 'testing':
      // Calculate testing progress based on completed tests
      if (project.testingMetrics?.testsConducted) {
        const completedTests = Object.values(project.testingMetrics.testsConducted)
          .filter(conducted => conducted).length;
        progress = (completedTests / 3) * 100;
      }
      break;
      
    case 'release':
      // Progress based on remaining bugs
      if (project.initialBugs === 0) return 100;
      const bugsFixed = project.initialBugs - project.bugs;
      progress = (bugsFixed / project.initialBugs) * 100;
      break;
  }
  
  return Math.min(100, Math.max(0, progress));
}

function generateDevelopmentReport(gameState, details) {
  const { progressGain = 0, team = { efficiency: 1 }, event, previousProgress = 0 } = details;
  const project = gameState.project;
  
  outputToDisplay("\n╔════ Development Progress Report ════╗");
  
  // Progress Bar Section
  const progressBar = createProgressBar(project.progress || 0);
  outputToDisplay(`${progressBar}`);
  outputToDisplay(`Weekly Progress: +${progressGain.toFixed(1)}%`);
  outputToDisplay(`Overall: ${Math.floor(previousProgress)}% → ${Math.floor(project.progress)}%`);
  outputToDisplay("╟──────────────────────────────────╢");

  // Event Section (if any)
  if (event) {
    outputToDisplay("Event:");
    outputToDisplay(`➤ ${event.description}`);
    outputToDisplay("╟──────────────────────────────────╢");
  }

  // Team Performance Section
  outputToDisplay("Team Status:");
  outputToDisplay(`◆ Efficiency: ${Math.floor(team.efficiency * 100)}%`);
  outputToDisplay(`◆ Morale: ${Math.round(project.teamMorale)}%`);
  
  // Feature Progress Section
  if (project.planningData?.features) {
    const features = project.planningData.features;
    const completedFeatures = Math.floor(features.length * (project.progress / 100));
    outputToDisplay("\nFeature Progress:");
    outputToDisplay(`◆ Completed: ${completedFeatures}/${features.length}`);
    const featureBar = createFeatureProgressBar(completedFeatures, features.length);
    outputToDisplay(featureBar);
  }
  
  outputToDisplay("╟──────────────────────────────────╢");

  // Quality Metrics Section
  outputToDisplay("Development Metrics:");
  const codeQuality = calculateCodeQuality(gameState);
  const technicalDebt = calculateTechnicalDebt(gameState);
  outputToDisplay(`◆ Code Quality: ${codeQuality}%`);
  outputToDisplay(`◆ Technical Debt: ${technicalDebt}%`);
  
  // Time Estimation Section
  const timeRemaining = estimateTimeRemaining(gameState);
  outputToDisplay("\nProject Timeline:");
  outputToDisplay(`◆ Remaining Time: ${timeRemaining} weeks`);
  
  // Recommendations Section (if needed)
  if (technicalDebt > 30 || project.teamMorale < 70) {
    outputToDisplay("\nRecommendations:");
    if (technicalDebt > 30) {
      outputToDisplay("! Consider addressing technical debt");
    }
    if (project.teamMorale < 70) {
      outputToDisplay("! Team morale needs attention");
    }
  }
  
  outputToDisplay("╚════════════════════════════════════╝");
}

function createProgressBar(progress) {
  const width = 30;
  const filled = Math.floor((progress / 100) * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  return `Progress: [${bar}] ${Math.floor(progress)}%`;
}

function createFeatureProgressBar(completed, total) {
  const width = 20;
  const filled = Math.floor((completed / total) * width);
  const bar = "■".repeat(filled) + "□".repeat(width - filled);
  return `[${bar}] ${completed}/${total}`;
}

function calculateCodeQuality(gameState) {
  const project = gameState.project;
  // Base quality is 50-90%
  const baseQuality = 50 + (project.progress / 2.5);
  // If staff exists, their skills affect quality
  const staffBonus = gameState.staff.length > 0 ? calculateTeamEfficiency(gameState).efficiency * 10 : 0;
  return Math.min(100, Math.floor(baseQuality + staffBonus));
}

function calculateTechnicalDebt(gameState) {
  const project = gameState.project;
  // Technical debt increases with progress but can be mitigated by quality focus
  const baseTD = project.progress / 3;
  // Quality focus reduces technical debt
  const qualityModifier = project.priority === 'quality' ? 0.7 : (project.priority === 'speed' ? 1.3 : 1.0);
  return Math.floor(baseTD * qualityModifier);
}

function estimateTimeRemaining(gameState) {
  const project = gameState.project;
  const remainingProgress = 100 - project.progress;
  // Calculate weekly progress rate
  let baseRate = 5; // Solo developer
  if (gameState.staff.length > 0) {
    const team = calculateTeamEfficiency(gameState);
    baseRate = 10 * team.efficiency;
  }
  const progressRate = baseRate * (gameState.modifiers.development_speed || 1);
  
  // Calculate weeks
  const remainingWeeks = Math.ceil(remainingProgress / progressRate);
  return remainingWeeks;
}

// Add this function to check development events
function checkDevelopmentEvents(gameState) {
  const eventProbability = 0.25; // 25% chance of event per week
  const risk = Math.random();

  if (risk >= (1 - eventProbability)) {
    return DEVELOPMENT_RISKS.BREAKTHROUGH;
  } else if (risk <= eventProbability) { 
    const risks = Object.values(DEVELOPMENT_RISKS).filter(r => r !== DEVELOPMENT_RISKS.BREAKTHROUGH);
    return risks[Math.floor(Math.random() * risks.length)];
  }
  
  return null;
}

// Make sure checkDevelopmentEvents is available globally
window.checkDevelopmentEvents = checkDevelopmentEvents;

function advanceTime(gameState) {
  const weeklyCost = 100;
  let randomEvent = getRandomEvent();
  if (!randomEvent) {
    randomEvent = {
      text: "Uneventful week",
      moneyEffect: 1.0,
      moraleEffect: 0
    };
  }
  
  // Handle market effect safely
  if (randomEvent.marketEffect) {
    applyMarketEffect(gameState, randomEvent.marketEffect);
  }

  // Use nullish coalescing for critical properties
  let costModifier = randomEvent.moneyEffect ?? 1.0;
  let moraleModifier = randomEvent.moraleEffect ?? 0;
  const actualCost = weeklyCost * costModifier;

  let report = [
    "\n=== Weekly Report ===",
    randomEvent.text,
    `Financial Changes:`,
    `- Weekly Costs: $${actualCost.toFixed(2)}`,
  ];

  if (gameState.staff.length > 0) {
    const salaries = gameState.totalSalaries;
    report.push(`- Staff Salaries: $${salaries}`);
    actualCost += salaries;
  }

  gameState.moneyAmount -= actualCost;
  report.push(`- New Balance: $${gameState.moneyAmount.toFixed(2)}`);

  // Project progress
  if (gameState.project) {
    // Check if priority is set (required to start development)
    if (!gameState.project.priority && gameState.project.phase === 'planning') {
      outputToDisplay("Set development priority before continuing.");
      outputToDisplay("Use 'priority [quality/balanced/speed]' to set priority.");
      return;
    }

    // If priority is set and we're in planning, transition to development
    if (gameState.project.priority && gameState.project.phase === 'planning') {
      gameState.project.phase = 'development';
      gameState.project.status = 'development';
      gameState.project.progress = 0;
      gameState.project.phaseProgress = 0;
      outputToDisplay("\n=== Transitioning to Development Phase ===");
      outputToDisplay("Development has begun! Weekly progress will now be tracked.");
      updatePhaseIndicator(gameState.project);
    }

    // Handle development progress
    if (gameState.project.phase === 'development') {
      let previousProgress = gameState.project.progress || 0;
      
      // Calculate progress
      let baseProgress = 5; // Base progress for solo development
      if (gameState.staff.length > 0) {
        const team = calculateTeamEfficiency(gameState);
        baseProgress = 10 * team.efficiency;
      }
      
      // Apply modifiers
      let progressGain = baseProgress * (gameState.modifiers.development_speed || 1);
      
      // Handle risks and events
      const event = checkDevelopmentEvents(gameState);
      if (event) {
        progressGain *= (1 + (event.impact / 100));
        outputToDisplay(`Development Event: ${event.description}`);
      }

      // Update progress
      gameState.project.progress = Math.min(100, previousProgress + progressGain);
      gameState.project.phaseProgress = Math.min(100, (gameState.project.phaseProgress || 0) + progressGain);

      // Check for milestones
      checkProductionMilestones(gameState, previousProgress);

      // Generate development report
      generateDevelopmentReport(gameState, {
        progressGain,
        team: { efficiency: gameState.staff.length > 0 ? calculateTeamEfficiency(gameState).efficiency : 1 },
        event,
        previousProgress
      });

      // Check phase completion
      if (gameState.project.progress >= 100) {
        completeProductionPhase(gameState);
      }
    }
  }

  // Staff updates
  if (gameState.staff.length > 0) {
    processStaff(gameState);
    report.push(
      `\nTeam Status:`,
      `- Team Size: ${gameState.staff.length}`,
      `- Average Morale: ${calculateAverageMorale(gameState.staff)}%`
    );
  }

  gameState.weekNumber++;
  if (gameState.weekNumber % 4 === 0) {
    saveGame(gameState, null, true);
    report.push(`\nAutosave completed.`);
  }

  // Output the report
  report.forEach(line => outputToDisplay(line));

  updateStatusDisplay(gameState.companyName, gameState.weekNumber, gameState.moneyAmount);
  
  // If market trends exist, update them
  if (gameState.marketTrends) {
    Object.keys(gameState.marketTrends).forEach(genre => {
      gameState.marketTrends[genre].popularity *= (1 + (gameState.marketTrends[genre].growth || 0));
      // Adjust market saturation
      gameState.marketTrends[genre].saturation = 
        Math.min(1, (gameState.marketTrends[genre].saturation || 0) + Math.random() * 0.1);
    });
  }
}

function processStaff(gameState) {
  gameState.totalSalaries = gameState.staff.reduce((total, staff) => total + staff.salary, 0);
  const actualCost = 100 * (1 + (gameState.staff.length * 0.1));
  gameState.moneyAmount -= actualCost;
  
  // Update staff experience and mood
  gameState.staff.forEach(staff => {
    staff.daysWorked++;
    staff.experience += 1;
    
    // Random mood changes
    if (Math.random() < 0.2) {
      staff.mood += Math.floor(Math.random() * 11) - 5;
      staff.mood = Math.max(0, Math.min(100, staff.mood));
    }
  });
  
  // Apply team effectiveness to project progress
  if (gameState.project && gameState.project.status === 'development') {
    const teamEffectiveness = calculateTeamEffectiveness(gameState);
    gameState.project.phaseProgress += 25 * teamEffectiveness;
  }
}

function calculateTeamEffectiveness(gameState) {
  const staffCount = gameState.staff.length;
  const totalExperience = gameState.staff.reduce((total, staff) => total + staff.experience, 0);
  const averageMood = gameState.staff.reduce((total, staff) => total + staff.mood, 0) / staffCount;
  
  return (totalExperience / (staffCount * 100)) * (averageMood / 100);
}

function advanceToNextPhase(gameState) {
  const phases = ['planning', 'development', 'testing', 'release'];
  const currentIndex = phases.indexOf(gameState.project.phase);
  
  if (currentIndex < phases.length - 1) {
    gameState.project.phase = phases[currentIndex + 1];
    gameState.project.phaseProgress = 0;
    
    outputToDisplay(`\n=== Phase Complete! ===`);
    outputToDisplay(`Advancing to ${gameState.project.phase} phase...`);
    
    switch (gameState.project.phase) {
      case 'development':
        outputToDisplay("Production phase begins! Development will progress automatically.");
        break;
      case 'testing':
        outputToDisplay("Testing phase begins! Use 'test' to look for bugs and 'fix' to resolve them.");
        break;
      case 'release':
        outputToDisplay("Polish phase begins! Set your launch window with 'launch [window]'");
        break;
    }
    
    updatePhaseIndicator(gameState.project);
  }
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

function validatePhaseTransition(fromPhase, toPhase, project) {
  if (!project) return { valid: false, reason: 'No active project' };
  
  // Check if transition is valid in sequence
  const fromIndex = PHASE_SEQUENCE.indexOf(fromPhase);
  const toIndex = PHASE_SEQUENCE.indexOf(toPhase);
  if (toIndex !== fromIndex + 1) {
    return { valid: false, reason: 'Invalid phase sequence' };
  }

  // Check required data for current phase completion
  const requirements = PHASE_REQUIREMENTS[fromPhase].required;
  const missingData = requirements.filter(req => !project[req]);
  
  if (missingData.length > 0) {
    return {
      valid: false,
      reason: 'Incomplete phase requirements',
      missing: missingData
    };
  }

  // Verify transition data is prepared
  const transitionData = PHASE_REQUIREMENTS[fromPhase].transition;
  const missingTransition = transitionData.filter(data => !project[data]);
  
  if (missingTransition.length > 0) {
    return {
      valid: false,
      reason: 'Missing transition data',
      missing: missingTransition
    };
  }

  return { valid: true };
}

function transitionToPhase(gameState, newPhase) {
  let project = gameState.project;
  if (!project) return false;

  const currentPhase = project.phase;
  const validation = validatePhaseTransition(currentPhase, newPhase, project);

  if (!validation.valid) {
    outputToDisplay(`Cannot transition to ${newPhase}: ${validation.reason}`);
    if (validation.missing) {
      outputToDisplay("Missing requirements:");
      validation.missing.forEach(item => outputToDisplay(`- ${formatRequirement(item)}`));
    }
    return false;
  }

  // Store previous phase data
  project.phaseHistory = project.phaseHistory || {};
  project.phaseHistory[currentPhase] = {
    completedAt: gameState.weekNumber,
    metrics: collectPhaseMetrics(project, currentPhase),
    decisions: project.decisions ? [...project.decisions] : []
  };

  // Initialize new phase
  project.phase = newPhase;
  project.phaseProgress = 0;
  
  // Set up phase-specific data
  project = initializePhaseData(project, newPhase);

  outputToDisplay(`\n=== Transitioning to ${formatPhaseName(newPhase)} Phase ===`);
  displayPhaseObjectives(newPhase);
  
  // Save game state after transition
  saveGame(gameState, null, true);
  
  return true;
}

function initializePhaseData(project, phase) {
  switch (phase) {
    case 'planning':
      project = initializePlanningPhase(project);
      break;
    case 'development':
      project = initializeDevelopmentPhase(project);
      break;
    case 'testing':
      project = initializeTestingPhase(project);
      break;
    case 'release':
      project = initializeReleasePhase(project);
      break;
  }
  return project;
}

function initializePlanningPhase(project) {
  return {
    ...project,
    planningData: {
      features: [],
      assignedStaff: [],
      resourceAllocation: {
        coding: 0,
        design: 0,
        testing: 0
      },
      milestones: [],
      scope: {
        minimumViable: false,
        plannedFeatures: [],
        stretchGoals: []
      },
      estimates: {
        timeRequired: 0,
        costEstimate: 0,
        staffingNeeds: 0
      },
      decisions: []
    }
  };
}

function updateProjectPlan(project, decision) {
  let planningData = project.planningData || {};
  const impact = calculateDecisionImpact(decision);
  
  switch(decision.type) {
    case 'feature':
      planningData.features.push({
        name: decision.feature,
        complexity: impact.complexity,
        timeEstimate: impact.time,
        costEstimate: impact.cost
      });
      break;
      
    case 'staff':
      planningData.assignedStaff.push({
        id: decision.staffId,
        role: decision.role,
        allocation: decision.allocation
      });
      break;
      
    case 'resource':
      planningData.resourceAllocation[decision.resource] = decision.amount;
      break;
      
    case 'scope':
      planningData.scope = {
        ...planningData.scope,
        ...decision.scope
      };
      break;
      
    case 'milestone':
      planningData.milestones.push({
        name: decision.name,
        week: decision.week,
        goals: decision.goals
      });
      break;
  }
  
  // Recalculate project estimates
  planningData.estimates = calculateUpdatedEstimates(planningData);
  
  // Record decision
  planningData.decisions.push({
    type: decision.type,
    timestamp: new Date(),
    details: decision
  });
  
  return { ...project, planningData };
}

function calculateDecisionImpact(decision) {
  const baseImpacts = {
    feature: {
      small: { complexity: 1, time: 1, cost: 1000 },
      medium: { complexity: 2, time: 2, cost: 2000 },
      large: { complexity: 3, time: 4, cost: 4000 }
    }
  };
  
  switch(decision.type) {
    case 'feature':
      const size = decision.size || 'medium';
      return baseImpacts.feature[size];
      
    case 'staff':
      return {
        productivity: 1 + (decision.allocation / 100),
        cost: decision.allocation * 100
      };
      
    default:
      return {
        complexity: 1,
        time: 1,
        cost: 1000
      };
  }
}

function calculateUpdatedEstimates(planningData) {
  const baseEstimates = {
    timeRequired: 0,
    costEstimate: 0,
    staffingNeeds: 0
  };
  
  // Sum up feature requirements
  planningData.features.forEach(feature => {
    baseEstimates.timeRequired += feature.timeEstimate;
    baseEstimates.costEstimate += feature.costEstimate;
    baseEstimates.staffingNeeds += Math.ceil(feature.complexity / 2);
  });
  
  // Adjust for staff assignments
  if (planningData.assignedStaff.length > 0) {
    const staffEfficiency = calculateStaffEfficiency(planningData.assignedStaff);
    baseEstimates.timeRequired = Math.ceil(baseEstimates.timeRequired / staffEfficiency);
  }
  
  // Adjust for resource allocation
  const resourceEfficiency = calculateResourceEfficiency(planningData.resourceAllocation);
  baseEstimates.timeRequired = Math.ceil(baseEstimates.timeRequired * resourceEfficiency);
  
  return baseEstimates;
}

function displayPlanningStatus(project) {
  if (!project || !project.planningData) {
    outputToDisplay("No active project in planning phase.");
    return;
  }
  
  outputToDisplay("\n=== Project Planning Status ===");
  outputToDisplay(`Project: ${project.name}`);
  outputToDisplay(`Genre: ${project.genre} (${project.subgenre})`);
  
  // Feature List
  outputToDisplay("\nPlanned Features:");
  if (project.planningData.features.length === 0) {
    outputToDisplay("No features planned yet");
  } else {
    project.planningData.features.forEach(feature => {
      outputToDisplay(`- ${feature.name} (Complexity: ${feature.complexity})`);
      outputToDisplay(`  Time: ${feature.timeEstimate} weeks | Cost: $${feature.costEstimate}`);
    });
  }
  
  // Team Assignments
  outputToDisplay("\nTeam Assignments:");
  if (project.planningData.assignedStaff.length === 0) {
    outputToDisplay("No staff assigned yet");
  } else {
    project.planningData.assignedStaff.forEach(assignment => {
      outputToDisplay(`- ${assignment.role}: ${assignment.allocation}% allocated`);
    });
  }
  
  // Resource Allocation
  outputToDisplay("\nResource Allocation:");
  Object.entries(project.planningData.resourceAllocation).forEach(([resource, amount]) => {
    outputToDisplay(`${resource}: ${amount}%`);
  });
  
  // Project Estimates
  const estimates = project.planningData.estimates;
  outputToDisplay("\nCurrent Estimates:");
  outputToDisplay(`Development Time: ${estimates.timeRequired} weeks`);
  outputToDisplay(`Budget Required: $${estimates.costEstimate}`);
  outputToDisplay(`Recommended Staff: ${estimates.staffingNeeds} developers`);
  
  // Milestones
  outputToDisplay("\nPlanned Milestones:");
  if (project.planningData.milestones.length === 0) {
    outputToDisplay("No milestones set");
  } else {
    project.planningData.milestones.forEach(milestone => {
      outputToDisplay(`- Week ${milestone.week}: ${milestone.name}`);
    });
  }
  
  // Next Steps
  outputToDisplay("\nAvailable Actions:");
  outputToDisplay("- feature add [name] [size] - Add new feature");
  outputToDisplay("- assign [staff] [role] [allocation] - Assign team member");
  outputToDisplay("- allocate [resource] [amount] - Adjust resource allocation");
  outputToDisplay("- milestone add [week] [name] - Set project milestone");
  outputToDisplay("- complete planning - Finish planning phase");
}

function calculateTeamEfficiency(gameState) {
  if (!gameState.staff || gameState.staff.length === 0) {
    return { 
      efficiency: 1,  
      factors: { 
        size: 1, 
        experience: 1, 
        morale: 1 
      } 
    };
  }

  let factors = {
    size: Math.min(1.5, 1 + (gameState.staff.length * 0.1)),
    experience: calculateTeamExperience(gameState.staff),
    morale: (gameState.project?.teamMorale || 100) / 100
  };

  let efficiency = Object.values(factors).reduce((a, b) => a * b, 1);
  return { efficiency, factors };
}

function calculateTeamExperience(staff) {
  if (!staff || staff.length === 0) return 1;
  const avgExperience = staff.reduce((sum, member) => sum + member.experience, 0) / staff.length;
  return Math.min(1.5, 1 + (avgExperience / 365));
}

function updateTeamMorale(gameState, change) {
  gameState.project.teamMorale = Math.max(0, Math.min(100, gameState.project.teamMorale + change));
  
  // Apply morale effects to staff
  if (gameState.staff) {
    gameState.staff.forEach(staff => {
      staff.mood = Math.max(0, Math.min(100, staff.mood + (change / 2)));
    });
  }
}

function handlePolishPhase(gameState, command) {
  if (!validatePhase(gameState, 'release')) return false;
  
  if (command === 'fix') {
    handleBugFixing(gameState);
  } else if (command === 'release') {
    handleReleaseCommand(gameState);
  } else {
    displayPolishOptions(gameState);
  }
  return true;
}

function displayPolishOptions(gameState) {
  outputToDisplay("\n=== Final Polish Phase ===");
  
  if (gameState.project.bugs > 0) {
    const severity = gameState.project.testingMetrics.bugSeverity;
    outputToDisplay("Remaining Bugs:");
    outputToDisplay(`Critical: ${severity.critical}`);
    outputToDisplay(`Major: ${severity.major}`);
    outputToDisplay(`Minor: ${severity.minor}`);
    outputToDisplay("\nAvailable Commands:");
    outputToDisplay("- 'fix bugs' - Continue fixing issues");
    outputToDisplay("- 'release' - Launch with current bug status");
  } else {
    outputToDisplay("\nAll bugs fixed! Ready for release.");
    outputToDisplay("Use 'release' to launch your game")
  }
}

function updatePolishProgress(gameState) {
  const project = gameState.project;
  if (!project || project.phase !== 'release') {
    return;
  }

  // Progress is now based solely on bug status
  const hasUnfixedBugs = project.bugs > 0;
  if (hasUnfixedBugs) {
    outputToDisplay("\n=== Polish Phase ===");
    outputToDisplay("Bugs remaining: " + project.bugs);
    const severity = project.testingMetrics.bugSeverity;
    outputToDisplay("Critical: " + severity.critical);
    outputToDisplay("Major: " + severity.major);
    outputToDisplay("Minor: " + severity.minor);
    outputToDisplay("\nOptions:");
    outputToDisplay("- 'fix bugs' to continue fixing bugs");
    outputToDisplay("- 'release' to release with current bugs");
    outputToDisplay("\nNote: Releasing with bugs will impact:");
    outputToDisplay("- Game quality and reviews");
    outputToDisplay("- Sales potential");
    outputToDisplay("- Company reputation");
  } else {
    outputToDisplay("\n All bugs fixed!");
    outputToDisplay("Game is ready for release. Use 'release' command to launch.");
  }
}

function isReadyForRelease(project) {
  return project?.phase === 'release';
}

function handleReleaseCommand(gameState) {
  if (!isReadyForRelease(gameState.project)) {
    outputToDisplay("Project not ready for release!");
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

function proceedWithRelease(gameState) {
  try {
    // Validate game state exists
    if (!gameState || !gameState.project) {
      throw new Error("No active project found");
    }

    // Set default values if missing
    gameState.project.targetAudience = gameState.project.targetAudience || 'all';
    gameState.project.marketingStrategy = gameState.project.marketingStrategy || 'balanced';
    // Ensure budget is set for revenue calculation
    if (!gameState.project.budget || isNaN(gameState.project.budget)) {
      gameState.project.budget = 10000;
    }
    // Initialize missing metrics if needed
    if (!gameState.project.testingMetrics) {
      gameState.project.testingMetrics = {
        bugSeverity: {
          critical: Math.floor((gameState.project.bugs || 0) * 0.2),
          major: Math.floor((gameState.project.bugs || 0) * 0.3),
          minor: Math.ceil((gameState.project.bugs || 0) * 0.5)
        },
        bugsFound: gameState.project.bugs || 0,
        bugsFixed: 0,
        playtestScore: 70 // Default playtest score
      };
    }
    // Ensure reputation data exists
    if (!gameState.reputation) {
      gameState.reputation = {
        casual: { fans: 0, loyalty: 0.5, expectations: 50 },
        hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
        critics: { fans: 0, loyalty: 0.5, expectations: 50 },
        lastMentions: [],
        marketPresence: 0
      };
    }
    // --- NEW: Ensure metrics are up to date for reviews ---
    if (typeof updateProjectMetrics === 'function') {
      gameState.project.metrics = updateProjectMetrics(gameState.project);
    }
    // Calculate final metrics
    const finalQuality = calculateFinalQuality(gameState);
    const releaseStats = calculateReleaseStats(gameState, finalQuality);
    if (!releaseStats) {
      throw new Error("Failed to calculate release statistics");
    }
    // Calculate bug impact
    const bugImpact = calculateBugImpact(gameState.project);
    // Apply bug impacts with validation
    releaseStats.successScore = Math.max(0, releaseStats.successScore - (bugImpact?.scoreReduction || 0));
    releaseStats.revenue = Math.floor(releaseStats.revenue * (1 - (bugImpact?.revenueLoss || 0)));
    // Create completed game record
    const completedGame = {
      name: gameState.project.name || "Untitled Game",
      genre: gameState.project.genre,
      subgenre: gameState.project.subgenre,
      elements: gameState.project.elements || [],
      developmentTime: gameState.weekNumber - (gameState.project.startDate || 0),
      quality: finalQuality,
      successScore: releaseStats.successScore,
      revenue: releaseStats.revenue,
      budget: gameState.project.budget, // Ensure budget is saved for history
      metrics: gameState.project.metrics, // <-- Add metrics for reviews
      date: gameState.weekNumber,
      marketingStrategy: gameState.project.marketingStrategy,
      targetAudience: gameState.project.targetAudience || 'all',
      reception: releaseStats.reception || {},
      bugs: {
        total: gameState.project.bugs || 0,
        severity: gameState.project.testingMetrics.bugSeverity || {
          critical: 0,
          major: 0,
          minor: 0
        }
      }
    };

    // Initialize game history if needed
    if (!Array.isArray(gameState.gameHistory)) {
      gameState.gameHistory = [];
    }

    // Add to game history
    gameState.gameHistory.push(completedGame);

    // Update company reputation
    if (typeof updateReputation === 'function') {
      updateReputation(gameState, completedGame);
    }

    // Display results
    displayReleaseResults(completedGame, releaseStats, bugImpact);

    // Reset project and update UI
    gameState.project = null;
    if (typeof updatePhaseIndicator === 'function') {
      updatePhaseIndicator(null);
    }

    // Autosave
    if (typeof saveGame === 'function') {
      saveGame(gameState, null, true);
    }

    // Important: Hide the phase indicator after successful release
    const phaseIndicator = document.getElementById('phase-indicator');
    if (phaseIndicator) {
      phaseIndicator.classList.add('hidden');
    }

    return true;

  } catch (error) {
    console.error('Release failed:', error);
    outputToDisplay("\n=== Release Error ===");
    outputToDisplay(`Error: ${error.message}`);
    outputToDisplay("\nDebug Information:");
    outputToDisplay(`Project exists: ${!!gameState?.project}`);
    outputToDisplay(`Target audience: ${gameState?.project?.targetAudience}`);
    outputToDisplay(`Marketing strategy: ${gameState?.project?.marketingStrategy}`);
    outputToDisplay(`Genre: ${gameState?.project?.genre}`);
    outputToDisplay("\nRequired settings:");
    outputToDisplay("1. Marketing strategy ('marketing [strategy]')");
    outputToDisplay("2. Launch window ('launch [window]')");
    outputToDisplay("3. Target audience (should be set during development)");
    return false;
  }
}

function displayReleaseResults(game, stats, bugImpact) {
  outputToDisplay("\n=== Game Release Results ===");
  outputToDisplay(`Title: ${game.name}`);
  outputToDisplay(`Genre: ${game.genre} (${game.subgenre})`);
  outputToDisplay(`Development Time: ${game.developmentTime} weeks`);
  
  outputToDisplay("\nQuality Metrics:");
  outputToDisplay(`Base Quality: ${game.quality}%`);
  
  // Show bug impact if any
  if (game.bugs.total > 0) {
    outputToDisplay("\nBug Impact:");
    outputToDisplay(`Total Bugs at Release: ${game.bugs.total}`);
    outputToDisplay(`- Critical: ${game.bugs.severity.critical}`);
    outputToDisplay(`- Major: ${game.bugs.severity.major}`);
    outputToDisplay(`- Minor: ${game.bugs.severity.minor}`);
    outputToDisplay(`Quality Reduction: -${Math.round(bugImpact.scoreReduction)} points`);
  }
  
  outputToDisplay("\nFinal Results:");
  outputToDisplay(`Success Score: ${stats.successScore}/100`);
  outputToDisplay(`Revenue: $${stats.revenue}`);
  if (bugImpact?.revenueLoss > 0) {
    outputToDisplay(`Revenue Loss from Bugs: -${Math.round(bugImpact.revenueLoss * 100)}%`);
  }
  
  outputToDisplay("\nAudience Reception:");
  Object.entries(stats.reception).forEach(([audience, score]) => {
    outputToDisplay(`${formatAudienceName(audience)}: ${score}/100`);
  });

  // Show special achievements or warnings
  if (stats.successScore >= 90) {
    outputToDisplay("\nSpecial Achievement: Masterpiece! ");
  } else if (stats.successScore >= 80) {
    outputToDisplay("\nSpecial Achievement: Critical Success! ");
  } else if (game.bugs.total > 0) {
    outputToDisplay("\nWarning: Game released with known issues!");
    outputToDisplay("This may affect long-term reputation.");
  }

  // Show future outlook
  outputToDisplay("\nMarket Outlook:");
  if (game.bugs.total === 0) {
    outputToDisplay("- Strong foundation for future projects");
    outputToDisplay("- Positive impact on company reputation");
  } else {
    outputToDisplay("- Bug fixes may be required post-release");
    outputToDisplay("- Consider quality focus for next project");
  }
}

function formatCategoryName(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatMetricName(metric) {
  return metric
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatTrendName(trend) {
  return trend
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/_/g, ' ');
}

function formatTrendIndicator(change) {
  if (change > 0) return `↑ +${change}%`;
  if (change < 0) return `↓ ${Math.abs(change)}%`;
  return '→ 0%';
}

function validatePhase(gameState, requiredPhase) {
  if (!gameState.project) {
    outputToDisplay("No active project.");
    return false;
  }
  
  // Handle 'polish' as an alias for 'release' phase
  const currentPhase = gameState.project.phase;
  if (requiredPhase === 'polish') {
    requiredPhase = 'release';
  }
  
  if (currentPhase !== requiredPhase) {
    outputToDisplay(`This command can only be used during the ${requiredPhase} phase.`);
    return false;
  }
  return true;
}

function calculateFinalQuality(gameState) {
  if (!gameState?.project) return 0;

  let quality = gameState.project.quality || 0;

  // Base quality modifications
  const priority = gameState.project.priority || 'balanced';
  switch(priority) {
    case 'quality':
      quality *= 1.2;
      break;
    case 'speed':
      quality *= 0.8;
      break;
  }

  // Team effects
  const teamEfficiency = calculateTeamEfficiency(gameState)?.efficiency || 1;
  quality *= (0.8 + (teamEfficiency * 0.4));

  // Technology effects
  quality *= (gameState.modifiers?.quality || 1);

  // Account for bugs
  if (gameState.project.bugs > 0) {
    const bugPenalty = Math.min(0.5, gameState.project.bugs * 0.02);
    quality *= (1 - bugPenalty);
  }

  return Math.min(100, Math.max(0, Math.round(quality)));
}

function calculateAudienceReception(successScore, project, gameState) {
  const reception = {
    casual: 0,
    hardcore: 0,
    critics: 0
  };

  if (!project || typeof successScore !== 'number') {
    console.error('Invalid data for reception calculation:', { project, successScore });
    return reception;
  }

  // Define default preferences as fallback
  const DEFAULT_PREFERENCES = {
    casual: { [project.genre.toLowerCase()]: 1.0 },
    hardcore: { [project.genre.toLowerCase()]: 1.0 },
    critics: { [project.genre.toLowerCase()]: 1.0 },
    all: { [project.genre.toLowerCase()]: 1.0 }
  };

  try {
    const targetAudience = project.targetAudience || 'all';
    const baseScore = successScore * 0.8;

    // Get audience preferences with robust fallback chain
    let targetPreferences;
    
    if (window.AUDIENCE_SEGMENTS && window.AUDIENCE_SEGMENTS[targetAudience] && 
        window.AUDIENCE_SEGMENTS[targetAudience].preferences) {
      targetPreferences = window.AUDIENCE_SEGMENTS[targetAudience].preferences;
    } else if (window.AUDIENCE_SEGMENTS && window.AUDIENCE_SEGMENTS.all && 
              window.AUDIENCE_SEGMENTS.all.preferences) {
      targetPreferences = window.AUDIENCE_SEGMENTS.all.preferences;
    } else {
      targetPreferences = DEFAULT_PREFERENCES[targetAudience] || DEFAULT_PREFERENCES.all;
    }

    const genreMultiplier = targetPreferences[project.genre.toLowerCase()] || 1.0;

    // Apply balanced reception with safeguards
    reception.casual = Math.min(100, baseScore * 1.0 * genreMultiplier);
    reception.hardcore = Math.min(100, baseScore * 1.0 * genreMultiplier);
    reception.critics = Math.min(100, baseScore * 1.0 * genreMultiplier);

    // Apply reputation effects if available
    if (gameState && gameState.reputation) {
      Object.keys(reception).forEach(audience => {
        if (gameState.reputation[audience]) {
          const loyalty = gameState.reputation[audience].loyalty || 0.5;
          reception[audience] *= (0.9 + (loyalty * 0.2));
          reception[audience] = Math.min(100, Math.round(reception[audience]));
        }
      });
    }
  } catch (error) {
    console.error('Error in audience reception calculation:', error);
    // Provide safe default values
    Object.keys(reception).forEach(key => {
      reception[key] = Math.round(successScore * 0.8);
    });
  }

  // Ensure all values are valid numbers
  Object.keys(reception).forEach(key => {
    reception[key] = Math.min(100, Math.max(0, Math.round(reception[key] || 0)));
  });

  return reception;
}

function calculateReleaseStats(gameState, finalQuality) {
  return {
    successScore: finalQuality,
    revenue: Math.floor(finalQuality * 10000),
    reception: calculateAudienceReception(finalQuality, gameState.project, gameState)
  };
}

function calculateBugImpact(project) {
  const severity = project.testingMetrics.bugSeverity;
  const impact = {
    scoreReduction: 0,
    revenueLoss: 0,
    reputationDamage: 0
  };

  // Calculate impact based on bug severity
  if (severity.critical > 0) {
    impact.scoreReduction += severity.critical * 5;  // -5 points per critical bug
    impact.revenueLoss += severity.critical * 0.05;  // -5% revenue per critical bug
    impact.reputationDamage += severity.critical * 0.1;  // -10% reputation per critical bug
  }

  if (severity.major > 0) {
    impact.scoreReduction += severity.major * 2;  // -2 points per major bug
    impact.revenueLoss += severity.major * 0.02;  // -2% revenue per major bug
    impact.reputationDamage += severity.major * 0.05;  // -5% reputation per major bug
  }

  if (severity.minor > 0) {
    impact.scoreReduction += severity.minor * 0.5;  // -0.5 points per minor bug
    impact.revenueLoss += severity.minor * 0.01;  // -1% revenue per minor bug
    impact.reputationDamage += severity.minor * 0.01;  // -1% reputation per minor bug
  }

  // Cap the impacts at reasonable maximums
  impact.scoreReduction = Math.min(50, impact.scoreReduction);  // Max 50 point reduction
  impact.revenueLoss = Math.min(0.75, impact.revenueLoss);     // Max 75% revenue loss
  impact.reputationDamage = Math.min(0.5, impact.reputationDamage);  // Max 50% reputation loss

  return impact;
}

function checkPhaseCompletion(gameState) {
  const project = gameState.project;
  if (!project) return false;

  const phase = project.phase;
  const requirements = PHASE_REQUIREMENTS[phase]?.required || [];
  
  // Check all required fields have values
  const missing = requirements.filter(req => {
    const value = project[req] || project.planningData?.[req];
    return !value || (Array.isArray(value) && value.length === 0);
  });
  
  return missing.length === 0;
}

const RANDOM_EVENTS = {
  positive: [],
  neutral: [],
  negative: []
};
window.RANDOM_EVENTS = RANDOM_EVENTS;

function getRandomEvent() {
  // Base event probabilities
  const eventChances = {
    positive: 0.2,  // 20% chance
    neutral: 0.6,   // 60% chance
    negative: 0.2   // 20% chance
  };

  const roll = Math.random();
  let eventType;

  if (roll < eventChances.positive) {
    eventType = 'positive';
  } else if (roll < eventChances.positive + eventChances.neutral) {
    eventType = 'neutral';
  } else {
    eventType = 'negative';
  }

  // Get random event from chosen type
  let events = RANDOM_EVENTS[eventType];
  if (!events || events.length === 0) {
    console.warn(`No events for ${eventType}, using neutral`);
    events = RANDOM_EVENTS.neutral || []; 
  }

  // Ensure event is defined with default values to prevent undefined errors
  const event = events[Math.floor(Math.random() * events.length)] || {
    text: "Uneventful week",
    moneyEffect: 1.0,
    moraleEffect: 0
  };

  // Add market effect if needed (20% chance)
  if (Math.random() < 0.2) {
    event.marketEffect = {
      type: Math.random() < 0.5 ? 'growth' : 'decline',
      amount: Math.random() * 0.1  // 0-10% change
    };
  }

  return event;
}

// Make sure getRandomEvent is available globally
window.getRandomEvent = getRandomEvent;

function applyMarketEffect(gameState, effect) {
  if (!gameState.marketTrends) {
    gameState.marketTrends = initializeMarketTrends(gameState);
    return;
  }
  
  Object.keys(gameState.marketTrends).forEach(genre => {
    const trendData = gameState.marketTrends[genre];
    if (effect.type === 'growth') {
      trendData.growth += effect.amount;
      trendData.popularity *= (1 + effect.amount);
    } else {
      trendData.growth -= effect.amount;
      trendData.popularity *= (1 - effect.amount);
    }
    
    // Keep values in reasonable range
    trendData.popularity = Math.max(0.1, Math.min(2.0, trendData.popularity));
    trendData.growth = Math.max(-0.2, Math.min(0.3, trendData.growth));
  });
}

// Make function available globally
window.applyMarketEffect = applyMarketEffect;

function checkProductionMilestones(gameState, previousProgress) {
  const project = gameState.project;
  
  for (const [milestone, threshold] of Object.entries(PRODUCTION_MILESTONES)) {
    if (previousProgress < threshold * 100 && project.progress >= threshold * 100) {
      outputToDisplay("\n╔═══════ Milestone Reached! ═══════╗");
      outputToDisplay(`Milestone: ${milestone.replace(/_/g, ' ')}`);
      outputToDisplay("──────────────────────────");
      
      switch (milestone) {
        case 'DESIGN_REVIEW':
          outputToDisplay("✓ Design review completed");
          outputToDisplay("► Team efficiency increased by 10%");
          gameState.modifiers.development_speed *= 1.1;
          break;
        case 'FEATURE_COMPLETE':
          outputToDisplay("✓ Core features implemented");
          outputToDisplay("► Bug rate reduced by 10%");
          gameState.modifiers.bug_rate *= 0.9;
          break;
        case 'ALPHA':
          outputToDisplay("✓ Alpha state reached");
          outputToDisplay("► Quality bonus increased by 10%");
          gameState.modifiers.quality *= 1.1;
          break;
        case 'BETA':
          outputToDisplay("✓ Beta milestone achieved");
          outputToDisplay("► Bug count reduced by 20%");
          project.bugs *= 0.8;
          break;
      }
      
      updateTeamMorale(gameState, 10);
      outputToDisplay("► Team morale improved!");
      outputToDisplay("╚════════════════════════════════════╝");
    }
  }
}

function completeProductionPhase(gameState) {
  outputToDisplay("\n=== Development Phase Complete! ===");
  outputToDisplay("All planned features have been implemented.");
  
  // Transition to testing phase
  gameState.project.phase = 'testing';
  gameState.project.phaseProgress = 0;
  
  // Initialize testing metrics
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
      critical: 0,
      major: 0,
      minor: 0
    }
  };
  
  // Generate bugs based on development quality and team factors
  const baseBugCount = 10;
  const qualityFactor = (100 - (gameState.project.quality || 50)) / 100;
  const bugRateFactor = gameState.modifiers.bug_rate || 1;
  
  gameState.project.bugs = Math.floor(baseBugCount * qualityFactor * bugRateFactor);
  
  // Distribute bugs among severity levels
  gameState.project.testingMetrics.bugSeverity = {
    critical: Math.floor(gameState.project.bugs * 0.2),
    major: Math.floor(gameState.project.bugs * 0.3),
    minor: Math.ceil(gameState.project.bugs * 0.5)
  };
  
  outputToDisplay("Project has moved to Testing Phase");
  outputToDisplay(`Initial bugs detected: ${gameState.project.bugs}`);
  outputToDisplay("\nAvailable Commands:");
  outputToDisplay("- test unit - Perform unit testing");
  outputToDisplay("- test integration - Perform integration testing");
  outputToDisplay("- test playtest - Conduct user playtesting");
  
  // Update phase indicator
  updatePhaseIndicator(gameState.project);
}

function handleTestingPhase(gameState, testType) {
  const project = gameState.project;
  
  outputToDisplay("\n╔═══════ Testing Phase ═══════╗");
  
  if (!testType) {
    outputToDisplay("──── Available Tests ────");
    outputToDisplay("• unit - Basic functionality");
    outputToDisplay("• integration - System testing");
    outputToDisplay("• playtest - User experience");
    outputToDisplay("\nUse: test [type]");
    outputToDisplay("╚═══════════════════════════╝");
    return;
  }

  if (project.phase === 'release') {
    outputToDisplay("✓ Testing phase complete");
    outputToDisplay("Use polish phase commands");
    outputToDisplay("╚═══════════════════════════╝");
    return;
  }

  if (!project.testingMetrics) {
    project.testingMetrics = {
      bugsFound: 0,
      bugsFixed: 0,
      playtestScore: 0,
      testsConducted: {
        unit: false,
        integration: false,
        playtest: false
      }
    };
  }

  if (project.testingMetrics.testsConducted[testType]) {
    outputToDisplay(`\n⚠️ ${capitalizeFirst(testType)} testing already completed`);
    
    const remainingTests = Object.entries(project.testingMetrics.testsConducted)
      .filter(([_, conducted]) => !conducted)
      .map(([type]) => type);
    
    if (remainingTests.length > 0) {
      outputToDisplay("\n──── Remaining Tests ────");
      remainingTests.forEach(test => outputToDisplay(`• ${test}`));
    } else {
      outputToDisplay("\n✨ All tests completed!");
    }
    outputToDisplay("╚═══════════════════════════╝");
    return;
  }

  // Calculate test effectiveness
  const baseEffectiveness = 0.7;
  const teamBonus = calculateTeamEfficiency(gameState)?.efficiency || 1;
  const testEffectiveness = baseEffectiveness * teamBonus * (gameState.modifiers.testing_effectiveness || 1);

  outputToDisplay(`\n──── ${capitalizeFirst(testType)} Testing ────`);
  
  // Process test results
  switch(testType) {
    case 'unit':
      handleUnitTesting(project, testEffectiveness);
      break;
    case 'integration':
      handleIntegrationTesting(project, testEffectiveness);
      break;
    case 'playtest':
      handlePlaytesting(project, testEffectiveness);
      break;
    default:
      outputToDisplay("❌ Invalid test type");
      outputToDisplay("Use: unit, integration, or playtest");
      return;
  }

  // Mark test as completed
  project.testingMetrics.testsConducted[testType] = true;
  
  // Show remaining tests
  const remainingTests = Object.entries(project.testingMetrics.testsConducted)
    .filter(([_, conducted]) => !conducted)
    .map(([type]) => type);

  if (remainingTests.length > 0) {
    outputToDisplay("\n──── Remaining Tests ────");
    remainingTests.forEach(test => outputToDisplay(`• ${test}`));
  }

  outputToDisplay("╚═══════════════════════════╝");

  // Update phase progress
  updateTestingProgress(project);
}

function handleUnitTesting(project, effectiveness) {
  // Base bugs discovered varies by effectiveness
  const baseBugsFound = Math.floor(10 * effectiveness);
  
  // Bug discovery distribution by severity
  const criticalBugs = Math.floor(baseBugsFound * 0.2);
  const majorBugs = Math.floor(baseBugsFound * 0.3);
  const minorBugs = baseBugsFound - criticalBugs - majorBugs;
  
  // Update metrics
  project.testingMetrics.bugsFound += baseBugsFound;
  project.bugs = (project.bugs || 0) + baseBugsFound;
  
  // Update bug severity distribution
  if (!project.testingMetrics.bugSeverity) {
    project.testingMetrics.bugSeverity = { critical: 0, major: 0, minor: 0 };
  }
  
  project.testingMetrics.bugSeverity.critical += criticalBugs;
  project.testingMetrics.bugSeverity.major += majorBugs;
  project.testingMetrics.bugSeverity.minor += minorBugs;
  
  outputToDisplay(`Found ${baseBugsFound} bugs through unit testing:`);
  outputToDisplay(`- Critical: ${criticalBugs}`);
  outputToDisplay(`- Major: ${majorBugs}`);
  outputToDisplay(`- Minor: ${minorBugs}`);
  
  // Quality improvements from unit testing
  const qualityGain = 5 * effectiveness;
  project.quality = (project.quality || 0) + qualityGain;
  outputToDisplay(`\nQuality improved by ${qualityGain.toFixed(1)}%`);
}

function handleIntegrationTesting(project, effectiveness) {
  // Integration testing finds more bugs than unit testing
  const baseBugsFound = Math.floor(15 * effectiveness);
  
  // Bug discovery distribution by severity
  const criticalBugs = Math.floor(baseBugsFound * 0.3); // Higher chance of critical bugs
  const majorBugs = Math.floor(baseBugsFound * 0.4);
  const minorBugs = baseBugsFound - criticalBugs - majorBugs;
  
  // Update metrics
  project.testingMetrics.bugsFound += baseBugsFound;
  project.bugs = (project.bugs || 0) + baseBugsFound;
  
  // Update bug severity distribution
  if (!project.testingMetrics.bugSeverity) {
    project.testingMetrics.bugSeverity = { critical: 0, major: 0, minor: 0 };
  }
  
  project.testingMetrics.bugSeverity.critical += criticalBugs;
  project.testingMetrics.bugSeverity.major += majorBugs;
  project.testingMetrics.bugSeverity.minor += minorBugs;
  
  outputToDisplay(`Found ${baseBugsFound} bugs through integration testing:`);
  outputToDisplay(`- Critical: ${criticalBugs}`);
  outputToDisplay(`- Major: ${majorBugs}`);
  outputToDisplay(`- Minor: ${minorBugs}`);
  
  // Quality improvements from integration testing
  const qualityGain = 7 * effectiveness;
  project.quality = (project.quality || 0) + qualityGain;
  outputToDisplay(`\nQuality improved by ${qualityGain.toFixed(1)}%`);
}

function handlePlaytesting(project, effectiveness) {
  // Playtesting finds user-facing issues
  const baseBugsFound = Math.floor(8 * effectiveness);
  
  // Bug discovery distribution by severity
  const criticalBugs = Math.floor(baseBugsFound * 0.1);
  const majorBugs = Math.floor(baseBugsFound * 0.3);
  const minorBugs = baseBugsFound - criticalBugs - majorBugs;
  
  // Update metrics
  project.testingMetrics.bugsFound += baseBugsFound;
  project.bugs = (project.bugs || 0) + baseBugsFound;
  
  // Update bug severity distribution
  if (!project.testingMetrics.bugSeverity) {
    project.testingMetrics.bugSeverity = { critical: 0, major: 0, minor: 0 };
  }
  
  project.testingMetrics.bugSeverity.critical += criticalBugs;
  project.testingMetrics.bugSeverity.major += majorBugs;
  project.testingMetrics.bugSeverity.minor += minorBugs;
  
  // Playtest score calculation (50-100 scale)
  const baseScore = 50 + (Math.random() * 30);
  const qualityBonus = ((project.quality || 0) / 100) * 20;
  project.testingMetrics.playtestScore = Math.min(100, Math.floor(baseScore + qualityBonus));
  
  outputToDisplay(`Found ${baseBugsFound} bugs through playtesting:`);
  outputToDisplay(`- Critical: ${criticalBugs}`);
  outputToDisplay(`- Major: ${majorBugs}`);
  outputToDisplay(`- Minor: ${minorBugs}`);
  
  outputToDisplay(`\nPlaytest Score: ${project.testingMetrics.playtestScore}/100`);
  
  // Quality improvements from playtesting
  const qualityGain = 10 * effectiveness;
  project.quality = (project.quality || 0) + qualityGain;
  outputToDisplay(`Quality improved by ${qualityGain.toFixed(1)}%`);
}

function updateTestingProgress(project) {
  if (!project.testingMetrics) return;
  
  const testTypes = Object.keys(project.testingMetrics.testsConducted);
  const completedTests = testTypes.filter(type => project.testingMetrics.testsConducted[type]).length;
  const progress = (completedTests / testTypes.length) * 100;
  
  project.phaseProgress = progress;
  
  // Check if testing phase is complete
  if (progress >= 100) {
    project.phase = 'release';
    project.phaseProgress = 0;
    
    // Initialize bug tracking for release phase
    project.initialBugs = project.bugs;
    
    outputToDisplay("\n=== Testing Phase Complete! ===");
    outputToDisplay("Project has entered Polish Phase");
    outputToDisplay(`Total bugs found: ${project.bugs}`);
    outputToDisplay(`Critical: ${project.testingMetrics.bugSeverity.critical}`);
    outputToDisplay(`Major: ${project.testingMetrics.bugSeverity.major}`);
    outputToDisplay(`Minor: ${project.testingMetrics.bugSeverity.minor}`);
    outputToDisplay("\nAvailable Commands:");
    outputToDisplay("- fix bugs - Fix remaining issues");
    outputToDisplay("- release - Release the game");
  }
}

// Make handleTestingPhase function available globally
window.handleTestingPhase = handleTestingPhase;

function calculateQualityGain(fixedBugs) {
  const qualityGainFactors = {
    critical: 2.0,  // Critical bugs have biggest quality impact
    major: 1.0,     // Major bugs have moderate impact
    minor: 0.5      // Minor bugs have smallest impact
  };

  let totalGain = 0;
  Object.entries(fixedBugs).forEach(([severity, count]) => {
    totalGain += count * qualityGainFactors[severity];
  });

  // Cap the maximum quality gain per session
  return Math.min(10, totalGain);
}

// Make sure calculateQualityGain is available globally
window.calculateQualityGain = calculateQualityGain;
