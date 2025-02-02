// Grab a handle to the video
var video = document.getElementById("video");
var pageWrapper=document.querySelector('#page');
var time;
var fullscreenVideo=document.querySelector('#video-fullscreen');
var playpause = document.getElementById("playpause");
var volume=document.getElementById('volume');
// Turn off the default controls
video.controls = false;
function togglePlayPause() {
  if (video.paused || video.ended) {
    video.play();
    playpause.classList.remove('pause');
  }
  else {
    video.pause();
    playpause.classList.add('pause');
  }
}
function setVolume() {
  var volume = document.getElementById("volume");
  video.volume = volume.value;
}
function toggleMute() {
  video.muted = !video.muted;
  if(video.muted){
    volume.classList.add('mute');
  }
  else{
    volume.classList.remove('mute');
  }
}
video.addEventListener("timeupdate", updateProgress, false);
function updateProgress() {
  var progress = document.getElementById("progress");
  var value = 0;
  if (video.currentTime > 0) {
    value = Math.floor((100 / video.duration) * video.currentTime);
  }
  progress.style.width = value + "%";
}
function desktop_handleVideoPopup(){
  // pageWrapper.classList.add('pageHide');
  if(screen.width>1024 || screen.availWidth>1024){
    toggleVideo();
  }
  else{
    playFullscreenVideo();
  }
}
function toggleVideo(){
  document.querySelector('#video-popup').classList.toggle('d-n-override')
  if(document.querySelector('#video-popup').classList.contains('d-n-override')){
    video.pause();
    playpause.classList.add('pause');
  }else{
    video.play();
    playpause.classList.remove('pause');
  }
  if(pageWrapper.classList.contains('pageHide')){
    pageWrapper.classList.remove('pageHide');
  }else{
    pageWrapper.classList.add('pageHide');
  }
}
var videoControlsHandle;
var videoWrapper=document.querySelector('#video-wrapper');
var videoControls=videoWrapper.querySelector('.video-controls');
function desktop_showVideoControls(event){
  event.stopPropagation();
  if(videoControlsHandle)clearRequestTimeout(videoControlsHandle);
  videoControls.classList.remove('d-n');
  videoControlsHandle=requestTimeout(function(){
    TweenMax.to(videoControls,0.4,{
      autoAlpha:0,
      clearProps:'all',
      onComplete:function(){
        videoControls.classList.add('d-n');
      }
    })
  },5000);
}
function desktop_hideVideoControls(event){
  event.stopPropagation();
  if(videoControlsHandle)clearRequestTimeout(videoControlsHandle);
  videoControls.classList.add('d-n');
}
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;
function playFullscreenVideo(){
  // fullscreenVideo.classList.remove('d-n');
  time = window.setInterval(function() {
    try {
      if (typeof(fullscreenVideo.webkitEnterFullscreen) != "undefined") {
        // This is for Android Stock.
        fullscreenVideo.webkitEnterFullscreen();
      } else if (typeof(fullscreenVideo.webkitRequestFullscreen) != "undefined") {
        // This is for Chrome.
        fullscreenVideo.webkitRequestFullscreen();
      } else if (typeof(fullscreenVideo.mozRequestFullScreen) != "undefined") {
        fullscreenVideo.mozRequestFullScreen();
      }
    } catch (e) {}
  }, 250);
  fullscreenVideo.play();
}
fullscreenVideo.addEventListener('webkitbeginfullscreen', function() {
  // alert('webkit begin fullscreen');
  window.clearInterval(time);
});
fullscreenVideo.addEventListener('webkitendfullscreen', function() {
  // alert('webkit end fullscreen');
  video.pause();
});
document.addEventListener("fullscreenchange", function () {
  // alert('fullscreen change');
  document.fullscreen?window.clearInterval(time):fullscreenVideo.pause();
}, false);

document.addEventListener("mozfullscreenchange", function () {
  document.mozFullScreen?window.clearInterval(time):fullscreenVideo.pause();
}, false);

document.addEventListener("webkitfullscreenchange", function () {
  if(document.webkitIsFullScreen){
    window.clearInterval(time);
  }
  else{

    if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    fullscreenVideo.pause();
  }
}, false);
document.addEventListener("msfullscreenchange", function () {
  document.msFullscreenElement?window.clearInterval(time):fullscreenVideo.pause();
}, false);
