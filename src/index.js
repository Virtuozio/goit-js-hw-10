import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput() {
  const value = searchBox.value.trim();
  clearAll();
  fetchCountries(value)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 4000,
            position: 'center-top',
            width: '400px',
          }
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        const list = countries.reduce(
          (markup, country) => createCountriesList(country) + markup,
          ''
        );
        updateCountriesList(list);
      } else {
        const card = countries.reduce(
          (markup, country) => createCountryCard(country) + markup,
          ''
        );
        updateCountryCard(card);
      }
    })
    .catch(onError);
}

function createCountriesList({ name, flags }) {
  return `<li>
  <span> <img src="${flags.svg}" width="30px" height="20px"></span>
  <span>${name}</span>
  </li>`;
}

function createCountryCard({ name, capital, population, flags, languages }) {
  const languageList = languages.map(language => language.name);
  return `<div style="display: flex; align-items: center;">  <img src="${
    flags.svg
  }" width="30px" height="20px">
  <h2 style="margin-left: 10px;">${name}</h2></div>
  <ul style = "list-style: none; padding: 0">
  <li><b style="margin-right: 5px;">Capital:</b>${capital}</li>
  <li><b style="margin-right: 5px;">Population:</b>${population}</li>
  <li><b style="margin-right: 5px;">Languages:</b>${Object.values(
    languageList
  ).join(', ')}
</li>
  </ul>`;
}

function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function updateCountriesList(markup) {
  countryList.innerHTML = markup;
}

function updateCountryCard(markup) {
  countryInfo.innerHTML = markup;
}

function onError() {
  Notify.failure('Oops, there is no country with that name', {
    timeout: 2000,
    position: 'center-top',
    width: '400px',
  });
}
