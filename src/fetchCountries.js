function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(response =>
    response.json()
  );
}

export default { fetchCountries };
