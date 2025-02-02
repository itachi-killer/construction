/*
 *
 * Initialize Slider
 *
 */
var homepageSlider = $('#slider__homepage');
var slideImages = $$('.slide-image', homepageSlider);
if (getDeviceType() === 'mobile') {
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
				// console.log('::slide images loaded::');
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
				// console.log('::slide images loaded::');
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
		slider: homepageSlider,
		sliderInterval: 6,
		transitionDuration: 0.5
	});
	jsSlider.isSliderNavigationDisabled = false;
	jsSlider.sliderHandle = requestTimeout(jsSlider.goToNextSlide.bind(jsSlider), jsSlider.sliderInterval * 1000);
}



class WhatWeDoSlider {
	constructor(ele) {
		this.container = ele;
		this.prevBtns = [...this.container.querySelectorAll("[slider-prev]")];
		this.nextBtns = [...this.container.querySelectorAll("[slider-next]")];
		this.cardLists = this.container.querySelector("[slider-card-list]");
		this.cards = [...this.cardLists.querySelectorAll("[slider-card]")];

		this.cardWidth = this.cards[0].offsetWidth; // Get width of one card
		// this.cardGap = 16;
		this.totalCardWidth = this.cardWidth;

		this.cardPositions = [];
		this.interval = null;

		this.totalCards = this.cards.length;
		this.currentIndex = 0;
		this.init();
	}


	init() {

		// Move the last card to the beginning for the infinite effect
		// this.cardLists.prepend(this.cards[this.cards.length - 1]);
		// this.cards = [...this.cardLists.querySelectorAll("[slider-card]")]; // Update the cards list
		// this.cardLists.scrollLeft = this.totalCardWidth;

		this.prevBtns.forEach(btn => btn.addEventListener('click', () => this.scrollToPrev()));
		this.nextBtns.forEach(btn => btn.addEventListener('click', () => this.scrollToNext()));


		// Pause auto-slide on mouse events
		this.cardLists.addEventListener('mouseenter', () => this.endAutoSlide());
		this.cardLists.addEventListener('mouseleave', () => this.startAutoSlide());
		this.prevBtns.forEach(btn => btn.addEventListener('mouseenter', () => this.endAutoSlide()));
		this.nextBtns.forEach(btn => btn.addEventListener('mouseenter', () => this.endAutoSlide()));
		this.prevBtns.forEach(btn => btn.addEventListener('mouseleave', () => this.startAutoSlide()));
		this.nextBtns.forEach(btn => btn.addEventListener('mouseleave', () => this.startAutoSlide()));

		// Debounce scroll events
		// this.cardLists.addEventListener('scroll', () => this.updateButtonState());
		window.addEventListener('resize', this.onResize.bind(this));
		this.userTimeout = null;

		// this.updateButtonState();
		this.startAutoSlide();
	}

