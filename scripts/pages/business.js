if (getDeviceType() === "mobile") {
  var moreDetails = $('#more-details');
  var companiesSection = $('#companies-section', moreDetails);
  companiesSection.parentElement.append(companiesSection);
}
/*
 *
 * Show/Hide More Details
 *
 */
;
(function manageMoreDetails(window, document) {
  var moreDetails = $('#more-details');
  var moreAnchorTags = $$('.more-anchor-tag');
  TweenMax.set(moreDetails, {
    height: 0
  });
  window.toggleMoreDetails = function() {
    console.log('::toggle more details::');
    _.map(moreAnchorTags, function(moreAnchorTag) {
      moreAnchorTag.classList.toggle('hide');
      if (getDeviceType() !== 'mobile') {
        if (moreAnchorTag.classList.contains('hide')) {
          moreAnchorTag.innerHTML = '<p class="component__blue-link hidden">more<img class="arrow-icon"width="7"src="assets/vectors/icons/icon_rightarrow_blue.svg" /></p>';
        } else {
          moreAnchorTag.innerHTML = '<p class="component__blue-link hidden">less<img class="arrow-icon"width="7"src="assets/vectors/icons/icon_rightarrow_blue.svg" /></p>';
        }
      }
    })
    moreDetails.classList.toggle('hidden');
    if (moreDetails.classList.contains('hidden')) {
      TweenMax.to(moreDetails, 0.4, {
        height: 0,
        ease: Back.easeIn.config(1.4)
      });
    } else {
      TweenMax.set(moreDetails, {
        height: 'auto'
      });
      TweenMax.from(moreDetails, 0.4, {
        height: 0,
        ease: Back.easeOut.config(1.4)
      });
    }
  }
})(window, document);
/*
 *
 * Show More Projects
 *
 */
;
(function handleSeeMoreProjects(window, document) {
  var seeMoreProjects = $('#see-more-projects');
  var projectCardsContainer = $('#component__project-cards-container');
  var allProjectCards = $$('.component__project-card', projectCardsContainer);
  if (allProjectCards.length > 8) {
    //identify the project cards that need to be hidden
    _.map(allProjectCards, function(projectCard, index) {
      if (index > 7) {
        projectCard.dataset.showMore = "true";
      }
    });
  } else {
    if (seeMoreProjects) seeMoreProjects.style.display = "none";
  }
  //
  window.showMoreProjects = function(event) {
    event.preventDefault();
    var clickedEl = event.currentTarget;
    clickedEl.classList.toggle('show-more');
    var pTag = $('p', clickedEl);
    var moreProjects = $$('.component__project-card[data-show-more]');
    if (clickedEl.classList.contains('show-more')) {
      pTag.innerHTML = "SEE LESS PROJECTS";
      _.map(moreProjects, function(project) {
        project.style.display = "block";
      });
      var tl = new TimelineMax();
      if (getDeviceType() !== "mobile") {
        tl.to(moreProjects, 0.6, {
          opacity: 1
        }, 0);
      } else {
        tl.set(moreProjects, {
          opacity: 1
        }, 0);
      }
    } else {
      pTag.innerHTML = "SEE MORE PROJECTS";
      _.map(moreProjects, function(project) {
        project.style.display = "none";
        project.style.opacity = "0";
      });
    }
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
  var chunkLength = 2;
  var metricsChunks = _.chunk(metrics, chunkLength);
  console.log(metrics, metricsChunks);
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