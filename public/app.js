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

const categoriesEl =
  document.getElementById(
    "categories"
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

  activeCategory: null,

  search: ""

};

/* =========================================
   SAFE OPEN
========================================= */

function openApp(url){

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}

/* =========================================
   FEATURED CARD
========================================= */

function createFeaturedCard(
  app
){

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

function createAppCard(
  app
){

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
   CATEGORIES
========================================= */

function renderCategories(){

  if(
    !categoriesEl
  ){
    return;
  }

  const categories =

    [

      ...new Set(

        state.apps.map(
          app =>
            app.category
        )

      )

    ]

    .sort();

  categoriesEl.innerHTML =

    categories
      .map(
        category =>

        `

        <button

          class="categoryChip"

          data-category="${category}"

        >

          ${category}

        </button>

        `
      )
      .join("");

  categoriesEl
    .querySelectorAll(
      ".categoryChip"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",

          () => {

            const value =

              button.dataset
                .category;

            if(
              state.activeCategory ===
              value
            ){

              state.activeCategory =
                null;

            }

            else{

              state.activeCategory =
                value;

            }

            renderApps();

          }
        );

      }
    );

}

/* =========================================
   FILTER
========================================= */

function getFilteredApps(){

  let apps =

    [...state.apps];

  const query =

    state.search
      .trim()
      .toLowerCase();

  if(
    query
  ){

    apps =

      apps.filter(

        app =>

          app.name
            .toLowerCase()
            .includes(query)

          ||

          app.category
            .toLowerCase()
            .includes(query)

          ||

          app.description
            .toLowerCase()
            .includes(query)

      );

  }

  if(
    state.activeCategory
  ){

    apps =

      apps.filter(

        app =>

          app.category ===
          state.activeCategory

      );

  }

  return apps;

}

/* =========================================
   APPS
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

  const filtered =

    getFilteredApps();

  if(

    !query

    &&

    !state.activeCategory

  ){

    appsGridEl.innerHTML = "";

    emptyStateEl.style.display =
      "block";

    return;
  }

  emptyStateEl.style.display =
    "none";

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

        event.target.value;

      renderApps();

    }
  );

}

/* =========================================
   LOAD FEATURED
========================================= */

async function
loadFeatured(){

  try{

    const response =

      await fetch(
        "./featured.json"
      );

    state.featured =

      await response.json();

    renderFeatured();

  }

  catch(error){

    console.error(
      error
    );

  }

}

/* =========================================
   LOAD APPS
========================================= */

async function
loadApps(){

  try{

    const response =

      await fetch(
        "./apps.json"
      );

    state.apps =

      await response.json();

    renderCategories();

    renderApps();

  }

  catch(error){

    console.error(
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
  "VIDHWAAN APP STORE"
);
