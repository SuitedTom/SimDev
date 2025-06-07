const MOOD_FACTORS = {
  overtime: -10,
  success: 15,
  failure: -15,
  bug_fixed: 5,
  salary_raise: 20,
  project_completion: 10,
  member_fired: -5
};

const DEVELOPMENT_PRIORITIES = {
  quality: {
    name: "Quality Focus",
    effects: {
      development_speed: 0.8,
      bug_rate: 0.7,
      team_morale: -5,
      quality_bonus: 1.3
    }
  },
  balanced: {
    name: "Balanced Approach",
    effects: {
      development_speed: 1.0,
      bug_rate: 1.0,
      team_morale: 0,
      quality_bonus: 1.0
    }
  },
  speed: {
    name: "Speed Focus",
    effects: {
      development_speed: 1.3,
      bug_rate: 1.4,
      team_morale: -10,
      quality_bonus: 0.8
    }
  }
};

const PRODUCTION_PRIORITIES = {
  features: {
    name: "Feature Implementation",
    effects: {
      development_speed: 1.1,
      bug_rate: 1.2,
      innovation: 1.2
    }
  },
  optimization: {
    name: "Technical Optimization",
    effects: {
      development_speed: 0.9,
      bug_rate: 0.8,
      performance: 1.2
    }
  },
  polish: {
    name: "Polish & Refinement",
    effects: {
      development_speed: 0.9,
      quality: 1.2,
      user_experience: 1.2
    }
  }
};

const MILESTONE_EVENTS = [
  {
    name: "Design Review",
    description: "The team is reviewing the current design direction.",
    choices: [
      {
        text: "Focus on innovation",
        effects: { quality: 1.1, development_speed: 0.9, innovation: 1.2 }
      },
      {
        text: "Stick to proven mechanics",
        effects: { quality: 0.9, development_speed: 1.1, risk: 0.8 }
      }
    ]
  },
  {
    name: "Technical Challenge",
    description: "The team has encountered a significant technical hurdle.",
    choices: [
      {
        text: "Invest time in proper solution",
        effects: { quality: 1.2, development_speed: 0.8, bug_rate: 0.7 }
      },
      {
        text: "Find quick workaround",
        effects: { quality: 0.8, development_speed: 1.2, bug_rate: 1.3 }
      }
    ]
  }
];

const POLISH_DECISIONS = {
  immediate: {
    name: "Release Now",
    effects: {
      time_saved: 4,
      quality: 0.8
    }
  },
  optimal: {
    name: "Standard Release",
    effects: {
      quality: 1.0,
      time_saved: 0
    }
  },
  delayed: {
    name: "Extra Polish",
    effects: {
      quality: 1.2,
      time_saved: -2
    }
  }
};

const REVIEWER_PROFILES = {
  technicalExpert: {
    name: "Alex Chen",
    title: "Technical Analysis Editor",
    background: "Former game engine developer with 10 years of experience",
    focuses: ["performance", "technical innovation", "code quality"],
    biases: {
      technical_quality: 1.3,
      innovation: 1.2,
      visual_quality: 0.9
    },
    style: "technical",
    quotes: {
      positive: [
        "The technical architecture is impressively robust",
        "Performance optimization is clearly a priority",
        "Rock-solid frame rates and responsive controls"
      ],
      neutral: [
        "Technically competent, if not groundbreaking",
        "Stable performance with occasional hitches",
        "Adequate technical foundation"
      ],
      negative: [
        "Technical issues hamper the experience",
        "Performance optimizations seem lacking",
        "Technical debt is evident in the implementation"
      ]
    }
  },
  indieEnthusiast: {
    name: "Sarah Martinez",
    title: "Indie Game Spotlight",
    background: "Indie game curator and community organizer",
    focuses: ["creativity", "innovation", "artistic vision"],
    biases: {
      innovation: 1.4,
      visual_style: 1.2,
      technical_quality: 0.8
    },
    style: "passionate",
    quotes: {
      positive: [
        "Bursting with creative energy and fresh ideas",
        "A bold artistic vision shines through",
        "Proves indies can deliver unique experiences"
      ],
      neutral: [
        "Shows promise but plays it safe",
        "Some interesting ideas amid familiar elements",
        "Decent effort from an up-and-coming studio"
      ],
      negative: [
        "Lacks the creative spark that makes indies special",
        "Falls short of its artistic ambitions",
        "Struggles to stand out in the indie space"
      ]
    }
  },
  casualGaming: {
    name: "Mike Thompson",
    title: "Casual Gaming Weekly",
    background: "Mobile gaming expert and accessibility advocate",
    focuses: ["accessibility", "fun factor", "pick-up-and-play"],
    biases: {
      user_experience: 1.3,
      complexity: 0.7,
      hardcore_appeal: 0.8
    },
    style: "approachable",
    quotes: {
      positive: [
        "Perfect for quick gaming sessions",
        "Incredibly accessible without sacrificing depth",
        "Anyone can pick up and enjoy this"
      ],
      neutral: [
        "Decent casual entertainment",
        "Simple but sometimes repetitive",
        "Acceptable time-waster"
      ],
      negative: [
        "Too complex for casual players",
        "Confusing interface hurts accessibility",
        "Fails to maintain casual interest"
      ]
    }
  },
  veteranCritic: {
    name: "Diana Wells",
    title: "Classic Gaming Authority",
    background: "25 years of game criticism experience",
    focuses: ["game design", "genre evolution", "industry trends"],
    biases: {
      design_quality: 1.2,
      innovation: 1.1,
      polish: 1.2
    },
    style: "analytical",
    quotes: {
      positive: [
        "Shows deep understanding of the genre",
        "Masterfully executed game design",
        "Sets new standards for the genre"
      ],
      neutral: [
        "Competent but unremarkable execution",
        "Follows genre conventions adequately",
        "Neither innovates nor disappoints"
      ],
      negative: [
        "Fails to learn from genre history",
        "Design choices feel dated",
        "Misses fundamental genre elements"
      ]
    }
  },
  communityVoice: {
    name: "Jordan Riley",
    title: "Community Perspective",
    background: "Popular streamer and community figure",
    focuses: ["entertainment value", "multiplayer", "community features"],
    biases: {
      entertainment: 1.3,
      social_features: 1.2,
      technical_quality: 0.9
    },
    style: "energetic",
    quotes: {
      positive: [
        "The community is going to love this!",
        "Incredibly fun with friends",
        "Stream-friendly and engaging"
      ],
      neutral: [
        "Has its moments but lacks staying power",
        "Community might be split on this one",
        "Fun but might not hold attention long"
      ],
      negative: [
        "Missing key community features",
        "Unlikely to build a strong following",
        "Limited streaming/community appeal"
      ]
    }
  }
};

