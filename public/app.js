/* =========================================
   VIDHWAAN APP STORE
========================================= */

const featuredAppsEl =
  document.getElementById(
    "featuredApps"
  );

const appsGridEl =
  document.getElementById(
    "appsGrid"
  );

const searchEl =
  document.getElementById(
    "appSearch"
  );

const emptyStateEl =
  document.getElementById(
    "emptyState"
  );

/* =========================================
   STATE
========================================= */

const state = {

  apps: [],

  featured: [],

  search: ""

};

/* =========================================
   OPEN APP
========================================= */

function openApp(url){

  if(!url){
    return;
  }

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}

/* =========================================
   FEATURED CARD
========================================= */

function createFeaturedCard(app){

  return `

    <div class="featuredCard">

      <img
        src="${app.icon}"
        alt="${app.name}"
        loading="lazy"
      >

      <h3>
        ${app.name}
      </h3>

      <p>
        ${app.description}
      </p>

      <button
        class="launchBtn"
        onclick="openApp('${app.url}')"
      >
        Launch App
      </button>

    </div>

  `;

}

/* =========================================
   APP CARD
========================================= */

function createAppCard(app){

  return `

    <div class="appCard">

      <img
        src="${app.icon}"
        alt="${app.name}"
        loading="lazy"
      >

      <h3>
        ${app.name}
      </h3>

      <p>
        ${app.description}
      </p>

      <button
        class="launchBtn"
        onclick="openApp('${app.url}')"
      >
        Launch App
      </button>

    </div>

  `;

}

/* =========================================
   FEATURED
========================================= */

function renderFeatured(){

  if(
    !featuredAppsEl
  ){
    return;
  }

  featuredAppsEl.innerHTML =

    state.featured
      .map(
        createFeaturedCard
      )
      .join("");

}

/* =========================================
   SEARCH FILTER
========================================= */

function getFilteredApps(){

  const query =

    state.search
      .trim()
      .toLowerCase();

  if(
    !query
  ){
    return [];
  }

  return state.apps.filter(

    app =>

      app.name
        .toLowerCase()
        .includes(query)

      ||

      app.description
        .toLowerCase()
        .includes(query)

  );

}

/* =========================================
   SEARCH RESULTS
========================================= */

function renderApps(){

  if(
    !appsGridEl
  ){
    return;
  }

  const query =

    state.search
      .trim();

  if(
    !query
  ){

    appsGridEl.innerHTML = "";

    if(
      emptyStateEl
    ){
      emptyStateEl.style.display =
        "block";
    }

    return;

  }

  const filtered =

    getFilteredApps();

  if(
    emptyStateEl
  ){
    emptyStateEl.style.display =
      filtered.length
        ? "none"
        : "block";
  }

  appsGridEl.innerHTML =

    filtered
      .map(
        createAppCard
      )
      .join("");

}

/* =========================================
   SEARCH
========================================= */

function setupSearch(){

  if(
    !searchEl
  ){
    return;
  }

  searchEl.addEventListener(

    "input",

    event => {

      state.search =

        event.target.value || "";

      renderApps();

    }

  );

}

/* =========================================
   LOAD FEATURED
========================================= */

async function loadFeatured(){

  try{

    const response =

      await fetch(
        "./featured.json"
      );

    if(
      !response.ok
    ){
      throw new Error(
        "featured.json"
      );
    }

    state.featured =

      await response.json();

    renderFeatured();

  }

  catch(error){

    console.error(
      "Featured Load Error",
      error
    );

  }

}

/* =========================================
   LOAD APPS
========================================= */

async function loadApps(){

  try{

    const response =

      await fetch(
        "./apps.json"
      );

    if(
      !response.ok
    ){
      throw new Error(
        "apps.json"
      );
    }

    state.apps =

      await response.json();

  }

  catch(error){

    console.error(
      "Apps Load Error",
      error
    );

  }

}

/* =========================================
   IMAGE FALLBACK
========================================= */

document.addEventListener(

  "error",

  event => {

    if(

      event.target.tagName ===
      "IMG"

    ){

      event.target.src =
        "./icons/icon-192.png";

    }

  },

  true

);

/* =========================================
   BOOT
========================================= */

setupSearch();

loadFeatured();

loadApps();

/* =========================================
   GLOBAL
========================================= */

window.openApp =
  openApp;

console.log(
  "VIDHWAAN APP STORE READY"
);
