/**
 * Initialises the global variables and document elements.
 */
function setup() {
    backButton.onclick = (() => {
        backToMainPage();
    });
    
    prevBtn.innerHTML = '<';
    prevDiv.setAttribute('class', 'nav-div');
    prevDiv.appendChild(prevBtn);
    
    listDiv.setAttribute('class', 'inner-div');
    listDiv.setAttribute('id', 'starships-list-div')
    listDiv.appendChild(listTable);
    
    infoDiv.setAttribute('class', 'inner-div');
    infoDiv.setAttribute('id', 'info-div');
    
    nextDiv.setAttribute('class', 'nav-div');
    nextBtn.innerHTML = '>';
    nextDiv.appendChild(nextBtn);
    
    prevBtn.onclick = (() => {
        if (globalPageView > 0) {
            --globalPageView;
            displayStarships(listTable, starships, globalPageView);
        }
    });
    nextBtn.onclick = (() => {
        if ((globalPageView + 1) * 8 < starships.length) {
            ++globalPageView;
            displayStarships(listTable, starships, globalPageView);
        }
    });
    
    themeInterval = setInterval(() => {
        runTheme(picture_id);
        picture_id = (picture_id + 1) % 9;
    }, 6000);
}

/**
 * Changes the background image of the webpage.
 * @param {Number} picture_id The picture to replace into the webpage background.
 */
function runTheme(picture_id) {
    document.body.style.backgroundImage = `url(assets/bg-0${picture_id}.jpg)`;
}

/**
 * Changes the title of the tab.
 * @param {String} title The title to put in the header section of the tab.
 */
function titleTab(title='Topic') {
    tabTitle.innerHTML = title;
}

/**
 * Clears the content of a given element.
 * @param {Object} item The DOM element to clear.
 */
function clearTab(item) {
    while (item.lastChild) {
        item.removeChild(item.lastChild);
    }
}

/**
 * Loads the main page back.
 */
function backToMainPage() {
    document.querySelector('#back-button').style.display = 'none';
    listEpisodes();
}

/**
 * Sends a request to the server and downlaods the series info from the API.
 */
async function fetchEpisodes() {
    for (let i = 1; i <= 6; ++i) {
        await fetch(`https://swapi.dev/api/films/${i}`)
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            episodes.push(json);
        })
        .catch(error => alert(error));
    }
}

/**
 * Downloads the info about the starships present in the given episode.
 * @param {Object} episode The JSON object the starships of which are desired.
 * @returns The list of starships in the given episode of series.
 */
async function getStarships(episode) {
    let starships = [];
    for (let i = 0; i < episode['starships'].length; ++i) {
        await fetch(episode['starships'][i])
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            starships.push(json);
        })
        .catch(error => alert(error));
    }
    return starships;
}

/**
 * Displays the info about the given starship.
 * @param {Object} starship The JSON object the info of which are displayed.
 */
function displayStarshipInfo(starship) {
    let infoTitle = document.createElement('h2');
    infoTitle.innerHTML = starship['name'];
    let shipModelTitle = document.createElement('h4');
    shipModelTitle.innerHTML = 'Model:';
    shipModelTitle.style.textDecoration = 'underline';
    let shipModel = document.createElement('p');
    shipModel.innerHTML = starship['model'];
    let shipManufacturerTitle = document.createElement('h4');
    shipManufacturerTitle.innerHTML = 'Manufacturer:';
    shipManufacturerTitle.style.textDecoration = 'underline';
    let shipManufacturer = document.createElement('p');
    shipManufacturer.innerHTML = starship['manufacturer'];
    let shipCrewTitle = document.createElement('h4');
    shipCrewTitle.innerHTML = 'Crew:';
    shipManufacturerTitle.style.textDecoration = 'underline';
    let shipCrew = document.createElement('p');
    shipCrew.innerHTML = starship['crew'];
    let shipPassengersTitle = document.createElement('h4');
    shipPassengersTitle.innerHTML = 'Passengers:';
    shipPassengersTitle.style.textDecoration = 'underline';
    let shipPassengers = document.createElement('p');
    shipPassengers.innerHTML = starship['passengers'];
    
    infoDiv.appendChild(infoTitle);
    infoDiv.appendChild(shipModelTitle);
    infoDiv.appendChild(shipModel);
    infoDiv.appendChild(shipManufacturerTitle);
    infoDiv.appendChild(shipManufacturer);
    infoDiv.appendChild(shipCrewTitle);
    infoDiv.appendChild(shipCrew);
    infoDiv.appendChild(shipPassengersTitle);
    infoDiv.appendChild(shipPassengers);
}

