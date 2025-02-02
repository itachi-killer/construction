/* ============================================== */
/* Slider Object
/* ============================================== */
function JSSlider(sliderConfig) {
  var _this = this;
  _this.scrollY = window.pageYOffset;
  _this.isScrolling = false;
  _this.slider = sliderConfig.slider;
  _this.sliderInterval = sliderConfig.sliderInterval;
  _this.transitionDuration = sliderConfig.transitionDuration;
  _this.sliderHandle, _this.x1Down, _this.y1Down = null;
  _this.isSliderNavigationDisabled = true;
  _this.autoplayKilledOnScroll = false;
  _this.autoplayKilledOnClick = false;
  _this.slidesInnerWrapper = _this.slider.querySelector('.slides-inner-wrapper');
  _this.slidesArray = _this.slidesInnerWrapper.querySelectorAll('.slide[data-slide-index]');
  _this.slideContent = _this.slidesInnerWrapper.querySelectorAll('.slide-content');
  _this.slideCategory = $('.slide-category', _this.slider);
  _this.slideHeading = $('.slide-heading', _this.slider);
  _this.slideLocation = $('.slide-location', _this.slider);
  _this.slideLink = $('.slide-link', _this.slider);
  _this.carouselDots = $$('.carousel-dot', _this.slider);

  _this.sliderNextButton = $$('[slider-next]', _this.slider)[0];
  _this.sliderPrevButton = $$('[slider-prev]', _this.slider)[0];
  _this.sliderPlayPauseButton = $$('[slider-play-pause]', _this.slider)[0];

  _this.playFirstVideo();

  if (_this.sliderPlayPauseButton) {
    _this.sliderPlayPauseButton.addEventListener('click', function (event) {
      event.preventDefault();
      _this.autoplayKilledOnClick = !_this.autoplayKilledOnClick;

      _this.sliderPlayPauseButton.classList.toggle('-pause');
      if (_this.autoplayKilledOnClick) {
        _this.killAutoplay();
      } else {
        _this.triggerSliderAutoplay();
      }
      // _this.goToNextSlide()
    }, false);
  }

  if (_this.sliderNextButton) {
    _this.sliderNextButton.addEventListener('click', function (event) {
      event.preventDefault();
      _this.goToNextSlide();
    }, false);
  }

  if (_this.sliderPrevButton) {
    _this.sliderPrevButton.addEventListener('click', function (event) {
      event.preventDefault();
      _this.goToPreviousSlide();
    }, false);
  }


  _this.addScrollListener();
  if (getDeviceType() !== "desktop") {
    _this.slider.addEventListener('touchstart', function (event) {
      _this.handleSliderTouchStart(event);
    }, false);
    _this.slider.addEventListener('touchmove', function (event) {
      _this.handleSliderTouchMove(event)
    }, false);
  }
}
JSSlider.prototype.reInitSlides = function () {
  var _this = this;
  _this.slidesArray = _this.slidesInnerWrapper.querySelectorAll('.slide[data-slide-index]');
  _this.slideContent = _this.slidesInnerWrapper.querySelectorAll('.slide-content');
}
JSSlider.prototype.appendFirstSlide = function () {
  var _this = this;
  _this.slidesInnerWrapper.appendChild(_this.slidesArray[0]);
  _this.reInitSlides();

}
JSSlider.prototype.prependLastSlide = function () {
  var _this = this;
  var lastSlide = _this.slidesArray[_this.slidesArray.length - 1];
  _this.slidesInnerWrapper.prepend(lastSlide);
  _this.reInitSlides();
}
JSSlider.prototype.onVideoEnd = function (event) {
  var _this = this;
  const videoElement = event.target;
  // videoElement.currentTime = 0;

console.log("_this.autoplayKilledOnClick:::", _this.autoplayKilledOnClick);
  if (!_this.autoplayKilledOnClick) {
    _this.goToNextSlide();


    requestAnimationFrame(() => {
      videoElement.pause();
      setTimeout(() => {
        videoElement.currentTime = 0;
      }, 100);
      videoElement.removeEventListener('ended', debounce(_this.onVideoEnd.bind(_this), 300));
    })

  } else {
    videoElement.pause();
    videoElement.currentTime = 0;
    videoElement.play().catch((error) => {
      console.error('Video play failed:', error);
    });
  }
}

