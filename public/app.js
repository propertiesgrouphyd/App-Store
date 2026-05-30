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
   NORMALIZE
========================================= */

function normalizeText(text){

  return (text || "")

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[^a-z0-9\s]/g, "")

    .replace(/\s+/g, " ")

    .trim();

}

/* =========================================
   LEVENSHTEIN
========================================= */

function levenshtein(a,b){

  const matrix = [];

  for(
    let i = 0;
    i <= b.length;
    i++
  ){
    matrix[i] = [i];
  }

  for(
    let j = 0;
    j <= a.length;
    j++
  ){
    matrix[0][j] = j;
  }

  for(
    let i = 1;
    i <= b.length;
    i++
  ){

    for(
      let j = 1;
      j <= a.length;
      j++
    ){

      if(
        b.charAt(i - 1) ===
        a.charAt(j - 1)
      ){

        matrix[i][j] =
          matrix[i - 1][j - 1];

      }

      else{

        matrix[i][j] = Math.min(

          matrix[i - 1][j - 1] + 1,

          matrix[i][j - 1] + 1,

          matrix[i - 1][j] + 1

        );

      }

    }

  }

  return matrix[b.length][a.length];

}

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
   SMART SEARCH
========================================= */

function scoreApp(app,query){

  const name =

    normalizeText(
      app.name
    );

  if(
    name === query
  ){
    return 1000;
  }

  if(
    name.startsWith(query)
  ){
    return 900;
  }

  if(
    name.includes(query)
  ){
    return 800;
  }

  const words =
    name.split(" ");

  for(
    const word of words
  ){

    if(
      word.startsWith(query)
    ){
      return 700;
    }

  }

  const distance =

    levenshtein(
      query,
      name
    );

  if(
    distance <= 1
  ){
    return 600;
  }

  if(
    distance <= 2
  ){
    return 500;
  }

  return 0;

}

function getFilteredApps(){

  const query =

    normalizeText(
      state.search
    );

  if(
    !query
  ){
    return [];
  }

  return state.apps

    .map(
      app => ({

        app,

        score:
          scoreApp(
            app,
            query
          )

      })
    )

    .filter(
      item =>
        item.score > 0
    )

    .sort(
      (a,b) =>
        b.score - a.score
    )

    .map(
      item =>
        item.app
    );

}

/* =========================================
   RENDER RESULTS
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
   SEARCH INPUT
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
        `./featured.json?v=${Date.now()}`
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
        `./apps.json?v=${Date.now()}`
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
