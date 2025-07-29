// === 1. Scroll Position Restore ===
window.addEventListener("beforeunload", () => {
  localStorage.setItem("scrollTop", window.scrollY);
});

window.addEventListener("load", () => {
  const scrollY = localStorage.getItem("scrollTop");
  if (scrollY !== null) window.scrollTo(0, parseInt(scrollY));
});




// === 2. Portfolio Heading Animation (high bounce) ===
document.addEventListener("DOMContentLoaded", () => {
  const text = "portfolio";
  const el = document.getElementById("typed-text");

  el.textContent = "";

  const spans = text.split("").map(char => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    span.style.transform = "translateY(20px)";
    span.style.transition = "none";
    el.appendChild(span);
    return span;
  });

  gsap.to(spans, {
    y: 0,
    opacity: 1,
    ease: "power2.out",
    stagger: 0.09,
    duration: 0.9,
    onComplete: () => {
      startBounceHigh(spans); // 🔁 High bounce
    }
  });
});


// === 3. Typing Effect for Role Text ===
document.addEventListener("DOMContentLoaded", () => {
  const roles = [
    "Frontend Developer",
    "Graphic Designer",
    "Video Editor",
    "Social Media Manager"
  ];

  const el = document.getElementById("role-text");

  function typeText(text, onComplete) {
    el.textContent = "";
    text.split("").forEach((char, i) => {
      gsap.delayedCall(i * 0.05, () => {
        el.textContent += char;
        if (i === text.length - 1 && onComplete) {
          gsap.delayedCall(1, onComplete);
        }
      });
    });
  }

  function eraseText(onComplete) {
    const currentText = el.textContent;
    currentText.split("").forEach((_, i) => {
      gsap.delayedCall(i * 0.03, () => {
        el.textContent = currentText.slice(0, currentText.length - i - 1);
        if (i === currentText.length - 1 && onComplete) {
          gsap.delayedCall(0.3, onComplete);
        }
      });
    });
  }

  let index = 0;
  function loopRoles() {
    typeText(roles[index], () => {
      eraseText(() => {
        index = (index + 1) % roles.length;
        loopRoles();
      });
    });
  }

  loopRoles();
});


// === 4. Scroll-Reveal + Gentle Bounce for Section Headings ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const headings = document.querySelectorAll(".animated-heading");

  headings.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";

    const spans = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.transform = "translateY(20px)";
      span.style.transition = "none";
      el.appendChild(span);
      return span;
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 95%",
      onEnter: () => {
        gsap.to(spans, {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          stagger: 0.09,
          duration: 0.9,
          onComplete: () => {
            const tl = startBounceGentle(spans);
            el._bounceTL = tl;
          },
        });
      },
      onLeaveBack: () => {
        if (el._bounceTL) {
          el._bounceTL.kill();
          el._bounceTL = null;
        }

        gsap.set(spans, {
          y: 20,
          opacity: 0,
        });
      },
    });
  });
});


// === 5. Scroll-Reveal for About Section Paragraphs ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".about-text p", {
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out",
    stagger: 0.3
  });
});


// === 6. Bounce Functions ===
function startBounceHigh(spans) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

  spans.forEach((span, i) => {
    tl.to(span, { y: -20, duration: 0.25, ease: "power1.out" }, i * 0.1);
    tl.to(span, { y: 0, duration: 0.25, ease: "power1.in" }, i * 0.1 + 0.25);
  });

  const forwardWait = spans.length * 0.1 + 0.6;
  tl.to({}, { duration: 0.5 }, forwardWait);

  spans.slice().reverse().forEach((span, i) => {
    const delay = forwardWait + 0.5 + i * 0.1;
    tl.to(span, { y: -20, duration: 0.25, ease: "power1.out" }, delay);
    tl.to(span, { y: 0, duration: 0.25, ease: "power1.in" }, delay + 0.25);
  });

  return tl;
}

function startBounceGentle(spans) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

  spans.forEach((span, i) => {
    tl.to(span, { y: -5, duration: 0.3, ease: "sine.out" }, i * 0.1);
    tl.to(span, { y: 0, duration: 0.3, ease: "sine.in" }, i * 0.1 + 0.3);
  });

  const forwardWait = spans.length * 0.1 + 0.6;
  tl.to({}, { duration: 0.5 }, forwardWait);

  spans.slice().reverse().forEach((span, i) => {
    const delay = forwardWait + 0.5 + i * 0.1;
    tl.to(span, { y: -5, duration: 0.3, ease: "sine.out" }, delay);
    tl.to(span, { y: 0, duration: 0.3, ease: "sine.in" }, delay + 0.3);
  });

  return tl;
}


