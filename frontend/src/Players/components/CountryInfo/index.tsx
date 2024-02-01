import { useContext, useEffect } from "react";
import styles from "./index.module.css";
import { DbContext } from "../../..";
import { getCountries } from "../../../db";
import { getColorFromInt } from "../../../utils/color";

type CountryInfoProps = {
  username: string;
};

const CountryInfo = ({ username }: CountryInfoProps) => {
  const { playersData, countriesData } = useContext(DbContext);

  if (!playersData || !countriesData) return <></>;

  const player = playersData.find((player) => player.name === username);

  if (!player) return <></>;

  const country = countriesData.find(
    (country) => country.countryCode === player.countryCode
  );

  const countryName = country ? country.displayName : "No country";

  return (
    <div className={styles.container}>
      <h1>
        <span
          className="bold"
          style={{ color: country ? getColorFromInt(country.color) : "" }}
        >
          {countryName}
        </span>
        {country && <span className="bold"> / {player.role}</span>}
      </h1>
    </div>
  );
};

export default CountryInfo;
