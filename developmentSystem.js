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

const POLISH_PHASES = {
  MARKETING: { threshold: 0.25, name: 'Marketing Campaign' },
  OPTIMIZATION: { threshold: 0.50, name: 'Final Optimization' },
  CERTIFICATION: { threshold: 0.75, name: 'Release Certification' },
  LAUNCH_PREP: { threshold: 0.90, name: 'Launch Preparation' }
};

const LAUNCH_WINDOWS = {
  IMMEDIATE: {
    name: "Immediate Release",
    riskFactor: 1.2,
    costModifier: 0.8,
    description: "Release as soon as possible. Higher risk but lower costs."
  },
  OPTIMAL: {
    name: "Strategic Release",
    riskFactor: 1.0,
    costModifier: 1.0,
    description: "Wait for the best market conditions. Balanced approach."
  },
  DELAYED: {
    name: "Extended Polish",
    riskFactor: 0.8,
    costModifier: 1.2,
    description: "Take extra time for polish. Lower risk but higher costs."
  }
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
    required: ['marketingStrategy', 'launchWindow', 'finalPolish'],
    transition: ['releaseStats', 'audienceMetrics']
  }
};

// Add this helper function near the top of the file with other utility functions
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

const QUALITY_IMPACT_WEIGHTS = {
  BUG_SEVERITY: {
    critical: 0.4,  // 40% impact per critical bug
    major: 0.2,     // 20% impact per major bug
    minor: 0.1      // 10% impact per minor bug
  },
  DEVELOPMENT_DECISIONS: {
    quality_focus: 1.2,   // Quality priority bonus
    speed_focus: 0.8,     // Speed priority penalty
    balanced: 1.0,        // Balanced approach
    polish_time: 0.1      // 10% bonus per week of polish
  },
  RUSH_PENALTIES: {
    no_testing: 0.5,      // 50% penalty for skipping testing
    minimal_testing: 0.7,  // 30% penalty for minimal testing
    partial_testing: 0.85  // 15% penalty for incomplete testing
  }
};

// Add new scoring category constants after existing constants
const SCORING_CATEGORIES = {
  gameDesign: {
    gameplay: {
      name: "Gameplay",
      weight: 0.4,
      factors: {
        core_mechanics: 0.4,
        balance: 0.3,
        progression: 0.3
      }
    },
    features: {
      name: "Features",
      weight: 0.3,
      factors: {
        completeness: 0.4,
        polish: 0.3,
        variety: 0.3
      }
    },
    innovation: {
      name: "Innovation",
      weight: 0.3,
      factors: {
        uniqueness: 0.4,
        market_fit: 0.3,
        creative_vision: 0.3
      }
    }
  },
  technicalQuality: {
    bugs: {
      name: "Bug Status",
      weight: 0.4,
      factors: {
        severity_ratio: 0.4,
        fix_rate: 0.3,
        regression_rate: 0.3
      }
    },
    performance: {
      name: "Performance",
      weight: 0.3,
      factors: {
        optimization: 0.4,
        stability: 0.3,
        resource_usage: 0.3
      }
    },
    polish: {
      name: "Polish",
      weight: 0.3,
      factors: {
        visual_quality: 0.4,
        user_interface: 0.3,
        audio_quality: 0.3
      }
    }
  },
  playerExperience: {
    funFactor: {
      name: "Fun Factor",
      weight: 0.4,
      factors: {
        engagement: 0.4,
        satisfaction: 0.3,
        flow: 0.3
      }
    },
    engagement: {
      name: "Engagement",
      weight: 0.3,
      factors: {
        retention: 0.4,
        progression: 0.3,
        motivation: 0.3
      }
    },
    replayability: {
      name: "Replayability",
      weight: 0.3,
      factors: {
        content_variety: 0.4,
        branching: 0.3,
        emergent_gameplay: 0.3
      }
    }
  }
};

const GENRE_SCORE_WEIGHTS = {
  rpg: {
    gameDesign: 0.4,
    technicalQuality: 0.3,
    playerExperience: 0.3,
    expectations: 0.8 // Higher expectations
  },
  puzzle: {
    gameDesign: 0.3,
    technicalQuality: 0.3,
    playerExperience: 0.4,
    expectations: 0.6 // Lower expectations
  },
  adventure: {
    gameDesign: 0.4,
    technicalQuality: 0.2, 
    playerExperience: 0.4,
    expectations: 0.7
  },
  simulation: {
    gameDesign: 0.3,
    technicalQuality: 0.4,
    playerExperience: 0.3,
    expectations: 0.7
  },
  sports: {
    gameDesign: 0.3,
    technicalQuality: 0.4,
    playerExperience: 0.3,
    expectations: 0.75
  },
  fighting: {
    gameDesign: 0.3,
    technicalQuality: 0.4,
    playerExperience: 0.3,
    expectations: 0.8
  },
  horror: {
    gameDesign: 0.4,
    technicalQuality: 0.3,
    playerExperience: 0.3,
    expectations: 0.7
  },
  survival: {
    gameDesign: 0.35,
    technicalQuality: 0.35,
    playerExperience: 0.3,
    expectations: 0.65
  },
  racing: {
    gameDesign: 0.3,
    technicalQuality: 0.4,
    playerExperience: 0.3,
    expectations: 0.75
  },
  idle: {
    gameDesign: 0.3,
    technicalQuality: 0.3,
    playerExperience: 0.4,
    expectations: 0.5 // Lowest expectations
  }
};

const SCORE_FEEDBACK = {
  exceptional: {
    threshold: 9.5,
    messages: [
      "A masterpiece that sets new standards for the genre!",
      "Revolutionary game design that will influence future titles",
      "Technical excellence combined with exceptional gameplay",
      "An instant classic that will be remembered for years"
    ]
  },
  excellent: {
    threshold: 8.5,
    messages: [
      "Outstanding achievement across all aspects",
      "Hugely impressive execution with minimal flaws",
      "A must-play title that excels in nearly every way",
      "Sets a new bar for quality in multiple areas"
    ]
  },
  great: {
    threshold: 7.5,
    messages: [
      "A very strong title with numerous standout features",
      "High quality execution with only minor issues",
      "Delivers an engaging and polished experience",
      "Will certainly please fans of the genre"
    ]
  },
  good: {
    threshold: 6.5,
    messages: [
      "A solid game that achieves its core goals",
      "Despite some flaws, provides good entertainment",
      "Competent execution with room for improvement",
      "Fans of the genre will find plenty to enjoy"
    ]
  },
  average: {
    threshold: 5.5,
    messages: [
      "A decent but unremarkable experience",
      "Has potential but falls short in key areas",
      "Functional but lacks distinctive features",
      "May appeal to genre enthusiasts despite limitations"
    ]
  },
  poor: {
    threshold: 4.5,
    messages: [
      "Significant issues hold back the experience",
      "Falls short of basic quality expectations",
      "Needs substantial improvement in multiple areas",
      "Difficult to recommend in its current state"
    ]
  },
  very_poor: {
    threshold: 0,
    messages: [
      "Major problems throughout the experience",
      "Fails to deliver on fundamental promises",
      "Requires extensive work to meet basic standards",
      "Not recommended in its current form"
    ]
  }
};

