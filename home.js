window.addEventListener('navigateToProductDetail', (event) => {
    const productId = event.detail.productId;
    const productDetailFrame = document.getElementById('productDetailFrame');
    const productDetailsContainer = document.getElementById('productDetails');

    // Set the product details iframe source (you would point this to a product detail page)
    productDetailFrame.src = `product_detail.html?productId=${productId}`;
    productDetailsContainer.style.display = 'block';
});

// Close the product details modal
document.getElementById('closeButton').addEventListener('click', () => {
    document.getElementById('productDetails').style.display = 'none';
});

// Listen for messages to display the product details
window.addEventListener('message', (event) => {
    if (event.data && event.data.tagScrollViewHeight) {
        const tagScrollView = document.getElementById('tagScrollView');
        tagScrollView.style.height = `${event.data.tagScrollViewHeight}px`;
    }
    if (event.data && event.data.shopSlideHeight) {
        const envslideView = document.getElementById('envslideView');
        const googleAddressView = document.getElementById('googleAddressView');
        
        // Adjust height based on screen size
        const isMobile = window.innerWidth <= 768;
        const adjustedHeight = isMobile ? Math.min(event.data.shopSlideHeight, 400) : event.data.shopSlideHeight;
        
        envslideView.style.height = `${adjustedHeight}px`;
        googleAddressView.style.height = `${isMobile ? 300 : adjustedHeight}px`;
    }


    if (event.data && event.data.productImage) {
        // Display the product details modal
        const productDetails = document.getElementById('productDetails');
        const productImage = document.getElementById('productImage');
        productDetails.style.display = 'flex';

        // Set the product image
        productImage.src = event.data.productImage;

        // Adjust the image dimensions
        adjustProductImageSize();
    }
});

window.addEventListener('alertProductDetail', (event) => {
    if (event.detail && event.detail.productImage) {
        // Display the product details modal
        const productDetails = document.getElementById('productDetails');
        const productImage = document.getElementById('productImage');
        productDetails.style.display = 'flex';

        // Set the product image
        productImage.src = event.detail.productImage;

        // Adjust the image dimensions
        adjustProductImageSize();
    }
});





// Adjust the product image size to match the screen height and aspect ratio
function adjustProductImageSize() {
    const productImage = document.getElementById('productImage');
    const screenHeight = window.innerHeight;
    productImage.style.height = `${screenHeight}px`;
    productImage.style.width = `${screenHeight * (9 / 16)}px`;
}


function adjustTheViewHeight() {
    const browserHeight = window.innerHeight;
    const topScrollView = document.querySelector('#topScrollView');

    topScrollView.style.height = `${browserHeight * 0.99}px`;
    topScrollView.style.width = `${window.innerWidth}px`;
}

adjustTheViewHeight()


// Function to navigate to app download
function navigateToAppDownload() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        window.location.href = 'https://apps.apple.com/app/jojo-tea-shoppe/id6636472025';
    } else {
        alert('This client currently supports only iPhone and iPad. Android support is coming soon!');
    }
}

document.getElementById('downloadButton').addEventListener('click', function () {
    navigateToAppDownload();
});

// Order Button functionality
const orderButton = document.getElementById('orderButton');
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const instoreOption = document.getElementById('instoreOption');
const deliveryOption = document.getElementById('deliveryOption');
const deliveryButtons = document.getElementById('deliveryButtons');

// Open order modal
orderButton.addEventListener('click', function() {
    orderModal.style.display = 'flex';
});

// Close order modal
closeOrderModal.addEventListener('click', function() {
    orderModal.style.display = 'none';
});

// Close modal when clicking outside
orderModal.addEventListener('click', function(e) {
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
    }
});

// Handle In-Store option
instoreOption.addEventListener('click', function() {
    orderModal.style.display = 'none';
    navigateToAppDownload();
});

