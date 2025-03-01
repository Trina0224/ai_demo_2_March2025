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

  function togglePlayPause(videoElement) {
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.image-carousel');
    const container = document.querySelector('.carousel-container');
    
    // 複製圖片列表，達到無限循環效果
    carousel.innerHTML += carousel.innerHTML;
  
    let offset = 0;
    const speed = 1; // 每幀移動的像素數，可調整以控制速度
    let isPaused = false;
    let animationId;
  
    // 取得原始（未複製部分）的寬度
    const originalWidth = carousel.scrollWidth / 2;
  
    // 拖曳相關變數
    let isDragging = false;
    let startX = 0;
    let dragStartOffset = 0;
  
    function animate() {
      if (!isPaused && !isDragging) {
        offset += speed;
        if (offset >= originalWidth) {
          // 為避免跳動，暫時關閉 transition
          carousel.style.transition = 'none';
          offset = 0;
          carousel.style.transform = `translateX(-${offset}px)`;
          // 強制 reflow 讓瀏覽器立即應用樣式變更
          void carousel.offsetWidth;
          // 恢復 transition（如果有需要可保留或移除）
          carousel.style.transition = 'transform 0.2s ease-out';
        } else {
          carousel.style.transform = `translateX(-${offset}px)`;
        }
      }
      animationId = requestAnimationFrame(animate);
    }
  
    // 當滑鼠進入 container 區域時暫停自動滾動
    container.addEventListener('mouseenter', function() {
      isPaused = true;
    });
  
    // 當滑鼠離開 container 區域時恢復自動滾動
    container.addEventListener('mouseleave', function() {
      // 如果沒有拖曳，也恢復自動滾動
      if (!isDragging) {
        isPaused = false;
      }
    });
  
    // 拖曳開始
    container.addEventListener('mousedown', function(e) {
      isDragging = true;
      isPaused = true; // 拖曳時暫停自動滾動
      startX = e.clientX;
      dragStartOffset = offset;
    });
  
    // 拖曳移動
    container.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      let diff = e.clientX - startX;
      offset = dragStartOffset - diff;
      // 調整 offset 保持在 0 ~ originalWidth 之間（無限循環效果）
      if (offset < 0) {
        offset = originalWidth + offset;
      } else if (offset >= originalWidth) {
        offset = offset - originalWidth;
      }
      carousel.style.transform = `translateX(-${offset}px)`;
    });
  
    // 拖曳結束（滑鼠放開或離開 container）
    container.addEventListener('mouseup', function() {
      isDragging = false;
      isPaused = false;
    });
    container.addEventListener('mouseleave', function() {
      isDragging = false;
      isPaused = false;
    });
  
    animate();
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const floatingButton = document.getElementById("floating-button");
    const heroSection = document.querySelector(".hero"); // 正確選取 Hero

    function toggleFloatingButton() {
        if (!heroSection) return;

        const heroBottom = heroSection.getBoundingClientRect().bottom;

        // 當滾動超過 Hero 區域時，顯示按鈕
        if (heroBottom < 0) {
            floatingButton.classList.add("show");
        } else {
            floatingButton.classList.remove("show");
        }
    }

    document.addEventListener("scroll", toggleFloatingButton);

    document.addEventListener("mousemove", function (e) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // 當滑鼠遠離右下角時，讓按鈕變半透明
        if (mouseX < windowWidth - 100 || mouseY < windowHeight - 100) {
            floatingButton.classList.add("hidden");
        } else {
            floatingButton.classList.remove("hidden");
        }
    });

    // 讓按鈕點擊後平滑滾回 Hero
    floatingButton.addEventListener("click", function (e) {
        e.preventDefault(); // 防止預設行為
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
  });