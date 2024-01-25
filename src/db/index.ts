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

const getPlayers = async (): Promise<PlayerData[]> => {
  return [
    {
      name: "Matiix310",
      countryCode: "fin",
      role: "leader",
      playtime: 5,
    },
    {
      name: "Martb31",
      countryCode: "fin",
      role: "member",
      playtime: 3,
    },
    {
      name: "Flavien",
      countryCode: "",
      role: "",
      playtime: 0.5,
    },
    {
      name: "Ag3nt_Ohm",
      countryCode: "fin",
      role: "member",
      playtime: 1,
    },
  ];
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

const getCountries = async (): Promise<CountryData[]> => {
  await sleep(1000);

  return [
    {
      countryCode: "fin",
      displayName: "Finlande",
      color: 255,
    },
  ];
};

export type { ActivePlayersData, ConnectedPlayersData, PlayerData, CountryData };

export { getActivePlayers, getConnectedPlayers, getPlayers, getCountries };

// Test functions

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
