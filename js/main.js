// JavaScript: find an element, then listen for an event.

// 1) Mobile menu: the Menu button adds or removes the "open" class (CSS shows/hides the menu).
const button = document.querySelector(".menu-btn");
const menu = document.querySelector("#menu");
button.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  button.setAttribute("aria-expanded", isOpen);
});

// 2) Footer year updates itself.
document.querySelector("#year").textContent = new Date().getFullYear();

// 3) Contact form (only exists on contact.html). A simple website has no server to receive forms,
//    so this opens the visitor's email app with the message already written.
const form = document.querySelector("#enquiry");
if (form) {
  const note = document.querySelector("#form-note");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name").trim(), phone = data.get("phone").trim(), message = data.get("message").trim();
    if (!name || !phone || !message) { note.textContent = "Please fill in your name, phone and message."; return; }
    const subject = encodeURIComponent("Website enquiry from " + name);
    const body = encodeURIComponent(message + "\n\nName: " + name + "\nPhone: " + phone);
    window.location.href = "mailto:contact@anjaneyaengineeringconsultants.com?subject=" + subject + "&body=" + body;
    note.textContent = "Opening your email app. Press send there to finish.";
  });
}

// 3b) Services dropdown: click the button to open or close it (on a computer it also opens when you hover).
//     Click anywhere else, or press Esc, to close it.
document.querySelectorAll(".dropdown").forEach((dd) => {
  const btn = dd.querySelector(".dd-btn");
  const close = () => { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => { const isOpen = dd.classList.toggle("open"); btn.setAttribute("aria-expanded", isOpen); });
  document.addEventListener("click", (e) => { if (!dd.contains(e.target)) close(); });
  dd.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); btn.focus(); } });
});

// 4) Slideshows (the home banner and every photo gallery). Each one shows a single slide and moves on by itself.
//    Hover to pause. Click a dot or an arrow to move. Stays still if the visitor prefers reduced motion.
document.querySelectorAll(".slider").forEach((slider, index) => {
  const slides = [...slider.querySelectorAll(".slide")];
  const dots = slider.querySelector(".dots");
  let current = 0, timer;
  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle("is-active", k === current);
      s.setAttribute("aria-hidden", k !== current);
      if (s.tagName === "A") s.tabIndex = k === current ? 0 : -1;
    });
    [...dots.children].forEach((d, k) => d.setAttribute("aria-current", k === current));
  }
  function start() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(() => show(current + 1), 4500 + index * 700);   // slightly different speeds so they don't change together
  }
  function restart() { clearInterval(timer); start(); }
  slides.forEach((_, n) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Show slide " + (n + 1));
    b.addEventListener("click", () => { show(n); restart(); });
    dots.append(b);
  });
  const prev = slider.querySelector(".prev"), next = slider.querySelector(".next");
  if (prev) prev.addEventListener("click", () => { show(current - 1); restart(); });
  if (next) next.addEventListener("click", () => { show(current + 1); restart(); });
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", start);
  show(0); start();
});
