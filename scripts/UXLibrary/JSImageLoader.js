/*
 *
 * JS Image Loader
 *
 */
function JSImageLoader(loadInParallel) {
	var _this = this;
	_this.deviceType = _this.getDeviceType();
	_this.isResizing = false;
	_this.miscellaneousImages = ["assets/pngs/about/kites/0.png", "assets/pngs/about/kites/1.png", "assets/pngs/about/kites/2.png", "assets/pngs/about/kites/3.png"];
	_this.imgList = [];
	if (loadInParallel) {
		console.log("::loading images in parallel::");
		_this.loadImagesToDOMParallely(_this.getimgList());
	} else {
		console.log("::loading images in serial::");
		_this.loadImagesToDOMSerially(_this.getimgList());
	}
	_this.addResizeListener();
}
JSImageLoader.prototype.getDeviceType = function () {
	if (window.innerWidth < 768) {
		return "mobile";
	} else {
		return "desktop";
	}
};
JSImageLoader.prototype.getimgList = function () {
	var _this = this;
	var deviceType = _this.deviceType;
	_this.imgList = [];
	var imgList = $$("*[data-image]");
	_this.imgList = _.filter(imgList, function (imageEl) {
		if (imageEl.dataset.commonSrc) {
			/*!
			 * If the image has a 'data-src' attribute, this means that the image is common to both desktop and mobile
			 * and can be added directly to the image list.
			 */
			imageEl.dataset.src = imageEl.dataset.commonSrc;
			return true;
		}
		if (imageEl.dataset.mobileSrc && deviceType === "mobile") {
			/*!
			 * If the image has a 'data-mobile-src' attribute and the app has been opened on a mobile device,
			 * this means that the mobile image has to be loaded. We can set the data-src attribute to the mobile src
			 * and add this image to the imgList.
			 */
			imageEl.dataset.src = imageEl.dataset.mobileSrc;
			return true;
		}
		if (imageEl.dataset.desktopSrc && deviceType === "desktop") {
			/*!
			 * If the image has a 'data-desktop-src' attribute and the app has been opened on a desktop device,
			 * this means that the desktop image has to be loaded. We can set the data-src attribute to the desktop src
			 * and add this image to the imgList.
			 */
			imageEl.dataset.src = imageEl.dataset.desktopSrc;
			return true;
		}
		return false;
	});
	/*
	 *
	 * If the Image Loader is required to fade in the images,
	 * set the image opacity to 0 so that the Image Loader can
	 * fade the image in once loaded
	 *
	 */
	_.map(_this.imgList, function (imgEl) {
		if (!imgEl.dataset.loadonly && imgEl.dataset.animated !== "true") {
			imgEl.style.transition = "opacity 0ms";
			imgEl.style.opacity = 0;
		}
	});
	return _this.imgList;
};
JSImageLoader.prototype.loadImagesToDOMParallely = function (images, index) {
	var _this = this;
	index = index || 0;
	if (images.length > index && !window.cancelImageLoading) {
		var imgEl = images[index];
		var img = new Image();
		img.src = imgEl.dataset.src;
		img.onerror = function () {
			console.log("image loading error:: " + img.src);
			img.src = "assets/pngs/empty.png";
		};
		_this.loadImagesToDOMParallely(images, index + 1);
		img.onload = function () {
			if (imgEl.tagName == "IMG") {
				if (!imgEl.dataset.loadonly) {
					imgEl.src = this.src;
					if (imgEl.dataset.animated !== "true") {
						imgEl.style.transition = "opacity 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940)";
						imgEl.style.opacity = 1;
						imgEl.dataset.animated = "true";
					}
				}
			} else {
				if (!imgEl.dataset.loadonly) {
					imgEl.style.backgroundImage = "url(" + this.src + ")";
					if (imgEl.dataset.animated !== "true") {
						imgEl.style.transition = "opacity 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940)";
						imgEl.style.opacity = 1;
						imgEl.dataset.animated = "true";
					}
				}
			}
		};
	} else {
		/*
    All images relevant to the current page have been loaded.
    We can begin preloading the other images
    */
		_this.preloadMiscellaneousImages(_this.miscellaneousImages);
	}
};
JSImageLoader.prototype.loadImagesToDOMSerially = function (images, index) {
	var _this = this;
	index = index || 0;
	if (images.length > index && !window.cancelImageLoading) {
		var imgEl = images[index];
		var img = new Image();
		img.src = imgEl.dataset.src;
		img.onerror = function () {
			console.log("image loading error:: " + img.src);
			img.src = "assets/pngs/empty.png";
		};
		img.onload = function () {
			if (imgEl.tagName == "IMG") {
				if (!imgEl.dataset.loadonly) {
					imgEl.src = this.src;
					if (imgEl.dataset.animated !== "true") {
						imgEl.style.transition = "opacity 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940)";
						imgEl.style.opacity = 1;
						imgEl.dataset.animated = "true";
					}
				}
			} else {
				if (!imgEl.dataset.loadonly) {
					imgEl.style.backgroundImage = "url(" + this.src + ")";
					if (imgEl.dataset.animated !== "true") {
						imgEl.style.transition = "opacity 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940)";
						imgEl.style.opacity = 1;
						imgEl.dataset.animated = "true";
					}
				}
			}
			_this.loadImagesToDOMSerially(images, index + 1);
		};
	} else {
		/*
    All images relevant to the current page have been loaded.
    We can begin preloading the other images
    */
		_this.preloadMiscellaneousImages(_this.miscellaneousImages);
	}
};
/*
 * A function to preload all the other images (first ensuring
 * all the kotak card designs are loaded + vectors)
 */
JSImageLoader.prototype.preloadMiscellaneousImages = function (images, index) {
	var _this = this;
	index = index || 0;
	if (images.length > index && !window.cancelImageLoading) {
		var img = new Image();
		img.src = images[index];
		img.onload = function () {
			_this.preloadMiscellaneousImages(images, index + 1);
		};
	}
};
JSImageLoader.prototype.onResize = function () {
	/*
	 * Do this only on desktop, not on phones and ipads
	 */
	if (!navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry|IEMobile)/) && !navigator.userAgent.match(/(iPad)/)) {
		var _this = this;
		_this.loadImagesToDOMSerially(_this.getimgList());
	}
};
JSImageLoader.prototype.addResizeListener = function () {
	var _this = this;
	window.addEventListener(
		"resize",
		function () {
			window.clearTimeout(_this.isResizing);
			_this.isResizing = setTimeout(function () {
				if (_this.deviceType !== _this.getDeviceType()) {
					_this.deviceType = _this.getDeviceType();
					_this.onResize();
				}
			});
		},
		false
	);
};
(function () {
	new JSImageLoader();
})();