	startAutoSlide() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.scrollToNext();
			// console.log("startAutoSlides");
		}, 4000);
	}

	endAutoSlide() {
		clearInterval(this.interval);
		// console.log("endAutoSlide");
	}

	onResize() {
		this.cardWidth = this.cards[0].offsetWidth;
		this.cardGap = 16;
		this.totalCardWidth = this.cardWidth;
		this.cardLists.scrollLeft = this.totalCardWidth;
		// this.updateButtonState();
	}

	scrollToNext() {
		// console.log("scrollToNext");
		// If there's already a timeout set, clear it
		if (this.userTimeout !== null) {
			this.endAutoSlide();
			clearTimeout(this.userTimeout);
			// console.log('Timeout cleared.');
		}
		this.currentIndex++;
		const maxScrollLeft = this.cardLists.scrollWidth - this.cardLists.clientWidth;
		const newScrollPosition = Math.min(this.cardLists.scrollLeft + this.totalCardWidth, maxScrollLeft);
		if (this.currentIndex == Math.floor(this.cards.length / 2 + 1)) {
			this.cardLists.scrollTo({
				left: 0,
				behavior: 'instant'
			});
			this.currentIndex = 0;
		} else {
			this.cardLists.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth'
			});
		}
		// Set the timeout (for example, 3 seconds after click)
		this.userTimeout = setTimeout(() => {
			// console.log('Timeout triggered!');
			this.startAutoSlide();
		}, 1000); // Timeout set to 3 seconds (3000 ms)
	}

	scrollToPrev() {
		console.log("scrollToPrev");
		// If there's already a timeout set, clear it
		if (this.userTimeout !== null) {
			this.endAutoSlide();
			clearTimeout(this.userTimeout);
			console.log('Timeout cleared.');
		}

		this.currentIndex--;
		// this.endAutoSlide();
		const newScrollPosition = Math.max(this.cardLists.scrollLeft - this.totalCardWidth, 0);
		if (this.currentIndex < 0) {
			this.currentIndex = Math.floor(this.cards.length / 2);
			this.cardLists.scrollTo({
				left: (this.totalCardWidth * this.currentIndex),
				behavior: 'instant'
			});
		} else {
			this.cardLists.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth'
			});
		}
		// Set the timeout (for example, 3 seconds after click)
		this.userTimeout = setTimeout(() => {
			// console.log('Timeout triggered!');
			this.startAutoSlide();
		}, 1000); // Timeout set to 3 seconds (3000 ms)
	}

	// updateButtonStateDebounced() {
	//   clearTimeout(this.scrollTimeout);
	//   this.scrollTimeout = setTimeout(() => this.updateButtonState(), 100);
	// }

	// updateButtonState() {
	//   this.prevBtns.forEach(btn => {
	//     btn.disabled = this.cardLists.scrollLeft <= 9;
	//     btn.classList[this.cardLists.scrollLeft <= 9 ? 'add' : 'remove']('disabled');
	//     btn.offsetHeight;
	//   });

	//   const maxScrollLeft = this.cardLists.scrollWidth - this.cardLists.clientWidth;
	//   this.nextBtns.forEach(btn => {
	//     btn.disabled = Math.ceil(this.cardLists.scrollLeft) >= maxScrollLeft - 17;
	//     btn.classList[Math.ceil(this.cardLists.scrollLeft) >= maxScrollLeft - 17 ? 'add' : 'remove']('disabled');

	//     btn.offsetHeight;
	//   });
	// }
}

// Initialize the slider

