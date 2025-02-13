// Constants
const NO_BUTTON_MESSAGES = [
  "Nope!",
  "Try again!",
  "Wait, seriously?",
  "Are you sure?",
  "Think about Melo!",
  "And Bruno!",
  "Fine...",
];

const IMAGES = [
  "assets/images/stink.png",
  "assets/images/stink4.JPG",
  "assets/images/stink2.png",
  "assets/images/stink3.JPG",
  // Add more image paths as needed
];

// State
let currentMessageIndex = 0;
let currentImageIndex = 0;
let hasClickedNo = false;
let hasShownMessage = false;
let teleportCount = 0;

// Add mouse position tracking
let mouseX = 0;
let mouseY = 0;

// DOM Elements
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");
const imageContainer = document.querySelector(".image-container");
const container = document.querySelector(".container");

// Initialize
function init() {
  loadImage(currentImageIndex);
  setupEventListeners();
}

function loadImage(index) {
  const img = document.createElement("img");
  img.src = IMAGES[index];
  img.alt = "Valentine's Image";
  imageContainer.innerHTML = "";
  imageContainer.appendChild(img);
}

function setupEventListeners() {
  if ("ontouchstart" in window) {
    // Mobile behavior
    noBtn.addEventListener("touchstart", handleMobileEvade, { passive: false });
  } else {
    // Desktop behavior
    document.addEventListener("mousemove", updateMousePosition);
    noBtn.addEventListener("mousemove", handleButtonEvade);
  }
  noBtn.addEventListener("click", handleNoClick);
  yesBtn.addEventListener("click", handleYesClick);
}

function handleButtonEvade(e) {
  // Only evade if we ARE on the last message
  if (currentMessageIndex !== NO_BUTTON_MESSAGES.length - 1) {
    return;
  }

  e.preventDefault(); // Prevent any click
  teleportButton();
}

function handleMobileEvade(e) {
  // Only evade if we ARE on the last message
  if (currentMessageIndex !== NO_BUTTON_MESSAGES.length - 1) {
    return;
  }

  // Prevent both the touch and click events
  e.preventDefault();
  e.stopPropagation();

  // Teleport before the click can register
  requestAnimationFrame(() => {
    teleportButton();
  });

  return false;
}

function updateMousePosition(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function handleNoClick() {
  hasClickedNo = true;

  // Only proceed if not at the last message
  if (currentMessageIndex < NO_BUTTON_MESSAGES.length - 1) {
    currentMessageIndex++;
    noBtn.textContent = NO_BUTTON_MESSAGES[currentMessageIndex];

    // Update image
    currentImageIndex = (currentImageIndex + 1) % IMAGES.length;
    loadImage(currentImageIndex);

    // Remove any position styling that might have been added
    if (currentMessageIndex < NO_BUTTON_MESSAGES.length - 1) {
      noBtn.style.position = "";
      noBtn.style.left = "";
      noBtn.style.top = "";
      noBtn.style.transition = "";
    } else {
      // If we're now on the last message, check if mouse is already over button
      checkButtonPosition();
    }
  }
}

function checkButtonPosition() {
  const noBtnRect = noBtn.getBoundingClientRect();

  // Check if mouse is over button
  if (
    mouseX >= noBtnRect.left &&
    mouseX <= noBtnRect.right &&
    mouseY >= noBtnRect.top &&
    mouseY <= noBtnRect.bottom
  ) {
    teleportButton();
  }
}

function handleYesClick() {
  window.location.href = `success.html?hasClickedNo=${hasClickedNo}`;
}

function teleportButton() {
  const containerRect = container.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();

  // Only set position to fixed when we start teleporting
  noBtn.style.position = "fixed";

  // Increment teleport count and show/update messages based on attempts
  teleportCount++;

  // Message handling
  let message;
  if (teleportCount === 5) {
    message = "You have to be quicker than that stink...";
  } else if (teleportCount === 15) {
    message = "Is that the best you can do??";
  } else if (teleportCount === 25) {
    message = "🥱 I'm getting bored now...";
  } else if (teleportCount === 35) {
    message = "Just do us both a favour and click yes...";
  } else if (teleportCount === 45) {
    message = "Bro you're violating now...";
  } else if (teleportCount === 55) {
    message = "okay damn... message received...";
  } else if (teleportCount === 65) {
    message = "bruh we get it...";
  } else if (teleportCount === 75) {
    message = "ok bye stink.";
  } else if (teleportCount === 85) {
    message = "...this is just sad...";
  }

  if (message) {
    if (!hasShownMessage) {
      // Create new message element if it's the first message
      hasShownMessage = true;
      const messageElement = document.createElement("p");
      messageElement.id = "teasingMessage";
      messageElement.style.color = "#ff4d8d";
      messageElement.style.marginTop = "2rem";
      messageElement.style.fontSize = "1.2rem";
      messageElement.style.fontStyle = "italic";
      const buttonContainer = document.querySelector(".button-container");
      buttonContainer.parentNode.insertBefore(
        messageElement,
        buttonContainer.nextSibling
      );
    }
    // Update message text
    document.getElementById("teasingMessage").textContent = message;
  }

  // Rest of teleport function remains the same...
  const maxDistance = Math.min(containerRect.width, containerRect.height) / 2;
  const minDistance = 100;
  const randomDistance =
    Math.random() * (maxDistance - minDistance) + minDistance;
  const randomAngle = Math.random() * Math.PI * 2;

  let newX = buttonRect.left + Math.cos(randomAngle) * randomDistance;
  let newY = buttonRect.top + Math.sin(randomAngle) * randomDistance;

  // Keep within bounds
  newX = Math.max(
    containerRect.left + 10,
    Math.min(newX, containerRect.right - buttonRect.width - 10)
  );
  newY = Math.max(
    containerRect.top + 10,
    Math.min(newY, containerRect.bottom - buttonRect.height - 10)
  );

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
  noBtn.style.transition = "none";

  setTimeout(() => {
    noBtn.style.transition = "all 0.2s ease";
  }, 50);
}

// Start the app
init();
