/*
 *
 * Slide Kite Images in On Load
 *
 */
var kites = $('#kites');
var kiteList = $$('.kite', kites);
var kiteImgList = $$('.kite-img', kites);
var kitesReady = false;
var imagesReady = false;
window.addEventListener('load', function() {
  TweenMax.staggerTo(kiteList, 1.4, {
    scale: 0.7,
    rotation: 135,
    ease: Back.easeInOut.config(3),
    force3D: true
  }, 0.1, onKiteRotationComplete);
}, false);

function addScript(src) {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  document.body.appendChild(s);
}

function onKiteRotationComplete() {
  //Adding image loading after animation because otherwise it gets jerky on safari
  addScript('scripts/UXLibrary/JSImageLoader.js');
  (function preload(images, index) {
    index = index || 0;
    if (images) {
      if (images.length > index) {
        var img = new Image();
        var imgEl = images[index];
        img.src = imgEl.dataset.commonSrc;
        img.onload = function() {
          imgEl.style.backgroundImage = "url('" + img.src + "')";
          imgEl.style.backgroundSize = 'cover';
          preload(images, index + 1);
        };
      } else {
        imagesReady = true;
        console.log('::images ready::')
      }
    }
  })(kiteImgList);
  kitesReady = true;
};
var kiteHandle = setInterval(checkKiteStatus, 1000);

function checkKiteStatus() {
  if (imagesReady && kitesReady) {
    animateImages();
    clearInterval(kiteHandle);
  }
}

function animateImages() {
  _.map(kiteImgList, function(kiteImg) {
    kiteImg.classList.add('slideKiteImg');
  });
};
/*
 *
 * Tooltips
 *
 */
;
(function manageMapTooltips(window, document) {
  var tooltipEl = document.getElementById('tooltip');
  if (getDeviceType() === "desktop" && tooltipEl) {
    var mapPins = $$('.map-pin');
    var mumbaiWorld = $('#mumbai-world');
    var tooltipTextEl = $('#tooltip-text');
    tooltipTextEl.innerHTML = 'India';
    tooltipEl.style.left = mumbaiWorld.offsetLeft + 'px';
    tooltipEl.style.top = mumbaiWorld.offsetTop - 70 + 'px';
    window.addEventListener('resize', function() {
      tooltipEl.style.left = mumbaiWorld.offsetLeft + 'px';
      tooltipEl.style.top = mumbaiWorld.offsetTop - 70 + 'px';
    }, false);
    _.map(mapPins, function(mapPin) {
      mapPin.addEventListener('mouseover', function(event) {
        event.target.id != 'mumbai-world' ? (tooltipTextEl.innerHTML = event.target.id) : (tooltipTextEl.innerHTML = 'India');
        tooltipEl.dataset.location = event.target.id;
        tooltipEl.style.left = event.target.offsetLeft + 'px';
        tooltipEl.style.top = event.target.offsetTop - 70 + 'px';
      });
    })
  }
})(window, document);
/*
 *
 * Achievement Stats Animation
 *
 */
;
(function(window, document) {
  //
  var metrics = window.metrics;
  var chunkLength = 6;
  var metricsChunks = _.chunk(metrics, chunkLength);
  var nMetricsChunks = metricsChunks.length;
  //
  var counter = 0;
  var chunkCounter = 0;
  var achievementStats = $('#achievement-stats');
  //
  var statHeadings = $$('.stat-heading', achievementStats);
  var statSubHeadings = $$('.stat-subheading', achievementStats);
  //
  if (metricsChunks.length > 1) {
    requestTimeout(function() {
      requestAnimationFrame(animateAchievementStats);
    }, 5000);
  }

  function animateAchievementStats() {
    chunkCounter++;
    if (chunkCounter === metricsChunks.length) chunkCounter = 0;
    var thisChunk = metricsChunks[chunkCounter];
    var tl = new TimelineMax();
    tl.to(achievementStats, 0.3, {
      opacity: 0,
      onComplete: function() {
        _.map(statHeadings, function(statHeading) {
          statHeading.innerHTML = "";
        });
        _.map(statSubHeadings, function(statSubHeading) {
          statSubHeading.innerHTML = "";
        });
        _.map(thisChunk, function(metric, index) {
          if (metric.title) statHeadings[index].innerHTML = metric.title;
          if (metric.text) statSubHeadings[index].innerHTML = metric.text;
        });
      }
    }).to(achievementStats, 0.3, {
      opacity: 1,
      onComplete: function() {
        requestTimeout(function() {
          requestAnimationFrame(animateAchievementStats);
        }, 5000);
      }
    }, 0.4);
  }
  /*
   *
   * Set Achievements Height
   *
   */
  achievementStats.style.visibility = "hidden";
  //
  function setAchievementsData(chunk) {
    _.map(statHeadings, function(statHeading) {
      statHeading.innerHTML = "";
    });
    _.map(statSubHeadings, function(statSubHeading) {
      statSubHeading.innerHTML = "";
    });
    _.map(chunk, function(metric, index) {
      if (metric.title) statHeadings[index].innerHTML = metric.title;
      if (metric.text) statSubHeadings[index].innerHTML = metric.text;
    });
  }
  //
  function setAchievementsHeight() {
    if (achievementsHeightCounter === metricsChunks.length) {
      setAchievementsData(metricsChunks[0]);
      achievementStats.style.minHeight = achievementsHeight + 'px';
      achievementStats.style.visibility = "visible";
    } else {
      setAchievementsData(metricsChunks[achievementsHeightCounter]);
      setTimeout(function() {
        var achievementsRenderedHeight = achievementStats.getBoundingClientRect().height;
        achievementsHeight = achievementsHeight > achievementsRenderedHeight ? achievementsHeight : achievementsRenderedHeight;
        achievementsHeightCounter++;
        setAchievementsHeight();
      }, 10);
    }
  };
  // Resize
  var achievementsHeight = 0;
  var achievementsHeightCounter = 0;
  var ACHIEVEMENTS_HEIGHT_RESIZE_TIMER = 0;
  //
  onResize();

  function onResize() {
    console.log('::on resize::');
    achievementStats.style.height = 'auto';
    achievementsHeight = 0;
    achievementsHeightCounter = 0;
    setAchievementsHeight();
  }
  // window.addEventListener('resize', function() {
  //   window.clearTimeout(ACHIEVEMENTS_HEIGHT_RESIZE_TIMER);
  //   ACHIEVEMENTS_HEIGHT_RESIZE_TIMER = setTimeout(function() {
  //     onResize();
  //   }, 200);
  // }, false);
})(window, document);