const MARKET_CYCLES = {
  BOOM: { growth: 0.2, duration: [8, 12] },
  STABLE: { growth: 0.05, duration: [12, 24] },
  DECLINE: { growth: -0.1, duration: [4, 8] },
  RECOVERY: { growth: 0.1, duration: [6, 10] }
};

function initializeMarketTrends(gameState) {
  const genres = Object.keys(GENRE_DATA);
  gameState.marketTrends = {};
  
  genres.forEach(genre => {
    gameState.marketTrends[genre] = {
      popularity: 0.5 + (Math.random() * 0.5), // 50-100% base popularity
      growth: 0.05 + (Math.random() * 0.1),    // 5-15% growth rate
      cycle: 'STABLE',
      cycleWeek: 0,
      cycleDuration: 12,
      saturation: Math.random() * 0.3,         // 0-30% initial saturation
      trends: [],
      competitorReleases: []
    };
  });

  // Randomly boost a few genres
  const boostCount = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...genres].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < boostCount; i++) {
    const genre = shuffled[i];
    gameState.marketTrends[genre].popularity *= 1.5;
    gameState.marketTrends[genre].growth *= 1.2;
  }

  // Initialize competitor releases
  initializeCompetitorReleases(gameState);

  return gameState.marketTrends;
}

function initializeCompetitorReleases(gameState) {
  const nextMonths = 12;
  const genres = Object.keys(GENRE_DATA);
  
  for (let month = 1; month <= nextMonths; month++) {
    const releaseCount = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < releaseCount; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const week = (month * 4) - Math.floor(Math.random() * 4);
      
      gameState.marketTrends[genre].competitorReleases.push({
        week: week,
        company: generateCompanyName(),
        anticipation: Math.random() * 100
      });
    }
  }
}

function updateMarketTrends(gameState) {
  Object.entries(gameState.marketTrends).forEach(([genre, data]) => {
    // Update market cycle
    data.cycleWeek++;
    if (data.cycleWeek >= data.cycleDuration) {
      transitionMarketCycle(data);
    }
    
    // Apply cycle effects
    const cycleData = MARKET_CYCLES[data.cycle];
    data.popularity = Math.max(0.1, Math.min(2.0, 
      data.popularity * (1 + cycleData.growth * (Math.random() * 0.5 + 0.75))
    ));
    
    // Update saturation
    data.saturation = Math.max(0, Math.min(1,
      data.saturation + (Math.random() * 0.1 - 0.05)
    ));
    
    // Record trend data
    data.trends.push({
      week: gameState.weekNumber,
      popularity: data.popularity,
      saturation: data.saturation
    });
    
    // Trim old trend data
    if (data.trends.length > 52) {
      data.trends.shift();
    }
    
    // Clean up old competitor releases
    data.competitorReleases = data.competitorReleases.filter(
      release => release.week >= gameState.weekNumber
    );
  });
}

