function updateReputation(gameState, gameResult) {
  const segments = ['casual', 'hardcore', 'critics'];
  
  // Initialize reputation if it doesn't exist or reinitialize with minimum values
  if (!gameState.reputation) {
    gameState.reputation = initializeBaseReputation();
  }

  // Ensure minimum values for each segment
  segments.forEach(segment => {
    if (!gameState.reputation[segment]) {
      gameState.reputation[segment] = {
        fans: 100, // Minimum starting fans
        loyalty: 0.5,
        expectations: 50
      };
    } else {
      // Ensure existing segments have minimum values
      gameState.reputation[segment].fans = Math.max(100, gameState.reputation[segment].fans);
      gameState.reputation[segment].loyalty = gameState.reputation[segment].loyalty || 0.5;
      gameState.reputation[segment].expectations = gameState.reputation[segment].expectations || 50;
    }
  });

  // Ensure market presence exists
  if (typeof gameState.reputation.marketPresence !== 'number') {
    gameState.reputation.marketPresence = 0;
  }

  // Initialize last mentions if needed
  if (!Array.isArray(gameState.reputation.lastMentions)) {
    gameState.reputation.lastMentions = [];
  }

  // Rest of the existing updateReputation code...
  const genrePreference = AUDIENCE_SEGMENTS[gameResult.targetAudience].preferences[gameResult.genre.toLowerCase()];
  
  segments.forEach(segment => {
    const segmentData = AUDIENCE_SEGMENTS[segment];
    const qualityFactor = gameResult.successScore / 100;
    const matchFactor = genrePreference || 0.5;
    
    const reputationChange = (qualityFactor * matchFactor * segmentData.loyaltyGain);
    gameState.reputation[segment].fans += Math.floor(reputationChange * 100);
    gameState.reputation[segment].loyalty = Math.min(1, 
      gameState.reputation[segment].loyalty + (reputationChange * 0.1)
    );
    
    gameState.reputation[segment].expectations = 
      Math.min(100, gameState.reputation[segment].expectations + (qualityFactor * 10));
  });
  
  // Track historical reputation
  if (!gameState.reputation.history) {
    gameState.reputation.history = [];
  }
  
  gameState.reputation.history.push({
    week: gameState.weekNumber,
    event: "Game Release",
    game: gameResult.name,
    score: gameResult.successScore,
    changes: segments.map(segment => ({
      segment: segment,
      fanChange: Math.floor(gameState.reputation[segment].fans),
      loyaltyChange: gameState.reputation[segment].loyalty
    }))
  });
  
  generateSocialMentions(gameState, gameResult);
  updateMarketPresence(gameState, gameResult);
  calculateBrandStrength(gameState);
}

