// =========================================================
// 1. MOBILE MENU — open/close the nav when the ☰ button is tapped
// =========================================================
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open'); // add "open" if missing, remove if present
});

// Close the mobile menu automatically after tapping a link
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});


// =========================================================
// 2. SCROLL REVEAL — fade/slide sections in as you scroll to them,
// and draw in the rope dividers the same way
// =========================================================
// An IntersectionObserver watches elements and tells you when
// they enter (or leave) the visible part of the screen.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { // element is now on screen
      entry.target.classList.add('in-view'); // CSS handles the actual animation
      revealObserver.unobserve(entry.target); // stop watching — only need this once
    }
  });
}, { threshold: 0.2 }); // fire when 20% of the element is visible

// Watch every element that has "reveal" or is a rope divider
document.querySelectorAll('.reveal, .rope-divider').forEach(el => {
  revealObserver.observe(el);
});


// =========================================================
// 3. GALLERY FILTER — show/hide gallery cards by category
// =========================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Highlight only the button that was clicked
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter; // reads data-filter="locs" etc from the HTML

    galleryItems.forEach(item => {
      const matches = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !matches);
    });
  });
});


// =========================================================
// 4. BOOKING FORM — validate fields, then show a success message
// =========================================================
const form = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

// One test function per field. Each returns true (valid) or false (invalid).
const validators = {
  name: v => v.trim().length > 1,
  phone: v => /^[\d\s()+-]{7,}$/.test(v.trim()),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  service: v => v.trim().length > 0,
  date: v => v.trim().length > 0,
};

form.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the page from reloading (the default form behavior)

  let valid = true;

  Object.keys(validators).forEach(key => {
    const input = form.elements[key]; // the actual <input>/<select>
    const fieldEl = document.getElementById('field-' + key); // its wrapping <div>
    const ok = validators[key](input.value);

    if (!ok) {
      valid = false;
      fieldEl.classList.add('error'); // CSS shows the red border + message
    } else {
      fieldEl.classList.remove('error');
    }
  });

  if (valid) {
    form.style.display = 'none';
    formSuccess.classList.add('show');
  } else {
    // Move focus to the first invalid field so the user sees it immediately
    const firstError = form.querySelector('.error input, .error select');
    if (firstError) firstError.focus();
  }
});

// Remove the red error state as soon as the user starts fixing a field
['name', 'phone', 'email', 'service', 'date'].forEach(key => {
  const input = form.elements[key];
  input.addEventListener('input', () => {
    document.getElementById('field-' + key).classList.remove('error');
  });
});
