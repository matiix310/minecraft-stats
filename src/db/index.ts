type ActivePlayersData = {
  day: string;
  value: number;
}[];

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
      day: "02/02",
      value: 10,
    },
  ];
};

export type { ActivePlayersData };
export { getActivePlayers };