function displayReputation(gameState) {
  // Initialize reputation if it doesn't exist
  if (!gameState.reputation) {
    gameState.reputation = {
      casual: { fans: 0, loyalty: 0.5, expectations: 50 },
      hardcore: { fans: 0, loyalty: 0.5, expectations: 50 },
      critics: { fans: 0, loyalty: 0.5, expectations: 50 },
      lastMentions: [],
      marketPresence: 0
    };
  }

  // Ensure all segments exist
  ['casual', 'hardcore', 'critics'].forEach(segment => {
    if (!gameState.reputation[segment]) {
      gameState.reputation[segment] = { fans: 0, loyalty: 0.5, expectations: 50 };
    }
  });

  outputToDisplay("\n=== Company Reputation Report ===");
  
  // Overall Rating
  const brandStrength = calculateBrandStrength(gameState);
  outputToDisplay(`Brand Strength: ${getBrandTier(brandStrength)}`);
  outputToDisplay(`Market Recognition: ${getPresenceLevel(gameState.reputation.marketPresence || 0)}`);
  
  // Market Position
  outputToDisplay("\nMarket Position:");
  const presence = gameState.reputation.marketPresence || 0;
  outputToDisplay(`Market Presence: ${getPresenceIndicator(presence)}`);
  
  // Show genre expertise
  if (gameState.gameHistory && gameState.gameHistory.length > 0) {
    outputToDisplay("\nGenre Expertise:");
    const expertise = calculateGenreExpertise(gameState);
    Object.entries(expertise)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 3)
      .forEach(([genre, data]) => {
        outputToDisplay(`${genre}: ${getExpertiseLevel(data.score)} (${data.games} games)`);
      });
  }

  // Audience Segments
  outputToDisplay("\nAudience Segments:");
  Object.entries(AUDIENCE_SEGMENTS).forEach(([segment, data]) => {
    const repData = gameState.reputation[segment] || { fans: 0, loyalty: 0.5, expectations: 50 };
    outputToDisplay(`\n${data.name}:`);
    outputToDisplay(`Fans: ${repData.fans}`);
    outputToDisplay(`Loyalty: ${Math.floor(repData.loyalty * 100)}%`);
    outputToDisplay(`Expectations: ${Math.floor(repData.expectations)}%`);
    
    if (repData.expectations > 80) {
      outputToDisplay(" High expectations for next release!");
    }
  });

  // Recent Reception
  if (gameState.gameHistory && gameState.gameHistory.length > 0) {
    const recentGames = gameState.gameHistory.slice(-3);
    outputToDisplay("\nRecent Game Reception:");
    recentGames.forEach(game => {
      outputToDisplay(`${game.name || 'Unnamed Game'} (${game.genre}):`);
      outputToDisplay(`- Success Score: ${game.successScore}`);
      outputToDisplay(`- Revenue: $${game.revenue}`);
    });
  }

  // Social Media Buzz
  if (gameState.reputation.lastMentions && gameState.reputation.lastMentions.length > 0) {
    outputToDisplay("\nRecent Social Media Buzz:");
    gameState.reputation.lastMentions.forEach(mention => {
      outputToDisplay(`"${mention}"`);
    });
  }

  // Historical Trends
  if (gameState.reputation.history && gameState.reputation.history.length > 0) {
    outputToDisplay("\nReputation History:");
    gameState.reputation.history.slice(-5).forEach(entry => {
      outputToDisplay(`Week ${entry.week}: ${entry.event}`);
      if (entry.score) {
        outputToDisplay(`- Impact Score: ${entry.score}`);
      }
    });
  }
}

function calculateBrandStrength(gameState) {
  if (!gameState.reputation) return 0;
  
  let strength = 0;
  
  // Fan base contribution
  const totalFans = Object.values(gameState.reputation)
    .reduce((sum, segment) => {
      return sum + (typeof segment === 'object' && segment.fans ? segment.fans : 0);
    }, 0);
  
  strength += Math.min(50, totalFans / 100);
  
  // Market presence
  strength += (gameState.reputation.marketPresence || 0) * 30;
  
  // Game history
  if (gameState.gameHistory) {
    const avgSuccess = gameState.gameHistory.reduce((sum, game) => sum + game.successScore, 0) / 
      Math.max(1, gameState.gameHistory.length);
    strength += avgSuccess * 0.2;
  }
  
  return Math.min(100, strength);
}

function getBrandTier(strength) {
  if (strength >= 90) return "Industry Leader ";
  if (strength >= 75) return "Respected Studio ";
  if (strength >= 60) return "Established Developer ";
  if (strength >= 40) return "Rising Studio ";
  if (strength >= 20) return "Known Developer ";
  return "Indie Startup ";
}

function calculateGenreExpertise(gameState) {
  const expertise = {};
  
  gameState.gameHistory.forEach(game => {
    if (!expertise[game.genre]) {
      expertise[game.genre] = { games: 0, totalScore: 0, score: 0 };
    }
    expertise[game.genre].games++;
    expertise[game.genre].totalScore += game.successScore;
    expertise[game.genre].score = expertise[game.genre].totalScore / expertise[game.genre].games;
  });
  
  return expertise;
}

function getExpertiseLevel(score) {
  if (score >= 90) return "Master";
  if (score >= 75) return "Expert";
  if (score >= 60) return "Proficient";
  if (score >= 40) return "Competent";
  return "Novice";
}

function getPresenceIndicator(presence) {
  const level = Math.floor(presence * 10);
  return `[${"".repeat(level)}${".".repeat(10-level)}] ${(presence * 100).toFixed(1)}%`;
}

function getPresenceLevel(presence) {
  if (presence < 0.2) return "Unknown Studio";
  if (presence < 0.4) return "Rising Developer";
  if (presence < 0.6) return "Established Studio";
  if (presence < 0.8) return "Industry Leader";
  return "Legendary Developer";
}