// === Custom Cursor + Hover Effects ===
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

let lastX = 0, lastY = 0;
let currentX = 0, currentY = 0;

const followEase = 0.12;
const maxStretch = 0.35;

function animateCursor() {
  lastX += (currentX - lastX) * followEase;
  lastY += (currentY - lastY) * followEase;

  const dx = currentX - lastX;
  const dy = currentY - lastY;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const stretch = 1 + Math.min(distance / 60, maxStretch);

  cursor.style.transform = `
    translate(${lastX - 6}px, ${lastY - 6}px)
    rotate(${angle}deg)
    scale(${stretch}, ${1 / stretch})
  `;

  requestAnimationFrame(animateCursor);
}

document.addEventListener("mousemove", (e) => {
  currentX = e.clientX;
  currentY = e.clientY;
});
animateCursor();

document.addEventListener("mouseover", (e) => {
  const tag = e.target.tagName;
  if (["A", "P", "SPAN", "H1", "H2", "H3"].includes(tag)) {
    cursor.classList.add("hovering");
  }
});
document.addEventListener("mouseout", () => {
  cursor.classList.remove("hovering");
});


// === Resume Buttons: Hover + Glow + Observer ===
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('.resume-btn');

  buttons.forEach(btn => {
    // Glow Pulse
    gsap.to(btn, {
      boxShadow: "0 0 30px rgba(214, 63, 47, 0.3)",
      repeat: -1,
      yoyo: true,
      duration: 2.5,
      ease: "sine.inOut"
    });

    // Magnetic Hover
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.3,
        duration: 0.4,
        ease: "power3.out"
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });

  // Intersection Observer for all resume buttons
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  buttons.forEach(btn => observer.observe(btn));
});


// === Scroll Animations for Resume + Portfolio Sections ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".resume-card", {
    scrollTrigger: {
      trigger: ".resume-card",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
  });

  gsap.from(".column", {
    scrollTrigger: {
      trigger: ".row",
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    stagger: 0.3,
    ease: "power2.out"
  });

  gsap.from(".section-divider", {
    scrollTrigger: {
      trigger: ".section-divider",
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    y: 20,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out",
    stagger: 0.3
  });

  gsap.from(".description", {
    scrollTrigger: {
      trigger: ".description",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out"
  });

  gsap.from(".page6-description", {
    scrollTrigger: {
      trigger: ".page6-description",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out"
  });

  gsap.from(".page6-tags", {
  scrollTrigger: {
    trigger: ".page6-tags",
    start: "top 90%",
    toggleActions: "play none none reverse"
  },
  y: 30,
  opacity: 0,
  filter: "blur(10px)",
  duration: 1,
  ease: "power2.out"
});


  gsap.from(".tags", {
    scrollTrigger: {
      trigger: ".tags",
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out"
  });

  

  gsap.to(".vertical-divider", {
    scrollTrigger: {
      trigger: ".vertical-divider",
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    height: "80%",
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
  });

  // Animation for 5 page 
  gsap.from(".project-summary", {
    scrollTrigger: {
      trigger: ".project-summary",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out"
  });

   gsap.from(".skill-tags", {
    scrollTrigger: {
      trigger: ".skill-tags",
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out"
  });
});


// === Animate HR Lines on 4th Page ===
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll('.top-line, .bottom-line');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('line-animate');
      } else {
        entry.target.classList.remove('line-animate');
      }
    });
  }, {
    threshold: 0.5
  });

  lines.forEach(line => observer.observe(line));
});


// === Animate HR Lines on 5th Page ===
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll('.divider-top, .divider-bottom');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-line');
      } else {
        entry.target.classList.remove('animate-line');
      }
    });
  }, {
    threshold: 0.5
  });

  lines.forEach(line => observer.observe(line));
});


// === Start infinite scroll animation only when 5th page is in view ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".wrapper-container",
    start: "top 80%", // adjust as needed
    onEnter: () => {
      document.querySelector(".gallery-scroll").classList.add("animate");
    },
    onLeaveBack: () => {
      document.querySelector(".gallery-scroll").classList.remove("animate");
    }
  });
});


// === Animate HR Lines on 6th Page ===
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll('.page6-line-top, .page6-line-bottom');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-line');
      } else {
        entry.target.classList.remove('animate-line');
      }
    });
  }, {
    threshold: 0.5
  });

  lines.forEach(line => observer.observe(line));
});