// Default audience preferences if none found
const DEFAULT_AUDIENCE_PREFERENCES = {
  casual: {
    preferences: {
      puzzle: 1.2,
      idle: 1.2,
      simulation: 1.1,
      sports: 1.0,
      adventure: 0.9,
      rpg: 0.7,
      fighting: 0.6,
      survival: 0.7,
      racing: 0.9,
      horror: 0.5
    }
  },
  hardcore: {
    preferences: {
      rpg: 1.5,
      fighting: 1.3,
      survival: 1.2,
      racing: 1.1,
      horror: 1.2,
      sports: 0.9,
      simulation: 0.8,
      puzzle: 0.7,
      idle: 0.6,
      adventure: 1.0
    }
  },
  all: {
    preferences: {
      puzzle: 1.0,
      idle: 1.0,
      simulation: 1.0,
      sports: 1.0,
      adventure: 1.0,
      rpg: 1.0,
      fighting: 1.0,
      survival: 1.0,
      racing: 1.0,
      horror: 1.0
    }
  }
};

const RANDOM_EVENTS = {
  positive: [
    { text: "Team morale is high!", moneyEffect: 0.9, moraleEffect: 5 },
    { text: "Productive work week!", moneyEffect: 0.95, moraleEffect: 3 },
    { text: "Team found efficient solution!", moneyEffect: 0.9, moraleEffect: 4 }
  ],
  neutral: [
    { text: "Normal work week", moneyEffect: 1.0, moraleEffect: 0 },
    { text: "Everything proceeding as usual", moneyEffect: 1.0, moraleEffect: 0 },
    { text: "Team maintaining steady progress", moneyEffect: 1.0, moraleEffect: 0 }
  ],
  negative: [
    { text: "Minor technical setback", moneyEffect: 1.1, moraleEffect: -3 },
    { text: "Team hit a roadblock", moneyEffect: 1.15, moraleEffect: -4 },
    { text: "Some unexpected challenges", moneyEffect: 1.2, moraleEffect: -5 }
  ]
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
  const events = RANDOM_EVENTS[eventType];
  const event = events[Math.floor(Math.random() * events.length)];

  // Add market effect if needed (20% chance)
  if (Math.random() < 0.2) {
    event.marketEffect = {
      type: Math.random() < 0.5 ? 'growth' : 'decline',
      amount: Math.random() * 0.1  // 0-10% change
    };
  }

  return event;
}

window.getRandomEvent = getRandomEvent;

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
      // Calculate release preparation progress
      const requiredDecisions = [
        !!project.marketingStrategy,
        !!project.launchWindow,
        !!project.optimizationFocus
      ];
      progress = (requiredDecisions.filter(Boolean).length / 3) * 100;
      break;
  }
  
  return Math.min(100, Math.max(0, progress));
}

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

