function truncateMessage(message, maxLength = 500) { 
  if (!message) return '';
  
  // Handle different types of input
  const str = String(message);
  if (str.length <= maxLength) return str;
  
  // Find a good breaking point
  const breakPoint = str.lastIndexOf(' ', maxLength - 3);
  return breakPoint > maxLength / 2 ? 
    str.substring(0, breakPoint) + '...' :
    str.substring(0, maxLength - 3) + '...';
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

  // Manage message history
  const messages = messageContainer.children;
  if (messages.length > 100) { 
    messages[0].remove();
  }

  // Scroll handling
  const shouldScroll = outputDiv.scrollTop + outputDiv.clientHeight >= 
    outputDiv.scrollHeight - 50;
    
  if (shouldScroll) {
    setTimeout(() => {
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }, 10);
  }
}

function createMessageContainer(outputDiv) {
  const container = document.createElement('div');
  container.classList.add('message-container');
  outputDiv.appendChild(container);
  return container;
}
