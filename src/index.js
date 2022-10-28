import './css/styles.css';
import API from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const DEBOUNCE_DELAY = 300;
const searchForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchForm.addEventListener(
  'input',
  debounce(onInputSearchForm, DEBOUNCE_DELAY)
);

function onInputSearchForm() {
  let searchingCountry = searchForm.value.trim();

  if (searchingCountry) {
    API.fetchCountries(searchingCountry)
      .then(renderListOfCountries)
      .catch(onSearchError);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function renderListOfCountries(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  if (countries.length === 1) {
    renderCountry(countries[0]);

    countryList.innerHTML = '';
    return;
  }

  countryInfo.innerHTML = '';

  const markup = countries
    .map(
      country => `<li class='country-list__item'>
      <img class='flag' src="${country.flags.png}" alt="${country.name.common} flag">
        <span>${country.name.common}</span>
      </li>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function renderCountry(country) {
  const languages = country.languages;

  countryInfo.innerHTML = `<img class='flag' src="${country.flags.png}" alt="${
    country.name.common
  } flag">
  <span class='country-info__name'>${country.name.common}</span>
  <div>Capital: <span class='country-info__fact'>${
    country.capital[0]
  }</span></div>
  <div>Population: <span class='country-info__fact'>${
    country.population
  }</span></div>
  <div>Languages: <span class='country-info__fact'>${Object.values(
    languages
  ).join(', ')}</span></div>`;
}

function onSearchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  countryList.innerHTML = '';
}
