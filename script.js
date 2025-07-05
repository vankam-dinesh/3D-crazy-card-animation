// Cards array and current index
const cards = Array.from(document.querySelectorAll(".card"));
let currentIndex = 0;

// Set initial positions and classes
function updateCards() {
  cards.forEach((card, index) => {
    // Reset all classes
    card.classList.remove("active", "prev", "next");

    // Set appropriate class based on index
    if (index === currentIndex) {
      card.classList.add("active");
    } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
      card.classList.add("prev");
    } else if (index === (currentIndex + 1) % cards.length) {
      card.classList.add("next");
    }
  });
}

// GSAP animation function
function animateCardChange(direction) {
  // Get current, previous and next cards
  const current = cards[currentIndex];
  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  const nextIndex = (currentIndex + 1) % cards.length;
  const prev = cards[prevIndex];
  const next = cards[nextIndex];

  // First tween - current card slides out
  gsap.to(current, {
    opacity: 0.7,
    x: direction === "next" ? "-50%" : "50%",
    z: -100,
    rotationY: direction === "next" ? 10 : -10,
    duration: 0.6,
    ease: "power2.inOut",
  });

  // Target card slides in
  const targetCard = direction === "next" ? next : prev;
  gsap.fromTo(
    targetCard,
    {
      opacity: 0.7,
      x: direction === "next" ? "50%" : "-50%",
      z: -100,
      rotationY: direction === "next" ? -10 : 10,
    },
    {
      opacity: 1,
      x: "0%",
      z: 0,
      rotationY: 0,
      duration: 0.6,
      ease: "power2.inOut",
    }
  );

  // Update the current index
  currentIndex = direction === "next" ? nextIndex : prevIndex;

  // After animation completes, update classes
  setTimeout(updateCards, 600);
}

// Auto rotation
function startAutoRotation() {
  return setInterval(() => {
    animateCardChange("next");
  }, 3000); // Change slide every 3 seconds
}

// Initialize and start auto rotation
updateCards();
let autoRotation = startAutoRotation();

// Click event for manual navigation (not shown in UI but ready for implementation)
function nextCard() {
  clearInterval(autoRotation);
  animateCardChange("next");
  autoRotation = startAutoRotation();
}

function prevCard() {
  clearInterval(autoRotation);
  animateCardChange("prev");
  autoRotation = startAutoRotation();
}

// Touch events for mobile swiping
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left, go to next
    nextCard();
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right, go to previous
    prevCard();
  }
}