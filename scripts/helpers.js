class ResizeManager {
	constructor() {
		this.width = Math.floor(document.documentElement.getBoundingClientRect().width);
		this.height = window.innerHeight;
		this.listeners = [];
		document.documentElement.style.setProperty("--h-viewportOnLoad", `${this.height}px`);
		window.addEventListener("load", this.updateSize.bind(this));
		window.addEventListener("resize", this.debounce(this.updateSize.bind(this), 200));
	}
	updateSize() {
		this.width = Math.floor(document.documentElement.getBoundingClientRect().width);
		this.height = window.innerHeight;
		document.documentElement.style.setProperty("--w-viewport", `${this.width}`);
		document.documentElement.style.setProperty("--h-viewport", `${this.height}`);
		document.documentElement.style.setProperty("--w-viewportInPx", `${this.width}px`);
		document.documentElement.style.setProperty("--h-viewportInPx", `${this.height}px`);
		this.notifyListeners();
	}
	notifyListeners() {
		this.listeners.forEach(listener => listener(this.width, this.height));
	}
	subscribe(listener) {
		this.listeners.push(listener);
	}
	unsubscribe(listener) {
		this.listeners = this.listeners.filter(l => l !== listener);
	}
	debounce(func, wait, immediate) {
		let timeout;
		return function executedFunction() {
			const context = this,
				args = arguments;
			const later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
}

window.resizeManager = new ResizeManager();

/*
 *
 * A library for helper functions
 *
 */
/*
 *
 * requestAnimationFrame() shim by Paul Irish
 *
 */
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function (fn, delay) {
  if (
    !window.requestAnimationFrame &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  )
    return window.setInterval(fn, delay);
  var start = new Date().getTime(),
    handle = new Object();

  function loop() {
    var current = new Date().getTime(),
      delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
    handle.value = requestAnimFrame(loop);
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};
/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function (handle) {
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) /* Support for legacy API */ : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearInterval(handle);
};
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestTimeout = function (fn, delay) {
  if (
    !window.requestAnimationFrame &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  )
    return window.setTimeout(fn, delay);
  var start = new Date().getTime(),
    handle = new Object();

  function loop() {
    var current = new Date().getTime(),
      delta = current - start;
    delta >= delay ? fn.call() : (handle.value = requestAnimFrame(loop));
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};
/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function (handle) {
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) /* Support for legacy API */ : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearTimeout(handle);
};
/*!
 * Get an array of all matching elements in the DOM
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} selector The element selector
 * @param  {Node}   parent   The parent to search in [optional]
 * @return {Array}           Th elements
 */
var $$ = function (selector, parent) {
  return Array.prototype.slice.call((parent ? parent : document).querySelectorAll(selector));
};
/*!
 * Get the first matching element in the DOM
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} selector The element selector
 * @param  {Node}   parent   The parent to search in [optional]
 * @return {Node}            The element
 */
var $ = function (selector, parent) {
  return (parent ? parent : document).querySelector(selector);
};
/*
 *
 * Function to set the window width and height
 * on resize
 *
 */
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var resizeTimer = false;
window.addEventListener(
  "resize",
  function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    }, 200);
  },
  false
);
/*
 *
 * Function to get the device type
 *
 */
function getDeviceType() {
  if (navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry|IEMobile)/)) {
    return "mobile";
  } else if (navigator.userAgent.match(/(iPad)/)) {
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    if (wWidth > wHeight) {
      return "ipad-landscape";
    } else {
      return "ipad-portrait";
    }
  } else {
    return "desktop";
  }
}
/*
 *
 * Page Scrolling
 *
 */
var scrollToPosition = function (direction) {
  if (direction === "VERTICAL") {
    return function (element, to, duration) {
      var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 10;
      var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };
      animateScroll();
    };
  }
  if (direction === "HORIZONTAL") {
    return function (element, to, duration) {
      var start = element.scrollLeft,
        change = to - start,
        currentTime = 0,
        increment = 10;
      var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };
      animateScroll();
    };
  }
};
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
var scrollVertically = scrollToPosition("VERTICAL");
var scrollHorizontally = scrollToPosition("HORIZONTAL");
/*
 *
 * Starting with the Element itself, the closest() method
 * traverses parents (heading toward the document root) of
 * the Element until it finds a node that matches the provided
 * selectorString. Will return itself or the matching ancestor.
 * If no such element exists, it returns null.
 *
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
/*
 *
 * Function to remove element from DOM
 *
 */
