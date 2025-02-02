console.log('::company scripts::');
/*
 *
 * Show More Projects
 *
 */
;
(function handleSeeMoreProjects(window, document) {
  if (getDeviceType() !== "mobile") {
    var seeMoreProjects = $('#see-more-projects');
    var projectCardsContainer = $('#component__project-cards-container');
    var allProjectCards = $$('.component__project-card', projectCardsContainer);
    if (allProjectCards.length > 4) {
      //identify the project cards that need to be hidden
      _.map(allProjectCards, function(projectCard, index) {
        if (index > 3) {
          projectCard.dataset.showMore = "true";
        }
      });
    } else {
      if (seeMoreProjects) seeMoreProjects.style.display = "none";
    }
  }
  //
  window.showMoreProjects = function(event) {
    if (getDeviceType() !== "mobile") {
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
        tl.to(moreProjects, 0.6, {
          opacity: 1,
          onComplete: function() {
            setOffsetValues();
          }
        }, 0);
      } else {
        pTag.innerHTML = "SEE MORE PROJECTS";
        _.map(moreProjects, function(project) {
          project.style.display = "none";
          project.style.opacity = "0";
        });
        setOffsetValues();
      }
    }
  }
})(window, document);
/*
 *
 * Header Scroll Interactions
 *
 */
//
var lastScrollY = window.pageYOffset;
var ticking = false;
//
var header = $('#component__header');
var companyHeader = $('#company-header');
//clone company header for sticky interaction
var companyStickyHeaderClone;
if (getDeviceType() === 'mobile') {
  companyStickyHeaderClone = companyHeader.cloneNode(true);
  document.body.appendChild(companyStickyHeaderClone);
  companyStickyHeaderClone.classList.add('sticky');
  companyStickyHeaderClone.style.display = 'none';
}
var companyHeaderTitle = $('.company-header-title', companyHeader);
var companyStickyHeaderTitle = $('.company-header-title', companyStickyHeaderClone);
var companyHeaderItems = $$('.company-header-item', companyHeader);
var activeCompanyHeaderItem;
var header = $('#component__header');
var companyBanner = $('#company-banner');
var companyHeaderHeight;
var headerHeight;
var companyBannerOffsetBottom;
//Page Sections
var projectsSection = $('#projects-section');
if (!projectsSection) {
  projectsSection = $('#achievements-section');
}
var projectsNavItem = $('.projects', companyHeader);
var projectsSectionOffsetTop;
//
var aboutSection = $('#about-section');
var aboutNavItem = $('.about', companyHeader);
var aboutSectionOffsetTop;
//
var servicesSection = $('#services-section');
var servicesNavItem = $('.services', companyHeader);
var servicesSectionOffsetTop;
//
var contactSection = $('#contact-section');
var contactNavItem = $('.contact', companyHeader);
var contactSectionOffsetTop;
//
var resizeTimer = false;
window.addEventListener('resize', function() {
  window.clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    setOffsetValues();
  });
})
setOffsetValues();