// Handle Delivery option
deliveryOption.addEventListener('click', function() {
    orderModal.style.display = 'none';
    // Show delivery buttons
    deliveryButtons.style.display = 'block';
    // Scroll to footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Christmas Snowflake Animation
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.opacity = Math.random() * 0.8 + 0.2; // Opacity between 0.2 and 1
    snowflake.style.fontSize = (Math.random() * 15 + 15) + 'px';
    snowflake.style.animationDelay = Math.random() * 2 + 's';
    
    const container = document.getElementById('snowflakes-container');
    if (container) {
        container.appendChild(snowflake);
        
        // Remove snowflake after animation completes
        const duration = parseFloat(snowflake.style.animationDuration) * 1000;
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, duration);
    }
}

// Create snowflakes periodically
function startSnowfall() {
    // Create initial snowflakes
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createSnowflake(), i * 200);
    }
    // Continue creating snowflakes
    setInterval(createSnowflake, 500);
}

// Start snowfall when page loads
window.addEventListener('load', function() {
    startSnowfall();
    
    // Set up delivery platform buttons after DOM is loaded
    setupDeliveryButtons();
});

// Delivery platform URLs
const deliveryUrls = {
    doordash: 'https://www.doordash.com/en/store/jojo-tea-shoppe-rancho-cucamonga-27910420/33325176/?event_type=autocomplete&pickup=false',
    uber: 'https://www.ubereats.com/store/jojo-tea-shoppe/GuvZABxtQkyZf02idtI3kg?diningMode=DELIVERY&sc=SEARCH_SUGGESTION',
    grubhub: 'https://www.grubhub.com/restaurant/jojo-tea-shoppe-9779-base-line-rd-rancho-cucamonga/7936968',
    fantuan: 'https://www.fantuanorder.com/store/Restaurant/us-19640?rTraceId=s-1-1-1996744853299470350'
};

// Set up delivery platform buttons
function setupDeliveryButtons() {
    const doordashBtn = document.getElementById('doordashBtn');
    const uberBtn = document.getElementById('uberBtn');
    const grubhubBtn = document.getElementById('grubhubBtn');
    const fantuanBtn = document.getElementById('fantuanBtn');
    
    // Set initial href values
    if (doordashBtn) {
        doordashBtn.href = deliveryUrls.doordash;
    }
    if (uberBtn) {
        uberBtn.href = deliveryUrls.uber;
    }
    if (grubhubBtn) {
        grubhubBtn.href = deliveryUrls.grubhub;
    }
    if (fantuanBtn) {
        fantuanBtn.href = deliveryUrls.fantuan;
    }
}

// Function to update delivery URLs (to be called when addresses are provided)
function updateDeliveryUrls(urls) {
    if (urls.doordash) {
        deliveryUrls.doordash = urls.doordash;
        const btn = document.getElementById('doordashBtn');
        if (btn) btn.href = urls.doordash;
    }
    if (urls.uber) {
        deliveryUrls.uber = urls.uber;
        const btn = document.getElementById('uberBtn');
        if (btn) btn.href = urls.uber;
    }
    if (urls.grubhub) {
        deliveryUrls.grubhub = urls.grubhub;
        const btn = document.getElementById('grubhubBtn');
        if (btn) btn.href = urls.grubhub;
    }
    if (urls.fantuan) {
        deliveryUrls.fantuan = urls.fantuan;
        const btn = document.getElementById('fantuanBtn');
        if (btn) btn.href = urls.fantuan;
    }
}

// Handle window resize for mobile responsiveness
window.addEventListener('resize', function() {
    adjustTheViewHeight();
    
    // Adjust footer iframes on resize
    const isMobile = window.innerWidth <= 768;
    const envslideView = document.getElementById('envslideView');
    const googleAddressView = document.getElementById('googleAddressView');
    
    if (isMobile) {
        if (envslideView) {
            envslideView.style.height = '400px';
        }
        if (googleAddressView) {
            googleAddressView.style.height = '300px';
        }
    }
});