function removeElement(element) {
  element.parentNode.removeChild(element);
}
/*
 *
 * Set the year in the footer dynamically
 *
 */
var footerYearEls = $$(".footer-year");
var date = new Date();
_.map(footerYearEls, function (footerYearEl) {
  footerYearEl.innerHTML = date.getFullYear();
});
/*
 *
 * Header related JS
 *
 */
var page = $("#page");
var mobileMenu = $("#mobile-menu");
var primaryMenu = $(".primary-menu", mobileMenu);
var scrollingElement = document.scrollingElement || document.documentElement;
var scrollingElementScrollTop = 0;

function openMenu() {
  page.style.display = "none";
  mobileMenu.style.display = "block";
  scrollingElementScrollTop = scrollingElement.scrollTop;
  window.scrollTo(0, 0);
}

function closeMenu() {
  page.style.display = "flex";
  scrollingElement.scrollTop = scrollingElementScrollTop;
  mobileMenu.style.display = "none";
}

function openSecondaryMenu(secondaryMenuSelector) {
  secondaryMenu = $(secondaryMenuSelector, mobileMenu);
  primaryMenu.style.display = "none";
  secondaryMenu.style.display = "block";
}

function closeSecondaryMenu(event) {
  var clickedEl = event.currentTarget;
  secondaryMenu = clickedEl.closest(".secondary-menu");
  primaryMenu.style.display = "block";
  secondaryMenu.style.display = "none";
}
//Search
var search_click = document.getElementById("search_click");
var search_input = document.getElementById("search-input");
search_input.addEventListener("keypress", function () {
  setTimeout(function () {
    if (search_input.value.length > 2) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://www.shapoorjipallonji.com/search-ajax", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          document.getElementById("search_list").innerHTML = xhr.response;
        }
      };
      xhr.send("searchtext=" + search_input.value);
    }
  }, 500);
});

function myFunction() {
  console.log(document.getElementById("search-input").value);
}
search_click.addEventListener("click", function () {
  hideDropdownsWithoutTransition();
  var show_search = document.getElementById("search_text_box");
  show_search.classList.toggle("showBox");
  //on show search
  if (show_search.classList.contains("showBox")) {
    var searchInput = $("#search-input");
    searchInput.focus();
  } else {
    hideSearchSuggestions();
  }
  var bgc_overlay = document.getElementById("black_overlay");
  bgc_overlay.classList.toggle("showShadow");
  //hide sticky company header if present
  var stickyCompanyHeader = $("#company-header.sticky");
  if (stickyCompanyHeader) stickyCompanyHeader.style.opacity = "0";
  //
});
var close_search = document.getElementById("close_search");
close_search.addEventListener("click", function () {
  closeSearchbar();
});
//Header Dropdown
var acc = document.getElementsByClassName("dropdown_menu_wrapper");
var i;
var drop_div_path = document.getElementById("dropdown_sub_menu");
TweenMax.set(drop_div_path, {
  height: 0,
});
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function (event) {
    event.stopPropagation();
    var drop_div;
    for (i = 0; i < acc.length; i++) {
      drop_div = acc[i].nextElementSibling;
      if (drop_div != this.nextElementSibling) {
        drop_div.classList.add("hidden");
        var img = this.querySelector("img");
        img.classList.remove('rotate-img');
        TweenMax.set(drop_div, {
          height: "0",
        });
      }
    }
    drop_div = this.nextElementSibling;
    var img = this.querySelector("img");
    drop_div.classList.toggle("hidden");
    if (drop_div.classList.contains("hidden")) {
      img.classList.remove('rotate-img');
      TweenMax.to(drop_div, 0.4, {
        height: 0,
        ease: Back.easeIn.config(1.4),
      });
    } else {
      img.classList.add('rotate-img');
      closeSearchbar();
      TweenMax.set(drop_div, {
        height: "auto",
      });
      TweenMax.from(drop_div, 0.4, {
        height: 0,
        ease: Back.easeOut.config(1.4),
      });
    }
  });
}
// hide dropdowns
function hideDropdownsWithoutTransition() {
  var drop_div;
  for (i = 0; i < acc.length; i++) {
    drop_div = acc[i].nextElementSibling;
    drop_div.classList.add("hidden");
    TweenMax.set(drop_div, {
      height: "0",
    });
  }
}
// close saarchbar
function closeSearchbar() {
  var show_search = document.getElementById("search_text_box");
  show_search.classList.remove("showBox");
  var bgc_overlay = document.getElementById("black_overlay");
  bgc_overlay.classList.remove("showShadow");
  //
  var stickyCompanyHeader = $("#company-header.sticky");
  if (stickyCompanyHeader) stickyCompanyHeader.style.opacity = "1";
  //
  clearSearchInput();
  //
  hideSearchSuggestions();
}
/*
 *
 * Search Suggestions
 *
 */
