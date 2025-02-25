/**
 * Smooth scroll to target section when called
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Fade-in or animate sections on scroll
   * - We detect when the element is in the viewport
   *   and add an 'active' class.
   */
  const sections = document.querySelectorAll('.section-content');
  
  function handleScrollAnimation() {
    const triggerBottom = (window.innerHeight / 5) * 4; 
    sections.forEach((sec) => {
      const sectionTop = sec.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  }
  
  // Event Listeners
  window.addEventListener('scroll', handleScrollAnimation);
  window.addEventListener('load', handleScrollAnimation);

function toggleImage(element) {
    element.classList.toggle('pressed');
  }

// Select all the image-item elements
const imageItems = document.querySelectorAll('.image-item');

// Keep track of the last scroll position to detect scroll direction
let lastScrollPosition = 0;

// Listen for scroll events
window.addEventListener('scroll', handleScroll);

function handleScroll() {
  // currentScroll gets the current vertical position
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // If currentScroll is greater than the last position, user is scrolling down
  if (currentScroll > lastScrollPosition) {
    // Add the "pressed" class to all image-items
    imageItems.forEach((item) => {
      item.classList.add('pressed');
    });
  } else {
    // If currentScroll is less, user is scrolling up => remove "pressed"
    imageItems.forEach((item) => {
      item.classList.remove('pressed');
    });
  }

  // Update lastScrollPosition
  lastScrollPosition = currentScroll;
}