function generateSocialMentions(gameState, gameResult) {
  gameState.reputation.lastMentions = [];
  const mentionCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < mentionCount; i++) {
    let mentionPool;
    if (gameResult.successScore >= 80) {
      mentionPool = SOCIAL_MENTIONS.positive;
    } else if (gameResult.successScore >= 50) {
      mentionPool = SOCIAL_MENTIONS.neutral;
    } else {
      mentionPool = SOCIAL_MENTIONS.negative;
    }
    
    let mention = mentionPool[Math.floor(Math.random() * mentionPool.length)]
      .replace('{company}', gameState.companyName)
      .replace('{genre}', gameResult.genre);
      
    gameState.reputation.lastMentions.push(mention);
  }
}

function updateMarketPresence(gameState, gameResult) {
  const baseIncrease = gameResult.successScore / 100;
  const marketingMultiplier = 1 + (gameResult.marketingBudget / 10000);
  
  if (!gameState.reputation.marketPresence) {
    gameState.reputation.marketPresence = 0;
  }
  
  gameState.reputation.marketPresence = Math.min(1, 
    gameState.reputation.marketPresence + (baseIncrease * marketingMultiplier * 0.1)
  );
}

function calculateAudienceReception(successScore, project, gameState) {
  // Initialize base reception
  const reception = {
    casual: 0,
    hardcore: 0,
    critics: 0
  };

  // Early validation
  if (!project || typeof successScore !== 'number') {
    console.error('Invalid project data for reception calculation');
    return reception;
  }

  try {
    // Set default target audience if not specified
    const targetAudience = project.targetAudience || 'all';
    
    // Define default preferences as fallback
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

    // Get audience data with fallbacks
    const audienceData = window.AUDIENCE_SEGMENTS || DEFAULT_PREFERENCES;
    
    // Safely get genre for lookup
    const genre = (project.genre || 'puzzle').toLowerCase();
    
    // Get preferences with robust fallback chain
    const targetPreferences = audienceData[targetAudience]?.preferences || 
                            audienceData.all?.preferences || 
                            DEFAULT_PREFERENCES[targetAudience] || 
                            DEFAULT_PREFERENCES.all;
    
    // Get genre multiplier with safe fallback
    const genreMultiplier = targetPreferences[genre] || 1.0;
    
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

function initializeBaseReputation() {
  return {
    casual: {
      fans: 100,
      loyalty: 0.5,
      expectations: 50
    },
    hardcore: {
      fans: 100,
      loyalty: 0.5,
      expectations: 50
    },
    critics: {
      fans: 100,
      loyalty: 0.5,
      expectations: 50
    },
    lastMentions: [],
    marketPresence: 0
  };
}

window.initializeBaseReputation = initializeBaseReputation;
window.calculateAudienceReception = calculateAudienceReception;

function calculateStudioEntryImpact(gameState, genre) {
  // New studios get a small bonus to represent "fresh perspective"
  if (!gameState.gameHistory || gameState.gameHistory.length === 0) {
    return 1.1;
  }

  // Calculate genre experience
  const genreGames = gameState.gameHistory.filter(g => g.genre === genre).length;
  if (genreGames === 0) {
    // First time in this genre
    return 1.05;
  }

  return 1.0;
}

function calculateStudioPositioning(gameState, project) {
  const basePositioning = {
    casual: 1.0,
    hardcore: 1.0,
    critics: 1.0
  };

  // For new studios, use default positioning
  if (!gameState.gameHistory || gameState.gameHistory.length === 0) {
    return basePositioning;
  }

  // Calculate historical audience reception
  const history = gameState.gameHistory.slice(-3); // Last 3 games
  if (history.length > 0) {
    let casualSum = 0, hardcoreSum = 0, criticsSum = 0;
    let count = 0;

    history.forEach(game => {
      if (game.reception) {
        casualSum += game.reception.casual || 0;
        hardcoreSum += game.reception.hardcore || 0;
        criticsSum += game.reception.critics || 0;
        count++;
      }
    });

    if (count > 0) {
      basePositioning.casual = 1 + ((casualSum / count) * 0.002);
      basePositioning.hardcore = 1 + ((hardcoreSum / count) * 0.002);
      basePositioning.critics = 1 + ((criticsSum / count) * 0.002);
    }
  }

  return basePositioning;
}

function calculateMarketEntryFactor(gameState, genre) {
  // Base factor for all releases
  let factor = 1.0;

  // Get market trends with fallback
  const marketTrends = gameState.marketTrends || {};
  const genreData = marketTrends[genre.toLowerCase()] || { 
    popularity: 1.0, 
    growth: 0,
    saturation: 0.5 
  };

  // Adjust for market conditions
  factor *= (1 + (genreData.growth || 0));
  factor *= (1 - ((genreData.saturation || 0.5) * 0.2));

  // First-time genre bonus
  const genreExperience = (gameState.gameHistory || [])
    .filter(g => g.genre === genre).length;
  if (genreExperience === 0) {
    factor *= 1.1; // 10% bonus for genre innovation
  }

  return Math.max(0.8, Math.min(1.5, factor));
}

const REVIEW_ELEMENTS = {
  positive_feature: [
    "The {feature} implementation shows real promise",
    "Well-executed {feature} mechanics",
    "Solid {feature} system that delivers",
    "Clever use of {feature} mechanics",
    "Impressive {feature} integration"
  ],
  needs_improvement: [
    "The {feature} system could use more polish",
    "Some rough edges in the {feature} implementation",
    "{feature} mechanics need more refinement",
    "The {feature} aspects feel underdeveloped",
    "{feature} elements show potential but need work"
  ],
  bug_impact: {
    low: [
      "Minor technical issues don't detract significantly",
      "A few small bugs, but nothing game-breaking",
      "Generally stable with occasional minor glitches"
    ],
    medium: [
      "Some notable bugs impact the experience",
      "Technical issues occasionally interrupt gameplay",
      "Several bugs need attention in future updates"
    ],
    high: [
      "Significant technical problems hurt the experience",
      "Frequent bugs detract from the core gameplay",
      "Technical issues need substantial attention"
    ]
  },
  development_choices: {
    quality_focus: [
      "Attention to polish is evident throughout",
      "Clear focus on quality over quick delivery",
      "The extra development time paid off"
    ],
    balanced: [
      "Balanced approach to development shows",
      "Reasonable compromise between speed and quality",
      "Solid execution within timeframe"
    ],
    speed_focus: [
      "Quick delivery came at a cost to polish",
      "Rush to release is apparent in places",
      "Could have benefited from more development time"
    ]
  },
  new_studio: {
    encouraging: [
      "An impressive debut for a new studio",
      "Shows great promise for a first release",
      "A solid foundation to build upon"
    ],
    constructive: [
      "Room to grow but shows potential",
      "A learning experience that will serve them well",
      "Good first effort with clear areas for improvement"
    ]
  },
  future_recommendations: {
    gameplay: [
      "Deeper gameplay mechanics would enhance the experience",
      "More varied gameplay elements could add replay value",
      "Consider expanding core gameplay systems"
    ],
    technical: [
      "Focus on technical polish for future releases",
      "Stronger optimization could improve performance",
      "More thorough testing would benefit future titles"
    ],
    content: [
      "Additional content variety would add value",
      "More gameplay options would increase longevity",
      "Expanded feature set would strengthen the offering"
    ]
  }
};

function generateReviewerFeedback(reviewer, gameResult, gameState) {
  // Keep existing review score calculation
  let reviewerScore = gameResult.successScore;
  
  // Apply existing reviewer biases
  Object.entries(reviewer.biases).forEach(([aspect, bias]) => {
    if (gameResult.metrics?.[aspect]) {
      reviewerScore *= bias;
    }
  });

  // Normalize score
  reviewerScore = Math.min(100, Math.max(0, reviewerScore));

  // Generate contextual comments
  const comments = generateContextualComments(reviewer, gameResult, gameState);

  // Select appropriate quote based on score
  let mainQuote;
  if (reviewerScore >= 80) {
    mainQuote = reviewer.quotes.positive[Math.floor(Math.random() * reviewer.quotes.positive.length)];
  } else if (reviewerScore >= 50) {
    mainQuote = reviewer.quotes.neutral[Math.floor(Math.random() * reviewer.quotes.neutral.length)];
  } else {
    mainQuote = reviewer.quotes.negative[Math.floor(Math.random() * reviewer.quotes.negative.length)];
  }

  return {
    reviewer: {
      name: reviewer.name,
      title: reviewer.title,
      background: reviewer.background
    },
    score: Math.round(reviewerScore),
    mainQuote: mainQuote,
    comments: comments,
    focusComments: generateFocusComments(reviewer, gameResult),
    style: reviewer.style
  };
}

function generateContextualComments(reviewer, gameResult, gameState) {
  const comments = [];
  
  // Check if this is a first release
  const isFirstGame = !gameState.gameHistory || gameState.gameHistory.length === 0;
  
  // Feature commentary
  if (gameResult.elements) {
    const bestFeature = getBestFeature(gameResult);
    const weakestFeature = getWeakestFeature(gameResult);
    
    if (bestFeature) {
      comments.push(selectComment(REVIEW_ELEMENTS.positive_feature)
        .replace('{feature}', bestFeature));
    }
    if (weakestFeature) {
      comments.push(selectComment(REVIEW_ELEMENTS.needs_improvement)
        .replace('{feature}', weakestFeature));
    }
  }

  // Bug impact commentary
  const bugImpact = assessBugImpact(gameResult);
  if (bugImpact) {
    comments.push(selectComment(REVIEW_ELEMENTS.bug_impact[bugImpact]));
  }

  // Development choices commentary
  const devStyle = gameResult.priority || 'balanced';
  comments.push(selectComment(REVIEW_ELEMENTS.development_choices[devStyle]));

  // New studio commentary
  if (isFirstGame) {
    const studioComment = reviewerScore >= 70 ? 
      selectComment(REVIEW_ELEMENTS.new_studio.encouraging) :
      selectComment(REVIEW_ELEMENTS.new_studio.constructive);
    comments.push(studioComment);
  }

  // Future recommendations based on weak areas
  const weakestCategory = findWeakestCategory(gameResult);
  if (weakestCategory) {
    comments.push(selectComment(REVIEW_ELEMENTS.future_recommendations[weakestCategory]));
  }

  return comments;
}

function getBestFeature(gameResult) {
  // Implement logic to determine best feature based on metrics
  if (!gameResult.elements || !gameResult.elements.length) return null;
  return gameResult.elements[Math.floor(Math.random() * gameResult.elements.length)];
}

function getWeakestFeature(gameResult) {
  // Implement logic to determine weakest feature based on metrics
  if (!gameResult.elements || !gameResult.elements.length) return null;
  return gameResult.elements[Math.floor(Math.random() * gameResult.elements.length)];
}

function assessBugImpact(gameResult) {
  if (!gameResult.bugs) return null;
  
  const totalBugs = gameResult.bugs.total || 0;
  const criticalBugs = gameResult.bugs.severity?.critical || 0;
  
  if (criticalBugs > 0 || totalBugs > 10) return 'high';
  if (totalBugs > 5) return 'medium';
  if (totalBugs > 0) return 'low';
  return null;
}

function findWeakestCategory(gameResult) {
  // Default to gameplay if no clear data
  if (!gameResult.metrics) return 'gameplay';
  
  const categories = {
    gameplay: calculateCategoryScore(gameResult, 'gameplay'),
    technical: calculateCategoryScore(gameResult, 'technical'),
    content: calculateCategoryScore(gameResult, 'content')
  };
  
  return Object.entries(categories)
    .sort(([,a], [,b]) => a - b)[0][0];
}

function calculateCategoryScore(gameResult, category) {
  // Implement scoring logic based on available metrics
  return Math.random() * 100; // Placeholder - replace with actual metrics
}

function selectComment(comments) {
  return comments[Math.floor(Math.random() * comments.length)];
}

function displayReleaseResults(game, stats, bugImpact) {
  // ... existing display code ...

  // Reviews Section
  outputToDisplay("\n──── Press Reviews ────");
  const reviews = generateReviews(game, gameState);
  reviews.forEach(review => {
    outputToDisplay(`\n${review.reviewer.name} - ${review.reviewer.title}`);
    outputToDisplay(`Score: ${review.score}/100`);
    outputToDisplay(`"${review.mainQuote}"`);
    
    // Display contextual comments
    if (review.comments && review.comments.length > 0) {
      outputToDisplay("\nDetailed Feedback:");
      review.comments.forEach(comment => {
        outputToDisplay(`• ${comment}`);
      });
    }
    
    // Display focus area comments
    if (review.focusComments && review.focusComments.length > 0) {
      outputToDisplay("\nFocus Areas:");
      review.focusComments.forEach(comment => {
        outputToDisplay(`- ${comment}`);
      });
    }
  });

}

window.updateReputation = updateReputation;
window.displayReputation = displayReputation;
window.calculateBrandStrength = calculateBrandStrength;
window.calculateAudienceReception = calculateAudienceReception;