JSSlider.prototype.playPauseVideo = function (currentIndex, prevIndex) {
  var _this = this;
  // console.log("prevIndex::", prevIndex);


  const previousSlide = _this.slidesArray[prevIndex];
  const currentSlide = _this.slidesArray[currentIndex];
 
  function handleVideo(slide, action) {
    const videoElement = slide.querySelector('video');

    if (videoElement) {
      if (action === 'play') {
        //videoElement.setAttribute("autoplay", _this.autoplayKilledOnClick);
 
        setTimeout(() => {
          videoElement.play().catch((error) => {
            console.error('Video play failed:', error);
          });
        }, 100);


        // Stop slider autoplay and manage event listeners
        _this.killAutoplay();

        //if (!_this.autoplayKilledOnClick) {
         // videoElement.removeAttribute("autoplay");
          videoElement.addEventListener('ended', debounce(_this.onVideoEnd.bind(_this), 300));
        //}
      } else if (action === 'pause') {
        requestAnimationFrame(() => {
          videoElement.pause();
          videoElement.removeEventListener('ended', debounce(_this.onVideoEnd.bind(_this), 300));
        })
      }
    }
  }

  // Pause previous slide video
  if (previousSlide) { 

    const videoElement = previousSlide.querySelector('video');
    
    if (videoElement) {
      videoElement.currentTime = 0;
    }
    handleVideo(previousSlide, 'pause');
  }

  if (currentSlide) {
    handleVideo(currentSlide, 'play');
  }
};


function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

JSSlider.prototype.playFirstVideo = function () {
  var _this = this;
  const currentSlide = _this.slidesArray[0];
  const videoElement = currentSlide.querySelector('video');
  if (videoElement) {
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("autoplay", _this.autoplayKilledOnClick);
    videoElement.setAttribute("muted", true);
    if (videoElement.paused && videoElement.currentTime === videoElement.duration) {
      videoElement.currentTime = 0; // Only reset if the video has ended
    }
    videoElement.play().catch((error) => {
      console.error('Video play failed:', error);
    });
    videoElement.addEventListener('ended', debounce(_this.onVideoEnd.bind(_this), 300));
  }
  
  

}




