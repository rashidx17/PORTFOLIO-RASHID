// === Scroll Position Restore ===
window.addEventListener("beforeunload", () => {
  localStorage.setItem("scrollTop", window.scrollY);
});
window.addEventListener("load", () => {
  const scrollY = localStorage.getItem("scrollTop");
  if (scrollY !== null) window.scrollTo(0, parseInt(scrollY));
});

// locomotive smooth scroll
function initLocomotiveAndScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);

  const scroller = document.querySelector("[data-scroll-container]"); // #main
  if (!scroller) {
    console.warn("Locomotive: no [data-scroll-container] found.");
    return null;
  }


  const locoScroll = new LocomotiveScroll({
    el: scroller,
    smooth: true,
    tablet: { smooth: true },
    smartphone: { smooth: true },
  });

  // make ScrollTrigger aware of locomotive
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length) {
        // setter
        // new locomotive uses an object for options; older used (value, 0, 0).
        try {
          locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
        } catch (err) {
          // fallback for older versions
          locoScroll.scrollTo(value, 0, 0);
        }
      } else {
        // getter
        return locoScroll.scroll && locoScroll.scroll.instance
          ? locoScroll.scroll.instance.scroll.y
          : 0;
      }
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scroller.style.transform ? "transform" : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  return locoScroll;
}
// Usage
document.addEventListener("DOMContentLoaded", () => {
  const loco = initLocomotiveAndScrollTrigger();
  // then run the rest of your existing page animation/observer logic...
});
// smooth scroll end 

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.matchMedia("(max-width: 899px)").matches;

  // === Portfolio Heading Animation + Bounce ===
  const text = "portfolio";
  const headingEl = isMobile
    ? document.getElementById("typed-text-mobile")
    : document.getElementById("typed-text-desktop");

  if (headingEl) {
    headingEl.textContent = "";
    const spans = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.transform = "translateY(20px)";
      headingEl.appendChild(span);
      return span;
    });

    gsap.to(spans, {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      stagger: 0.09,
      duration: 0.9,
      delay:0.5,
      onComplete: () => startBounceHigh(spans),
    });
  }

  // === Typing Effect for Role Text ===
  const roles = [
    "Frontend Developer",
    "Graphic Designer",
    "Video Editor",
    "Social Media Manager",
  ];
  const roleEl = isMobile
    ? document.getElementById("role-text-mobile")
    : document.getElementById("role-text-desktop");

  if (roleEl) {
    let index = 0;

    function typeText(text, cb) {
      roleEl.textContent = "";
      text.split("").forEach((char, i) => {
        gsap.delayedCall(i * 0.05, () => {
          roleEl.textContent += char;
          if (i === text.length - 1 && cb) gsap.delayedCall(1, cb);
        });
      });
    }

    function eraseText(cb) {
      const text = roleEl.textContent;
      text.split("").forEach((_, i) => {
        gsap.delayedCall(i * 0.03, () => {
          roleEl.textContent = text.slice(0, text.length - i - 1);
          if (i === text.length - 1 && cb) gsap.delayedCall(0.3, cb);
        });
      });
    }

    function loopRoles() {
      typeText(roles[index], () => {
        eraseText(() => {
          index = (index + 1) % roles.length;
          loopRoles();
        });
      });
    }

    loopRoles();
  }

  // === Scroll-Reveal Animated Headings ===
  document.querySelectorAll(".animated-heading").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    const spans = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.transform = "translateY(20px)";
      el.appendChild(span);
      return span;
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(spans, {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              stagger: 0.09,
              duration: 0.9,
              onComplete: () => {
                spans.forEach((span) => span.classList.add("float-up-down"));
              },
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
  });

  // === Reusable IntersectionObserver Fade-In Once Function ===
  const fadeInOnce = (selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.set(el, { y: 30, opacity: 0, filter: "blur(10px)" });

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
              });
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
    });
  };

  fadeInOnce(".about-image");
  fadeInOnce(".about-text p");
  fadeInOnce(".page4-description");
  fadeInOnce(".page4-tags");
  fadeInOnce(".contact-links p");
  fadeInOnce(".resume-btn");
  fadeInOnce(".resume-card");
  fadeInOnce(".column");
  fadeInOnce(".section-divider");
  fadeInOnce(".description");
  fadeInOnce(".tags");
  fadeInOnce(".skill-tags");
  fadeInOnce(".project-summary");
  fadeInOnce(".page6-description");
  fadeInOnce(".page6-tags");
  fadeInOnce(".contact-content");

  // === Resume Divider Animation ===
  gsap.to(".vertical-divider", {
    scrollTrigger: {
      trigger: ".vertical-divider",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
    height: "80%",
    duration: 1,
    delay: 0.5,
    ease: "power2.out",
  });

  // === Resume Button Hover Effects ===
  document.querySelectorAll(".resume-btn").forEach((btn) => {
    gsap.to(btn, {
      boxShadow: "0 0 30px rgba(214, 63, 47, 0.3)",
      repeat: -1,
      yoyo: true,
      duration: 2.5,
      ease: "sine.inOut",
    });

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.3,
        duration: 0.4,
        ease: "power3.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    });
  });

  // === Floating Stickers + Intro ===
  const stickers = ["#icon-headphones", "#icon-tablet", "#icon-gamepad"];
  const floatOffsets = [-5, 6, -4];
  const intro = gsap.timeline();
  stickers.forEach((id, i) => {
    intro.from(id, {
      delay: 0.4 + i * 0.2,
      opacity: 0,
      y: -30,
      scale: 0.8,
      ease: "back.out(1.7)",
      duration: 1,
    });
    gsap.to(id, {
      y: `+=${floatOffsets[i]}`,
      duration: 2 + i * 0.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
});

// === Bouncing Portfolio Heading ===
function startBounceHigh(spans) {
  const isMobile = window.matchMedia("(max-width: 899px)").matches;
  const bounceHeight = isMobile ? 5 : 20;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
  spans.forEach((span, i) => {
    tl.to(
      span,
      { y: -bounceHeight, duration: 0.25, ease: "power1.out" },
      i * 0.1
    ).to(span, { y: 0, duration: 0.25, ease: "power1.in" }, i * 0.1 + 0.25);
  });

  const forwardDur = spans.length * 0.1 + 0.6;
  tl.to({}, { duration: 0.6 }, forwardDur);

  spans
    .slice()
    .reverse()
    .forEach((span, i) => {
      const delay = forwardDur + 0.6 + i * 0.1;
      tl.to(
        span,
        { y: -bounceHeight, duration: 0.25, ease: "power1.out" },
        delay
      ).to(span, { y: 0, duration: 0.25, ease: "power1.in" }, delay + 0.25);
    });

  tl.to({}, { duration: 0.6 });
}

if (window.matchMedia("(pointer: fine)").matches) {
  // === Custom Cursor ===
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  let lastX = 0,
    lastY = 0,
    currentX = 0,
    currentY = 0;
  const followEase = 0.12,
    maxStretch = 0.35;

  function animateCursor() {
    lastX += (currentX - lastX) * followEase;
    lastY += (currentY - lastY) * followEase;
    const dx = currentX - lastX,
      dy = currentY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const stretch = 1 + Math.min(dist / 60, maxStretch);
    cursor.style.transform = `translate(${lastX - 6}px, ${
      lastY - 6
    }px) rotate(${angle}deg) scale(${stretch}, ${1 / stretch})`;
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
  document.addEventListener("mouseout", () =>
    cursor.classList.remove("hovering")
  );
}

// === Circle viewport reveal ===
const circleSelectors = [
  ".page4-semicircle",
  ".page4-small-circle",
  ".page6-semicircle",
  ".page6-small-circle",
];

const circles = document.querySelectorAll(circleSelectors.join(","));

const circleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inview");
      }
    });
  },
  { threshold: 0.2 }
);

