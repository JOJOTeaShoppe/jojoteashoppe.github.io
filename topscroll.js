let items = [];
let currentIndex = 1; // Start at the second item for infinite scrolling effect
let autoSlideInterval;
const slideDuration = 5000; // 5 seconds for each slide
let isAnimating = false;
let dragStartX = 0;
let dragOffset = 0;

let initOffset = 0



document.addEventListener('DOMContentLoaded', () => {
    fetchHomePageData();
});

function fetchHomePageData() {
    const apiURL = 'https://api.jojoteashoppe.com/api/pages/APP_HOME';

    fetch(apiURL, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer marsyoungtest'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200 && data.data && data.data.pageSectionDtoList) {
                const mostPopularSection = data.data.pageSectionDtoList.find(section => section.title === 'Most Popular');
                if (mostPopularSection) {
                    items = [mostPopularSection.content[mostPopularSection.content.length - 1], ...mostPopularSection.content, mostPopularSection.content[0]]; // Create loopItems
                    initializeCarousel();
                    startAutoSlide(); // Start auto slide after initializing the carousel
                    // Call the function to set the initial height
                    adjustCarouselHeight();

                }
            } else {
                console.error('Unexpected API response:', data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function initializeCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear existing items

    items.forEach((item, index) => {
        const imageUrl = item.images && item.images[0] ? item.images[0] : '';
        const tag = item.popularProduct?.tag || 'In Demand'; // Use tag or a default value
        const name = item.name || 'Unnamed Product';

        if (!imageUrl) {
            console.warn(`Missing image URL for item at index ${index}`);
            return;
        }

        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        // Click event to open product details modal in the parent
        carouselItem.onclick = () => {
            window.parent.postMessage({
                productImage: item.images[0]
            }, '*');
        };

        // Add HTML for the image, tag, and name
        carouselItem.innerHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="${name}">
                <div class="tag">${tag}</div>
            </div>
            <div class="name">${name}</div>
        `;
        carousel.appendChild(carouselItem);
    });

    updateBackground(items[currentIndex].images[0]);

    // Create progress dots
    const progressIndicator = document.getElementById('progress-indicator');
    progressIndicator.innerHTML = '';
    for (let i = 0; i < items.length - 2; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === currentIndex - 1) dot.classList.add('active');
        progressIndicator.appendChild(dot);
    }

    // Add drag gesture
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('mouseup', endDrag);
    carousel.addEventListener('mouseleave', endDrag);
    carousel.addEventListener('mousemove', handleDrag);
}


function startAutoSlide() {
    clearInterval(autoSlideInterval); // Clear any existing interval

    autoSlideInterval = setInterval(() => {
        slideTo(currentIndex + 1);
    }, slideDuration);
}

function slideTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    const carousel = document.getElementById('carousel');
    currentIndex = index;

    // Loop the slides
    if (currentIndex <= 0) {
        currentIndex = items.length - 2;
        carousel.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease';
            slideTo(currentIndex - 1);
        }, 50);
        return;
    } else if (currentIndex >= items.length - 1) {
        currentIndex = 1;
        carousel.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease';
            slideTo(currentIndex + 1);
        }, 50);
        return;
    }

    updateCarousel();
    updateBackground(items[currentIndex].images[0]);
}

function updateCarousel() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carousel = document.getElementById('carousel');
    const carouselItem = document.querySelector(".carousel-item");

    if (!carouselItem) return;

    // Calculate the width of a single slide
    const slideWidth = carouselItem.clientWidth;
    const margin = parseInt(getComputedStyle(carouselItem).marginRight) || 0;
    const moveWidth = slideWidth + margin * 2;

    // Calculate the total width of the carousel based on the number of slides
    const carouselWrapperWidth = carouselWrapper.clientWidth;

    // Calculate the offset to center the current slide
    // Center position = wrapper width / 2 - slide width / 2
    const centerOffset = carouselWrapperWidth / 2 - slideWidth / 2;
    const translateX = centerOffset - currentIndex * moveWidth;

    // Update the transform to show the current slide
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${translateX}px)`;

    isAnimating = false;

    // Update progress dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex - 1);
    });
}


function updateBackground(imageUrl) {
    const background = document.getElementById('background');
    background.style.backgroundImage = `url('${imageUrl}')`;
}

// Dragging functions
function startDrag(event) {
    clearInterval(autoSlideInterval); // Clear the auto-slide interval when dragging starts
    dragStartX = event.clientX;
    dragOffset = 0;
}

function handleDrag(event) {
    if (dragStartX === null) return;
    dragOffset = event.clientX - dragStartX;
}

function endDrag(event) {
    if (dragOffset > 50) {
        slideTo(currentIndex - 1);
    } else if (dragOffset < -50) {
        slideTo(currentIndex + 1);
    }
    dragStartX = null;
    dragOffset = 0;
    startAutoSlide(); // Restart the auto-slide after dragging ends
}

let slideWidth = 0; // Width of each slide in pixels


function adjustCarouselHeight() {
    const browserHeight = window.innerHeight;
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselItems = document.querySelectorAll('.carousel-item');

    const browserWidth = window.innerWidth;

    // Set the height of the carousel wrapper
    carouselWrapper.style.height = `${browserHeight * 0.95}px`;
    carouselWrapper.style.width = `${browserWidth - 20}px`;

    carouselItems.forEach((item) => {
        item.style.height = `${browserHeight * 0.8}px`;
        item.style.width = `${browserHeight * 0.8 * 0.95 * 9 / 16}px`;
    });
    
    // Update carousel position after adjusting height
    if (carouselItems.length > 0) {
        updateCarousel();
    }
}


// Optionally, adjust the height on window resize
window.addEventListener('resize', adjustCarouselHeight);