// class WhatWeDoSlider {
//   constructor(ele) {
//     this.container = ele;
//     this.prevBtns = [...this.container.querySelectorAll("[slider-prev]")];
//     this.nextBtns = [...this.container.querySelectorAll("[slider-next]")];
//     this.cardLists = this.container.querySelector("[slider-card-list]");
//     this.cards = [...this.cardLists.querySelectorAll("[slider-card]")];
//     this.cardWidth = this.cards[0].offsetWidth;
//     this.totalCardWidth = this.cardWidth;
//     this.interval = null;
//     this.init();
//   }
//   init() {
//     // Move the last card to the beginning
//     const lastCard = this.cards[this.cards.length - 1];
//     this.cardLists.insertBefore(lastCard, this.cards[0]);
//     this.cards = [...this.cardLists.querySelectorAll("[slider-card]")]; // Update the card list
//     // Set initial scroll position to show the first real card
//     this.cardLists.scrollLeft = this.totalCardWidth;
//     // Event listeners
//     this.prevBtns.forEach(btn => btn.addEventListener('click', () => this.scrollToPrev()));
//     this.nextBtns.forEach(btn => btn.addEventListener('click', () => this.scrollToNext()));
//     this.cardLists.addEventListener('mouseenter', () => this.endAutoSlide());
//     this.cardLists.addEventListener('mouseleave', () => this.startAutoSlide());
//     this.prevBtns.forEach(btn => btn.addEventListener('mouseenter', () => this.endAutoSlide()));
//     this.nextBtns.forEach(btn => btn.addEventListener('mouseenter', () => this.endAutoSlide()));
//     this.prevBtns.forEach(btn => btn.addEventListener('mouseleave', () => this.startAutoSlide()));
//     this.nextBtns.forEach(btn => btn.addEventListener('mouseleave', () => this.startAutoSlide()));
//     window.addEventListener('resize', this.onResize.bind(this));
//     this.startAutoSlide();
//   }
//   startAutoSlide() {
//     clearInterval(this.interval);
//     this.interval = setInterval(() => {
//       this.scrollToNext();
//     }, 4000);
//   }
//   endAutoSlide() {
//     clearInterval(this.interval);
//   }
//   onResize() {
//     this.cardWidth = this.cards[0].offsetWidth;
//     this.totalCardWidth = this.cardWidth;
//     this.cardLists.scrollLeft = this.totalCardWidth;
//   }
//   scrollToNext() {
//     this.endAutoSlide();
//     // Move the first card to the end and scroll back to the start
//     const firstCard = this.cards[0];
//     this.cardLists.appendChild(firstCard);
//     this.cards = [...this.cardLists.querySelectorAll("[slider-card]")];
//     this.cardLists.scrollTo({
//       left: this.totalCardWidth,
//       behavior: 'smooth'
//     });
//     // Reset scroll position without animation to maintain continuity
//     this.cardLists.scrollLeft = this.totalCardWidth;
//     // setTimeout(() => {
//     // }, 300);
//     // setTimeout(() => {
//     this.startAutoSlide();
//     // }, 4000);
//   }
//   scrollToPrev() {
//     this.endAutoSlide();
//     // Move the last card to the beginning and scroll forward to maintain continuity
//     const lastCard = this.cards[this.cards.length - 1];
//     this.cardLists.insertBefore(lastCard, this.cards[0]);
//     this.cards = [...this.cardLists.querySelectorAll("[slider-card]")];
//     // Set the scroll position to show the newly added card
//     this.cardLists.scrollLeft = 0;
//     this.cardLists.scrollTo({
//       right: this.totalCardWidth,
//       behavior: 'smooth'
//     });
//     // setTimeout(() => {
//     this.startAutoSlide();
//     // }, 4000);
//   }
// }

class InfiniteSlider {
	constructor(el) {
		this.infiniteSlider = el;
		if (!this.infiniteSlider) return;
		this.element = this.infiniteSlider.querySelectorAll("[slider-card-list]");
		this.sliderHeader = this.infiniteSlider.querySelector(".whatWeDo__top");
		this.cards = this.infiniteSlider.querySelectorAll("[slider-card]");
		this.timeline = null;
		this.timer = null;
		this.debounceTime = null;
		this.duration = this.infiniteSlider.dataset.duration || 10;
		this.prevBtns = this.infiniteSlider.querySelectorAll("[slider-prev]");
		this.nextBtns = this.infiniteSlider.querySelectorAll("[slider-next]");
		this.touchStart = false;
		this.touchCordinates = { x: 0, y: 0 };
		this.cardProgress = [];
		this.calculateCardProgress();
		this.createTimeline();
		this.attachEvents();
		if (!document.body.classList.contains("isPhone")) {
			this.setupObserver();
		}
		this.startLoop = true;

	}
	createTimeline() {
		//first create a timeline using gsap
		this.timeline = gsap.timeline({ repeatDelay: 0, repeat: -1 });

		this.setupAnimation();
	}
	setupAnimation() {
                this.startLoop= true;
		this.timeline.to(this.element, {
			xPercent: -100,
			delay: 0,
			duration: this.duration,
			ease: "linear",
		});
		this.timeline.pause();
		setInterval(() => {
		    if (this.startLoop) { this.nextSlide(); }
		}, 1000);
	}
	// Method to calculate and store card progress
	calculateCardProgress() {
		let duration = this.duration;
		const cardWidth = parseFloat(this.cards[0].getBoundingClientRect().width);
		let gap = window.innerWidth < 1281 ? this.sliderHeader.getBoundingClientRect().left : 0;
		const totalDistance = parseFloat(this.cards.length * cardWidth + (this.cards.length - 1) * 25) + 25;

		const speed = totalDistance / 2 / duration;
		if (window.innerWidth < 767) {
			gap = 16
		}

		this.cardProgress = Array.from(this.cards).map((card, index) => {
			const distanceToStartLine = index * (cardWidth + 25) - gap;
			const timeTaken = distanceToStartLine / speed;
			const progress = timeTaken / duration;
			return Math.max(0, Math.min(1, progress.toFixed(4)));
		});
		
	}

