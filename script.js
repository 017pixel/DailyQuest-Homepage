const navSlide = () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });
}

navSlide();

// Modal/Lightbox Logic
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    // Get all images that should open the lightbox
    var images = document.querySelectorAll('img[src^="Screenshots/"]');

    // Go through all images and add a click event
    images.forEach(function(img) {
        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    });

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // When the user clicks anywhere outside of the modal content, close it
    modal.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// --- Slider Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dotsContainer = document.querySelector('.dots-container');

    if (slider && slides.length > 0) {
        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                setTimeout(setPositionByIndex, 0);
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function setSliderPosition() {
            slider.style.transform = `translateX(${currentTranslate}px)`;
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function dragStart(e) {
            isDragging = true;
            startPos = getPositionX(e);
            animationID = requestAnimationFrame(animation);
            slider.style.transition = 'none';
        }

        function dragging(e) {
            if (isDragging) {
                const currentPosition = getPositionX(e);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function dragEnd() {
            cancelAnimationFrame(animationID);
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < slides.length - 1) {
                currentIndex += 1;
            }

            if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }

            if (window.innerWidth >= 1024) {
                // For desktop, use scrollIntoView for snapping
                slides[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                // For mobile, use existing transform logic
                setTimeout(setPositionByIndex, 0);
            }
            slider.style.transition = 'transform 0.5s ease-in-out'; // Ensure transition is re-enabled
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function setPositionByIndex() {
            const targetSlide = slides[currentIndex];
            const containerWidth = sliderContainer.offsetWidth;

            // Apply active class to all slides temporarily for correct width calculation
            slides.forEach(s => s.classList.add('is-active'));
            const slideWidth = targetSlide.offsetWidth; // Get width after applying active class
            slides.forEach((s, i) => s.classList.toggle('is-active', i === currentIndex)); // Revert

            if (window.innerWidth >= 1024) { // Desktop view
                // Use scrollIntoView for smooth scrolling to center the active slide
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                // Reset transform for desktop as native scrolling handles position
                slider.style.transform = `translateX(0px)`;
                currentTranslate = 0;
                prevTranslate = 0;
            } else { // Mobile view
                const targetOffset = targetSlide.offsetLeft;
                const desiredPosition = (containerWidth / 2) - (slideWidth / 2) - targetOffset;

                currentTranslate = desiredPosition;
                prevTranslate = currentTranslate;
                slider.style.transition = 'transform 0.5s ease-in-out';
                setSliderPosition();
            }
            updateUI();
        }

        function updateUI() {
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('touchstart', dragStart, { passive: true });

        slider.addEventListener('mousemove', dragging);
        slider.addEventListener('touchmove', dragging, { passive: true });

        slider.addEventListener('mouseup', dragEnd);
        slider.addEventListener('mouseleave', () => { if (isDragging) dragEnd(); });
        slider.addEventListener('touchend', dragEnd);

        window.addEventListener('resize', () => setTimeout(setPositionByIndex, 0));
        setTimeout(setPositionByIndex, 100);
    }
});

// --- Animate Features on Scroll ---
document.addEventListener('DOMContentLoaded', () => {
    const featureDisplays = document.querySelectorAll('.feature-display');

    if (featureDisplays.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.6 // Trigger when 60% of the element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    featureDisplays.forEach(el => {
                        if (el !== entry.target) {
                            el.classList.remove('is-in-view');
                        }
                    });
                    entry.target.classList.add('is-in-view');
                }
            });
        };

        const featureObserver = new IntersectionObserver(observerCallback, observerOptions);
        featureDisplays.forEach(feature => featureObserver.observe(feature));
    }
});