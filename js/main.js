document.addEventListener('DOMContentLoaded', function() {
  // Initialize global game state
  window.gameState = initGameState();

  // Initialize command handling
  const commandLine = document.getElementById('command-line');
  if (commandLine) {
    commandLine.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const command = this.value.trim();
        if (command) {
          window.handleCommand(command, window.gameState);
          this.value = '';
        }
      }
    });
  }

  // Initialize menu buttons with proper event handling
  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.add('pressed');
      setTimeout(() => this.classList.remove('pressed'), 200);
      
      // Play click sound
      const clickSound = document.getElementById('click-sound');
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio play failed:', err));
      }
      
      const action = this.dataset.action;
      switch(action) {
        case 'new':
          window.startNewGame();
          break;
        case 'load':
          window.displayLoadGameInterface();
          break;
        case 'tutorial':
          window.startTutorial();
          break;
      }
    });
  });

  // Initialize scroll button
  window.setupScrollButton();

  // Ensure global functions are available
  if (!window.handleCommand) {
    console.error('Command handler not initialized!');
  }
  if (!window.outputToDisplay) {
    console.error('Output handler not initialized!');
  }
  if (!window.updateStatusDisplay) {
    console.error('Status display handler not initialized!');
  }

  // Initialize save system
  if (typeof saveGame !== 'function') {
    console.error('Save system not initialized!');
  }

  // Verify all required systems are loaded
  const requiredSystems = [
    'handleCommand',
    'outputToDisplay',
    'updateStatusDisplay',
    'saveGame',
    'loadGame',
    'startTutorial',
    'displayLoadGameInterface',
    'updatePhaseIndicator'
  ];

  requiredSystems.forEach(system => {
    if (typeof window[system] !== 'function') {
      console.error(`Required system not found: ${system}`);
    }
  });

  // Initialize error handling
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    outputToDisplay('\nAn error occurred. Please try again or reload the game.');
    return false;
  };

  console.log('Game initialization complete!');
});

function validateGameInitialization() {
  const requiredElements = [
    'home-screen',
    'game-screen',
    'command-line',
    'company-name',
    'week-number',
    'money-amount'
  ];

  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.error('Missing required elements:', missingElements);
    return false;
  }

  const requiredSystems = [
    { name: 'Command Handler', fn: window.handleCommand },
    { name: 'Output Display', fn: window.outputToDisplay },
    { name: 'Status Display', fn: window.updateStatusDisplay },
    { name: 'Save System', fn: window.saveGame },
    { name: 'Load System', fn: window.loadGame },
    { name: 'Tutorial System', fn: window.startTutorial },
    { name: 'Phase Indicator', fn: window.updatePhaseIndicator }
  ];

  const missingSystemes = requiredSystems.filter(system => typeof system.fn !== 'function');
  
  if (missingSystemes.length > 0) {
    console.error('Missing required systems:', missingSystemes.map(s => s.name));
    return false;
  }

  return true;
}

// Global error handler enhancement
window.addEventListener('error', function(e) {
  console.error('Runtime error:', e.error);
  outputToDisplay('\nAn error occurred. Please try again or reload the game.');
  return false;
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  outputToDisplay('\nAn error occurred. Please try again or reload the game.');
  return false;
});

function initGameState() {
  return {
    companyName: "",
    weekNumber: 1,
    moneyAmount: 10000,
    project: null,
    tempProject: {}, 
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
    marketTrends: null // Will be initialized on first market check
  };
}
