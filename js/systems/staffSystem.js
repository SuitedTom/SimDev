function processStaff(gameState) {
  gameState.totalSalaries = gameState.staff.reduce((total, staff) => total + staff.salary, 0);
  
  // Process staff activities
  gameState.staff.forEach(staff => {
    // Update experience
    staff.experience++;
    
    // Random mood changes
    if (Math.random() < 0.2) {
      staff.mood += Math.floor(Math.random() * 11) - 5;
      staff.mood = Math.max(0, Math.min(100, staff.mood));
    }

    // Apply productivity effects
    if (gameState.project) {
      applyStaffEffects(gameState, staff);
    }
  });
}

function applyStaffEffects(gameState, staff) {
  const staffType = STAFF_TYPES[staff.type];
  const effectiveness = calculateStaffEffectiveness(staff);
  
  staffType.affects.forEach(effect => {
    if (!gameState.modifiers[effect]) gameState.modifiers[effect] = 1;
    gameState.modifiers[effect] *= (0.9 + (effectiveness * 0.2));
  });
}

function calculateStaffEffectiveness(staff) {
  const skillAverage = Object.values(staff.skills).reduce((sum, val) => sum + val, 0) / 
    Object.keys(staff.skills).length;
  const moodFactor = staff.mood / 100;
  const experienceFactor = Math.min(1, staff.experience / 365); // Cap at 1 year
  
  return (skillAverage / 5) * moodFactor * (0.7 + (experienceFactor * 0.3));
}

function updateStaffMoods(gameState, event) {
  const moodChange = MOOD_FACTORS[event] || 0;
  
  gameState.staff.forEach(staff => {
    staff.mood = Math.max(0, Math.min(100, staff.mood + moodChange));
  });
}

function displayStaffDetails(staff, index) {
  const staffType = STAFF_TYPES[staff.type];
  const moodEmoji = getMoodEmoji(staff.mood);
  const experienceYears = (staff.experience / 365).toFixed(1);
  
  const output = [
    `\n=== ${staff.name} - ${staffType.name} ===`,
    `Employee #${index + 1}`,
    `Status: ${moodEmoji} ${getMoodDescription(staff.mood)}`,
    `Salary: $${staff.salary}/week`,
    `Experience: ${experienceYears} years`,
    "\nSkills:",
  ];

  Object.entries(staff.skills).forEach(([skill, level]) => {
    output.push(`${skill}: ${"★".repeat(level)}☆${"☆".repeat(5-level)} (${level}/5)`);
  });

  // Add performance metrics
  const performance = calculatePerformance(staff);
  output.push(
    "\nPerformance Metrics:",
    `Productivity: ${performance.productivity}%`,
    `Quality: ${performance.quality}%`,
    `Team Impact: ${performance.teamImpact}%`
  );

  // Add project assignment if any
  if (staff.currentProject) {
    output.push(
      "\nCurrent Assignment:",
      `Project: ${staff.currentProject}`,
      `Role: ${staff.projectRole}`,
      `Time Allocated: ${staff.allocation}%`
    );
  } else {
    output.push("\nCurrently Unassigned");
  }

  // Add recent history
  if (staff.history && staff.history.length > 0) {
    output.push(
      "\nRecent Activity:",
      ...staff.history.slice(-3).map(entry => `- ${entry}`)
    );
  }

  // Add available actions
  output.push(
    "\nAvailable Actions:",
    "- train [skill]  - Improve specific skill",
    "- raise [amount] - Adjust salary",
    "- assign [project] - Assign to project",
    "- review - View detailed performance report"
  );

  output.forEach(line => outputToDisplay(line));
}

function getMoodEmoji(mood) {
  if (mood >= 90) return "😄";
  if (mood >= 75) return "😊";
  if (mood >= 50) return "😐";
  if (mood >= 25) return "😟";
  return "😠";
}

function getMoodDescription(mood) {
  if (mood >= 90) return "Excellent - Highly motivated";
  if (mood >= 75) return "Good - Satisfied";
  if (mood >= 50) return "Neutral - Content";
  if (mood >= 25) return "Poor - Dissatisfied";
  return "Critical - Considering leaving";
}

