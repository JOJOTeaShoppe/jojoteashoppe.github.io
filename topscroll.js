let items = [];
let currentIndex = 1; // Start at the second item for infinite scrolling effect
let autoSlideInterval;
const slideDuration = 5000; // 5 seconds for each slide
let isAnimating = false;
let dragStartX = 0;
let dragOffset = 0;
let isDragging = false;

// Constants similar to iOS implementation
const spacing = 20; // spacing between items
const zoomRatio = 0.9; // zoom ratio for non-current items
const defaultPadding = 2; // default padding

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
                    // Create loopItems: [last, ...items, first]
                    items = [
                        mostPopularSection.content[mostPopularSection.content.length - 1],
                        ...mostPopularSection.content,
                        mostPopularSection.content[0]
                    ];
                    initializeCarousel();
                    startAutoSlide();
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
        const tag = item.popularProduct?.tag || 'In Demand';
        const name = item.name || 'Unnamed Product';

        if (!imageUrl) {
            console.warn(`Missing image URL for item at index ${index}`);
            return;
        }

        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.setAttribute('data-index', index);
        
        // Click event to open product details modal in the parent
        carouselItem.onclick = () => {
            if (!isDragging) {
                window.parent.postMessage({
                    productImage: item.images[0]
                }, '*');
            }
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

    // Add drag gesture (mouse and touch)
    const carousel = document.getElementById('carousel');
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('touchstart', startDrag, { passive: false });
    
    // Global event listeners for drag handling
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    // Set initial position to center the first element
    setTimeout(() => {
        currentIndex = 1;
        updateCarousel();
    }, 100);
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        if (!isDragging && !isAnimating) {
            slideTo(currentIndex + 1);
        }
    }, slideDuration);
}

function slideTo(index) {
    if (isAnimating || isDragging) return;
    isAnimating = true;

    const carousel = document.getElementById('carousel');
    currentIndex = index;

    // Handle infinite loop
    modifyCurrentIndex(currentIndex);

    updateCarousel();
    updateBackground(items[currentIndex].images[0]);
}

function modifyCurrentIndex(index) {
    const carousel = document.getElementById('carousel');
    
    if (index <= 0) {
        // Jump to the last real item (items.length - 2)
        currentIndex = items.length - 2;
        carousel.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateCarousel();
        }, 50);
    } else if (index >= items.length - 1) {
        // Jump to the first real item (index 1)
        currentIndex = 1;
        carousel.style.transition = 'none';
        updateCarousel();
        setTimeout(() => {
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateCarousel();
        }, 50);
    } else {
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
}

function updateCarousel() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carousel = document.getElementById('carousel');
    const carouselItem = document.querySelector(".carousel-item");

    if (!carouselItem || !carouselWrapper) return;

    // Get wrapper width (similar to iOS: UIScreen.main.bounds.width - 2 * toBorderSpacing)
    const wrapperWidth = carouselWrapper.clientWidth;
    
    // Get actual item width (should be wrapperWidth * zoomRatio in normal state)
    const actualItemWidth = carouselItem.clientWidth;
    
    // Calculate move distance: item width + spacing (similar to iOS)
    const moveDistance = actualItemWidth + spacing;
    
    // Calculate offset to center the current item
    // Center position = wrapper center - item center
    const wrapperCenter = wrapperWidth / 2;
    const itemCenter = actualItemWidth / 2;
    
    // Calculate how far the current item is from the first real item (index 1)
    const indexOffset = currentIndex - 1;
    
    // Calculate final position: center - (indexOffset * moveDistance) + dragOffset
    const finalOffset = wrapperCenter - itemCenter - (indexOffset * moveDistance) + dragOffset;

    // Update the transform
    carousel.style.transform = `translateX(${finalOffset}px)`;

    // Update item sizes based on drag (similar to iOS zoom effect)
    updateItemSizes();

    isAnimating = false;

    // Update progress dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex - 1);
    });
}

