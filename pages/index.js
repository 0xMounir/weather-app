import { useState, useEffect } from "react";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { Search } from "../components/Search";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import styles from "../styles/Home.module.css";
import config from "../config/settings.json";

export const App = () => {
  const [latitudeInput, setLatitudeInput] = useState(config.defaultLatitude);
  const [longitudeInput, setLongitudeInput] = useState(config.defaultLongitude);
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [weatherData, setWeatherData] = useState();
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitudeInput, longitudeInput }),
      });
      const data = await res.json();
      setWeatherData({ ...data });
      setLatitudeInput("");
      setLongitudeInput("");
    };
    getData();
  }, [triggerFetch, latitudeInput, longitudeInput]);

  const changeSystem = () =>
    unitSystem === "metric"
      ? setUnitSystem("imperial")
      : setUnitSystem("metric");

  return weatherData && !weatherData.error ? (
    <div className={styles.wrapper}>
      <MainCard
        city={weatherData.name}
        country={weatherData.sys.country}
        description={weatherData.weather[0].description}
        iconName={weatherData.weather[0].icon}
        unitSystem={unitSystem}
        weatherData={weatherData}
      />
      <ContentBox>
        <Header>
          <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
          <Search
            placeHolder="Enter Latitude..."
            value={latitudeInput}
            onFocus={(e) => {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={(e) => setLatitudeInput(e.target.value)}
            onKeyDown={(e) => {
              e.keyCode === 13 && setTriggerFetch(!triggerFetch);
              e.target.placeholder = "Enter Latitude...";
            }}
          />
          <Search
            placeHolder="Enter Longitude..."
            value={longitudeInput}
            onFocus={(e) => {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={(e) => setLongitudeInput(e.target.value)}
            onKeyDown={(e) => {
              e.keyCode === 13 && setTriggerFetch(!triggerFetch);
              e.target.placeholder = "Enter Longitude...";
            }}
          />
        </Header>
        <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
        <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
      </ContentBox>
    </div>
  ) : weatherData && weatherData.message ? (
    <ErrorScreen errorMessage="Data not found, try again!">
      <Search
        onFocus={(e) => (e.target.value = "")}
        onChange={(e) =>
          setLatitudeInput(e.target.value) && setLongitudeInput(e.target.value)
        }
        onKeyDown={(e) => e.keyCode === 13 && setTriggerFetch(!triggerFetch)}
      />
    </ErrorScreen>
  ) : (
    <LoadingScreen loadingMessage="Loading data..." />
  );
};

export default App;
