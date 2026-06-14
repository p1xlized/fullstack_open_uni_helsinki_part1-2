import { useState, useEffect } from "react";
import axios from "axios";
import CountryDisplay from "./components/Display";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  // coutnries fetch
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredCountries([]);
      return;
    }

    const matches = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCountries(matches);
  }, [search, countries]);

  const handleSearchChange = (event) => setSearch(event.target.value);

  const handleShowCountry = (countryName) => {
    setSearch(countryName);
  };

  const renderResults = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredCountries.map((country) => (
            <li key={country.cca3} style={{ margin: "5px 0" }}>
              {country.name.common}{" "}
              <button onClick={() => handleShowCountry(country.name.common)}>
                show
              </button>
            </li>
          ))}
        </ul>
      );
    }

    if (filteredCountries.length === 1) {
      return <CountryDisplay country={filteredCountries[0]} />;
    }

    if (search && filteredCountries.length === 0) {
      return <p>No matches found</p>;
    }

    return null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div>
        find countries:{" "}
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder="Type country name..."
        />
      </div>
      <div style={{ marginTop: "20px" }}>{renderResults()}</div>
    </div>
  );
};

export default App;
