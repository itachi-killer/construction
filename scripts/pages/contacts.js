/*
 *
 * Toggle Contact Details
 *
 */
function toggleContactDetails(event) {
  if (window.innerWidth < 768) {
    var clickedEl = event.currentTarget;
    var thisContact = clickedEl.closest('.global-office-contact');
    thisContact.classList.toggle('show');
  }
}