/**
 * Displays the starships info on separated limited pages.
 * @param {Object} listTable The DOM element of the table containing the list of starships.
 * @param {Array} starships The list of starships in a given episode.
 * @param {Number} index The index of the current page of starships list.
 */
function displayStarships(listTable, starships, index) {
    clearTab(listTable);
    for (let i = index * 8; i < (index + 1) * 8 && i < starships.length; ++i) {
        row = document.createElement('tr');
        data = document.createElement('td');
        data.innerHTML = starships[i]['name'];
        data.addEventListener('mouseover', () => {

            displayStarshipInfo(starships[i]);
        });
        data.addEventListener('mouseout', () => {
            clearTab(infoDiv);
        });
        row.appendChild(data);
        listTable.appendChild(row);
    }
    if (index == 0) {
        prevBtn.disabled = true;
        prevBtn.innerHTML = '|';
    }
    else {
        prevBtn.disabled = false;
        prevBtn.innerHTML = '<';
    }

    if ((index + 1) * 8 >= starships.length) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '|';
    }
    else {
        nextBtn.disabled = false;
        nextBtn.innerHTML = '>';
    }
}

/**
 * Switches the tab to display the starships of the given episode.
 * @param {Object} episode The JSON object of the given episode.
 */
async function viewStarships(episode) {
    
    titleTab('Starships');

    backButton.style.display = 'inline';
    tab.innerHTML = 'Loading...'
    starships = await getStarships(episode);
    clearTab(tab);
    
    tab.appendChild(prevDiv);
    
    tab.appendChild(listDiv);
    globalPageView = 0;
    displayStarships(listTable, starships, globalPageView);
    
    tab.appendChild(infoDiv);
    
    tab.appendChild(nextDiv);
    
}

/**
 * Creates a table and a table header.
 * @returns The table element that contains the table header.
 */
function getTableHeader() {
    let table = document.createElement('table');
    table.setAttribute('id', 'episodes-table');
    
    let tableHeader = document.createElement('tr');
    
    let epName = document.createElement('th');
    epName.innerHTML = 'Episode Name';
    tableHeader.appendChild(epName);
    
    let epNumber = document.createElement('th');
    epNumber.innerHTML = 'Episode';
    tableHeader.appendChild(epNumber);
    
    let rlsDate = document.createElement('th');
    rlsDate.innerHTML = 'Release Date';
    tableHeader.appendChild(rlsDate);
    
    let strShips = document.createElement('th');
    strShips.innerHTML = 'Starships';
    tableHeader.appendChild(strShips);
    
    table.appendChild(tableHeader);
    
    return table;
}

/**
 * Creates a table row containing some info about the given episode.
 * @param {Object} episode The JSON object of the given episode.
 * @returns The table row containing the info.
 */
function getTableRow(episode) {
    let tableRow = document.createElement('tr');
    
    let en = document.createElement('td');
    en.innerHTML = episode['title'];
    tableRow.appendChild(en);
    
    let enmbr = document.createElement('td');
    enmbr.innerHTML = episode['episode_id'];
    tableRow.appendChild(enmbr);
    
    let rlsdt = document.createElement('td');
    rlsdt.innerHTML = episode['release_date'];
    tableRow.appendChild(rlsdt);
    
    let strs = document.createElement('td');
    tableRow.appendChild(strs);

    let viewButton = document.createElement('button');
    viewButton.innerHTML = 'View Starships';
    viewButton.onclick = () => {
        viewStarships(episode);
    };
    strs.appendChild(viewButton);
    
    return tableRow;
}

/**
 * Lists the series episodes inside the main page table.
 */
function listEpisodes() {
    titleTab('Star Wars Episodes');
    
    let table = getTableHeader();
    
    for (let i = 0; i < 6; ++i) {
        let tableRow = getTableRow(episodes[i])

        table.appendChild(tableRow);
    }
    clearTab(tab);
    tab.appendChild(table);
}

/**
 * Loads the main page with the seires episodes.
 */
async function loadMainPage() {
    document.querySelector('.tab').innerHTML = 'Loading...';
    await fetchEpisodes();
    listEpisodes();
}

// The global variables and DOM elements.
let picture_id = 0;
let episodes = [];
let starships = [];
let globalPageView = 0;
let tab = document.querySelector('.tab');
let tabTitle = document.querySelector('#tab-title');
let prevDiv = document.createElement('div');
let prevBtn = document.createElement('button');
let listDiv = document.createElement('div');
let listTable = document.createElement('table');
let infoDiv = document.createElement('div');
let nextDiv = document.createElement('div');
let nextBtn = document.createElement('button');
let backButton = document.querySelector('#back-button');

setup();

loadMainPage();