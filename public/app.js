/* =========================================
   UTUKUR DIGITAL UNIVERSE
   APP.JS
========================================= */

/* =========================================
   SPLASH SCREEN
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      document
        .getElementById(
          "appSplash"
        )
        ?.classList.add(
          "hideSplash"
        );

    }, 900);

  }
);

/* =========================================
   ELEMENTS
========================================= */

const installBtn =

  document.getElementById(
    "installBtn"
  );

const appsGrid =

  document.getElementById(
    "appsGrid"
  );

const featuredApp =

  document.getElementById(
    "featuredApp"
  );

const notificationsFeed =

  document.getElementById(
    "notificationsFeed"
  );

/* =========================================
   SAFE LINKS
========================================= */

function safeOpen(url) {

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}

/* =========================================
   APP CARD
========================================= */

function createAppCard(app) {

  return `

    <div
      class="appCard"
    >

      <div class="appCardGlow"></div>

      <img
        src="${app.icon}"
        alt="${app.name}"
        class="appIcon"
        loading="lazy"
      />

      <div class="appInfo">

        <div class="appTag">

          ${app.category}

        </div>

        <h3>
          ${app.name}
        </h3>

        <p>
          ${app.description}
        </p>

        <div class="cardButtons">

          <button
            class="openCardBtn"
            onclick="safeOpen('${app.url}')"
          >

            Open App

          </button>


        </div>

      </div>

    </div>

  `;

}

/* =========================================
   FEATURED CARD
========================================= */

function createFeaturedCard(app) {

  return `

    <div
      class="featuredCard"
    >

      <div class="featuredGlow"></div>

      <div class="featuredImageWrap">

        <img
          src="${app.icon}"
          alt="${app.name}"
          loading="lazy"
        />

      </div>

      <div class="featuredContent">

        <div class="featuredBadge">

          ${app.badge || "FEATURED"}

        </div>

        <h3>
          ${app.name}
        </h3>

        <p>
          ${app.description}
        </p>

        <div class="cardButtons">

          <button
            class="launchButton"
            onclick="safeOpen('${app.url}')"
          >

            Open Experience

          </button>



        </div>

      </div>

    </div>

  `;

}

/* =========================================
   NOTIFICATION CARD
========================================= */

function createNotificationCard(item) {

  return `

    <div

      class="notificationCard"

      onclick="safeOpen('${item.url}')"

      role="button"

      tabindex="0"

    >

      <div class="notificationGlow"></div>

      <div class="notificationTop">

        <div class="notificationBadge">

          ${item.badge || "UPDATE"}

        </div>

        <div class="notificationTime">

          ${item.time || "NOW"}

        </div>

      </div>

      <h3>
        ${item.title}
      </h3>

      <p>
        ${item.description}
      </p>

    </div>

  `;

}

/* =========================================
   INSTALL POPUP
========================================= */



/* =========================================
   LOAD APPS
========================================= */

async function loadApps() {

  try {

    const response =

      await fetch(
        "./apps.json"
      );

    const data =
      await response.json();

    /* =====================
       FEATURED
    ===================== */

    const featured =

      data.find(
        app => app.featured
      );

    if (
      featured &&
      featuredApp
    ) {

      featuredApp.innerHTML =

        createFeaturedCard(
          featured
        );

    }

    /* =====================
       APPS GRID
    ===================== */

    if (appsGrid) {

      appsGrid.innerHTML =

        data
          .map(app =>
            createAppCard(app)
          )
          .join("");

    }

    initCardEffects();

  }

  catch (error) {

    console.error(
      "Apps loading failed",
      error
    );

  }

}

/* =========================================
   LOAD NOTIFICATIONS
========================================= */

async function loadNotifications() {

  try {

    const response =

      await fetch(
        "./notifications.json"
      );

    const data =
      await response.json();

    if (
      notificationsFeed
    ) {

      notificationsFeed.innerHTML =

        data
          .map(item =>
            createNotificationCard(
              item
            )
          )
          .join("");

    }

  }

  catch (error) {

    console.error(
      "Notifications loading failed",
      error
    );

  }

}

/* =========================================
   CARD EFFECTS
========================================= */

function initCardEffects() {

  const cards =

    document.querySelectorAll(

      ".appCard, .featuredCard, .notificationCard"

    );

  cards.forEach(card => {

    card.addEventListener(
      "mousemove",
      event => {

        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const rotateX =
          ((y - centerY) / centerY) * -4;

        const rotateY =
          ((x - centerX) / centerX) * 4;

        card.style.transform =

          `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-6px)
          `;

      }
    );

    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform =
          "";

      }
    );

  });

}

/* =========================================
   HERO FLOAT
========================================= */

const heroLogo =

  document.querySelector(
    ".heroLogoWrap"
  );

let floatAngle = 0;

function animateHeroLogo() {

  if (!heroLogo) {
    return;
  }

  floatAngle += 0.015;

  const y =
    Math.sin(floatAngle) * 8;

  const rotate =
    Math.sin(floatAngle * 0.6) * 2;

  heroLogo.style.transform =

    `
      translateY(${y}px)
      rotate(${rotate}deg)
    `;

  requestAnimationFrame(
    animateHeroLogo
  );

}

animateHeroLogo();

/* =========================================
   PWA INSTALL
========================================= */

let deferredPrompt = null;

function isPWAInstalled() {

  return (

    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||

    window.navigator.standalone === true

  );

}

window.addEventListener(

  "beforeinstallprompt",

  event => {

    event.preventDefault();

    deferredPrompt = event;

    if (
      !isPWAInstalled()
    ) {

      installBtn?.classList.add(
        "showInstall"
      );

    }

  }
);

installBtn?.addEventListener(
  "click",
  async () => {

    if (
      !deferredPrompt
    ) {

      alert(
        "Install option not available on this device/browser."
      );

      return;

    }

    deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    if (
      choice.outcome ===
      "accepted"
    ) {

      installBtn.classList.remove(
        "showInstall"
      );

    }

    deferredPrompt = null;

  }
);

window.addEventListener(
  "appinstalled",
  () => {

    installBtn?.classList.remove(
      "showInstall"
    );

    deferredPrompt = null;

  }
);

/* =========================================
   SERVICE WORKER
========================================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(console.error);

    }
  );

}

/* =========================================
   IMAGE FALLBACK
========================================= */

document.addEventListener(
  "error",
  event => {

    if (
      event.target.tagName ===
      "IMG"
    ) {

      event.target.src =
        "./icons/icon-192.png";

    }

  },
  true
);

/* =========================================
   LOAD SYSTEM
========================================= */

loadApps();
loadNotifications();

/* =========================================
   CONSOLE BRANDING
========================================= */

console.log(

  "%cUTUKUR DIGITAL UNIVERSE",

  `
    color:#7defff;
    font-size:18px;
    font-weight:bold;
  `
);

console.log(
  "Built by Vidhwaan"
);