function handleReleaseCommand(gameState) {
  const project = gameState.project;
  
  if (!project || project.phase !== 'release') {
    outputToDisplay("Not ready for release yet!");
    return;
  }

  // Show warning if there are remaining bugs
  if (project.bugs > 0) {
    const severity = project.testingMetrics.bugSeverity;
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

function proceedWithRelease(gameState) {
  try {
    // Validate game state exists
    if (!gameState || !gameState.project) {
      throw new Error("No active project found");
    }

    // Set default values if missing
    gameState.project.targetAudience = gameState.project.targetAudience || 'all';
    gameState.project.marketingStrategy = gameState.project.marketingStrategy || 'balanced';

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

function handleBugFixing(gameState) {
  const project = gameState.project;
  
  if (!project.bugs || project.bugs <= 0) {
    outputToDisplay("No known bugs to fix!");
    return;
  }

  // Initialize bug severity if not set
  if (!project.testingMetrics.bugSeverity) {
    project.testingMetrics.bugSeverity = {
      critical: Math.floor(project.bugs * 0.2),
      major: Math.floor(project.bugs * 0.3),
      minor: Math.ceil(project.bugs * 0.5)
    };
  }

  // Calculate fix effectiveness
  const baseEffectiveness = 0.4;
  const teamBonus = Math.max(0.2, calculateTeamEfficiency(gameState)?.efficiency || 0.2);
  const fixEffectiveness = baseEffectiveness * teamBonus * (gameState.modifiers.testing_effectiveness || 1);

  // Calculate bugs fixed with guaranteed minimums
  const fixedBugs = {
    critical: Math.max(1, Math.floor(Math.min(project.testingMetrics.bugSeverity.critical, project.testingMetrics.bugSeverity.critical * fixEffectiveness))),
    major: Math.max(1, Math.floor(Math.min(project.testingMetrics.bugSeverity.major, project.testingMetrics.bugSeverity.major * fixEffectiveness * 0.8))),
    minor: Math.max(1, Math.floor(Math.min(project.testingMetrics.bugSeverity.minor, project.testingMetrics.bugSeverity.minor * fixEffectiveness * 0.6)))
  };

  // Ensure we don't fix more bugs than exist
  fixedBugs.critical = Math.min(fixedBugs.critical, project.testingMetrics.bugSeverity.critical);
  fixedBugs.major = Math.min(fixedBugs.major, project.testingMetrics.bugSeverity.major);
  fixedBugs.minor = Math.min(fixedBugs.minor, project.testingMetrics.bugSeverity.minor);

  // Update bug counts
  const totalFixed = fixedBugs.critical + fixedBugs.major + fixedBugs.minor;
  project.bugs = Math.max(0, project.bugs - totalFixed);
  
  // Update severity counts
  project.testingMetrics.bugSeverity.critical -= fixedBugs.critical;
  project.testingMetrics.bugSeverity.major -= fixedBugs.major;
  project.testingMetrics.bugSeverity.minor -= fixedBugs.minor;

  // Update metrics
  if (!project.testingMetrics.bugsFixed) {
    project.testingMetrics.bugsFixed = 0;
  }
  project.testingMetrics.bugsFixed += totalFixed;

  // Calculate quality improvement
  const qualityGain = calculateQualityGain(fixedBugs);
  project.quality = Math.min(100, (project.quality || 0) + qualityGain);

  if (!project.initialBugs) {
    project.initialBugs = project.bugs + totalFixed;
  }
  const fixProgress = ((project.initialBugs - project.bugs) / project.initialBugs) * 100;

  // Display formatted results
  outputToDisplay("\n╔═══════ Bug Fixing Session ═══════╗");
  
  // Progress Section
  outputToDisplay(`Total Bugs Fixed: ${totalFixed}`);
  const progressBar = createProgressBar(fixProgress);
  outputToDisplay(progressBar);
  outputToDisplay(`Overall Progress: ${fixProgress.toFixed(1)}%`);
  
  // Results Breakdown
  outputToDisplay("\n──── Fixed This Session ────");
  outputToDisplay(`Critical: ${fixedBugs.critical} ${renderBugIcon(fixedBugs.critical, '🔴')}`);
  outputToDisplay(`Major: ${fixedBugs.major} ${renderBugIcon(fixedBugs.major, '🟡')}`);
  outputToDisplay(`Minor: ${fixedBugs.minor} ${renderBugIcon(fixedBugs.minor, '🟢')}`);
  
  outputToDisplay("\n──── Remaining Issues ────");
  outputToDisplay(`Critical: ${project.testingMetrics.bugSeverity.critical} ${renderBugIcon(project.testingMetrics.bugSeverity.critical, '🔴')}`);
  outputToDisplay(`Major: ${project.testingMetrics.bugSeverity.major} ${renderBugIcon(project.testingMetrics.bugSeverity.major, '🟡')}`);
  outputToDisplay(`Minor: ${project.testingMetrics.bugSeverity.minor} ${renderBugIcon(project.testingMetrics.bugSeverity.minor, '🟢')}`);

  // Quality Metrics
  outputToDisplay("\n──── Quality Metrics ────");
  outputToDisplay(`Quality Score: ${Math.floor(project.quality)}% (${qualityGain > 0 ? '+' : ''}${qualityGain.toFixed(1)}%)`);
  outputToDisplay(`Total Remaining: ${project.bugs} bugs`);

  // Recommendations
  if (project.bugs > 0) {
    outputToDisplay("\n──── Recommendations ────");
    if (project.testingMetrics.bugSeverity.critical > 0) {
      outputToDisplay("⚠️ Critical bugs require attention");
      outputToDisplay("   (release still possible but risky)");
    }
    if (project.testingMetrics.bugSeverity.major > 0) {
      outputToDisplay("i️ Consider fixing major bugs");
    }
    if (project.testingMetrics.bugSeverity.minor > 0 && 
        project.testingMetrics.bugSeverity.critical === 0 && 
        project.testingMetrics.bugSeverity.major === 0) {
      outputToDisplay("✓ Only minor bugs remain");
    }

    outputToDisplay("\nRelease Impact:");
    outputToDisplay("• Game quality and reviews");
    outputToDisplay("• Sales potential");
    outputToDisplay("• Company reputation");
  } else {
    outputToDisplay("\n✨ All bugs fixed!");
    outputToDisplay("Game is ready for release");
  }
  
  outputToDisplay("╚═══════════════════════════════╝");

  // Update testing progress
  updateTestingProgress(project);
}

function renderBugIcon(count, icon) {
  return count > 0 ? icon.repeat(Math.min(count, 5)) : '─';
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
    outputToDisplay("\n✨ All bugs fixed!");
    outputToDisplay("Game is ready for release. Use 'release' command to launch.");
  }
}

function isReadyForRelease(project) {
  // Game is always ready for release in polish phase, but with consequences for bugs
  return project.phase === 'release';
}

function displayReleaseResults(game, stats, bugImpact) {
  outputToDisplay("\n╔═══════ Game Release ═══════╗");
  
  // Basic Info
  outputToDisplay(`Title: ${game.name}`);
  outputToDisplay(`Genre: ${game.genre} (${game.subgenre})`);
  outputToDisplay(`Development: ${game.developmentTime} weeks`);
  
  // Quality Section
  outputToDisplay("\n──── Quality Metrics ────");
  outputToDisplay(`Base Quality: ${game.quality}%`);
  
  // Bug Impact Section
  if (game.bugs.total > 0) {
    outputToDisplay("\n──── Bug Impact ────");
    outputToDisplay(`Total Bugs: ${game.bugs.total}`);
    outputToDisplay(`Critical: ${game.bugs.severity.critical} 🔴`);
    outputToDisplay(`Major: ${game.bugs.severity.major} 🟡`);
    outputToDisplay(`Minor: ${game.bugs.severity.minor} 🟢`);
    outputToDisplay(`Quality Loss: -${Math.round(bugImpact.scoreReduction)}`);
  }
  
  // Results Section
  outputToDisplay("\n──── Final Results ────");
  outputToDisplay(`Success Score: ${stats.successScore}/100`);
  outputToDisplay(`Revenue: $${stats.revenue}`);
  if (bugImpact?.revenueLoss > 0) {
    outputToDisplay(`Revenue Impact: -${Math.round(bugImpact.revenueLoss * 100)}%`);
  }
  
  // Market Performance
  outputToDisplay("\n──── Market Performance ────");
  outputToDisplay(`Marketing: ${((stats.marketingImpact - 1) * 100).toFixed(0)}%`);
  outputToDisplay(`Timing: ${((stats.timingImpact - 1) * 100).toFixed(0)}%`);
  
  // Reviews Section
  const reviews = generateReviews(game, gameState);
  outputToDisplay("\n──── Press Reviews ────");
  reviews.forEach(review => {
    outputToDisplay(`\n${review.reviewer.name} - ${review.reviewer.title}`);
    outputToDisplay(`Background: ${review.reviewer.background}`);
    outputToDisplay(`Score: ${review.score}/100`);
    outputToDisplay(`"${review.mainQuote}"`);
    if (review.focusComments.length > 0) {
      outputToDisplay("Focus Areas:");
      review.focusComments.forEach(comment => outputToDisplay(`- ${comment}`));
    }
  });

  // Special Achievements
  if (stats.successScore >= 90) {
    outputToDisplay("\n🏆 Masterpiece Achievement!");
  } else if (stats.successScore >= 80) {
    outputToDisplay("\n🌟 Critical Success!");
  } else if (game.bugs.total > 0) {
    outputToDisplay("\n⚠️ Released with known issues");
    outputToDisplay("May affect long-term reputation");
  }

  outputToDisplay("╚════════════════════════════╝");
  displayFinalScore(game, gameState);
}

function calculateFinalQuality(gameState) {
  if (!gameState?.project) return 0;

  // Start with existing quality calculation
  let quality = gameState.project.quality || 0;

  // Preserve existing priority modifications
  const priority = gameState.project.priority || 'balanced';
  switch(priority) {
    case 'quality':
      quality *= 1.2;
      break;
    case 'speed':
      quality *= 0.8;
      break;
  }

  // Keep existing team effects
  const teamEfficiency = calculateTeamEfficiency(gameState)?.efficiency || 1;
  quality *= (0.8 + (teamEfficiency * 0.4));

  // Maintain technology effects
  quality *= (gameState.modifiers?.quality || 1);

  // Preserve optimization focus effects
  if (gameState.project.optimizationFocus === 'quality') {
    quality *= 1.1;
  }

  // NEW: Add bug severity impact
  if (gameState.project.bugs > 0 && gameState.project.testingMetrics?.bugSeverity) {
    const severity = gameState.project.testingMetrics.bugSeverity;
    const bugImpact = (
      (severity.critical || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.critical +
      (severity.major || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.major +
      (severity.minor || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.minor
    );
    quality *= Math.max(0.1, 1 - bugImpact);
  }

  // NEW: Add development decision impacts
  const decisionImpact = QUALITY_IMPACT_WEIGHTS.DEVELOPMENT_DECISIONS[
    gameState.project.priority || 'balanced'
  ] || 1.0;
  quality *= decisionImpact;

  // NEW: Add rush penalties if applicable
  if (gameState.project.testingMetrics?.testsConducted) {
    const conducted = gameState.project.testingMetrics.testsConducted;
    const testsRun = Object.values(conducted).filter(Boolean).length;
    
    if (testsRun === 0) {
      quality *= QUALITY_IMPACT_WEIGHTS.RUSH_PENALTIES.no_testing;
    } else if (testsRun === 1) {
      quality *= QUALITY_IMPACT_WEIGHTS.RUSH_PENALTIES.minimal_testing;
    } else if (testsRun === 2) {
      quality *= QUALITY_IMPACT_WEIGHTS.RUSH_PENALTIES.partial_testing;
    }
  }

  // Preserve existing bug impact calculation
  if (gameState.project.bugs > 0) {
    const bugPenalty = Math.min(0.5, gameState.project.bugs * 0.02);
    quality *= (1 - bugPenalty);
  }

  return Math.min(100, Math.max(0, Math.round(quality)));
}

function calculateBugImpact(project) {
  // Preserve existing bug impact calculation
  const severity = project.testingMetrics.bugSeverity;
  const impact = {
    scoreReduction: 0,
    revenueLoss: 0,
    reputationDamage: 0
  };

  // Keep existing severity calculations
  if (severity.critical > 0) {
    impact.scoreReduction += severity.critical * 5;
    impact.revenueLoss += severity.critical * 0.05;
    impact.reputationDamage += severity.critical * 0.1;
  }

  if (severity.major > 0) {
    impact.scoreReduction += severity.major * 2;
    impact.revenueLoss += severity.major * 0.02;
    impact.reputationDamage += severity.major * 0.05;
  }

  if (severity.minor > 0) {
    impact.scoreReduction += severity.minor * 0.5;
    impact.revenueLoss += severity.minor * 0.01;
    impact.reputationDamage += severity.minor * 0.01;
  }

  // NEW: Add weighted quality impact
  impact.qualityImpact = {
    critical: (severity.critical || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.critical,
    major: (severity.major || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.major,
    minor: (severity.minor || 0) * QUALITY_IMPACT_WEIGHTS.BUG_SEVERITY.minor,
    total: 0
  };

  impact.qualityImpact.total = 
    impact.qualityImpact.critical + 
    impact.qualityImpact.major + 
    impact.qualityImpact.minor;

  // Preserve existing impact caps
  impact.scoreReduction = Math.min(50, impact.scoreReduction);
  impact.revenueLoss = Math.min(0.75, impact.revenueLoss);
  impact.reputationDamage = Math.min(0.5, impact.reputationDamage);

  return impact;
}

function displayPlanningStatus(project) {
  if (!project || !project.planningData) {
    outputToDisplay("No active project in planning phase.");
    return;
  }

  // Project Overview Section
  outputToDisplay("\n=== Project Overview ===");
  outputToDisplay(`Project Name: ${project.name}`);
  outputToDisplay(`Genre: ${project.genre}`);
  outputToDisplay(`Subgenre: ${project.subgenre}`);

  // Current Choices Summary
  if (project.planningData.completedDecisions) {
    outputToDisplay("\n=== Current Decisions ===");
    project.planningData.completedDecisions.forEach(decision => {
      outputToDisplay(`✓ ${formatDecisionName(decision)}`);
    });
  }

  // Feature Planning Section
  outputToDisplay("\n=== Feature Planning ===");
  if (project.planningData.features.length === 0) {
    outputToDisplay("No features planned yet");
    outputToDisplay("Use 'feature add [name] [size]' to add features");
  } else {
    outputToDisplay("Current Features:");
    const featureTable = createFeatureTable(project.planningData.features);
    featureTable.forEach(row => outputToDisplay(row));
  }

  // Team Assignment Section
  outputToDisplay("\n=== Team Assignments ===");
  if (project.planningData.assignedStaff.length === 0) {
    outputToDisplay("No staff assigned");
    outputToDisplay("Use 'assign [staff] [role] [allocation]' to assign team members");
  } else {
    outputToDisplay("Current Assignments:");
    project.planningData.assignedStaff.forEach(assignment => {
      outputToDisplay(`➤ ${assignment.role}: ${assignment.allocation}% allocated`);
    });
  }

  // Resource Allocation Section
  outputToDisplay("\n=== Resource Allocation ===");
  const allocations = project.planningData.resourceAllocation;
  if (Object.values(allocations).every(v => v === 0)) {
    outputToDisplay("No resources allocated");
    outputToDisplay("Use 'allocate [resource] [amount]' to distribute resources");
  } else {
    outputToDisplay("Current Allocations:");
    Object.entries(allocations).forEach(([resource, amount]) => {
      const bar = createResourceBar(amount);
      outputToDisplay(`${formatResourceName(resource)}: ${bar} ${amount}%`);
    });
  }

  // Milestone Planning Section
  outputToDisplay("\n=== Project Milestones ===");
  if (project.planningData.milestones.length === 0) {
    outputToDisplay("No milestones set");
    outputToDisplay("Use 'milestone add [week] [name]' to set project milestones");
  } else {
    outputToDisplay("Planned Milestones:");
    project.planningData.milestones.forEach(milestone => {
      outputToDisplay(`Week ${milestone.week}: ${milestone.name}`);
    });
  }

  // Project Estimates Section
  const estimates = project.planningData.estimates;
  outputToDisplay("\n=== Project Estimates ===");
  outputToDisplay(`Development Timeline: ${estimates.timeRequired} weeks`);
  outputToDisplay(`Budget Required: $${estimates.costEstimate}`);
  outputToDisplay(`Recommended Team Size: ${estimates.staffingNeeds} developers`);

  // Requirements and Warnings Section
  const completionStatus = checkPlanningCompletion(project);
  if (!completionStatus.valid) {
    outputToDisplay("\n=== Required Actions ===");
    completionStatus.missing.forEach(requirement => {
      outputToDisplay(`! ${formatRequirement(requirement)}`);
    });
  }

  // Available Actions Section
  outputToDisplay("\n=== Available Commands ===");
  outputToDisplay("• feature add [name] [size] - Add new feature");
  outputToDisplay("• assign [staff] [role] [allocation] - Assign team member");
  outputToDisplay("• allocate [resource] [amount] - Adjust resource allocation");
  outputToDisplay("• milestone add [week] [name] - Set project milestone");
  
  if (completionStatus.valid) {
    outputToDisplay("\n✓ Planning phase complete!");
    outputToDisplay("Use 'complete planning' to proceed to development");
  }
}

function createFeatureTable(features) {
  if (features.length === 0) return [];

  const table = [];
  table.push("┌─────────────┬────────────┬──────────┐");
  table.push("│ Feature     │ Complexity │   Cost   │");
  table.push("├─────────────┼────────────┼──────────┤");

  features.forEach(feature => {
    const name = feature.name.padEnd(11);
    const complexity = `${feature.complexity}`.padStart(10);
    const cost = `$${feature.costEstimate}`.padStart(8);
    table.push(`│ ${name} │ ${complexity} │ ${cost} │`);
  });

  table.push("└─────────────┴────────────┴──────────┘");
  return table;
}

function createResourceBar(percentage) {
  const width = 20;
  const filled = Math.floor((percentage / 100) * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
}

function formatResourceName(resource) {
  return resource.charAt(0).toUpperCase() + resource.slice(1).padEnd(10);
}

function formatDecisionName(decision) {
  return decision
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

function displayPhaseObjectives(phase) {
  outputToDisplay("\n╔════ Phase Objectives ════╗");
  
  const objectives = {
    development: [
      "✦ Implement planned features",
      "✦ Maintain code quality",
      "✦ Meet milestone deadlines",
      "✦ Manage team efficiency"
    ],
    testing: [
      "✦ Find and fix bugs",
      "✦ Conduct playtesting",
      "✦ Optimize performance",
      "✦ Ensure feature completion"
    ],
    release: [
      "✦ Choose marketing strategy",
      "✦ Select launch window",
      "✦ Polish final details",
      "✦ Prepare launch assets"
    ]
  };

  if (objectives[phase]) {
    objectives[phase].forEach(objective => 
      outputToDisplay(objective)
    );
  }
  
  outputToDisplay("╚════════════════════════╝");
}

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
      outputToDisplay("╚══════════════════════════╝");
    }
  }
}

function calculateReleaseStats(gameState, finalQuality) {
  try {
    // Validate basic requirements
    const project = gameState.project;
    if (!project) {
      throw new Error('No active project for release stats calculation');
    }

    // Ensure market data exists
    const marketTrends = ensureMarketData(gameState);
    
    // Calculate base success score from quality
    let successScore = finalQuality;

    // Calculate marketing impact
    const marketingImpact = calculateMarketingEffectiveness(project, gameState);
    
    // Calculate timing impact with fallback
    const genreData = marketTrends[project.genre.toLowerCase()] || { popularity: 1.0, growth: 0 };
    const timingImpact = calculateTimingImpact(project.launchWindow, genreData);

    // NEW: First-time studio considerations
    const isFirstRelease = !gameState.gameHistory || gameState.gameHistory.length === 0;
    const studioBonus = isFirstRelease ? 1.1 : 1.0; // 10% bonus for first game
    const marketEntryModifier = calculateMarketEntryModifier(gameState, project.genre);

    // Apply base effects
    successScore *= marketingImpact;
    successScore *= timingImpact;
    successScore *= studioBonus;
    successScore *= marketEntryModifier;

    // Apply optimization effects if any
    if (project.optimizationEffects) {
      Object.values(project.optimizationEffects).forEach(effect => {
        successScore *= effect;
      });
    }

    // Calculate revenue based on success with new studio factors
    const baseRevenue = (successScore / 100) * (project.budget || 10000) * 2;
    const revenueMultiplier = calculateRevenueMultiplier(gameState, isFirstRelease);
    const revenue = Math.floor(baseRevenue * revenueMultiplier);

    // Calculate reception with new studio context
    const reception = calculateAudienceReception(successScore, project, gameState);

    // Keep success score in valid range
    successScore = Math.round(Math.min(100, Math.max(0, successScore)));

    return {
      successScore,
      revenue,
      marketingImpact,
      timingImpact,
      reception,
      // NEW: Additional release metrics
      marketEntry: {
        isFirstRelease,
        studioBonus,
        marketEntryModifier,
        revenueMultiplier
      }
    };

  } catch (error) {
    console.error('Failed to calculate release stats:', error);
    throw error;
  }
}

// NEW: Calculate market entry modifier
function calculateMarketEntryModifier(gameState, genre) {
  // Base modifier for all releases
  let modifier = 1.0;

  // Get genre experience
  const genreReleases = (gameState.gameHistory || [])
    .filter(game => game.genre === genre).length;

  if (genreReleases === 0) {
    // First time in genre bonus
    modifier *= 1.15;
  } else {
    // Experience bonus
    modifier *= (1 + (Math.min(genreReleases, 5) * 0.05));
  }

  // Market trend adjustment
  const marketTrends = gameState.marketTrends || {};
  const genreData = marketTrends[genre.toLowerCase()] || { 
    popularity: 1.0, 
    growth: 0,
    saturation: 0.5 
  };

  modifier *= (1 + (genreData.growth || 0));
  modifier *= (1 - ((genreData.saturation || 0.5) * 0.2));

  return Math.max(0.8, Math.min(1.5, modifier));
}

// NEW: Calculate revenue multiplier with new studio considerations
function calculateRevenueMultiplier(gameState, isFirstRelease) {
  // Base multiplier from reputation
  const baseMultiplier = (1 + (gameState.reputation?.marketPresence || 0));
  
  // First release adjustment
  if (isFirstRelease) {
    return baseMultiplier * 1.2; // 20% bonus for first game
  }

  // Experience scaling
  const releaseCount = gameState.gameHistory?.length || 0;
  const experienceBonus = Math.min(0.5, releaseCount * 0.05); // Up to 50% bonus
  
  // Genre loyalty bonus
  const genreLoyalty = calculateGenreLoyalty(gameState);
  
  return baseMultiplier * (1 + experienceBonus) * (1 + genreLoyalty);
}

// NEW: Calculate genre loyalty bonus
function calculateGenreLoyalty(gameState) {
  if (!gameState.gameHistory || gameState.gameHistory.length === 0) {
    return 0;
  }

  const genreReleases = {};
  gameState.gameHistory.forEach(game => {
    genreReleases[game.genre] = (genreReleases[game.genre] || 0) + 1;
  });

  const maxReleases = Math.max(...Object.values(genreReleases));
  return Math.min(0.3, maxReleases * 0.05); // Up to 30% bonus
}

function compileFinalScore(project, gameState) {
  // Get detailed category scores
  const scores = calculateDetailedScores(project);
  
  // Get genre-specific weights
  const weights = GENRE_SCORE_WEIGHTS[project.genre.toLowerCase()] || {
    gameDesign: 0.33,
    technicalQuality: 0.33,
    playerExperience: 0.34,
    expectations: 0.7
  };

  // Calculate weighted score
  const weightedScore = (
    (scores.gameDesign * weights.gameDesign) +
    (scores.technicalQuality * weights.technicalQuality) +
    (scores.playerExperience * weights.playerExperience)
  );

  // Apply market expectations
  const marketExpectations = calculateMarketExpectations(project, gameState);
  const finalScore = weightedScore * marketExpectations;

  // Get appropriate feedback
  const feedback = generateScoreFeedback(finalScore);

  return {
    categoryScores: scores,
    weightedScore: weightedScore,
    finalScore: finalScore,
    feedback: feedback,
    expectations: marketExpectations
  };
}

function calculateMarketExpectations(project, gameState) {
  const weights = GENRE_SCORE_WEIGHTS[project.genre.toLowerCase()] || { expectations: 0.7 };
  
  // Base expectations
  let expectations = weights.expectations;

  // Adjust for company history
  if (gameState.gameHistory && gameState.gameHistory.length > 0) {
    const recentGames = gameState.gameHistory.slice(-3);
    const avgScore = recentGames.reduce((sum, game) => sum + game.successScore, 0) / recentGames.length;
    expectations *= (1 + (avgScore - 75) / 100); // Adjust expectations based on recent performance
  } else {
    // First game gets slightly lower expectations
    expectations *= 0.9;
  }

  // Market presence adjustment
  if (gameState.reputation?.marketPresence) {
    expectations *= (1 + (gameState.reputation.marketPresence * 0.2));
  }

  return Math.min(1.2, Math.max(0.6, expectations));
}

function generateScoreFeedback(score) {
  // Find appropriate feedback category
  let category = null;
  for (const [cat, data] of Object.entries(SCORE_FEEDBACK)) {
    if (score >= data.threshold) {
      category = cat;
      break;
    }
  }
  
  // Get random message from category
  const feedback = SCORE_FEEDBACK[category];
  const message = feedback.messages[Math.floor(Math.random() * feedback.messages.length)];
  
  return {
    category: category,
    message: message,
    threshold: feedback.threshold
  };
}

function displayFinalScore(project, gameState) {
  const finalResults = compileFinalScore(project, gameState);
  
  outputToDisplay("\n╔═══════ Final Game Score ═══════╗");
  
  // Category Scores
  outputToDisplay("\n──── Category Scores ────");
  outputToDisplay(`Game Design:       ${finalResults.categoryScores.gameDesign.toFixed(2)}/10`);
  outputToDisplay(`Technical Quality: ${finalResults.categoryScores.technicalQuality.toFixed(2)}/10`);
  outputToDisplay(`Player Experience: ${finalResults.categoryScores.playerExperience.toFixed(2)}/10`);
  
  // Market Context
  outputToDisplay("\n──── Market Context ────");
  outputToDisplay(`Genre Expectations: ${(finalResults.expectations * 100).toFixed(1)}%`);
  if (finalResults.expectations > 1.0) {
    outputToDisplay("! High expectations due to company reputation");
  } else if (finalResults.expectations < 0.8) {
    outputToDisplay("+ Lower expectations for new studio");
  }
  
  // Final Score
  outputToDisplay("\n──── Final Rating ────");
  outputToDisplay(`Overall Score: ${finalResults.finalScore.toFixed(2)}/10`);
  
  // Critical Reception
  outputToDisplay("\n──── Critical Reception ────");
  outputToDisplay(`"${finalResults.feedback.message}"`);
  
  // Market Position
  const marketPosition = assessMarketPosition(finalResults.finalScore, project.genre, gameState);
  outputToDisplay("\n──── Market Position ────");
  marketPosition.forEach(line => outputToDisplay(line));
  
  outputToDisplay("╚════════════════════════════╝");
}

function assessMarketPosition(score, genre, gameState) {
  const messages = [];
  
  // Genre competition
  const marketTrends = gameState.marketTrends?.[genre.toLowerCase()];
  if (marketTrends) {
    if (marketTrends.saturation > 0.8) {
      messages.push("• Highly competitive market - standing out will be crucial");
    } else if (marketTrends.saturation < 0.3) {
      messages.push("• Market has room for new entries");
    }
    
    if (marketTrends.growth > 0.1) {
      messages.push("• Growing market - good timing for release");
    } else if (marketTrends.growth < -0.1) {
      messages.push("• Shrinking market - may affect sales");
    }
  }
  
  // Score-based position
  if (score >= 9.0) {
    messages.push("• Strong potential to become a market leader");
  } else if (score >= 8.0) {
    messages.push("• Well positioned for commercial success");
  } else if (score >= 7.0) {
    messages.push("• Should find its audience with proper marketing");
  } else {
    messages.push("• May struggle to stand out in the market");
  }
  
  return messages;
}

function calculateDetailedScores(project) {
  const scores = {
    gameDesign: calculateGameDesignScore(project),
    technicalQuality: calculateTechnicalScore(project),
    playerExperience: calculatePlayerExperienceScore(project)
  };

  // Calculate overall weighted score
  scores.overall = Math.round(
    (scores.gameDesign * 0.35) +
    (scores.technicalQuality * 0.35) +
    (scores.playerExperience * 0.3)
  );

  return scores;
}

function calculateGameDesignScore(project) {
  const gameplayScore = calculateGameplayScore(project);
  const featureScore = calculateFeatureScore(project);
  const innovationScore = calculateInnovationScore(project);

  return Math.round(
    (gameplayScore * SCORING_CATEGORIES.gameDesign.gameplay.weight) +
    (featureScore * SCORING_CATEGORIES.gameDesign.features.weight) +
    (innovationScore * SCORING_CATEGORIES.gameDesign.innovation.weight)
  );
}

function calculateTechnicalScore(project) {
  const bugScore = calculateBugScore(project);
  const performanceScore = calculatePerformanceScore(project);
  const polishScore = calculatePolishScore(project);

  return Math.round(
    (bugScore * SCORING_CATEGORIES.technicalQuality.bugs.weight) +
    (performanceScore * SCORING_CATEGORIES.technicalQuality.performance.weight) +
    (polishScore * SCORING_CATEGORIES.technicalQuality.polish.weight)
  );
}

function calculatePlayerExperienceScore(project) {
  const funScore = calculateFunScore(project);
  const engagementScore = calculateEngagementScore(project);
  const replayabilityScore = calculateReplayabilityScore(project);

  return Math.round(
    (funScore * SCORING_CATEGORIES.playerExperience.funFactor.weight) +
    (engagementScore * SCORING_CATEGORIES.playerExperience.engagement.weight) +
    (replayabilityScore * SCORING_CATEGORIES.playerExperience.replayability.weight)
  );
}

// Individual score calculation functions
function calculateGameplayScore(project) {
  let score = 7; // Base score

  // Adjust based on development decisions
  if (project.priority === 'quality') score += 1;
  if (project.priority === 'speed') score -= 1;

  // Factor in testing phase feedback
  if (project.testingMetrics?.playtestScore) {
    score += (project.testingMetrics.playtestScore - 70) / 10;
  }

  // Consider feature implementation
  if (project.planningData?.features) {
    const completion = project.planningData.features.filter(f => f.completed).length / 
                      project.planningData.features.length;
    score += completion * 2;
  }

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateFeatureScore(project) {
  let score = 7; // Base score

  // Check feature completion and quality
  if (project.planningData?.features) {
    const features = project.planningData.features;
    const completion = features.filter(f => f.completed).length / features.length;
    score += completion * 2;
  }

  // Consider development priority
  if (project.priority === 'quality') score += 1;
  if (project.priority === 'speed') score -= 1;

  // Factor in polish phase
  if (project.optimizationFocus === 'features') score += 1;

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateInnovationScore(project) {
  let score = 6; // Base score

  // Consider genre and market factors
  if (project.genreInnovation) score += 2;
  
  // Check feature uniqueness
  if (project.planningData?.features) {
    const uniqueFeatures = new Set(project.planningData.features.map(f => f.type)).size;
    score += uniqueFeatures > 3 ? 1 : 0;
  }

  // Development approach impact
  if (project.priority === 'quality') score += 1;

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateBugScore(project) {
  let score = 8; // Base score

  // Factor in bug counts and severity
  if (project.bugs > 0) {
    const severity = project.testingMetrics?.bugSeverity || {
      critical: Math.floor(project.bugs * 0.2),
      major: Math.floor(project.bugs * 0.3),
      minor: Math.ceil(project.bugs * 0.5)
    };
    
    score -= (severity.critical * 1.5 + severity.major * 0.8 + severity.minor * 0.3);
  }

  // Consider testing thoroughness
  if (project.testingMetrics?.testsConducted) {
    const completedTests = Object.values(project.testingMetrics.testsConducted)
      .filter(Boolean).length;
    score += completedTests * 0.5;
  }

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculatePerformanceScore(project) {
  let score = 7; // Base score

  // Consider optimization focus
  if (project.optimizationFocus === 'performance') score += 2;

  // Factor in technical quality
  if (project.metrics?.technical?.performance) {
    score += (project.metrics.technical.performance / 20);
  }

  // Development priority impact
  if (project.priority === 'quality') score += 1;
  if (project.priority === 'speed') score -= 1;

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculatePolishScore(project) {
  let score = 7; // Base score

  // Polish phase impact
  if (project.optimizationFocus === 'polish') score += 2;

  // Consider development time
  if (project.developmentTime < project.estimatedCompletionWeeks) {
    score -= 2;
  } else if (project.developmentTime > project.estimatedCompletionWeeks * 1.2) {
    score += 1;
  }

  // Quality focus impact
  if (project.priority === 'quality') score += 1;
  if (project.priority === 'speed') score -= 1;

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateFunScore(project) {
  let score = 7; // Base score

  // Factor in playtest results
  if (project.testingMetrics?.playtestScore) {
    score += (project.testingMetrics.playtestScore - 70) / 10;
  }

  // Consider feature variety
  if (project.planningData?.features) {
    const uniqueTypes = new Set(project.planningData.features.map(f => f.type)).size;
    score += uniqueTypes > 3 ? 1 : 0;
  }

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateEngagementScore(project) {
  let score = 7; // Base score

  // Factor in gameplay elements
  if (project.elements?.length > 0) {
    score += project.elements.length * 0.5;
  }

  // Consider targeting effectiveness
  if (project.targetAudience && project.marketingStrategy) {
    if (project.targetAudience === project.marketingStrategy) {
      score += 1;
    }
  }

  return Math.min(10, Math.max(1, Math.round(score)));
}

function calculateReplayabilityScore(project) {
  let score = 6; // Base score

  // Consider feature variety
  if (project.planningData?.features) {
    const uniqueFeatures = new Set(project.planningData.features.map(f => f.type)).size;
    score += uniqueFeatures > 3 ? 2 : 1;
  }

  // Genre impact
  if (project.genre === 'rpg' || project.genre === 'simulation') {
    score += 1;
  }

  return Math.min(10, Math.max(1, Math.round(score)));
}

function displayDetailedScores(project) {
  const scores = calculateDetailedScores(project);

  outputToDisplay("\n=== Detailed Game Evaluation ===");

  // Game Design Category
  outputToDisplay("\nGame Design: " + scores.gameDesign + "/10");
  outputToDisplay(`- Gameplay: ${calculateGameplayScore(project)}/10`);
  outputToDisplay(`- Features: ${calculateFeatureScore(project)}/10`);
  outputToDisplay(`- Innovation: ${calculateInnovationScore(project)}/10`);

  // Technical Quality Category
  outputToDisplay("\nTechnical Quality: " + scores.technicalQuality + "/10");
  outputToDisplay(`- Bug Status: ${calculateBugScore(project)}/10`);
  outputToDisplay(`- Performance: ${calculatePerformanceScore(project)}/10`);
  outputToDisplay(`- Polish: ${calculatePolishScore(project)}/10`);

  // Player Experience Category
  outputToDisplay("\nPlayer Experience: " + scores.playerExperience + "/10");
  outputToDisplay(`- Fun Factor: ${calculateFunScore(project)}/10`);
  outputToDisplay(`- Engagement: ${calculateEngagementScore(project)}/10`);
  outputToDisplay(`- Replayability: ${calculateReplayabilityScore(project)}/10`);

  outputToDisplay(`\nOverall Score: ${scores.overall}/10`);

  // Display score analysis
  outputToDisplay("\nAnalysis:");
  displayScoreAnalysis(scores);
}

function displayScoreAnalysis(scores) {
  // Identify strengths
  const strengths = [];
  if (scores.gameDesign >= 8) strengths.push("Strong game design");
  if (scores.technicalQuality >= 8) strengths.push("High technical quality");
  if (scores.playerExperience >= 8) strengths.push("Excellent player experience");

  // Identify weaknesses
  const weaknesses = [];
  if (scores.gameDesign <= 6) weaknesses.push("Game design needs improvement");
  if (scores.technicalQuality <= 6) weaknesses.push("Technical issues present");
  if (scores.playerExperience <= 6) weaknesses.push("Player experience could be better");

  // Display findings
  if (strengths.length > 0) {
    outputToDisplay("\nStrengths:");
    strengths.forEach(strength => outputToDisplay(`+ ${strength}`));
  }

  if (weaknesses.length > 0) {
    outputToDisplay("\nAreas for Improvement:");
    weaknesses.forEach(weakness => outputToDisplay(`- ${weakness}`));
  }
}

// Add new categories to validation system
function validateGameMetrics(project) {
  if (!project.metrics) {
    project.metrics = {
      gameDesign: {},
      technicalQuality: {},
      playerExperience: {}
    };
  }

  Object.keys(SCORING_CATEGORIES).forEach(category => {
    if (!project.metrics[category]) {
      project.metrics[category] = {};
    }
  });

  return true;
}

// Export new functions
window.compileFinalScore = compileFinalScore;
window.displayFinalScore = displayFinalScore;

function calculateAudienceReception(successScore, project, gameState) {
  // Initialize base reception
  const reception = {
    casual: 0,
    hardcore: 0,
    critics: 0
  };

  // Validate required inputs
  if (!project || typeof successScore !== 'number') {
    console.warn('Invalid input for reception calculation:', { project, successScore });
    return reception;
  }

  // Define default preferences map for fallback
  const DEFAULT_PREFERENCES = {
    casual: {
      puzzle: 1.2, rpg: 0.7, action: 0.8, adventure: 0.9, simulation: 1.1,
      sports: 1.0, fighting: 0.6, survival: 0.7, racing: 0.9, horror: 0.5,
      idle: 1.2
    },
    hardcore: {
      puzzle: 0.7, rpg: 1.5, action: 1.3, adventure: 1.0, simulation: 0.8,
      sports: 0.9, fighting: 1.3, survival: 1.2, racing: 1.1, horror: 1.2,
      idle: 0.6
    },
    critics: {
      puzzle: 0.9, rpg: 1.2, action: 1.1, adventure: 1.3, simulation: 1.0,
      sports: 0.9, fighting: 1.0, survival: 1.0, racing: 1.1, horror: 1.2,
      idle: 0.8
    },
    all: {
      puzzle: 1.0, rpg: 1.0, action: 1.0, adventure: 1.0, simulation: 1.0,
      sports: 1.0, fighting: 1.0, survival: 1.0, racing: 1.0, horror: 1.0,
      idle: 1.0
    }
  };

  try {
    // Set default target audience if not specified
    const targetAudience = project.targetAudience || 'all';
    const genre = (project.genre || 'puzzle').toLowerCase();

    // Get genre multiplier with robust fallback chain
    let genreMultiplier = 1.0;
    
    // First try to get from AUDIENCE_SEGMENTS if available
    if (window.AUDIENCE_SEGMENTS && 
        window.AUDIENCE_SEGMENTS[targetAudience] && 
        window.AUDIENCE_SEGMENTS[targetAudience].preferences) {
      genreMultiplier = window.AUDIENCE_SEGMENTS[targetAudience].preferences[genre] || 1.0;
    } else {
      // Fallback to default preferences
      genreMultiplier = DEFAULT_PREFERENCES[targetAudience]?.[genre] || 
                       DEFAULT_PREFERENCES.all[genre] || 
                       1.0;
    }

    // Calculate base reception score with safe defaults
    const baseScore = Math.min(100, Math.max(0, successScore * 0.8));

    // Apply marketing strategy modifiers
    switch(project.marketingStrategy || 'balanced') {
      case 'casual':
        reception.casual = Math.min(100, baseScore * 1.2 * genreMultiplier);
        reception.hardcore = Math.min(100, baseScore * 0.8 * genreMultiplier);
        reception.critics = Math.min(100, baseScore * 0.9 * genreMultiplier);
        break;
      case 'hardcore':
        reception.casual = Math.min(100, baseScore * 0.8 * genreMultiplier);
        reception.hardcore = Math.min(100, baseScore * 1.2 * genreMultiplier);
        reception.critics = Math.min(100, baseScore * 1.1 * genreMultiplier);
        break;
      default: // balanced
        reception.casual = Math.min(100, baseScore * genreMultiplier);
        reception.hardcore = Math.min(100, baseScore * genreMultiplier);
        reception.critics = Math.min(100, baseScore * genreMultiplier);
    }

    // Apply reputation effects with safety checks
    if (gameState?.reputation) {
      Object.keys(reception).forEach(audience => {
        if (gameState.reputation[audience]) {
          const loyalty = gameState.reputation[audience].loyalty || 0.5;
          reception[audience] *= (0.9 + (loyalty * 0.2));
          reception[audience] = Math.min(100, Math.round(reception[audience]));
        }
      });
    }

    // Log calculation debug info
    console.log('Reception calculation:', {
      targetAudience,
      genre,
      genreMultiplier,
      baseScore,
      strategy: project.marketingStrategy,
      finalReception: reception
    });

  } catch (error) {
    console.error('Error calculating audience reception:', error);
    // Return safe default values
    Object.keys(reception).forEach(key => {
      reception[key] = Math.round(successScore * 0.8);
    });
  }

  // Ensure all values are numbers and within bounds
  Object.keys(reception).forEach(key => {
    reception[key] = Math.min(100, Math.max(0, Math.round(reception[key] || 0)));
  });

  return reception;
}