function calculatePerformance(staff) {
  const baseProductivity = (staff.skills[staff.type] || 3) * 15;
  const moodFactor = staff.mood / 100;
  const experienceFactor = Math.min(1, staff.experience / 365);

  return {
    productivity: Math.round(baseProductivity * moodFactor * (1 + experienceFactor)),
    quality: Math.round(((staff.skills.quality || 3) / 5) * 100 * moodFactor),
    teamImpact: Math.round(((staff.skills.teamwork || 3) / 5) * 100)
  };
}

function displayStaffRoster(gameState) {
  if (gameState.staff.length === 0) {
    outputToDisplay("No staff members hired yet.");
    outputToDisplay("Use 'hire view' to see available candidates.");
    return;
  }

  const totalCost = gameState.staff.reduce((sum, staff) => sum + staff.salary, 0);
  const avgMorale = Math.round(gameState.staff.reduce((sum, staff) => sum + staff.mood, 0) / gameState.staff.length);

  outputToDisplay("\n=== Staff Roster Overview ===");
  outputToDisplay(`Total Staff: ${gameState.staff.length}`);
  outputToDisplay(`Weekly Payroll: $${totalCost}`);
  outputToDisplay(`Average Morale: ${avgMorale}%`);
  outputToDisplay(`Workspace: ${gameState.workspace} (${WORKSPACES[gameState.workspace].capacity} capacity)`);

  // Department breakdown
  const departments = {};
  gameState.staff.forEach(staff => {
    departments[staff.type] = (departments[staff.type] || 0) + 1;
  });

  outputToDisplay("\nDepartment Breakdown:");
  Object.entries(departments).forEach(([dept, count]) => {
    outputToDisplay(`${STAFF_TYPES[dept].name}s: ${count}`);
  });

  outputToDisplay("\nTeam Members:");
  gameState.staff.forEach((staff, index) => {
    const staffType = STAFF_TYPES[staff.type];
    outputToDisplay(`\n${index + 1}. ${staff.name} - ${staffType.name}`);
    outputToDisplay(`   Mood: ${getMoodEmoji(staff.mood)} | Salary: $${staff.salary}/week`);
    outputToDisplay(`   Top Skills: ${getTopSkills(staff)}`);
    if (staff.currentProject) {
      outputToDisplay(`   Project: ${staff.currentProject}`);
    }
  });

  outputToDisplay("\nCommands:");
  outputToDisplay("- staff [number] - View detailed employee info");
  outputToDisplay("- train [number] [skill] - Train employee");
  outputToDisplay("- raise [number] [amount] - Give raise");
  outputToDisplay("- fire [number] - Dismiss employee");
}

function getTopSkills(staff) {
  return Object.entries(staff.skills)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([skill, level]) => `${skill} (${level}/5)`)
    .join(', ');
}

function handleStaffCommand(params, gameState) {
  if (params.length === 0) {
    displayStaffRoster(gameState);
    return;
  }

  const action = params[0].toLowerCase();
  
  if (action === 'fire') {
    handleFireStaff(params.slice(1), gameState);
    return;
  }

  const staffIndex = parseInt(params[0]) - 1;
  if (isNaN(staffIndex) || staffIndex < 0 || staffIndex >= gameState.staff.length) {
    outputToDisplay("Invalid staff number. Use 'staff' to see the full roster.");
    return;
  }

  const staff = gameState.staff[staffIndex];
  const subAction = params[1];

  switch(subAction) {
    case undefined:
      displayStaffDetails(staff, staffIndex);
      break;
    case 'train':
      handleTraining(staff, params[2], gameState);
      break;
    case 'raise':
      handleRaise(staff, parseInt(params[2]), gameState);
      break;
    case 'assign':
      handleAssignment(staff, params.slice(2).join(' '), gameState);
      break;
    case 'review':
      displayPerformanceReview(staff);
      break;
    default:
      outputToDisplay("Unknown staff action. Available actions: train, raise, assign, review, fire");
  }
}

