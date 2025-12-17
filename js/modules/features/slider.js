export function initializeSlider() {
    console.log('Инициализация слайдера...');
    
    if (typeof Swiper === 'undefined') {
        console.error('Swiper не загружен');
        return;
    }
    
    const swiper = new Swiper('.plant-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        speed: 500,
        
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        pagination: {
            el: '.slider-pagination',
            clickable: true,
        },
        
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 15 },
            576: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            992: { slidesPerView: 2.5, spaceBetween: 30 },
            1200: { slidesPerView: 3, spaceBetween: 30 },
            1400: { slidesPerView: 3, spaceBetween: 35 }
        }
    });
    
    // Кастомные кнопки
    setupCustomNavigation(swiper);
    
    // Остановка автопрокрутки
    setupAutoplayControl(swiper);
    
    // Предзагрузка изображений
    preloadImages();
}

function setupCustomNavigation(swiper) {
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => swiper.slidePrev());
    if (nextBtn) nextBtn.addEventListener('click', () => swiper.slideNext());
}

function setupAutoplayControl(swiper) {
    const cards = document.querySelectorAll('.plant-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => swiper.autoplay.stop());
        card.addEventListener('mouseleave', () => swiper.autoplay.start());
    });
}

function preloadImages() {
    const images = document.querySelectorAll('.plant-img');
    images.forEach(img => {
        const image = new Image();
        image.src = img.src;
    });
}