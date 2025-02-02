/*
 *
 * Initialize Slider
 *
 */
var projectImagesSlider = $('#slider__project-images');
var slideImages = $$('.slide-image', projectImagesSlider);
if (getDeviceType() === 'mobile') {
  //
  (function preload(images, index) {
    index = index || 0;
    if (images) {
      if (images.length > index) {
        var img = new Image();
        var imgEl = images[index];
        img.src = imgEl.dataset.mobileSrc;
        img.onload = function() {
          preload(images, index + 1);
        };
      } else {
        console.log('::slide images loaded::');
        startSlider();
      }
    }
  })(slideImages);
} else {
  //
  (function preload(images, index) {
    index = index || 0;
    if (images) {
      if (images.length > index) {
        var img = new Image();
        var imgEl = images[index];
        img.src = imgEl.dataset.desktopSrc;
        img.onload = function() {
          preload(images, index + 1);
        };
      } else {
        console.log('::slide images loaded::');
        startSlider();
      }
    }
  })(slideImages);
}
var jsSlider;

function startSlider() {
  var carouselDots = $('.carousel-dots');
  carouselDots.classList.add('show');
  //
  jsSlider = new JSSlider({
    slider: projectImagesSlider,
    sliderInterval: 2,
    transitionDuration: 0.5
  });
  jsSlider.isSliderNavigationDisabled = false;
  jsSlider.sliderHandle = requestTimeout(jsSlider.goToNextSlide.bind(jsSlider), jsSlider.sliderInterval * 1000);
}

function goToNextProjectImage() {
  if (jsSlider) {
    jsSlider.goToNextSlide();
  }
}

function goToPreviousProjectImage() {
  if (jsSlider) {
    jsSlider.goToPreviousSlide();
  }
}
/* ---------------------------------------------------------- */
/* SWIPE EVENTS
/* ---------------------------------------------------------- */
if (getDeviceType() === 'mobile') {
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  var xDown = null;
  var yDown = null;

  function handleTouchStart(event) {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
  };

  function handleTouchMove(event) {
    if (!xDown || !yDown) {
      return;
    }
    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        console.log('::left swipe::');
        goToNextProject(event.target);
      } else {
        console.log('::right swipe::');
        goToPreviousProject(event.target);
      }
    } else {
      if (yDiff > 0) {
        console.log('::up swipe::');
      } else {
        console.log('::down swipe::');
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
};

function goToNextProject() {
  if ($('.project-next-nav')) {
    var nextHref = $('.project-next-nav').dataset.href;
    window.location.href = nextHref;
  }
}

function goToPreviousProject() {
  if ($('.project-previous-nav')) {
    var previousHref = $('.project-previous-nav').dataset.href;
    window.location.href = previousHref;
  }
}