function handleFireStaff(params, gameState) {
  if (!params.length) {
    outputToDisplay("Usage: fire [staff number]");
    outputToDisplay("View staff numbers with 'staff' command");
    return;
  }

  const staffIndex = parseInt(params[0]) - 1;
  if (isNaN(staffIndex) || staffIndex < 0 || staffIndex >= gameState.staff.length) {
    outputToDisplay("Invalid staff number. Use 'staff' to see the full roster.");
    return;
  }

  const staff = gameState.staff[staffIndex];
  const confirmFire = confirm(`Are you sure you want to fire ${staff.name}?`);
  
  if (confirmFire) {
    // Remove staff member
    gameState.staff.splice(staffIndex, 1);
    
    // Update total salaries
    gameState.totalSalaries = gameState.staff.reduce((total, s) => total + s.salary, 0);
    
    // Apply morale penalty to remaining staff
    gameState.staff.forEach(s => {
      s.mood = Math.max(0, s.mood - 5);
    });

    outputToDisplay(`\n=== Staff Change ===`);
    outputToDisplay(`${staff.name} has been fired.`);
    outputToDisplay(`Team Size: ${gameState.staff.length}`);
    outputToDisplay(`New Weekly Payroll: $${gameState.totalSalaries}`);
    
    if (gameState.staff.length > 0) {
      outputToDisplay("Note: Team morale has decreased due to the firing.");
    }
  } else {
    outputToDisplay("Firing cancelled.");
  }
}

function handleTraining(staff, skill, gameState) {
  if (!skill) {
    displayTrainingOptions(staff);
    return;
  }

  const trainingCost = calculateTrainingCost(staff, skill);
  if (gameState.moneyAmount < trainingCost) {
    outputToDisplay("Insufficient funds for training!");
    outputToDisplay(`Required: $${trainingCost}`);
    outputToDisplay(`Available: $${gameState.moneyAmount}`);
    return;
  }

  if (!staff.skills[skill.toLowerCase()]) {
    outputToDisplay("Invalid skill. Available skills:");
    Object.keys(staff.skills).forEach(s => {
      outputToDisplay(`- ${formatSkillName(s)}`);
    });
    return;
  }

  // Apply training
  gameState.moneyAmount -= trainingCost;
  const previousLevel = staff.skills[skill];
  staff.skills[skill] = Math.min(5, staff.skills[skill] + 1);
  
  outputToDisplay("\n=== Training Complete ===");
  outputToDisplay(`Trained: ${staff.name}`);
  outputToDisplay(`Skill: ${formatSkillName(skill)}`);
  outputToDisplay(`Level: ${previousLevel} → ${staff.skills[skill]}`);
  outputToDisplay(`Cost: $${trainingCost}`);

  // Morale boost from training
  staff.mood = Math.min(100, staff.mood + 10);
  outputToDisplay("Staff morale improved from training!");

  if (staff.skills[skill] === 5) {
    outputToDisplay("\nMaximum skill level reached!");
  }
}

function displayTrainingOptions(staff) {
  outputToDisplay("\n=== Training Options ===");
  outputToDisplay(`Staff Member: ${staff.name}`);
  outputToDisplay("\nAvailable Skills:");

  Object.entries(staff.skills).forEach(([skill, level]) => {
    const cost = calculateTrainingCost(staff, skill);
    const stars = "★".repeat(level) + "☆".repeat(5 - level);
    outputToDisplay(`${formatSkillName(skill)}: ${stars} (${level}/5)`);
    if (level < 5) {
      outputToDisplay(`Training Cost: $${cost}`);
    } else {
      outputToDisplay("Maximum level reached");
    }
  });

  outputToDisplay("\nUse 'train [skill]' to start training");
}

function calculateTrainingCost(staff, skill) {
  const baseTrainingCost = 500;
  const currentLevel = staff.skills[skill] || 1;
  return baseTrainingCost * currentLevel;
}

