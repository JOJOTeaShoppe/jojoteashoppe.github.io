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


document.getElementById('downloadButton').addEventListener('click', function () {
    // Check if the user is using an iOS device

    // alert(navigator.userAgent);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // const universalLink = 'https://www.jojoteashoppe.com/apple-app-site-association';

    const universalLink = "https://apps.apple.com/app/jojo-tea-shoppe/id6636472025";

    if (isIOS) {
        // If the client is an iOS device, navigate to the App Store link
        window.location.href = 'https://apps.apple.com/app/jojo-tea-shoppe/id6636472025'; // Replace with your App Store link
    } else {
        // If not an iOS device, show an alert message
        alert('This client currently supports only iPhone and iPad. Android support is coming soon!');
    }
});

// Christmas Snowflake Animation
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    
    const container = document.getElementById('snowflakes-container');
    if (container) {
        container.appendChild(snowflake);
        
        // Remove snowflake after animation
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, 5000);
    }
}

// Create snowflakes periodically
function startSnowfall() {
    setInterval(createSnowflake, 300);
}

// Start snowfall when page loads
window.addEventListener('load', startSnowfall);

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