function updateItemSizes() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (!carouselWrapper) return;
    
    const wrapperWidth = carouselWrapper.clientWidth;
    
    // Get base width from first item's data attribute or calculate from height
    const firstItem = carouselItems[0];
    let baseItemWidth;
    if (firstItem && firstItem.getAttribute('data-base-width')) {
        baseItemWidth = parseFloat(firstItem.getAttribute('data-base-width'));
    } else {
        // Fallback: calculate from height (aspect ratio 16:9)
        const itemHeight = firstItem ? firstItem.clientHeight : wrapperWidth * 16 / 9;
        baseItemWidth = itemHeight * 0.95 * 9 / 16;
    }
    
    carouselItems.forEach((item, index) => {
        const isCurrent = index === currentIndex;
        
        if (isDragging && dragOffset !== 0) {
            // Calculate drag difference (similar to iOS: dragOffset / width * proxy.size.width * (1 - zoomRatio))
            const dragDiff = (dragOffset / wrapperWidth) * wrapperWidth * (1 - zoomRatio);
            
            if (isCurrent) {
                // Current item: max(baseWidth, wrapperWidth - abs(dragDiff))
                // In iOS: max(proxy.size.width*zoomRatio, proxy.size.width - abs(dragDiff))
                const currentWidth = Math.max(
                    baseItemWidth,
                    wrapperWidth - Math.abs(dragDiff)
                );
                item.style.width = `${currentWidth}px`;
            } else {
                // Other items: min(baseWidth + abs(dragDiff), wrapperWidth)
                // In iOS: min(proxy.size.width * zoomRatio + abs(dragDiff), proxy.size.width)
                const otherWidth = Math.min(
                    baseItemWidth + Math.abs(dragDiff),
                    wrapperWidth
                );
                item.style.width = `${otherWidth}px`;
            }
        } else {
            // Normal state - all items use base width
            item.style.width = `${baseItemWidth}px`;
        }
    });
}

function updateBackground(imageUrl) {
    const background = document.getElementById('background');
    if (background) {
        background.style.backgroundImage = `url('${imageUrl}')`;
    }
}

// Dragging functions (similar to iOS DragGesture)
let dragStartY = 0;

function startDrag(event) {
    // Check if it's a touch or mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
    // Store initial position
    dragStartX = clientX;
    dragStartY = clientY;
    
    isDragging = false; // Will be set to true if horizontal movement detected
    dragOffset = 0;
    clearInterval(autoSlideInterval); // Stop auto slide when dragging starts
    
    event.preventDefault();
}

function handleDrag(event) {
    if (dragStartX === null) return;
    
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;
    
    // Only start drag if horizontal movement is greater than vertical (similar to iOS)
    if (!isDragging && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isDragging = true;
    }
    
    if (isDragging) {
        dragOffset = deltaX;
        updateCarousel(); // Update position in real-time during drag
        event.preventDefault();
    }
}

function endDrag(event) {
    if (dragStartX === null) return;
    
    const clientX = event.changedTouches ? event.changedTouches[0].clientX : (event.clientX || dragStartX);
    const finalDragOffset = clientX - dragStartX;
    
    // Only process if it was a drag (not just a click)
    if (isDragging) {
        // Determine if we should change index (similar to iOS: > 50 or < -50)
        let newIndex = currentIndex;
        if (finalDragOffset > 50) {
            // Swipe right, go to previous
            newIndex = currentIndex - 1;
        } else if (finalDragOffset < -50) {
            // Swipe left, go to next
            newIndex = currentIndex + 1;
        }
        
        // Update to new index
        if (newIndex !== currentIndex) {
            slideTo(newIndex);
        } else {
            // Just snap back to current position
            dragOffset = 0;
            updateCarousel();
        }
    }
    
    // Reset drag state
    dragOffset = 0;
    dragStartX = null;
    dragStartY = 0;
    isDragging = false;
    
    // Restart auto slide
    startAutoSlide();
}

function adjustCarouselHeight() {
    const browserHeight = window.innerHeight;
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const screenWidth = window.innerWidth;

    if (!carouselWrapper) return;

    // Set the height and width of the carousel wrapper
    carouselWrapper.style.height = `${browserHeight * 0.95}px`;
    carouselWrapper.style.width = `${screenWidth}px`;

    // Calculate item dimensions based on height (aspect ratio 16:9)
    const itemHeight = browserHeight * 0.8;
    const baseItemWidth = itemHeight * 0.95 * 9 / 16;

    // Set height for all items, but width will be controlled by updateItemSizes
    carouselItems.forEach((item) => {
        item.style.height = `${itemHeight}px`;
        // Store base width as data attribute for reference
        item.setAttribute('data-base-width', baseItemWidth);
    });
    
    // Update carousel position and item sizes after adjusting height
    if (carouselItems.length > 0) {
        setTimeout(() => {
            currentIndex = 1;
            updateItemSizes();
            updateCarousel();
        }, 100);
    }
}

// Adjust on window resize
window.addEventListener('resize', () => {
    adjustCarouselHeight();
});