function transitionMarketCycle(data) {
  const cycles = Object.keys(MARKET_CYCLES);
  const currentIndex = cycles.indexOf(data.cycle);
  
  // Determine next cycle (with some randomness)
  let nextIndex;
  if (Math.random() < 0.7) {
    // 70% chance to follow normal progression
    nextIndex = (currentIndex + 1) % cycles.length;
  } else {
    // 30% chance to pick random next cycle
    nextIndex = Math.floor(Math.random() * cycles.length);
  }
  
  data.cycle = cycles[nextIndex];
  data.cycleWeek = 0;
  
  // Set new cycle duration
  const [min, max] = MARKET_CYCLES[data.cycle].duration;
  data.cycleDuration = min + Math.floor(Math.random() * (max - min));
}

function generateCompanyName() {
  const prefixes = ['Mega', 'Super', 'Ultra', 'Epic', 'Digital', 'Crystal', 'Pixel', 'Cyber'];
  const suffixes = ['Games', 'Studios', 'Interactive', 'Entertainment', 'Digital', 'Arts', 'Media'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
    suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateReviews(gameResult, gameState) {
  const reviewers = selectReviewers();
  const reviews = [];

  reviewers.forEach(reviewer => {
    const review = generateReviewerFeedback(reviewer, gameResult, gameState);
    reviews.push(review);
  });

  return reviews;
}

function selectReviewers() {
  const allReviewers = Object.values(REVIEWER_PROFILES);
  const selectedReviewers = [];
  const reviewerCount = Math.floor(Math.random() * 3) + 3; // 3-5 reviewers

  // Shuffle reviewers
  for (let i = allReviewers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allReviewers[i], allReviewers[j]] = [allReviewers[j], allReviewers[i]];
  }

  // Select first reviewerCount reviewers
  return allReviewers.slice(0, reviewerCount);
}

function generateReviewerFeedback(reviewer, gameResult, gameState) {
  // Calculate reviewer-specific score
  let reviewerScore = gameResult.successScore;
  
  // Apply reviewer biases
  Object.entries(reviewer.biases).forEach(([aspect, bias]) => {
    if (gameResult.metrics?.[aspect]) {
      reviewerScore *= bias;
    }
  });

  // Normalize score
  reviewerScore = Math.min(100, Math.max(0, reviewerScore));

  // Select appropriate quote
  let quote;
  if (reviewerScore >= 80) {
    quote = reviewer.quotes.positive[Math.floor(Math.random() * reviewer.quotes.positive.length)];
  } else if (reviewerScore >= 50) {
    quote = reviewer.quotes.neutral[Math.floor(Math.random() * reviewer.quotes.neutral.length)];
  } else {
    quote = reviewer.quotes.negative[Math.floor(Math.random() * reviewer.quotes.negative.length)];
  }

  // Generate focus-specific comments
  const focusComments = generateFocusComments(reviewer, gameResult);

  return {
    reviewer: {
      name: reviewer.name,
      title: reviewer.title,
      background: reviewer.background
    },
    score: Math.round(reviewerScore),
    mainQuote: quote,
    focusComments: focusComments,
    style: reviewer.style
  };
}

function generateFocusComments(reviewer, gameResult) {
  const comments = [];
  reviewer.focuses.forEach(focus => {
    // Generate focus-specific feedback based on game metrics
    const relevantMetric = getRelevantMetric(focus, gameResult);
    if (relevantMetric !== null) {
      comments.push(generateFocusComment(focus, relevantMetric));
    }
  });
  return comments;
}

function getRelevantMetric(focus, gameResult) {
  // Map focus areas to game metrics
  const metricMap = {
    'technical innovation': gameResult.metrics?.technical?.innovation || 50,
    'performance': gameResult.metrics?.technical?.performance || 50,
    'creativity': gameResult.metrics?.design?.innovation || 50,
    'accessibility': gameResult.metrics?.design?.accessibility || 50,
    'fun factor': gameResult.metrics?.design?.entertainment || 50,
    'game design': gameResult.metrics?.design?.quality || 50
    // Add more mappings as needed
  };

  return metricMap[focus] || null;
}

function generateFocusComment(focus, metric) {
  // Generate specific comment based on focus area and metric value
  if (metric >= 80) {
    return `Excellent ${focus} implementation`;
  } else if (metric >= 60) {
    return `Solid ${focus} showing`;
  } else {
    return `Room for improvement in ${focus}`;
  }
}

// Export the new functions
window.initializeMarketTrends = initializeMarketTrends;
window.updateMarketTrends = updateMarketTrends;

window.REVIEWER_PROFILES = REVIEWER_PROFILES;
window.generateReviews = generateReviews;