function setOffsetValues() {
  //
  companyHeaderHeight = companyHeader.getBoundingClientRect().height;
  headerHeight = header.getBoundingClientRect().height;
  //
  companyBannerOffsetBottom = companyBanner.getBoundingClientRect().bottom + window.pageYOffset - headerHeight;
  if (projectsSection) projectsSectionOffsetTop = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - companyHeaderHeight;
  aboutSectionOffsetTop = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - companyHeaderHeight;
  if (servicesSection) servicesSectionOffsetTop = servicesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - companyHeaderHeight;
  contactSectionOffsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - companyHeaderHeight;
  //
  requestAnimationFrame(update);
}
//
function update() {
  if (window.innerWidth < 768) {
    if (companyStickyHeaderClone) {
      if (lastScrollY > companyBannerOffsetBottom) {
        companyStickyHeaderClone.style.display = 'block';
      } else {
        companyStickyHeaderClone.style.display = 'none';
      }
    }
  }
  if (window.innerWidth < 768) {
    if (aboutSectionOffsetTop > projectsSectionOffsetTop) {
      if (lastScrollY > contactSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'contact';
        companyStickyHeaderTitle.innerHTML = 'contact';
      } else if (lastScrollY > servicesSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'services';
        companyStickyHeaderTitle.innerHTML = 'services';
      } else if (lastScrollY > aboutSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'about';
        companyStickyHeaderTitle.innerHTML = 'about';
      } else {
        companyHeaderTitle.innerHTML = 'projects';
        companyStickyHeaderTitle.innerHTML = 'projects';
      }
    } else {
      if (lastScrollY > contactSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'contact';
        companyStickyHeaderTitle.innerHTML = 'contact';
      } else if (lastScrollY > servicesSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'services';
        companyStickyHeaderTitle.innerHTML = 'services';
      } else if (lastScrollY > projectsSectionOffsetTop) {
        companyHeaderTitle.innerHTML = 'projects';
        companyStickyHeaderTitle.innerHTML = 'projects';
      } else {
        companyHeaderTitle.innerHTML = 'about';
        companyStickyHeaderTitle.innerHTML = 'about';
      }
    }
  } else {
    companyHeaderTitle.innerHTML = 'Companies';
    if (aboutSectionOffsetTop > projectsSectionOffsetTop) {
      if (lastScrollY > contactSectionOffsetTop) {
        activeCompanyHeaderItem = contactNavItem;
      } else if (lastScrollY > servicesSectionOffsetTop) {
        activeCompanyHeaderItem = servicesNavItem;
      } else if (lastScrollY > aboutSectionOffsetTop) {
        activeCompanyHeaderItem = aboutNavItem;
      } else {
        activeCompanyHeaderItem = projectsNavItem;
      }
    } else {
      if (lastScrollY > contactSectionOffsetTop) {
        activeCompanyHeaderItem = contactNavItem;
      } else if (lastScrollY > servicesSectionOffsetTop) {
        activeCompanyHeaderItem = servicesNavItem;
      } else if (lastScrollY > projectsSectionOffsetTop) {
        activeCompanyHeaderItem = projectsNavItem;
      } else {
        activeCompanyHeaderItem = aboutNavItem;
      }
    }
    resetActiveHeaderItems();
    setActiveHeaderItem(activeCompanyHeaderItem);
  }
  // allow further rAFs to be called
  ticking = false;
};
// Reset Active Header Items (remove the 'active' class)
function resetActiveHeaderItems() {
  var companyHeader = $('#company-header');
  var companyHeaderItems = $$('.company-header-item', companyHeader);
  _.map(companyHeaderItems, function(companyHeaderItem) {
    if (companyHeaderItem.classList.contains('active')) companyHeaderItem.classList.remove('active');
  })
}
// Activate header item (add the 'active' class)
function setActiveHeaderItem(headerItem) {
  if (!headerItem.classList.contains('active')) headerItem.classList.add('active');
}
/**
 * Callback for our scroll event - just
 * keeps track of the last scroll value
 */
function onScroll() {
  lastScrollY = window.pageYOffset;
  requestTick();
}
/**
 * Calls rAF if it's not already
 * been done already
 */
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(update);
    ticking = true;
  }
}
// only listen for scroll events
window.addEventListener('scroll', onScroll, false);
/*
 *
 * Function to scroll to page section
 * on click of company header item
 *
 */
var scrollingElement = document.scrollingElement || document.documentElement;
//
function scrollToSection(event, section) {
  event.stopPropagation();
  var elementOffset = 0;
  switch (section) {
    case 'projects':
      if (projectsSectionOffsetTop > aboutSectionOffsetTop) {
        elementOffset = projectsSectionOffsetTop + 2;
      } else {
        elementOffset = 0;
      }
      break;
    case 'about':
      if (aboutSectionOffsetTop > projectsSectionOffsetTop) {
        elementOffset = aboutSectionOffsetTop + 2;
      } else {
        elementOffset = 0;
      }
      elementOffset = aboutSectionOffsetTop + 2;
      break;
    case 'services':
      elementOffset = servicesSectionOffsetTop + 2;
      break;
    case 'contact':
      elementOffset = contactSectionOffsetTop + 2;
      break;
  }
  companyHeader.classList.remove('show-header-options');
  if (companyStickyHeaderClone) companyStickyHeaderClone.classList.remove('show-header-options');
  scrollVertically(scrollingElement, elementOffset, 200);
}
/*
 *
 * Toggle Header Options on Mobile
 *
 */
function toggleHeaderOptions(event) {
  if (getDeviceType() === "mobile") {
    var clickedEl = event.currentTarget;
    clickedEl.classList.toggle('show-header-options');
  }
}
/*
 *
 * Achievement Stats Animation
 *
 */
;
(function(window, document) {
  //
  var metrics = window.metrics;
  var chunkLength = 4;
  var metricsChunks = _.chunk(metrics, chunkLength);
  var nMetricsChunks = metricsChunks.length;
  //
  var counter = 0;
  var chunkCounter = 0;
  var achievementStats = $('#achievements-section');
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