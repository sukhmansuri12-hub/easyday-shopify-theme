/**
 * EasyDay Shopify Theme - Main JavaScript
 * Scroll animations, cart functionality, and interactions
 */

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initStickyHeader();
  initProductGallery();
  initQuantitySelectors();
});

/**
 * Scroll Animation Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animatedElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Add animation class based on data attribute
        const animationType = entry.target.dataset.animation || 'fade-in-up';
        entry.target.classList.add(animationType);
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * Sticky Header Effect
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Product Gallery Interactions
 */
function initProductGallery() {
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.querySelector('.product-main-image img');

  if (!thumbnails.length || !mainImage) return;

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image with fade effect
      mainImage.style.opacity = '0';
      
      setTimeout(() => {
        mainImage.src = this.querySelector('img').src.replace('_80x80', '');
        mainImage.style.opacity = '1';
      }, 200);
    });
  });

  // Set first thumbnail as active
  if (thumbnails[0]) {
    thumbnails[0].classList.add('active');
  }
}

/**
 * Quantity Selector
 */
function initQuantitySelectors() {
  const quantityInputs = document.querySelectorAll('.quantity-input');

  quantityInputs.forEach((input) => {
    const decreaseBtn = input.querySelector('.quantity-decrease');
    const increaseBtn = input.querySelector('.quantity-increase');
    const qtyInput = input.querySelector('input[type="number"]');

    if (!decreaseBtn || !increaseBtn || !qtyInput) return;

    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(qtyInput.value) || 1;
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(qtyInput.value) || 1;
      qtyInput.value = currentValue + 1;
    });
  });
}

/**
 * Add to Cart (Shopify AJAX Cart API)
 */
function addToCart(formData) {
  return fetch(window.routes.cart_add_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'error') {
      throw new Error(data.description);
    }
    return data;
  });
}

/**
 * Update Cart Count
 */
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
        
        // Animate count update
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCount.style.transform = 'scale(1)';
        }, 200);
      }
    });
}

/**
 * Product Form Submission
 */
if (document.querySelector('.product-form')) {
  document.querySelector('.product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const cartData = {
      items: [{
        id: formData.get('id'),
        quantity: parseInt(formData.get('quantity')) || 1
      }]
    };

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;

    addToCart(cartData)
      .then(response => {
        submitBtn.textContent = 'Added! ✓';
        updateCartCount();
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        submitBtn.textContent = 'Error - Try Again';
        submitBtn.disabled = false;
      });
  });
}

/**
 * Announcement Bar Rotation
 */
function initAnnouncementRotation() {
  const announcements = document.querySelectorAll('.announcement-item');
  if (announcements.length <= 1) return;

  let currentIndex = 0;

  setInterval(() => {
    announcements[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % announcements.length;
    announcements[currentIndex].style.display = 'block';
  }, 4000);
}

// Initialize announcement rotation
initAnnouncementRotation();

/**
 * Mobile Menu Toggle (if needed)
 */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '#MainContent') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
