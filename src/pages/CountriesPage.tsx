import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export default function CountriesPage() {
  const [countries, setCountries] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [filteredcountries, setFilteredCountries] = useState<any>([]);
  const [selected, setSelected] = useState<any>();
  const fetchCountries = () => {
    setLoading(true);
    try {
      fetch("https://restcountries.com/v3.1/all")
        .then((value) => {
          return value.json();
        })
        .then((value) => {
          setCountries(value);
          setFilteredCountries(value);
        });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
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
      countries?.filter((e: any) =>
        e?.name?.common?.toLowerCase().includes(string.toLowerCase())
      )
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

        {loading && (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {filteredcountries.length === 0 && !loading && "No Countries Found"}
      </div>
    </div>
  );
}

function MapRef() {
  const map = useMap();
  map.invalidateSize();
  return null;
}
