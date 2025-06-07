// notifications.js - Notification system

function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  document.body.appendChild(notification);
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

function setupScrollButton() {
  if (!document.querySelector('.scroll-button')) {
    const button = document.createElement('button');
    button.classList.add('scroll-button');
    button.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
   `;
    button.addEventListener('click', scrollToBottom);
    document.body.appendChild(button);
  }

  const outputDiv = document.querySelector('.game-output');
  outputDiv.addEventListener('scroll', handleScroll);
  
  // Watch for screen changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'game-screen' || mutation.target.id === 'home-screen') {
        updateScrollButtonVisibility();
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
}

function handleScroll() {
  const outputDiv = document.querySelector('.game-output');
  const scrollButton = document.querySelector('.scroll-button');
  const gameScreen = document.getElementById('game-screen');

  // Only show scroll button if we're in the game screen
  if (!gameScreen || gameScreen.classList.contains('hidden')) {
    scrollButton.classList.remove('visible');
    return;
  }

  if (outputDiv.scrollTop !== outputDiv.scrollHeight - outputDiv.offsetHeight) {
    scrollButton.classList.add('visible');
  } else {
    scrollButton.classList.remove('visible');
  }
}

function updateScrollButtonVisibility() {
  const scrollButton = document.querySelector('.scroll-button');
  const gameScreen = document.getElementById('game-screen');
  
  if (!gameScreen || gameScreen.classList.contains('hidden')) {
    scrollButton.classList.remove('visible');
  } else {
    handleScroll(); // Re-check scroll position
  }
}

function scrollToBottom() {
  const outputDiv = document.querySelector('.game-output');
  outputDiv.scrollTop = outputDiv.scrollHeight - outputDiv.offsetHeight;
}

window.showNotification = showNotification;
window.setupScrollButton = setupScrollButton;
window.handleScroll = handleScroll;
window.scrollToBottom = scrollToBottom;
