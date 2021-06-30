// dom objects 

const pokeListItems = document.querySelectorAll('.list-item');
const backButton = document.querySelector('#back-btn');
const nextButton = document.querySelector('#next-btn');

const pokemonDexNumber = document.querySelector('#dex-number');
const pokemonName = document.querySelector('#pokemon-name');
const pokemonSelectedTypeOne = document.querySelector('#pokemon-type-one');
const pokemonSelectedTypeTwo = document.querySelector('#pokemon-type-two');
const pokemonImageFront = document.querySelector('#poke-image-front');
const pokemonImageFrontShine = document.querySelector('#poke-image-front-shine');
const pokemonImageback = document.querySelector('#poke-image-back');
const pokemonImageBackShine = document.querySelector('#poke-image-back-shine');

const statHp = document.querySelector('#stat-hp');
const statAttack = document.querySelector('#stat-attack');
const statDefense = document.querySelector('#stat-defense');
const statSpecialAttack = document.querySelector('#stat-special-attack');
const statSpecialDefense = document.querySelector('#stat-special-defense');
const statSpeed = document.querySelector('#stat-speed');

const hpColorBar = document.querySelector('.hp-color-bar');
const attackColorBar = document.querySelector('.attack-color-bar');
const defenseColorBar = document.querySelector('.defense-color-bar');
const specialAttackColorBar = document.querySelector('.special-attack-color-bar');
const specialDefenceColorBar = document.querySelector('.special-defense-color-bar');
const speedColorBar = document.querySelector('.speed-color-bar');

const pokemonWeight = document.querySelector('#pokemon-weight');
const pokemonHeight = document.querySelector('#pokemon-height');

// variables 

let prevUrl = null;
let nextUrl = null;
let statVal = 0;

const typeColor = {
    bug: '#9cb820',
    dragon: '#7038f8',
    fairy: '#f09ad9',
    fire: '#f08030',
    ghost: '#705898',
    ground: '#e0b668',
    normal: '#a8a8a8',
    psychic: '#eb2d77',
    steel: '#6d8f9c',
    dark: '#504843',
    electric: '#c09643',
    fighting: '#c03028',
    flying: '#9096f0',
    grass: '#22c02a',
    ice: '#98d8d8',
    poison: '#a040a0',
    rock: '#b8a038',
    water: '#6890f0'
};

// helper functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const statBarColor = (width) => {
    let color = '';
    const barColor = 20;
    if (width <= barColor) {
        color = '#de4141'
    } else if (width > barColor && width <= barColor * 2) {
        color = '#f59700'
    } else if (width > barColor * 2 && width <= barColor * 3) {
        color = '#f5c400'
    } else if (width > barColor * 3 && width <= barColor * 4) {
        color = '#5a9c39'
    }
    return color;
}

const setStat = (statValue, statElement, statBar) => {
    statElement.textContent = statValue;
    statBar.style.width = `${(statValue/255)*100}%`;
    statBar.style.backgroundColor = statBarColor(statValue / 255 * 100);
}


// left pannel data fetch 

const fetchPokeList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = id + '. ' + capitalize(name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
        });
};

// right panel data fetch 

const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        // .then(res => res.json())
        .then((res) => {
            if (!res.ok) {
                alert("No data found.");
                throw new Error("No data found.");
            } else {
                return res.json();
            }
        })
        .then(data => {
            // number
            pokemonDexNumber.textContent = '#' + data['id'].toString().padStart(3, '0');
            // name
            pokemonName.textContent = capitalize(data['name']);
            // types
            const dataTypes = data['types'];
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            let typeString = '';
            typeString = capitalize(dataFirstType['type']['name']);
            pokemonSelectedTypeOne.textContent = typeString;
            pokemonSelectedTypeOne.style.color = typeColor[typeString.toLowerCase()];

            if (dataSecondType) {
                typeString = `${capitalize(dataSecondType['type']['name'])}`;
                pokemonSelectedTypeTwo.textContent = typeString;
                pokemonSelectedTypeTwo.style.color = typeColor[typeString.toLowerCase()];
            }
            // images
            pokemonImageFront.src = data['sprites']['front_default'] || '';
            pokemonImageFrontShine.src = data['sprites']['front_shiny'] || '';
            pokemonImageback.src = data['sprites']['back_default'] || '';
            pokemonImageBackShine.src = data['sprites']['back_shiny'] || '';

            // base stats
            statVal = 0;
            statVal = data.stats[0].base_stat;
            setStat(statVal, statHp, hpColorBar);

            statVal = 0;
            statVal = data.stats[1].base_stat;
            setStat(statVal, statAttack, attackColorBar);

            statVal = 0;
            statVal = data.stats[2].base_stat;
            setStat(statVal, statDefense, defenseColorBar);

            statVal = 0;
            statVal = data.stats[3].base_stat;
            setStat(statVal, statSpecialAttack, specialAttackColorBar);

            statVal = 0;
            statVal = data.stats[4].base_stat;
            setStat(statVal, statSpecialDefense, specialDefenceColorBar);

            statVal = 0;
            statVal = data.stats[5].base_stat;
            setStat(statVal, statSpeed, speedColorBar);

            // weight and height
            pokemonWeight.textContent = data['weight'] + 'kg';
            pokemonHeight.textContent = data['height'] + 'm';
        });
};

// event listener funcations

const handleBackButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleNextButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return;
    const listItem = e.target;
    if (!listItem.textContent) return;
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
};

const search = () => {
    // console.log(document.querySelector('#search-field').value.toLowerCase());
    fetchPokeData(document.querySelector('#search-field').value.toLowerCase());
    document.querySelector('#search-field').value = '';
}


// adding event listeners for elements 

backButton.addEventListener('click', handleBackButtonClick);
nextButton.addEventListener('click', handleNextButtonClick);
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}
document.querySelector("#search-field").addEventListener("keyup",
    function(event) {
        if (event.key == "Enter") {
            search();
        }
    }
);

// initial fetches

fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
fetchPokeData(100);