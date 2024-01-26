type ActivePlayersData = {
  day: string;
  value: number;
}[];

type ConnectedPlayersData = {
  name: string;
  hearts: number;
  countryDisplayName: string | undefined;
  color: number | undefined;
}[];

type PlayerData = {
  name: string;
  countryCode: string;
  role: string;
  playtime: number;
};

type CountryData = {
  countryCode: string;
  displayName: string;
  color: number;
};

const getActivePlayers = async (): Promise<ActivePlayersData> => {
  return [
    {
      day: "01/02",
      value: 15,
    },
    {
      day: "02/02",
      value: 10,
    },
    {
      day: "03/02",
      value: 10,
    },
    {
      day: "04/02",
      value: 2,
    },
    {
      day: "05/02",
      value: 12,
    },
    {
      day: "06/02",
      value: 13,
    },
  ];
};

const getConnectedPlayers = async (
  countries: CountryData[],
  players: PlayerData[]
): Promise<ConnectedPlayersData> => {
  // TODO replace tempData with an actual server query
  const tempData: { name: string; hearts: number }[] = [
    { name: "Matiix310", hearts: 20 },
    { name: "Martb31", hearts: 15 },
    { name: "Ag3nt_Ohm", hearts: 18 },
    { name: "Flavien", hearts: 3 },
    { name: "Jean-midu31Xx", hearts: 1 },
  ];

  return tempData.map((data) => {
    const country = getCountryWithUsername(data.name, countries, players);
    return {
      name: data.name,
      hearts: data.hearts,
      countryDisplayName: country?.displayName,
      color: country?.color,
    };
  });
};

const getPlayers = async () => {
  const res = await fetch("/api/users").then((res) => res.json());

  const players: PlayerData[] = res.map((player: any) => {
    return {
      name: player.username,
      countryCode: player.country_code,
      role: player.role,
      playtime: 1,
    };
  });

  return players;
};

const getCountryWithUsername = (
  username: string,
  countries: CountryData[],
  players: PlayerData[]
): CountryData | undefined => {
  let countryCode: PlayerData["countryCode"] | undefined;

  for (let player of players) {
    if (player.name === username) {
      countryCode = player.countryCode;
      break;
    }
  }

  if (!countryCode) return;

  for (let country of countries) {
    if (country.countryCode === countryCode) return country;
  }
};

const getCountries = async () => {
  const res = await fetch("/api/countries").then((res) => res.json());

  const countries: CountryData[] = res.map((country: any) => {
    return {
      countryCode: country.country_code,
      displayName: country.display_name,
      color: country.color,
    };
  });

  return countries;
};

export type { ActivePlayersData, ConnectedPlayersData, PlayerData, CountryData };

export { getActivePlayers, getConnectedPlayers, getPlayers, getCountries };