function handleRaise(staff, amount, gameState) {
  if (isNaN(amount) || amount <= 0) {
    outputToDisplay("Please specify a valid raise amount.");
    return;
  }

  const weeklyIncrease = amount;
  const yearlyIncrease = weeklyIncrease * 52;

  // Check if company can afford the raise
  if (gameState.moneyAmount < yearlyIncrease) {
    outputToDisplay("Cannot afford this raise!");
    outputToDisplay(`Required funds for yearly commitment: $${yearlyIncrease}`);
    outputToDisplay(`Available funds: $${gameState.moneyAmount}`);
    return;
  }

  const oldSalary = staff.salary;
  staff.salary += weeklyIncrease;

  // Apply morale boost
  staff.mood = Math.min(100, staff.mood + 15);

  // Update total salaries
  gameState.totalSalaries = gameState.staff.reduce((total, s) => total + s.salary, 0);

  outputToDisplay(`\n=== Salary Adjustment ===`);
  outputToDisplay(`Employee: ${staff.name}`);
  outputToDisplay(`Previous Salary: $${oldSalary}/week`);
  outputToDisplay(`New Salary: $${staff.salary}/week`);
  outputToDisplay(`Increase: $${weeklyIncrease}/week`);
  outputToDisplay(`\nMorale improved due to raise!`);
  outputToDisplay(`New Weekly Payroll: $${gameState.totalSalaries}`);

  // Record the raise in staff history
  if (!staff.history) staff.history = [];
  staff.history.push(`Received $${weeklyIncrease}/week raise`);
}

function handleAssignment(staff, project, gameState) {
  // TO DO: Implement assignment functionality
  outputToDisplay("Assignment functionality not implemented yet.");
}

function displayPerformanceReview(staff) {
  // TO DO: Implement performance review functionality
  outputToDisplay("Performance review functionality not implemented yet.");
}

function displayCandidates(gameState, filterRole = null) {
  // Generate new candidates if none exist
  if (!gameState.candidates || gameState.candidates.length === 0) {
    gameState.candidates = generateCandidates();
  }
  
  outputToDisplay("\n=== Available Candidates ===");
  
  // Show filter options
  outputToDisplay("Filter by role: hire view [role]");
  outputToDisplay("Available roles: programmer, artist, writer, qa");
  outputToDisplay("Example: 'hire view programmer'\n");

  let candidatesToShow = gameState.candidates;
  if (filterRole) {
    candidatesToShow = gameState.candidates.filter(c => c.type === filterRole);
    if (candidatesToShow.length === 0) {
      outputToDisplay(`No ${filterRole} candidates currently available.`);
      outputToDisplay("Try checking back next week or view all candidates.");
      return;
    }
  }

  // Show workspace capacity info
  const workspace = WORKSPACES[gameState.workspace];
  outputToDisplay(`Workspace Capacity: ${gameState.staff.length}/${workspace.capacity} positions filled\n`);
  
  candidatesToShow.forEach((candidate, index) => {
    const staffType = STAFF_TYPES[candidate.type];
    const experienceLevel = getExperienceLevel(candidate.experience);
    
    outputToDisplay(`\n${index + 1}. ${candidate.name}`);
    outputToDisplay(`Role: ${staffType.name} (${experienceLevel})`);
    outputToDisplay(`Salary Requirement: $${candidate.salary}/week`);
    
    outputToDisplay("Key Skills:");
    Object.entries(candidate.skills).forEach(([skill, level]) => {
      const skillRating = "★".repeat(level) + "☆".repeat(5-level);
      outputToDisplay(`- ${formatSkillName(skill)}: ${skillRating}`);
    });

    // Show experience details
    const yearsExperience = (candidate.experience / 365).toFixed(1);
    outputToDisplay(`Experience: ${yearsExperience} years`);

    // Show special traits if any
    const traits = generateTraits(candidate);
    if (traits.length > 0) {
      outputToDisplay("Special Traits:");
      traits.forEach(trait => outputToDisplay(`- ${trait}`));
    }
    
    outputToDisplay(`Use 'hire ${index + 1}' to recruit this candidate\n`);
  });

  // Show hire command help
  outputToDisplay("\nHiring Commands:");
  outputToDisplay("- hire view [role] - Filter candidates by role");
  outputToDisplay("- hire [number] - Hire specific candidate");
  outputToDisplay("- hire info [number] - View detailed candidate info");
}

