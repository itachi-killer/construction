document.addEventListener("DOMContentLoaded", function () {
    let tabLinks = document.querySelectorAll(".csr-tab-navigation");
    let tabs = document.querySelectorAll(".csr-content");


    tabLinks.forEach((links) => {
        links.addEventListener("click", function (event) {
            event.preventDefault();
            tabLinks.forEach((links) => {
                links.classList.remove("active");
            });
            links.classList.add('active')
            tabs.forEach((ele) => {
                ele.classList.remove("show");
            });
            let target = document.querySelector(`#${links.dataset.tab}`);
            target.classList.add("show");
        });
    });
});

function toggleHeaderOptions(event) {
    if (getDeviceType() === "mobile") {
        var clickedEl = event.currentTarget;
        clickedEl.classList.toggle("show-header-options");
    }
}
/*
 *
 * Initialize Slider
 *
 */
var projectImagesSlider = $("#slider__project-images");
var slideImages = $$(".slide-image", projectImagesSlider);
if (getDeviceType() === "mobile") {
    //
    (function preload(images, index) {
        index = index || 0;
        if (images) {
            if (images.length > index) {
                var img = new Image();
                var imgEl = images[index];
                img.src = imgEl.dataset.mobileSrc;
                img.onload = function () {
                    preload(images, index + 1);
                };
            } else {
                console.log("::slide images loaded::");
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
                img.onload = function () {
                    preload(images, index + 1);
                };
            } else {
                console.log("::slide images loaded::");
                startSlider();
            }
        }
    })(slideImages);
}
var jsSlider;

function startSlider() {
    var carouselDots = $(".carousel-dots");
    carouselDots.classList.add("show");
    //
    jsSlider = new JSSlider({
        slider: projectImagesSlider,
        sliderInterval: 2,
        transitionDuration: 0.5,
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
if (getDeviceType() === "mobile") {
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    var xDown = null;
    var yDown = null;

    function handleTouchStart(event) {
        xDown = event.touches[0].clientX;
        yDown = event.touches[0].clientY;
    }

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
                console.log("::left swipe::");
                goToNextProject(event.target);
            } else {
                console.log("::right swipe::");
                goToPreviousProject(event.target);
            }
        } else {
            if (yDiff > 0) {
                console.log("::up swipe::");
            } else {
                console.log("::down swipe::");
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    }
}

function goToNextProject() {
    if ($(".project-next-nav")) {
        var nextHref = $(".project-next-nav").dataset.href;
        window.location.href = nextHref;
    }
}

function goToPreviousProject() {
    if ($(".project-previous-nav")) {
        var previousHref = $(".project-previous-nav").dataset.href;
        window.location.href = previousHref;
    }
}

/*
 *
 * Achievement Stats Animation
 *
 */
(function (window, document) {
    //
    var metrics = window.metrics;
    var chunkLength = 6;
    var metricsChunks = _.chunk(metrics, chunkLength);
    var nMetricsChunks = metricsChunks.length;
    //
    var counter = 0;
    var chunkCounter = 0;
    var achievementStats = $("#achievement-stats");
    //
    var statHeadings = $$(".stat-heading", achievementStats);
    var statSubHeadings = $$(".stat-subheading", achievementStats);
    //
    

const observer = new IntersectionObserver(
 (e) => {
 if (e[0].isIntersecting) {
 if (metricsChunks.length > 1) {
 requestTimeout(function () {
 requestAnimationFrame(animateAchievementStats);
 }, 5000);
 }
 }
 },
 {
 threshold: 0,
 }
 );
 const HighlightContainer = document.querySelector("#legacy") ;
 observer.observe(HighlightContainer);

    function animateAchievementStats() {
        chunkCounter++;
        if (chunkCounter === metricsChunks.length) chunkCounter = 0;
        var thisChunk = metricsChunks[chunkCounter];
        var tl = new TimelineMax();
        tl.to(achievementStats, 0.3, {
            opacity: 0,
            onComplete: function () {
                _.map(statHeadings, function (statHeading) {
                    statHeading.innerHTML = "";
                });
                _.map(statSubHeadings, function (statSubHeading) {
                    statSubHeading.innerHTML = "";
                });
                _.map(thisChunk, function (metric, index) {
                    if (metric.title) statHeadings[index].innerHTML = metric.title;
                    if (metric.text) statSubHeadings[index].innerHTML = metric.text;
                });
            },
        }).to(
            achievementStats,
            0.3,
            {
                opacity: 1,
                onComplete: function () {
                    requestTimeout(function () {
                        requestAnimationFrame(animateAchievementStats);
                    }, 5000);
                },
            },
            0.4
        );
    }
    /*
     *
     * Set Achievements Height
     *
     */
    achievementStats.style.visibility = "hidden";
    //
    function setAchievementsData(chunk) {
        _.map(statHeadings, function (statHeading) {
            statHeading.innerHTML = "";
        });
        _.map(statSubHeadings, function (statSubHeading) {
            statSubHeading.innerHTML = "";
        });
        _.map(chunk, function (metric, index) {
            if (metric.title) statHeadings[index].innerHTML = metric.title;
            if (metric.text) statSubHeadings[index].innerHTML = metric.text;
        });
    }
    //
    function setAchievementsHeight() {
        if (achievementsHeightCounter === metricsChunks.length) {
            setAchievementsData(metricsChunks[0]);
            achievementStats.style.minHeight = achievementsHeight + "px";
            achievementStats.style.visibility = "visible";
        } else {
            setAchievementsData(metricsChunks[achievementsHeightCounter]);
            setTimeout(function () {
                var achievementsRenderedHeight = achievementStats.getBoundingClientRect().height;
                achievementsHeight = achievementsHeight > achievementsRenderedHeight ? achievementsHeight : achievementsRenderedHeight;
                achievementsHeightCounter++;
                setAchievementsHeight();
            }, 10);
        }
    }
    // Resize
    var achievementsHeight = 0;
    var achievementsHeightCounter = 0;
    var ACHIEVEMENTS_HEIGHT_RESIZE_TIMER = 0;
    //
    onResize();

    function onResize() {
        console.log("::on resize::");
        achievementStats.style.height = "auto";
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
