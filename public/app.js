"use strict";

let ALL_APPS = [];

const appsGrid = document.getElementById("appsGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const appCount = document.getElementById("appCount");
const emptyState = document.getElementById("emptyState");

/* ========================================= */

async function loadApps(){

    try{

        const response = await fetch("apps.json");

        ALL_APPS = await response.json();

        ALL_APPS.sort((a,b)=>

            a.name.localeCompare(b.name)

        );

        renderApps(ALL_APPS);

    }

    catch(error){

        console.error(error);

        appCount.textContent =

            "Unable to load applications.";

    }

}

/* ========================================= */

function renderApps(apps){

    appsGrid.innerHTML = "";

    if(apps.length===0){

        emptyState.hidden = false;

        appCount.textContent =

            "0 Applications";

        return;

    }

    emptyState.hidden = true;

    appCount.textContent =

        `${apps.length} Application${apps.length>1?"s":""}`;

    apps.forEach(app=>{

        const card = document.createElement("div");

        card.className = "app";

        card.innerHTML = `

            <img

                src="${app.icon}"

                alt="${app.name}"

                loading="lazy">

            <span>

                ${app.name}

            </span>

        `;

        card.addEventListener(

            "click",

            ()=>{

                window.open(

                    app.url,

                    "_blank",

                    "noopener,noreferrer"

                );

            }

        );

        appsGrid.appendChild(card);

    });

}

/* ========================================= */

function searchApps(){

    const keyword =

        searchInput.value

        .trim()

        .toLowerCase();

    if(keyword===""){

        renderApps(ALL_APPS);

        return;

    }

    const filtered =

        ALL_APPS.filter(app=>

            app.name

            .toLowerCase()

            .includes(keyword)

        );

    renderApps(filtered);

}

/* ========================================= */

searchButton.addEventListener(

    "click",

    searchApps

);

searchInput.addEventListener(

    "keyup",

    event=>{

        if(event.key==="Enter"){

            searchApps();

        }

    }

);

searchInput.addEventListener(

    "input",

    searchApps

);

/* ========================================= */

loadApps();