function formatSkillName(skill) {
  return skill.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getExperienceLevel(days) {
  if (days >= 1825) return "Expert (5+ years)";
  if (days >= 1095) return "Senior (3+ years)";
  if (days >= 365) return "Intermediate (1+ year)";
  return "Junior (<1 year)";
}

function generateTraits(candidate) {
  const traits = [];
  
  // Experience-based traits
  if (candidate.experience > 1825) traits.push("Industry Veteran");
  if (candidate.experience < 180) traits.push("Fresh Graduate");
  
  // Skill-based traits
  const avgSkill = Object.values(candidate.skills).reduce((a,b) => a + b, 0) / 
    Object.keys(candidate.skills).length;
  
  if (avgSkill >= 4) traits.push("Highly Skilled");
  
  // Specialization traits
  const maxSkill = Math.max(...Object.values(candidate.skills));
  const specializations = Object.entries(candidate.skills)
    .filter(([_, value]) => value === maxSkill)
    .map(([skill, _]) => skill);
  
  if (maxSkill >= 4 && specializations.length === 1) {
    traits.push(`${formatSkillName(specializations[0])} Specialist`);
  }
  
  // Salary-based traits
  const staffType = STAFF_TYPES[candidate.type];
  if (candidate.salary < staffType.baseSalary * 0.9) traits.push("Budget Friendly");
  if (candidate.salary > staffType.baseSalary * 1.3) traits.push("Premium Talent");
  
  return traits;
}

function handleHireCommand(params, gameState) {
  if (!params || params.length === 0) {
    outputToDisplay("Usage: hire view [role] - View candidates");
    outputToDisplay("       hire [number] - Hire candidate");
    outputToDisplay("       hire info [number] - View detailed candidate info");
    return;
  }

  const action = params[0].toLowerCase();
  
  switch(action) {
    case 'view':
      const filterRole = params[1]?.toLowerCase();
      if (filterRole && !STAFF_TYPES[filterRole]) {
        outputToDisplay("Invalid role type. Available roles:");
        outputToDisplay(Object.keys(STAFF_TYPES).join(", ")
      );
      return;
    }
    displayCandidates(gameState, filterRole);
    break;

    case 'info':
      const infoIndex = parseInt(params[1]) - 1;
      if (isNaN(infoIndex) || !gameState.candidates[infoIndex]) {
        outputToDisplay("Invalid candidate number. Use 'hire view' to see available candidates.");
        return;
      }
      displayCandidateDetails(gameState.candidates[infoIndex]);
      break;

    default:
      const hireIndex = parseInt(action) - 1;
      if (isNaN(hireIndex) || !gameState.candidates[hireIndex]) {
        outputToDisplay("Invalid candidate number. Use 'hire view' to see available candidates.");
        return;
      }
      hireCandidateCommand(hireIndex, gameState);
  }
}

function displayCandidateDetails(candidate) {
  const staffType = STAFF_TYPES[candidate.type];
  const experienceLevel = getExperienceLevel(candidate.experience);
  
  outputToDisplay("\n=== Candidate Details ===");
  outputToDisplay(`Name: ${candidate.name}`);
  outputToDisplay(`Role: ${staffType.name}`);
  outputToDisplay(`Experience Level: ${experienceLevel}`);
  outputToDisplay(`Salary Requirement: $${candidate.salary}/week`);
  
  outputToDisplay("\nSkill Assessment:");
  Object.entries(candidate.skills).forEach(([skill, level]) => {
    const skillRating = "★".repeat(level) + "☆".repeat(5-level);
    outputToDisplay(`${formatSkillName(skill)}: ${skillRating} (${level}/5)`);
  });
  
  const traits = generateTraits(candidate);
  if (traits.length > 0) {
    outputToDisplay("\nSpecial Traits:");
    traits.forEach(trait => outputToDisplay(`- ${trait}`));
  }
  
  // Show role-specific impact
  outputToDisplay("\nRole Impact:");
  staffType.affects.forEach(effect => {
    outputToDisplay(`- Improves team ${formatSkillName(effect)}`);
  });
  
  outputToDisplay("\nCareer History:");
  outputToDisplay(`Total Experience: ${(candidate.experience / 365).toFixed(1)} years`);
  outputToDisplay(`Previous Positions: ${Math.floor(Math.random() * 3 + 1)}`);
  
  // Show salary analysis
  const salaryDiff = ((candidate.salary - staffType.baseSalary) / staffType.baseSalary * 100).toFixed(1);
  outputToDisplay("\nSalary Analysis:");
  outputToDisplay(`Base salary for role: $${staffType.baseSalary}`);
  outputToDisplay(`Candidate requirement: $${candidate.salary} (${salaryDiff}% ${salaryDiff >= 0 ? 'above' : 'below'} base)`);
}

function hireCandidateCommand(index, gameState) {
  const candidate = gameState.candidates[index];
  if (!candidate) {
    outputToDisplay("Invalid candidate selection.");
    return;
  }

  // Check workspace capacity
  const workspace = WORKSPACES[gameState.workspace];
  if (gameState.staff.length >= workspace.capacity) {
    outputToDisplay(`Cannot hire: Workspace at capacity (${workspace.capacity} positions)`);
    outputToDisplay("Consider upgrading your workspace first.");
    return;
  }

  // Check if can afford salary
  if (gameState.moneyAmount < candidate.salary * 4) {
    outputToDisplay("Cannot hire: Insufficient funds to cover initial salary costs.");
    outputToDisplay(`Required: $${candidate.salary * 4} for first month`);
    outputToDisplay(`Available: $${gameState.moneyAmount}`);
    return;
  }

  // Add candidate to staff
  gameState.staff.push(candidate);
  gameState.candidates.splice(index, 1);
  
  // Update game state
  gameState.totalSalaries = gameState.staff.reduce((total, staff) => total + staff.salary, 0);
  
  outputToDisplay(`\n=== Welcome Aboard! ===`);
  outputToDisplay(`${candidate.name} has joined your team as a ${STAFF_TYPES[candidate.type].name}!`);
  outputToDisplay(`Weekly salary: $${candidate.salary}`);
  outputToDisplay(`New total weekly salaries: $${gameState.totalSalaries}`);
  
  // Show team composition
  const teamComposition = {};
  gameState.staff.forEach(staff => {
    teamComposition[staff.type] = (teamComposition[staff.type] || 0) + 1;
  });
  
  outputToDisplay("\nUpdated Team Composition:");
  Object.entries(teamComposition).forEach(([type, count]) => {
    outputToDisplay(`${STAFF_TYPES[type].name}s: ${count}`);
  });
}

function displayTechnologies(gameState) {
  outputToDisplay("\n=== Available Technologies ===");
  
  Object.entries(TECHNOLOGIES).forEach(([category, techs]) => {
    outputToDisplay(`\n${formatCategoryName(category)}:`);
    
    Object.entries(techs).forEach(([key, tech]) => {
      const owned = gameState.technologies[key];
      const affordable = gameState.moneyAmount >= tech.cost;
      const requirements = checkTechRequirements(tech, gameState);
      
      outputToDisplay(`\n${tech.name}${owned ? ' (Owned)' : ''}`);
      outputToDisplay(`Cost: $${tech.cost}`);
      outputToDisplay(`Time: ${tech.timeCost} weeks`);
      outputToDisplay(tech.description);
      
      if (tech.details) {
        outputToDisplay("Effects:");
        tech.details.forEach(detail => outputToDisplay(`- ${detail}`));
      }

      if (tech.requirements.length > 0) {
        outputToDisplay("Requirements:");
        tech.requirements.forEach(req => {
          const hasReq = gameState.technologies[req];
          outputToDisplay(`- ${TECHNOLOGIES[category][req].name}: ${hasReq ? '✓' : '✗'}`);
        });
      }

      if (!owned) {
        if (!affordable) {
          outputToDisplay("Cannot afford! Need more funds.");
        } else if (!requirements.met) {
          outputToDisplay("Missing requirements!");
        } else {
          outputToDisplay(`Use 'research buy ${key}' to purchase`);
        }
      }
    });
  });
  
  outputToDisplay("\nNote: Technologies provide permanent company-wide bonuses");
}

function checkTechRequirements(tech, gameState) {
  const unmetReqs = tech.requirements.filter(req => !gameState.technologies[req]);
  return {
    met: unmetReqs.length === 0,
    missing: unmetReqs
  };
}

function purchaseTechnology(gameState, techId) {
  // Find the technology
  let targetTech = null;
  let techCategory = null;
  
  Object.entries(TECHNOLOGIES).forEach(([category, techs]) => {
    if (techs[techId]) {
      targetTech = techs[techId];
      techCategory = category;
    }
  });

  if (!targetTech) {
    outputToDisplay("Invalid technology ID. Use 'research view' to see available technologies.");
    return;
  }

  // Check if already owned
  if (gameState.technologies[techId]) {
    outputToDisplay("Technology already owned!");
    return;
  }

  // Check cost
  if (gameState.moneyAmount < targetTech.cost) {
    outputToDisplay(`Insufficient funds! Need $${targetTech.cost}`);
    return;
  }

  // Check requirements
  const requirements = checkTechRequirements(targetTech, gameState);
  if (!requirements.met) {
    outputToDisplay("Missing required technologies:");
    requirements.missing.forEach(req => {
      const reqTech = TECHNOLOGIES[techCategory][req];
      outputToDisplay(`- ${reqTech.name}`);
    });
    return;
  }

  // Purchase technology
  gameState.moneyAmount -= targetTech.cost;
  gameState.technologies[techId] = true;

  // Apply effects
  Object.entries(targetTech.effects).forEach(([modifier, value]) => {
    if (!gameState.modifiers[modifier]) {
      gameState.modifiers[modifier] = 1;
    }
    gameState.modifiers[modifier] *= value;
  });

  outputToDisplay(`\n=== Technology Acquired! ===`);
  outputToDisplay(`Purchased: ${targetTech.name}`);
  outputToDisplay(`Cost: $${targetTech.cost}`);
  outputToDisplay("\nEffects Applied:");
  Object.entries(targetTech.effects).forEach(([modifier, value]) => {
    const percentChange = ((value - 1) * 100).toFixed(0);
    outputToDisplay(`- ${formatModifierName(modifier)}: ${percentChange > 0 ? '+' : ''}${percentChange}%`);
  });

  updateStatusDisplay(gameState.companyName, gameState.weekNumber, gameState.moneyAmount);
}

function formatCategoryName(category) {
  return category.charAt(0).toUpperCase() + category.slice(1) + " Technologies";
}

function formatModifierName(modifier) {
  return modifier.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

  // Calculate fix effectiveness with more reliable base rate
  const baseEffectiveness = 0.4; // Ensure some bugs always get fixed
  const teamBonus = Math.max(0.2, calculateTeamEfficiency(gameState)?.efficiency || 0.2);
  const fixEffectiveness = baseEffectiveness * teamBonus * (gameState.modifiers.testing_effectiveness || 1);

  // Calculate bugs fixed this session based on severity with minimum values
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
  project.testingMetrics.bugSeverity.critical = Math.max(0, project.testingMetrics.bugSeverity.critical - fixedBugs.critical);
  project.testingMetrics.bugSeverity.major = Math.max(0, project.testingMetrics.bugSeverity.major - fixedBugs.major);
  project.testingMetrics.bugSeverity.minor = Math.max(0, project.testingMetrics.bugSeverity.minor - fixedBugs.minor);

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

  // Display results
  outputToDisplay("\n=== Bug Fixing Session Results ===");
  outputToDisplay(`Total Bugs Fixed: ${totalFixed}`);
  outputToDisplay(`Progress: ${fixProgress.toFixed(1)}% complete`);
  
  // Show progress bar
  const progressBar = createProgressBar(fixProgress);
  outputToDisplay(`Progress: ${progressBar}`);

  outputToDisplay("\nBreakdown of Fixed Bugs:");
  outputToDisplay(`- Critical: ${fixedBugs.critical}`);
  outputToDisplay(`- Major: ${fixedBugs.major}`);
  outputToDisplay(`- Minor: ${fixedBugs.minor}`);
  
  outputToDisplay("\nRemaining Bugs:");
  outputToDisplay(`- Critical: ${project.testingMetrics.bugSeverity.critical}`);
  outputToDisplay(`- Major: ${project.testingMetrics.bugSeverity.major}`);
  outputToDisplay(`- Minor: ${project.testingMetrics.bugSeverity.minor}`);

  outputToDisplay(`\nTotal Remaining Bugs: ${project.bugs}`);
  outputToDisplay(`Quality Score: ${Math.floor(project.quality)}% (${qualityGain > 0 ? '+' : ''}${qualityGain.toFixed(1)}%)`);

  // Show recommendations based on remaining bugs
  if (project.bugs > 0) {
    outputToDisplay("\nRecommendations:");
    if (project.testingMetrics.bugSeverity.critical > 0) {
      outputToDisplay("! Critical bugs should be addressed before release");
      outputToDisplay("  (but release is still possible)");
    }
    if (project.testingMetrics.bugSeverity.major > 0) {
      outputToDisplay("- Consider fixing major bugs to improve quality");
    }
    if (project.testingMetrics.bugSeverity.minor > 0 && (project.testingMetrics.bugSeverity.critical === 0 && project.testingMetrics.bugSeverity.major === 0)) {
      outputToDisplay("- Minor bugs remain but aren't blocking release");
    }
    outputToDisplay("\nNote: You can release the game with bugs, but it will affect:");
    outputToDisplay("- Game quality and reviews");
    outputToDisplay("- Sales potential");
    outputToDisplay("- Company reputation");
    outputToDisplay("\nUse 'release' command when you want to release");
  } else {
    outputToDisplay("\nAll known bugs have been fixed!");
    outputToDisplay("The game is ready for release. Use 'release' command when ready.");
  }

  // Update testing progress
  updateTestingProgress(project);
}

function calculateAudienceReception(successScore, project, gameState) {
  const reception = {
    casual: 0,
    hardcore: 0,
    critics: 0
  };

  // Ensure we have valid data
  if (!project || typeof successScore !== 'number') {
    console.error('Invalid project data for reception calculation');
    return reception;
  }

  // Set default target audience if not specified
  const targetAudience = project.targetAudience || 'all';
  
  // Base reception from success score
  const baseScore = successScore * 0.8;

  // Get audience preferences with fallback to default audience
  const targetPreferences = (AUDIENCE_SEGMENTS[targetAudience] && AUDIENCE_SEGMENTS[targetAudience].preferences) || 
                          AUDIENCE_SEGMENTS.all.preferences;
  
  const genreMultiplier = targetPreferences[project.genre.toLowerCase()] || 1;

  // Apply audience-specific modifiers based on project attributes
  switch (project.marketingStrategy || 'balanced') {
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
      reception.casual = Math.min(100, baseScore * 1.0 * genreMultiplier);
      reception.hardcore = Math.min(100, baseScore * 1.0 * genreMultiplier);
      reception.critics = Math.min(100, baseScore * 1.0 * genreMultiplier);
  }

  // Apply reputation effects
  Object.keys(reception).forEach(audience => {
    if (gameState.reputation[audience]) {
      const loyalty = gameState.reputation[audience].loyalty || 0.5;
      reception[audience] *= (0.9 + (loyalty * 0.2));
      reception[audience] = Math.min(100, Math.round(reception[audience]));
    }
  });

  return reception;
}

// Export functions
window.processStaff = processStaff;
window.updateStaffMoods = updateStaffMoods;
window.displayStaffRoster = displayStaffRoster;
window.displayStaffDetails = displayStaffDetails;
window.handleStaffCommand = handleStaffCommand;
window.displayCandidates = displayCandidates;
window.handleHireCommand = handleHireCommand;
window.displayTechnologies = displayTechnologies;
window.checkTechRequirements = checkTechRequirements;
window.purchaseTechnology = purchaseTechnology;
