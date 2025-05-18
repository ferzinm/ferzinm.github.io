const TOKEN_BOT = "5965616492:AAH0pBrfAytjO4HtJSqLxHqh8E3yeo64ra4";
const CHAT_ID = "-781957560";

const modalForm = document.getElementById('modal-form');
const modalSuccess = document.getElementById('modal-success');
const modalError = document.getElementById('modal-error');
const contacts = document.getElementById('contact');
const mobileMenu = document.querySelector('.mobile-menu');
const backdrop = document.querySelector('.backdrop');

window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }, 600);
});

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  
  if (!backdrop) {
    const newBackdrop = document.createElement('div');
    newBackdrop.className = 'backdrop';
    document.body.appendChild(newBackdrop);
    
    newBackdrop.addEventListener('click', toggleMobileMenu);
  } else {
    backdrop.classList.toggle('active');
  }
  
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

menuToggle.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMobileMenu();
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: targetPosition - headerHeight - 20,
        behavior: 'smooth'
      });
    }
  });
});

const contactBtn = document.getElementById('contact-btn');
contactBtn.addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  const headerHeight = header.offsetHeight;
  
  window.scrollTo({
    top: contactSection.offsetTop - headerHeight - 20,
    behavior: 'smooth'
  });
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const closeButtons = modal.querySelectorAll('.modal__close, .modal__close-btn');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => closeModal(modalId));
  });
  
  const backdrop = modal.querySelector('.modal__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => closeModal(modalId));
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

const modalButtons = [
  document.getElementById('modal-msg-nav'),
  document.getElementById('modal-msg-hero'),
  document.getElementById('modal-msg-float'),
  document.getElementById('calculator-request'),
  document.getElementById('mobile-msg-nav')
];

modalButtons.forEach(button => {
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modal-form');
    });
  }
});