	debounce(cb, time) {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		const debounce__time = this.debounceTime || time;
		// console.log("...de bounce..", debounce__time)
		this.timer = setTimeout(cb, debounce__time);
	}
	setupObserver() {
		let observer = new IntersectionObserver(
			entries => {
				for (let entry of entries) {
console.log('entry.isIntersecting::', entry.isIntersecting)
					if (entry.isIntersecting) {
						// this.timeline.play();
						//this.startLoop = true;
						//this.debounce(() => {this.startLoop = true;}, 300);
					this.setupAnimation();
					//alert("Trigger");
					} else {
						this.debounce(() => {this.timeline.pause(); this.startLoop = false;}, 300);
					}
				}
			},
			{
				threshold: 0.3,
			}
		);
		observer.observe(this.infiniteSlider);
	}
	stopTimeline() {
		// this.debounce(() => this.timeline.pause(), 30);
		this.timeline.pause();
		this.startLoop = false;
	}
	startTimeline() {
		// this.timeline.play();
		this.startLoop = true;
	}
	smoothlyAnimateTimeline(progressValue) {
		const duration = Math.abs(this.timeline.progress() - progressValue) * 1.5; // Adjust duration based on the distance between current and target progress

		// Tween the timeline's progress
		TweenMax.to(this.timeline, duration, {
			progress: progressValue,
			ease: Power2.easeInOut, // Use easeInOut for smoother animation
		});
	}
	prevSlide() {
		this.timeline.pause();
		this.startLoop = false;
		let cardProgress = this.cardProgress;
		let currentProgress = this.timeline.progress();
		if (currentProgress <= 0.1) {
			this.timeline.progress(1);
			currentProgress = 1;
		}
		let nearestCardProgress = Math.max(...cardProgress.filter(progress => progress < currentProgress - 0.05));

		this.smoothlyAnimateTimeline(nearestCardProgress);


		if (this.setTimeLoop) {
			clearInterval(this.setTimeLoop);
			this.setTimeLoop = null;
		}
		this.setTimeLoop = setTimeout(() => {
			this.startLoop = true;
		}, 4000);
	}
	nextSlide() {
		this.timeline.pause();
		this.startLoop = false; 
		let cardProgress = this.cardProgress;
		let currentProgress = this.timeline.progress();
		if (currentProgress + 0.1 >= 1) {
			this.timeline.progress(0);
			currentProgress = 0;
		}

		let nearestCardProgress = Math.min(...cardProgress.filter(progress => progress > currentProgress + 0.003));

		this.smoothlyAnimateTimeline(nearestCardProgress);

		if (this.setTimeLoop) {
			clearInterval(this.setTimeLoop);
			this.setTimeLoop = null;
		}
		this.setTimeLoop = setTimeout(() => {
			this.startLoop = true;
		}, 4000);
	}
	scroll() {
		console.log("scroll....");
	}
	touchMove(e) {
		this.infiniteSlider.classList.add("-touchmove");
		const endCordinates = {
			x: e.touches[0].clientX - this.infiniteSlider.getBoundingClientRect().left,
			y: e.touches[0].clientY - this.infiniteSlider.getBoundingClientRect().top,
		};
		// console.log("touch move...",endCordinates,this.touchCordinates)
		const finalCordinates = {
			x: endCordinates.x - this.touchCordinates.x,
			y: endCordinates.y - this.touchCordinates.y,
		};
		let direction;
		if (finalCordinates.x > 0) {
			direction = "left";
		} else if (finalCordinates.x < 0) {
			direction = "right";
		} else {
			direction = "none";
		}
		// console.log(direction);

		const currentValue = gsap.getProperty(this.element[0], "transform");
		const transformString = String(currentValue);
		const match = transformString.match(/translate\(([^,]+),/);
		let translateWidth;
		if (match && match[1]) {
			// match[1] contains our value
			const xValue = parseFloat(match[1]); // -12.14
			// console.log(xValue); // This will
			if (direction === "right") {
				translateWidth = xValue - 0.4;
				if (translateWidth < -95) {
					translateWidth = -0.4;
				}
			} else if (direction == "left") {
				// console.log("left...")
				this.infiniteSlider.scrollWidth;
				const scrollLeft = this.infiniteSlider.scrollLeft;
				const cardWidth = this.infiniteSlider.querySelector("[slider-card]").offsetWidth;
				// console.log(scrollLeft,cardWidth)
				if (scrollLeft < cardWidth) {
					return;
				}
				translateWidth = xValue + 0.4;
				if (translateWidth < -95) {
					// console.log("translate width",translateWidth)
					translateWidth = -100;
				}
			}
		}
		// console.log(translateWidth);
		this.element.forEach(element => {
			element.style.transform = `translate(${translateWidth}%) translate3d(0px, 0px, 0px)`;
		});
		// console.log("finalcordinates",finalCordinates);
	}
	isElementInViewport() {
		const rect = this.infiniteSlider.getBoundingClientRect();

		return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
	}
	attachEvents() {
		const userAgent = navigator.userAgent.toLowerCase();

		let isDesktop = userAgent.search("windows") !== -1 || userAgent.search("macintosh") !== -1;
		let isPhone = userAgent.search("iphone") !== -1 || userAgent.search("ipad") !== -1 || userAgent.search("ipod") !== -1 || userAgent.search("android") !== -1;

		[...this.prevBtns, ...this.nextBtns].forEach(btn => {
			btn.addEventListener("mouseover", () => {
				if (isDesktop) {
					this.stopTimeline();
				}
			});
			btn.addEventListener("mouseout", () => {
				if (isDesktop) {
					this.startTimeline();
				}
			});
		})

		//for phone
		this.infiniteSlider.addEventListener("touchstart", e => {
			if (isPhone) {
				this.timeline.pause(); //pause timeline
				this.startLoop = false;
				this.infiniteSlider.classList.add("-touchstart");
			}
		});
		this.infiniteSlider.addEventListener("touchend", () => {
			if (isPhone) {
				this.infiniteSlider.classList.remove("-touchstart");
				this.infiniteSlider.classList.remove("-touchmove");
				// this.timeline.play();
			}
			// this.touchStart = false;

			// this.startTimeline.bind(this)
		});
		// on visibility change
		document.addEventListener("visibilitychange", () => {
console.log('document.visibilityState::', document.visibilityState)
			//if (document.visibilityState === "visible" && this.isElementInViewport()) {
			//	this.startTimeline();
			//} else {
			//	this.stopTimeline();
			//}
		});

		this.prevBtns.forEach(btn => {
			btn.addEventListener("click", () => {
				this.debounce(this.prevSlide.bind(this), 250);
			});
		});

		this.nextBtns.forEach(btn => {
			btn.addEventListener("click", () => {
				this.debounce(this.nextSlide.bind(this), 250);
			});
		});
		// this.infiniteSlider.addEventListener("scroll",this.scroll.bind(this));
		// this.infiniteSlider.addEventListener("touchmove",this.touchMove.bind(this));
	}
}

const whatWeDo = document.querySelector('.whatWeDo');

if (whatWeDo) {
	window.cSlider = new InfiniteSlider(whatWeDo);
}
