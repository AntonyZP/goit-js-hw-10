import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
let searchingCountry = null;
const { inputCountry, countryList, countryInfoCard } = {
  inputCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoCard: document.querySelector('.country-info'),
};

inputCountry.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  searchingCountry = e.target.value.trim();
  if (searchingCountry.length < 1) {
    clearPage();
    return;
  }
  fetchCountries(searchingCountry).then(data => {
    if (!data) {
      return;
    } else if (data.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      clearPage();
    } else if (data.length > 1) {
      makeCountriesList();
      makeMarkupForCountriesList(data);
    } else if (data.length === 1) {
      makeCountryCard();
      makeMarkupForCountryCard(data);
    }
  });
}

function makeMarkupForCountriesList(arr) {
  const markup = arr
    .map(
      ({ name, flags }) => `<li class="country">
  <img class="country-flag" src="${flags.svg}" alt="${name.official}" width="70"/>
  <p class="country-name">${name.official}</p></li>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function makeMarkupForCountryCard(arr) {
  const markup = arr.map(
    ({ name, flags, capital, languages, population }) =>
      `<div class="card-title">
  <img class="country-flag-card" src="${flags.svg}" alt="${
        name.official
      }" width="70" />
  <p class="country-name-card">${name.official}</p>
</div>
<p class="info"><span class="info-title">Capital: </span>${capital}</p>
<p class="info"><span class="info-title">Population: </span>${population}</p>
<p class="info"><span class="info-title">Languages: </span>${Object.values(
        languages
      ).join(', ')}</p>`
  );

  countryInfoCard.innerHTML = markup;
}

function makeCountriesList() {
  countryInfoCard.innerHTML = '';
  countryInfoCard.classList.remove('card-style');
  countryList.classList.add('card-style');
}

function makeCountryCard() {
  countryList.innerHTML = '';
  countryList.classList.remove('card-style');
  countryInfoCard.classList.add('card-style');
}

export const clearPage = function () {
  countryList.innerHTML = '';
  countryInfoCard.innerHTML = '';
  countryList.classList.remove('card-style');
  countryInfoCard.classList.remove('card-style');
};
