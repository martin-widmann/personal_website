(function () {
  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var mobileDrawer = document.getElementById("mobileDrawer");
  var themeToggle = document.getElementById("themeToggle");
  var yearNode = document.getElementById("currentYear");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var logoSpark = document.getElementById("logoSpark");
  var contactLottie = document.getElementById("contactLottie");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY >= 12);
  }

  function setMenuState(open) {
    if (!menuToggle || !mobileDrawer) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileDrawer.hidden = !open;
  }

  function closeMenu() {
    setMenuState(false);
  }

  function initMenu() {
    if (!menuToggle || !mobileDrawer) return;

    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    Array.prototype.forEach.call(mobileDrawer.querySelectorAll("a"), function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  function markActiveNav(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initSectionObserver() {
    var sections = ["projects", "gallery", "cv", "contact"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) markActiveNav(entry.target.id);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-35% 0px -50% 0px"
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initThemeToggle() {
    if (!themeToggle) return;

    var saved = localStorage.getItem("martengous-theme");
    if (saved === "ink") {
      document.body.setAttribute("data-theme", "ink");
    }

    themeToggle.addEventListener("click", function () {
      var isInk = document.body.getAttribute("data-theme") === "ink";
      if (isInk) {
        document.body.removeAttribute("data-theme");
        localStorage.removeItem("martengous-theme");
      } else {
        document.body.setAttribute("data-theme", "ink");
        localStorage.setItem("martengous-theme", "ink");
      }
    });
  }

  function setLottieFallback(container) {
    if (!container) return;
    container.classList.add("lottie-fallback");
  }

  function initLotties() {
    if (!window.lottie || prefersReducedMotion) {
      setLottieFallback(logoSpark);
      setLottieFallback(contactLottie);
      return;
    }

    var logoAnim = null;
    var contactAnim = null;

    if (logoSpark) {
      logoAnim = window.lottie.loadAnimation({
        container: logoSpark,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "assets/lottie/logo-spark.json"
      });
      logoAnim.addEventListener("data_failed", function () {
        setLottieFallback(logoSpark);
      });
    }

    if (contactLottie) {
      contactAnim = window.lottie.loadAnimation({
        container: contactLottie,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "assets/lottie/contact-accent.json"
      });

      contactAnim.addEventListener("data_failed", function () {
        setLottieFallback(contactLottie);
      });

      if ("IntersectionObserver" in window) {
        var played = false;
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting && !played) {
                played = true;
                contactAnim.goToAndPlay(0, true);
                observer.disconnect();
              }
            });
          },
          { threshold: 0.45 }
        );
        observer.observe(contactLottie);
      } else {
        contactAnim.goToAndPlay(0, true);
      }

      contactLottie.addEventListener("mouseenter", function () {
        contactAnim.goToAndPlay(0, true);
      });
    }
  }

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  setHeaderState();
  markActiveNav("projects");
  initMenu();
  initSectionObserver();
  initThemeToggle();
  initLotties();

  window.addEventListener("scroll", setHeaderState, { passive: true });
})();
