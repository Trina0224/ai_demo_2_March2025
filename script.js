/*******************************************************
 * 1) Smooth Scroll to Section
 *******************************************************/
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /*******************************************************
   * 2) Fade-in / Animate Sections on Scroll
   *    - Detect when each .section-content is in viewport 
   *      and add 'active' class for fade-in.
   *******************************************************/
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
  
  /*******************************************************
   * 3) Toggle Image (Click): 
   *    - Toggles .pressed on a .image-item (Section 2).
   *******************************************************/
  function toggleImage(element) {
    element.classList.toggle('pressed');
  }
  
  /*******************************************************
   * 4) Shrink/Rotate Images in Section 2 ONLY 
   *    When Scrolling Down, revert when Scrolling Up,
   *    but ONLY if user is in Section 2's viewport.
   *******************************************************/
  const section2 = document.getElementById('section2');
  const imageItems = document.querySelectorAll('.image-item');  // 3 images in section 2
  let lastScrollPosition = 0;
  
  function handleScrollForSection2() {
    if (!section2) return; // Safety check if #section2 not found
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
    // Get Section 2's bounding rect in absolute page coords
    const rect = section2.getBoundingClientRect();
    const section2Top = rect.top + window.scrollY;
    const section2Bottom = section2Top + rect.height;
  
    // Get the viewport's current range
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
  
    // Check if the viewport overlaps with Section 2
    const isInSection2 = (
      viewportBottom >= section2Top &&  // bottom of viewport is below top of S2
      viewportTop <= section2Bottom     // top of viewport is above bottom of S2
    );
  
    if (!isInSection2) {
      // If user is NOT in Section 2 => remove .pressed
      imageItems.forEach(item => item.classList.remove('pressed'));
      lastScrollPosition = currentScroll;
      return;
    }
  
    // If we ARE in Section 2 => check scroll direction
    if (currentScroll > lastScrollPosition) {
      // Scrolling down => add .pressed
      imageItems.forEach(item => item.classList.add('pressed'));
    } else {
      // Scrolling up => remove .pressed
      imageItems.forEach(item => item.classList.remove('pressed'));
    }
  
    lastScrollPosition = currentScroll;
  }
  
  /*******************************************************
   * 5) Full-Size Overlay on Thumbnail Click
   *******************************************************/
  let overlayOpen = false;        // Flag to track if overlay is open
  const imageOverlay = document.getElementById('image-overlay');
  const overlayImage = document.getElementById('overlay-image');
  
  /**
   * Open the overlay with the clicked image
   */
  function openFullImage(imgElement) {
    if (!imageOverlay || !overlayImage) return;
    overlayImage.src = imgElement.src; // Or a higher-res version if you have one
    imageOverlay.classList.add('active');
    overlayOpen = true;
  }
  
  /**
   * Close the overlay
   */
  function closeImageOverlay() {
    if (!imageOverlay) return;
    imageOverlay.classList.remove('active');
    overlayOpen = false;
  }
  
  /*******************************************************
   * 6) Master Scroll Handler 
   *    - Combine fade-in + section2 image toggle + overlay close
   *******************************************************/
  function handleGlobalScroll() {
    handleScrollAnimation();    // fade in/out for .section-content
    handleScrollForSection2();  // shrink/rotate images in Section 2 only
  
    // If overlay is open, close it on scroll
    if (overlayOpen) {
      closeImageOverlay();
    }
  }
  
  /*******************************************************
   * 7) Load & Scroll Events
   *******************************************************/
  
  // 7.1 On DOM ready (DOMContentLoaded), do an initial check 
  //     so that the first section(s) is shown from the start.
  document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();  // fade in the first visible sections
  });
  
  /**
   * 7.2 On window load, we can also check once more 
   *     (some images or fonts might load late).
   */
  window.addEventListener('load', () => {
    handleScrollAnimation();
  });
  
  /**
   * 7.3 On scroll, run the combined logic
   */
  window.addEventListener('scroll', handleGlobalScroll);