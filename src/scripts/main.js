// Fixed GSAP Animations for Chaya Adamson Site
// Enhanced with header scroll effect and philosophy section animations

(function() {
  'use strict';

  // Wait for GSAP to load with multiple fallbacks
  function waitForGSAP(callback) {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    function checkGSAP() {
      attempts++;
      
      if (window.gsap && window.ScrollTrigger) {
        console.log('🎨 GSAP loaded successfully!');
        
        // Register plugins safely
        try {
          window.gsap.registerPlugin(window.ScrollTrigger);
          if (window.ScrollToPlugin) {
            window.gsap.registerPlugin(window.ScrollToPlugin);
          }
          callback();
        } catch (error) {
          console.warn('Plugin registration failed, continuing with basic GSAP:', error);
          callback();
        }
        
      } else if (attempts < maxAttempts) {
        setTimeout(checkGSAP, 100);
      } else {
        console.warn('GSAP failed to load after 5 seconds. Using CSS fallbacks.');
        initCSS3Fallbacks();
      }
    }
    
    checkGSAP();
  }

  // CSS3 fallbacks if GSAP fails to load
  function initCSS3Fallbacks() {
    const style = document.createElement('style');
    style.textContent = `
      .hero-title, .hero-subtitle, .section-title, .card, .text-large {
        animation: fadeInUp 1s ease-out forwards;
      }
      .hero-divider, .section-divider {
        animation: scaleIn 0.8s ease-out forwards;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Main animation controller
  const AnimationController = {
    gsap: null,
    ScrollTrigger: null,
    isInitialized: false,
    cardHoverTweens: new Map(), // Track card hover tweens to prevent conflicts

    init() {
      if (this.isInitialized) return;

      this.gsap = window.gsap;
      this.ScrollTrigger = window.ScrollTrigger;

      // Configure GSAP
      this.gsap.config({
        force3D: true,
        nullTargetWarn: false
      });

      // Configure ScrollTrigger if available
      if (this.ScrollTrigger) {
        this.ScrollTrigger.config({
          ignoreMobileResize: true
        });
      }

      // Check for reduced motion
      if (this.prefersReducedMotion()) {
        this.initSimpleAnimations();
      } else {
        this.initFullAnimations();
      }

      this.isInitialized = true;
      console.log('✅ Animations initialized successfully');
    },

    prefersReducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    initSimpleAnimations() {
      // Simple animations for reduced motion
      const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .section-title, .card, .text-large');
      
      this.gsap.set(elements, { opacity: 0, y: 20 });
      this.gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    },

    initFullAnimations() {
      // Set initial states
      this.setInitialStates();
      
      // Initialize animations (NO header or footer)
      this.animateHero();
      this.animateSections();
      this.animateCards();
      this.animateButtons();
      this.animateFloatingElements();
      this.initHeaderScrollEffect();
      this.animatePhilosophySection();
    },

    setInitialStates() {
      // Hide elements initially (NOT header or footer)
      this.gsap.set([
        '.hero-title',
        '.hero-subtitle', 
        '.section-title',
        '.card',
        '.text-large'
      ], {
        opacity: 0,
        y: 60
      });

      this.gsap.set('.hero-divider, .section-divider', {
        scaleX: 0
      });

      // DO NOT animate header or footer - leave them as they are
    },

    animateHero() {
      const heroTitle = document.querySelector('.hero-title');
      const heroSubtitle = document.querySelector('.hero-subtitle');
      const heroDivider = document.querySelector('.hero-divider');
      const heroButtons = document.querySelectorAll('.hero-content .btn');

      if (!heroTitle) return;

      // Hero timeline
      const tl = this.gsap.timeline({ delay: 0.5 });

      tl.to(heroTitle, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "back.out(1.7)"
      })
      .to(heroSubtitle, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=1")
      .to(heroDivider, {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      .to(heroButtons, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1
      }, "-=0.4");

      // Floating elements
      const floatingElements = document.querySelectorAll('.hero-floating-element');
      floatingElements.forEach((element, index) => {
        this.gsap.set(element, { opacity: 0.1 });
        this.gsap.to(element, {
          opacity: 0.15,
          duration: 2,
          delay: 1 + index * 0.3
        });

        // Gentle floating
        this.gsap.to(element, {
          y: -20,
          duration: 4,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    },

    animateSections() {
      if (!this.ScrollTrigger) {
        // Fallback without ScrollTrigger
        this.gsap.to('.section-title, .text-large', {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          delay: 1
        });
        return;
      }

      // Section titles
      this.ScrollTrigger.batch('.section-title', {
        onEnter: (elements) => {
          this.gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.1
          });
        },
        start: "top 85%",
        once: true
      });

      // Text content
      this.ScrollTrigger.batch('.text-large', {
        onEnter: (elements) => {
          this.gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.1
          });
        },
        start: "top 90%",
        once: true
      });

      // Dividers
      this.ScrollTrigger.batch('.section-divider', {
        onEnter: (elements) => {
          this.gsap.to(elements, {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        },
        start: "top 85%",
        once: true
      });

      // Mission section
      const missionContent = document.querySelector('.mission-content');
      if (missionContent) {
        this.ScrollTrigger.create({
          trigger: missionContent,
          start: "top 80%",
          once: true,
          onEnter: () => {
            this.gsap.to(missionContent, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.5,
              ease: "back.out(1.7)"
            });
          }
        });
      }
    },

    animateCards() {
      if (!this.ScrollTrigger) {
        // Fallback without ScrollTrigger
        this.gsap.to('.card', {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          delay: 1.5
        });
      } else {
        this.ScrollTrigger.batch('.card', {
          onEnter: (elements) => {
            this.gsap.to(elements, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              stagger: 0.15
            });
          },
          start: "top 85%",
          once: true
        });
      }

      // OPTIMIZED Card hover effects - prevent conflicts with scroll animations
      document.querySelectorAll('.card').forEach((card, index) => {
        let hoverTween = null;
        
        card.addEventListener('mouseenter', () => {
          // Kill any existing hover tween to prevent conflicts
          if (hoverTween) hoverTween.kill();
          
          // Create new optimized hover tween
          hoverTween = this.gsap.to(card, {
            scale: 1.02,
            y: -3,
            duration: 0.2, // Faster for responsiveness
            ease: "power1.out", // Simpler easing
            overwrite: "auto" // Prevent conflicts
          });
          
          // Store tween reference
          this.cardHoverTweens.set(card, hoverTween);
        });
        
        card.addEventListener('mouseleave', () => {
          // Kill any existing hover tween
          if (hoverTween) hoverTween.kill();
          
          // Create leave tween
          hoverTween = this.gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto"
          });
          
          // Update tween reference
          this.cardHoverTweens.set(card, hoverTween);
        });
      });
    },

    animateButtons() {
      document.querySelectorAll('.btn').forEach(btn => {
        const icon = btn.querySelector('.btn-icon');
        let buttonTween = null;
        let iconTween = null;
        
        btn.addEventListener('mouseenter', () => {
          // Kill existing tweens
          if (buttonTween) buttonTween.kill();
          if (iconTween) iconTween.kill();
          
          // Button hover
          buttonTween = this.gsap.to(btn, {
            scale: 1.05,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto"
          });
          
          // Icon movement
          if (icon) {
            iconTween = this.gsap.to(icon, {
              x: 5,
              duration: 0.2,
              ease: "power1.out",
              overwrite: "auto"
            });
          }
        });
        
        btn.addEventListener('mouseleave', () => {
          // Kill existing tweens
          if (buttonTween) buttonTween.kill();
          if (iconTween) iconTween.kill();
          
          // Reset button
          buttonTween = this.gsap.to(btn, {
            scale: 1,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto"
          });
          
          // Reset icon
          if (icon) {
            iconTween = this.gsap.to(icon, {
              x: 0,
              duration: 0.2,
              ease: "power1.out",
              overwrite: "auto"
            });
          }
        });
      });
    },

    animateFloatingElements() {
      const floatingElements = document.querySelectorAll('.section-floating-element');
      // NOTE: Removed footer floating elements as requested
      
      floatingElements.forEach((element, index) => {
        this.gsap.set(element, { opacity: 0.1 });
        
        // Gentle floating animation
        this.gsap.to(element, {
          y: -15,
          x: 5,
          duration: 4 + index,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    },

    // Header scroll effect
    initHeaderScrollEffect() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      let isScrolled = false;

      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollTop > 50;

        if (shouldBeScrolled !== isScrolled) {
          isScrolled = shouldBeScrolled;
          
          if (isScrolled) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    },

    // Philosophy section animations
    animatePhilosophySection() {
      const philosophySection = document.querySelector('.philosophy-section');
      if (!philosophySection) return;

      const line = philosophySection.querySelector('.philosophy-line');
      const items = philosophySection.querySelectorAll('.philosophy-item');

      if (!line || !items.length) return;

      // Set initial states
      this.gsap.set(line, { 
        opacity: 0, 
        scaleY: 0,
        transformOrigin: "top center"
      });

      this.gsap.set(items, { 
        opacity: 0, 
        y: 60,
        x: (index) => index % 2 === 0 ? -40 : 40
      });

      if (!this.ScrollTrigger) {
        // Fallback without ScrollTrigger
        this.gsap.to(line, {
          opacity: 1,
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5
        });

        this.gsap.to(items, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          delay: 1
        });
        return;
      }

      // Animate line first
      this.ScrollTrigger.create({
        trigger: philosophySection,
        start: "top 80%",
        once: true,
        onEnter: () => {
          this.gsap.to(line, {
            opacity: 1,
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      });

      // Animate items as they come into view
      items.forEach((item, index) => {
        this.ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          once: true,
          onEnter: () => {
            this.gsap.to(item, {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 1.2,
              ease: "back.out(1.7)",
              delay: index * 0.1
            });
          }
        });
      });
    },

    // Simple smooth scrolling without ScrollToPlugin dependency
    initSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    },

    refresh() {
      if (this.ScrollTrigger) {
        this.ScrollTrigger.refresh();
      }
    },

    cleanup() {
      // Clean up card hover tweens
      this.cardHoverTweens.forEach(tween => {
        if (tween) tween.kill();
      });
      this.cardHoverTweens.clear();
      
      if (this.ScrollTrigger) {
        this.ScrollTrigger.killAll();
      }
      if (this.gsap) {
        this.gsap.killTweensOf("*");
      }
    }
  };

  // Initialize animations
  function initialize() {
    waitForGSAP(() => {
      AnimationController.init();
      AnimationController.initSmoothScrolling();
    });
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      AnimationController.refresh();
    }, 250);
  });

  // Clean up
  window.addEventListener('beforeunload', () => {
    AnimationController.cleanup();
  });

  // Astro page transitions
  document.addEventListener('astro:page-load', () => {
    setTimeout(() => {
      AnimationController.refresh();
    }, 100);
  });

  // Expose for debugging
  window.AnimationController = AnimationController;

})();