import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export default function CountriesPage() {
  const [countries, setCountries] = useState<any>([]);
  const [filteredcountries, setFilteredCountries] = useState<any>([]);
  const [selected, setSelected] = useState<any>();
  const fetchCountries = () => {
    try {
      fetch("https://restcountries.com/v3.1/all")
        .then((value) => {
          return value.json();
        })
        .then((value) => {
          setCountries(value);
          setFilteredCountries(value);
        });
    } catch (e) {
      console.log(e);
    }
  };
  console.log(countries);
  useEffect(() => {
    fetchCountries();
  }, []);

  const getCurrencies = (currencies: any, country: any) => {
    if (currencies) {
      const currenciesData = Object.keys(country?.currencies);
      return currenciesData.map(
        (e, i) =>
          `${country?.currencies[e]?.name} (${country?.currencies[e]?.symbol})${
            i !== currenciesData?.length - 1 ? ", " : ""
          }`
      );
    }
  };
  const filter = (string: string) => {
    if (string === "") {
      setFilteredCountries(countries);
      return;
    }
    setFilteredCountries(
      countries?.filter((e: any) => e?.name?.common?.toLowerCase().includes(string.toLowerCase()))
    );
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl mb-6 font-bold">Country Lists</h1>
      <input
        type="text"
        className="neo-box w-full p-3 mb-8 focus-visible:outline-none"
        placeholder="Search Country by Name"
        onChange={(e) => filter(e?.target?.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 transition-all lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {filteredcountries?.map((country: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              country?.name?.common !== selected?.name?.common &&
                setSelected(country);
            }}
            className={`neo-box p-3 ${
              country?.name?.common === selected?.name?.common
                ? ""
                : "hover:bg-gray-200 cursor-pointer "
            } transition-all rounded-lg relative ${
              country?.name?.common === selected?.name?.common
                ? "col2-row2"
                : ""
            }`}
          >
            {country?.name?.common === selected?.name?.common && (
              <button
                onClick={() => {
                  setSelected(null);
                }}
                className="absolute top-0 end-0 translate-x-[35%] translate-y-[-35%] z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="m480-432 118 117q9 10 23 10.5t25-11.007q11-10.508 11-23.747T646-364L528-480l118-118q9-9 10-23t-10-25q-11.411-11-24.5-11T598-646L480-528 363-646q-10-9-23.5-10T316-646q-12 11.411-12 24.5t12 23.5l116 118-117 117q-10 10-10.5 23.5t11.007 23.5q10.508 12 23.747 12T364-316l116-116Zm.138 373Q393-59 316-91.5t-134.5-90Q124-239 91.5-315.862t-32.5-164Q59-567 91.5-644t89.843-134.553q57.343-57.552 134.278-90.5Q392.557-902 479.779-902q87.221 0 164.339 32.87 77.119 32.87 134.596 90.29 57.478 57.42 90.382 134.46T902-480q0 87.276-32.947 164.26-32.948 76.983-90.5 134.362Q721-124 644.138-91.5t-164 32.5Z" />
                </svg>
              </button>
            )}
            <div
              className={`${
                country?.name?.common === selected?.name?.common
                  ? "flex gap-12 relative z-10"
                  : ""
              }`}
            >
              <div className={`h-full`}>
                <div
                  className={`flex gap-4 mb-2 items-start ${
                    country?.name?.common === selected?.name?.common
                      ? ""
                      : "h-full"
                  }`}
                >
                  <img src={country?.flags?.svg} width={72} alt="" />
                  <div>
                    <h1 className="text-lg font-medium">
                      {country?.name?.common}
                    </h1>
                    <div className="text-gray-500 text-[.7rem] font-light">
                      {country?.region}
                    </div>
                  </div>
                </div>
                {country?.name?.common === selected?.name?.common && (
                  <div>
                    {/* <img src={country?.coatOfArms?.png} width={36} alt="" /> */}

                    <div className="mb-1">
                      <span className="font-semibold">Capital :</span>{" "}
                      {country?.capital?.map((e: any) => e)}
                    </div>

                    <div className="mb-1">
                      <span className="font-semibold">Population :</span>{" "}
                      {country?.population}
                    </div>

                    <div className="mb-1">
                      <span className="font-semibold">Currency :</span>
                      {getCurrencies(country?.currencies, country)}
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold">Continent :</span>
                      {country?.continents?.map((e: any) => e)}
                    </div>
                  </div>
                )}
              </div>
              {country?.name?.common === selected?.name?.common && (
                <>
                  <MapContainer
                    center={country?.capitalInfo?.latlng}
                    zoom={10}
                    style={{ height: "200px", width: "400px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <MapRef />
                  </MapContainer>
                </>
              )}
            </div>
          </div>
        ))}
        {filteredcountries.length===0 && 'No Countries Found'}
      </div>
    </div>
  );
}

function MapRef() {
  const map = useMap();
  map.invalidateSize();
  return null;
}