JSSlider.prototype.cloneFirstSlide = function () {
  var _this = this;
  var firstSlide = _this.slidesArray[0];
  var firstSlideClone = firstSlide.cloneNode(true);
  firstSlideClone.style.position = "absolute";
  firstSlideClone.style.left = "0";
  firstSlideClone.style.top = "0";
  return firstSlideClone;
}
JSSlider.prototype.transitionToNextSlide = function (index) {
  // console.log('::transition to next slide::',);
  var _this = this;
  var firstSlide = _this.slidesArray[0];
  var nextSlide;
  if (index || index === 0) {

    var nextSlideIndex = index;
    nextSlide = _.find(_this.slidesArray, function (slide) {
      return slide.dataset.slideIndex == nextSlideIndex;
    });
  } else {
    nextSlide = _this.slidesArray[1];
  }
  var tl = new TimelineMax({
    paused: true
  });
  tl.call(_this.tween_slideData.bind(_this), [nextSlide], this, 0).call(_this.tween_animateNextSlide.bind(_this), [firstSlide, nextSlide], this, 0)
  requestAnimFrame(function () {
    tl.play();

  })
}
JSSlider.prototype.transitionToPreviousSlide = function (index) {
  var _this = this;
  var firstSlide = _this.slidesArray[0];
  var previousSlide;
  if (index || index === 0) {
    var previousSlideIndex = index;
    previousSlide = _.find(_this.slidesArray, function (slide) {
      return slide.dataset.slideIndex == previousSlideIndex;
    });
  } else {
    previousSlide = _this.slidesArray[_this.slidesArray.length - 1];
  }
  var tl = new TimelineMax({
    paused: true
  });
  tl.call(_this.tween_slideData.bind(_this), [previousSlide], this, 0).call(_this.tween_animatePreviousSlide.bind(_this), [firstSlide, previousSlide], this, 0)
  requestAnimFrame(function () {
    tl.play();
  })
}
JSSlider.prototype.tween_animateNextSlide = function (firstSlide, secondSlide) {
  // console.log('::animate next slide::');
  var _this = this;
  var secondSlidePosition = _.findIndex(_this.slidesArray, function (slide, index) {
    return slide.dataset.slideIndex == secondSlide.dataset.slideIndex;
  });

  var firstSlideContent = $('.slide-content', firstSlide);
  var secondSlideContent = $('.slide-content', secondSlide);
  var secondSlideClone = secondSlide.cloneNode(true);
  var secondSlideCloneContent = secondSlideClone.querySelector('.slide-content');
  secondSlideClone.style.position = "absolute";
  secondSlideClone.style.left = "0";
  secondSlideClone.style.top = "0";
  secondSlideClone.style.opacity = "0";
  secondSlideCloneContent.style.opacity = "0";
  secondSlideCloneContent.style.transform = "scale(1)";
  _this.slidesInnerWrapper.appendChild(secondSlideClone);
  requestTimeout(function () {
    var tl = new TimelineMax();
    tl.to(secondSlideClone, _this.transitionDuration, {
      autoAlpha: 1
    }, 0).to(secondSlideCloneContent, _this.transitionDuration, {
      opacity: 1,
      scale: 1,
      onComplete: function () {
        secondSlideContent.style.transform = "scale(1)";

        for (var i = 0; i < secondSlidePosition; i++) {
          _this.appendFirstSlide();
        }
        requestTimeout(function () {
          _this.slidesInnerWrapper.removeChild(secondSlideClone);
          _this.reInitSlides();
          _this.enableSliderNavigation();
          if (!_this.autoplayKilledOnClick) _this.triggerSliderAutoplay();
          _this.playPauseVideo(0, _this.slidesArray.length - 1);
        }, 0)
      }
    }, 0)
  }, 0)
}
JSSlider.prototype.tween_animatePreviousSlide = function (firstSlide, previousSlide) {
  var _this = this;
  var previousSlidePosition = _.findIndex(_this.slidesArray, function (slide, index) {
    return slide.dataset.slideIndex == previousSlide.dataset.slideIndex;
  });
  var firstSlideContent = $('.slide-content', firstSlide);
  var previousSlideContent = $('.slide-content', previousSlide);
  var previousSlideClone = previousSlide.cloneNode(true);
  // _this.resetVideoPosition(previousSlide);
  // _this.resetVideoPosition(previousSlideClone);
  var previousSlideCloneContent = $('.slide-content', previousSlideClone);
  previousSlideClone.style.position = "absolute";
  previousSlideClone.style.left = "0";
  previousSlideClone.style.top = "0";
  previousSlideClone.style.opacity = "0";
  previousSlideCloneContent.style.transform = "scale(1)";
  _this.slidesInnerWrapper.appendChild(previousSlideClone);
  requestTimeout(function () {
    var tl = new TimelineMax();
    tl.to(previousSlideClone, _this.transitionDuration, {
      autoAlpha: 1
    }, 0).to(previousSlideCloneContent, _this.transitionDuration, {
      autoAlpha: 1,
      scale: 1,
      onComplete: function () {
        previousSlideContent.style.transform = "scale(1)";
        for (var i = _this.slidesArray.length; i > previousSlidePosition - 1; i--) {
          _this.prependLastSlide();
        }
        requestTimeout(function () {
          _this.slidesInnerWrapper.removeChild(previousSlideClone);
          _this.reInitSlides();
          _this.enableSliderNavigation();
          if (!_this.autoplayKilledOnClick) _this.triggerSliderAutoplay();
          _this.playPauseVideo(0, 1);
        }, 0)
      }
    }, 0)
  }, 0)
}
JSSlider.prototype.tween_slideData = function (slide) {
  var _this = this;
  if (_this.slideCategory && _this.slideHeading.innerHTML && _this.slideLocation.innerHTML) {
    var tl = new TimelineMax();
    tl.to([_this.slideCategory, _this.slideHeading, _this.slideLocation], 0.3, {
      autoAlpha: 0,
      force3D: true,
      onComplete: function () {
        _this.setSlideData(slide);
      }
    }, 0).to([_this.slideCategory, _this.slideHeading, _this.slideLocation], 0.3, {
      autoAlpha: 1,
      force3D: true
    }, 0.31);
  };
  _.map(_this.carouselDots, function (carouselDot, index) {
    if (index == slide.dataset.slideIndex) {
      carouselDot.classList.add('active');
    } else {
      carouselDot.classList.remove('active');
    }
  })
}
JSSlider.prototype.setSlideData = function (slide) {
  var _this = this;
  _this.slideCategory.innerHTML = slide.dataset.slideCategory;
  _this.slideHeading.innerHTML = slide.dataset.slideHeading;
  _this.slideLocation.innerHTML = slide.dataset.slideLocation;
  if (_this.slideLink) _this.slideLink.setAttribute('href', slide.dataset.slideLink);
}
JSSlider.prototype.goToPreviousSlide = function (index) {
  var _this = this;
  if (!_this.isSliderNavigationDisabled) {
    window.sliderDirection = "PREVIOUS";
    _this.killAutoplay();
    _this.disableSliderNavigation();
    _this.transitionToPreviousSlide(index);
  }
}
JSSlider.prototype.goToNextSlide = function (index) {
  // console.log('::go to next slide::');
  var _this = this;
  if (!_this.isSliderNavigationDisabled) {
    window.sliderDirection = "NEXT";
    _this.killAutoplay();
    _this.disableSliderNavigation();
    _this.transitionToNextSlide(index);
  }
}
JSSlider.prototype.disableSliderNavigation = function () {
  var _this = this;
  _this.isSliderNavigationDisabled = true;
}
JSSlider.prototype.enableSliderNavigation = function () {
  var _this = this;
  _this.isSliderNavigationDisabled = false;
}
JSSlider.prototype.killAutoplay = function () {
  var _this = this;
  clearRequestTimeout(_this.sliderHandle);
}
JSSlider.prototype.triggerSliderAutoplay = function () {

  // console.log('::trigger slider autoplay::');
  var _this = this;
  _this.sliderHandle = requestTimeout(_this.goToNextSlide.bind(_this), _this.sliderInterval * 1000);
}
JSSlider.prototype.killAutoplayOnScroll = function () {
  var _this = this;
  if (_this.scrollY >= 0.5 * window.innerHeight) {
    if (!_this.autoplayKilledOnScroll) {
      // console.log('::autoplay killed on scroll::');
      _this.autoplayKilledOnScroll = true;
      _this.killAutoplay();
    }
  } else {
    if (_this.autoplayKilledOnScroll) {
      // console.log('::autoplay restarted on scroll::')
      _this.autoplayKilledOnScroll = false;
      if (!_this.autoplayKilledOnClick) _this.triggerSliderAutoplay();
    }
  }
}
JSSlider.prototype.addScrollListener = function () {
  var _this = this;
  window.addEventListener('scroll', function () {
    _this.scrollY = window.pageYOffset;
    window.clearTimeout(_this.isScrolling);
    _this.isScrolling = setTimeout(function () {
      _this.killAutoplayOnScroll();
    }, 66);
  }, false);
}
JSSlider.prototype.handleSliderTouchStart = function (event) {
  var _this = this;
  _this.x1Down = event.touches[0].clientX;
  _this.y1Down = event.touches[0].clientY;
};
JSSlider.prototype.handleSliderTouchMove = function (event) {
  var _this = this;
  if (!_this.x1Down || !_this.y1Down) {
    return;
  }
  var xUp = event.touches[0].clientX;
  var yUp = event.touches[0].clientY;
  var xDiff = _this.x1Down - xUp;
  var yDiff = _this.y1Down - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      _this.goToNextSlide(); //Swipe Left
    } else {
      _this.goToPreviousSlide(); //Swipe Right
    }
  }
  /* reset values */
  _this.x1Down = null;
  _this.y1Down = null;
};
//
function goToSlideIndex(index) {
  if (jsSlider) {
    var slidesArray = $$('.slide[data-slide-index]');
    if (index > slidesArray[0].dataset.slideIndex) {
      jsSlider.goToNextSlide(index);
    } else if (index < slidesArray[0].dataset.slideIndex) {
      jsSlider.goToPreviousSlide(index);
    }
  }
}