circles.forEach((el) => {
  el.classList.add("circle-reveal");
  circleObserver.observe(el);
});

// === Contact Form Submit ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          alert("✅ Message sent successfully!");
          form.reset();
        } else {
          alert("❌ Oops! Something went wrong.");
        }
      } catch (error) {
        alert("⚠️ Network error, please try again later.");
      }
    });
  }
});

// === Preloader ===
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 500);
  }
});

// === Dark Mode Toggle (Updated) ===
(function initDarkToggle() {
  if (window.matchMedia("(max-width: 899px)").matches) {
    // Force light mode on mobile
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    const toggleBtn = document.getElementById("darkToggle");
    if (toggleBtn) toggleBtn.style.display = "none";
    return;
  }

  const toggleBtn = document.getElementById("darkToggle");
  const themeIcon = document.getElementById("theme-icon");
  if (!toggleBtn || !themeIcon) return;

  function applyDark(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
      localStorage.setItem("theme", "light");
    }
  }

  // Always start in light mode unless user chose dark before
  const saved = localStorage.getItem("theme");
  if (saved === "dark") applyDark(true);
  else applyDark(false);

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    applyDark(!isDark);
  });
})();




// String Animation
document.querySelectorAll(".string").forEach(stringEl => {
  const pathEl = stringEl.querySelector("path");

  const finalPath = "M 10 100 Q 500 100 990 100"; // resting shape

  stringEl.addEventListener("mousemove", e => {
    // get mouse position relative to element
    const rect = stringEl.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // update curve dynamically
    const path = `M 10 100 Q ${relX} ${relY} 990 100`;

    gsap.to(pathEl, {
      attr: { d: path },
      duration: 0.3,
      ease: "power3.out"
    });
  });

  stringEl.addEventListener("mouseleave", () => {
    gsap.to(pathEl, {
      attr: { d: finalPath },
      duration: 1.5,
      ease: "elastic.out(1,0.2)"
    });
  });
});





