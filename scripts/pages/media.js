/*
 *
 * Select Dropdown Handler
 *
 */
;
(function(window, document) {
  var dropdownInput = document.querySelector('.dropdown-input');
  if (dropdownInput) {
    var nativeSelectDropdown = document.querySelector('.native-select-dropdown');
    var selectedValueEl = document.querySelector('.selected-value');
    setSelectedValueInnerHTML();
    /*
     *
     * On Dropdown Input Change
     *
     */
    function setSelectedValueInnerHTML() {
      console.log('::on native dropdown change::');
      var selectedValue = nativeSelectDropdown.value;
      selectedValueEl.innerHTML = selectedValue;
    }
    window.handleSelectDropdown = function(event) {
      setSelectedValueInnerHTML();
    }
  }
})(window, document);
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
 * Toggle Award More Info on Mobile
 *
 */
function toggleMore(event) {
  if (getDeviceType() === "mobile") {
    var clickedEl = event.currentTarget;
    var pTag = $('p', clickedEl);
    var parentCol = clickedEl.closest('.grid__col');
    var moreEl = $('.more', parentCol);
    parentCol.classList.toggle('show-more');
    if (parentCol.classList.contains('show-more')) {
      TweenMax.set(moreEl, {
        height: 'auto'
      });
      TweenMax.from(moreEl, 0.2, {
        height: 0
      });
      pTag.innerHTML = "less";
    } else {
      TweenMax.to(moreEl, 0.2, {
        height: 0
      });
      pTag.innerHTML = "more";
    }
  }
}
/*
 *
 * Show More Media Items
 *
 */
/*
 *
 * Show More Media Items
 *
 */
;
(function handleShowMoreNewsItems(window, document) {
  if (getDeviceType() === "mobile") {
    var showMoreButton = $('#show-more');
    var mediaItems = $$('.media-item');
    if (mediaItems.length > 4) {
      //identify the project cards that need to be hidden
      _.map(mediaItems, function(mediaItem, index) {
        if (index > 3) {
          mediaItem.dataset.showMore = "true";
        }
      });
      //hide the project cards that have been identified
      var moreMediaItems = $$('.media-item[data-show-more]');
      _.map(moreMediaItems, function(mediaItem) {
        mediaItem.style.display = 'none';
      });
    } else {
      if (showMoreButton) showMoreButton.style.display = "none";
    }
  }
  //
  window.showMoreMediaItems = function(event) {
    if (getDeviceType() === "mobile") {
      var clickedEl = event.currentTarget;
      clickedEl.classList.toggle('show-more');
      var pTag = $('p', clickedEl);
      var moreMediaItems = $$('.media-item[data-show-more]');
      if (clickedEl.classList.contains('show-more')) {
        pTag.innerHTML = "SEE LESS PROJECTS";
        _.map(moreMediaItems, function(mediaItem) {
          mediaItem.style.display = 'block';
        });
      } else {
        pTag.innerHTML = "SEE MORE PROJECTS";
        _.map(moreMediaItems, function(mediaItem) {
          mediaItem.style.display = 'none';
        });
      }
    }
  }
})(window, document);