function onSearchInputChange(event) {
  if (event.target.value !== "") {
    showSearchSuggestions();
  } else {
    hideSearchSuggestions();
  }
}
//
var lastScrollY = window.pageYOffset;
//
function showSearchSuggestions() {
  var searchSuggestions = $("#search-suggestions");
  if (!searchSuggestions.isOpen) {
    scrollingElementScrollTop = scrollingElement.scrollTop;
    if (getDeviceType() === "mobile") {
      window.scrollTo(0, 0);
    } else {
      document.body.style.position = "fixed";
      document.body.style.top = -scrollingElementScrollTop + "px";
    }
  }
  searchSuggestions.style.display = "block";
  searchSuggestions.isOpen = true;
  //
  if (getDeviceType() === "mobile") {
    $("#page").style.display = "block";
    setTimeout(function () {
      $("#page").style.display = "flex";
    }, 100);
  }
}
//
function hideSearchSuggestions() {
  var searchSuggestions = $("#search-suggestions");
  var show_search = document.getElementById("search_text_box");
  searchSuggestions.scrollTop = 0;
  searchSuggestions.style.display = "none";
  if (searchSuggestions.isOpen && !show_search.classList.contains("showBox")) {
    searchSuggestions.isOpen = false;
    if (getDeviceType() === "desktop") {
      setTimeout(function () {
        document.body.style.position = "static";
        scrollingElement.scrollTop = scrollingElementScrollTop;
      });
    } else {
      scrollingElement.scrollTop = scrollingElementScrollTop;
    }
  }
}
//
function clearSearchInput() {
  var searchInput = $("#search-input");
  searchInput.value = "";
}
//
document.addEventListener('click', function(event) {
  // console.log('::document click::');
  var dropdownMenuLinks = $$('.dropdown_menu_wrapper');
  _.map(dropdownMenuLinks, function(link) {
    var dropdown = link.nextElementSibling;
    var img = link.querySelector("img");
    img.classList.remove('rotate-img');
    dropdown.classList.add('hidden');
    TweenMax.to(dropdown, 0.4, {
      height: 0,
      ease: Back.easeIn.config(1.4)
    });
  })
});
// window.registeredMouseEnterDropdown = false;

// document.addEventListener("mouseenter", function (event) {
//   if (window.registeredMouseEnterDropdown) return;
//   window.registeredMouseEnterDropdown = true;
//   console.log("::document mouseenter::");

//   var dropdownMenuLinks = document.querySelectorAll(".dropdown_menu_wrapper");

//   dropdownMenuLinks.forEach(function (link) {
//     var dropdown = link.nextElementSibling;

//     link.addEventListener("mouseenter", function (event) {
//       var img = link.querySelector("img");
//       clearTimeout(link.hideTimeout);
//       dropdown.classList.remove("hidden");
//       TweenMax.to(dropdown, 0.4, {
//         height: "auto",
//         ease: Back.easeOut.config(1.4),
//       });

//       // Add rotation class to the img
//       img.classList.add("rotate-img");
//     });

//     dropdown.addEventListener("mouseenter", function (event) {
//       // Prevent hiding the dropdown when entering it or its content
//       clearTimeout(link.hideTimeout);
//     });

//     link.addEventListener("mouseleave", function (event) {
//       var img = link.querySelector("img");
//       link.hideTimeout = setTimeout(function () {
//         dropdown.classList.add("hidden");
//         TweenMax.to(dropdown, 0.4, {
//           height: 0,
//           ease: Back.easeIn.config(1.4),
//         });

//         // Remove rotation class from the img
//         img.classList.remove("rotate-img");
//       }, 100);
//     });

//     dropdown.addEventListener("mouseleave", function (event) {
//       // Hide the dropdown after a short delay when the mouse leaves it
//       var img = link.querySelector("img");
//       link.hideTimeout = setTimeout(function () {
//         dropdown.classList.add("hidden");
//         TweenMax.to(dropdown, 0.4, {
//           height: 0,
//           ease: Back.easeIn.config(1.4),
//         });

//         // Remove rotation class from the img
//         img.classList.remove("rotate-img");
//       }, 100);
//     });
//   });
// });
