type ConnectedPlayerData = {
  name: string;
  hearts: number;
  countryDisplayName: string | undefined;
  color: number | undefined;
};

type PlayerData = {
  name: string;
  countryCode: string;
  role: string;
  playtime: number;
  uuid: string;
};

type CountryData = {
  countryCode: string;
  displayName: string;
  color: number;
};

type ActivePlayersData = {
  date: string;
  playerCount: number;
};

type RowStatistics = {
  [stat: string]: {
    [subStat: string]: {
      value: number;
      rank: number;
    };
  };
};

type Statistics = {
  [stat: string]: {
    name: string;
    value: number;
    rank: number;
  }[];
};

type Advancement = {
  uuid: string;
  id: string;
  date: number;
};

type FormatedAdvancement = {
  id: string;
  date: number;
  name: string;
  description: string;
  frame: string;
  x: number;
  y: number;
};

const getConnectedPlayers = async (
  countries: CountryData[],
  players: PlayerData[]
): Promise<ConnectedPlayerData[]> => {
  const apiRes: { name: string; health: number }[] = await fetch(
    "/api/onlinePlayers"
  ).then((res) => res.json());

  return apiRes.map((data) => {
    const country = getCountryWithUsername(data.name, countries, players);
    return {
      name: data.name,
      hearts: data.health,
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
      playtime: player.playtime,
      uuid: player.uuid,
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

const getActivePlayers = async (days: number): Promise<ActivePlayersData[]> => {
  const dates = [];

  let cDate = Date.now();
  let date = new Date(cDate);

  for (let i = 0; i < days; i++) {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();

    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;

    const formattedDate = `${day}/${month}/${year}`;
    dates.push(formattedDate);

    cDate -= 86400000;
    date = new Date(cDate);
  }

  const res = await fetch(
    "/api/activeUsers?dates=" + dates.join("-").replaceAll("/", ".")
  ).then((res) => res.json());

  const activeUsersTemp: ActivePlayersData[] = res.map((day: any) => {
    return {
      date: day.date,
      playerCount: day.player_count,
    };
  });

  const activeUsers: ActivePlayersData[] = [];

  for (let date of dates) {
    // search for the date
    let dateIndex = 0;
    while (dateIndex < activeUsersTemp.length && activeUsersTemp[dateIndex].date !== date)
      dateIndex += 1;

    if (dateIndex === activeUsersTemp.length) {
      activeUsers.push({
        date: date,
        playerCount: 0,
      });
    } else {
      activeUsers.push(activeUsersTemp[dateIndex]);
    }
  }

  activeUsers.reverse();

  return activeUsers;
};

const getStatistics = async (uuid: string): Promise<Statistics> => {
  const rowStatistics: RowStatistics = await fetch("/api/statistics?uuid=" + uuid).then(
    (res) => res.json()
  );

  const statistics: Statistics = {};

  for (let stat in rowStatistics) {
    statistics[stat] = Object.keys(rowStatistics[stat])
      .map((subStat) => {
        return {
          name: subStat,
          rank: rowStatistics[stat][subStat].rank,
          value: rowStatistics[stat][subStat].value,
        };
      })
      .sort((a, b) => a.rank - b.rank);
  }

  return statistics;
};

const getAdvancements = async (uuid: string): Promise<Advancement[]> => {
  const advancements: Advancement[] = await fetch("/api/advancements?uuid=" + uuid).then(
    (res) => res.json()
  );

  advancements.sort((a, b) => b.date - a.date);
  return advancements;
};

export type {
  ActivePlayersData,
  ConnectedPlayerData,
  PlayerData,
  CountryData,
  Statistics,
  Advancement,
  FormatedAdvancement,
};

export {
  getActivePlayers,
  getConnectedPlayers,
  getPlayers,
  getCountries,
  getStatistics,
  getAdvancements,
};