const formMsg = document.getElementById('form-msg');
formMsg.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const inputName = event.target.name.value;
  const inputPhone = event.target.phone.value;
  const inputAddress = event.target.address.value;
  const textAreaWork = event.target.work.value;

  if (!inputName || !inputPhone) {
    alert('Пожалуйста, заполните обязательные поля: имя и телефон');
    return;
  }

  const msg = `<b>Имя:</b> ${inputName}\n<b>Телефон:</b> ${inputPhone}\n<b>Адрес:</b> ${inputAddress}\n<b>Текст:</b> ${textAreaWork}`;
  const encodeMsg = encodeURI(msg);

  fetch(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage?chat_id=${CHAT_ID}&parse_mode=html&text=${encodeMsg}`)
    .then(response => response.json())
    .then(res => {
      closeModal('modal-form');
      
      if (res.ok) {
        openModal('modal-success');
      } else {
        openModal('modal-error');
      }
    })
    .catch(error => {
      console.error('Ошибка отправки:', error);
      closeModal('modal-form');
      openModal('modal-error');
    });
});

const changeDataBtn = document.getElementById('change-data');
changeDataBtn.addEventListener('click', () => {
  closeModal('modal-success');
  openModal('modal-form');
});

const changeDataErrorBtn = document.getElementById('change-data-error');
changeDataErrorBtn.addEventListener('click', () => {
  closeModal('modal-error');
  openModal('modal-form');
});

const contactErrorBtn = document.getElementById('contact-error');
contactErrorBtn.addEventListener('click', () => {
  closeModal('modal-error');
  
  const contactSection = document.getElementById('contact');
  const headerHeight = header.offsetHeight;
  
  window.scrollTo({
    top: contactSection.offsetTop - headerHeight - 20,
    behavior: 'smooth'
  });
});

const wallArea = document.getElementById('wall-area');
const surfaceType = document.getElementById('surface-type');
const plasterType = document.getElementById('plaster-type');
const layerThickness = document.getElementById('layer-thickness');
const calculatedPrice = document.getElementById('calculated-price');

function calculatePrice() {
  const basePrice = 10;
  const area = parseFloat(wallArea.value) || 50;
  const surfaceCoef = parseFloat(surfaceType.value) || 1;
  const plasterCoef = parseFloat(plasterType.value) || 1;
  const thicknessCoef = parseFloat(layerThickness.value) || 1;
  
  const totalPrice = Math.round(area * basePrice * surfaceCoef * plasterCoef * thicknessCoef);
  calculatedPrice.textContent = totalPrice;
}

[wallArea, surfaceType, plasterType, layerThickness].forEach(element => {
  element.addEventListener('input', calculatePrice);
  element.addEventListener('change', calculatePrice);
});

const testimonialsTrack = document.querySelector('.testimonials__track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialsDots = document.querySelectorAll('.testimonials__dot');
const prevArrow = document.querySelector('.testimonials__arrow--prev');
const nextArrow = document.querySelector('.testimonials__arrow--next');

let currentSlide = 0;
const totalSlides = testimonialCards.length;

function updateSlider() {
  if (testimonialCards.length > 0) {
    testimonialCards.forEach((card, index) => {
      if (index === currentSlide) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    testimonialsDots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

if (prevArrow) {
  prevArrow.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });
}

if (nextArrow) {
  nextArrow.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });
}

testimonialsDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    updateSlider();
  });
});

updateSlider();

const galleryTrack = document.querySelector('.gallery__track');
const galleryItems = document.querySelectorAll('.gallery__item');
const galleryDots = document.querySelectorAll('.gallery__dot');
const galleryPrevArrow = document.querySelector('.gallery__arrow--prev');
const galleryNextArrow = document.querySelector('.gallery__arrow--next');

let currentGallerySlide = 0;
const totalGallerySlides = galleryItems.length;

function updateGallerySlider() {
  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      if (index === currentGallerySlide) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    galleryDots.forEach((dot, index) => {
      if (index === currentGallerySlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

if (galleryPrevArrow) {
  galleryPrevArrow.addEventListener('click', () => {
    currentGallerySlide = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
    updateGallerySlider();
  });
}

if (galleryNextArrow) {
  galleryNextArrow.addEventListener('click', () => {
    currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
    updateGallerySlider();
  });
}

galleryDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentGallerySlide = index;
    updateGallerySlider();
  });
});

let galleryTouchStartX = 0;
let galleryTouchEndX = 0;

function handleGallerySwipe() {
  if (galleryTouchEndX < galleryTouchStartX - 50) {
    currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
    updateGallerySlider();
  } else if (galleryTouchEndX > galleryTouchStartX + 50) {
    currentGallerySlide = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
    updateGallerySlider();
  }
}

if (galleryTrack) {
  galleryTrack.addEventListener('touchstart', (e) => {
    galleryTouchStartX = e.changedTouches[0].screenX;
  });
  
  galleryTrack.addEventListener('touchend', (e) => {
    galleryTouchEndX = e.changedTouches[0].screenX;
    handleGallerySwipe();
  });
}

updateGallerySlider();

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.querySelector('img').src;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    modal.innerHTML = `
      <div class="modal__backdrop"></div>
      <div class="gallery-modal">
        <button class="gallery-modal__close">
          <i class="ri-close-line"></i>
        </button>
        <img src="${imgSrc}" class="gallery-modal__img" alt="Увеличенное изображение">
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeButton = modal.querySelector('.gallery-modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
    
    backdrop.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
  });
});

const phoneInputs = document.querySelectorAll('input[data-type="phone"]');

phoneInputs.forEach(input => {
  input.addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (!value) {
      this.value = '';
      return;
    }
    
    if (value.length <= 12) {
      if (value[0] === '3' && value[1] === '7' && value[2] === '5') {
        formattedValue = '+';
      } else if (value[0] === '8' && value[1] === '0') {
        value = '375' + value.substring(2);
        formattedValue = '+';
      } else if (value[0] !== '3' && value[0] !== '8') {
        value = '375' + value;
        formattedValue = '+';
      } else {
        formattedValue = '+';
      }
      
      if (value.length > 0) {
        formattedValue += value.substring(0, 3);
      }
      if (value.length > 3) {
        formattedValue += ' (' + value.substring(3, 5);
      }
      if (value.length > 5) {
        formattedValue += ') ' + value.substring(5, 8);
      }
      if (value.length > 8) {
        formattedValue += '-' + value.substring(8, 10);
      }
      if (value.length > 10) {
        formattedValue += '-' + value.substring(10, 12);
      }
      
      this.value = formattedValue;
    }
  });
});

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  } else if (touchEndX > touchStartX + 50) {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }
}

if (testimonialsTrack) {
  testimonialsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  testimonialsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

updateSlider();

calculatePrice();
