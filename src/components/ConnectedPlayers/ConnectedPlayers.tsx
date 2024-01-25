import "./ConnectedPlayers.css";
import { useEffect, useState } from "react";
import {
  ConnectedPlayersData,
  CountryData,
  PlayerData,
  getConnectedPlayers,
} from "../../db";

const fullHeart = require("../../assets/full_heart.png");
const halfHeart = require("../../assets/half_heart.png");

type ConnectedPlayersParam = {
  countriesData: CountryData[];
  playersData: PlayerData[];
};

const ConnectedPlayers = ({ countriesData, playersData }: ConnectedPlayersParam) => {
  const [players, setPlayers] = useState<ConnectedPlayersData>([]);

  useEffect(() => {
    getConnectedPlayers(countriesData, playersData).then((data) => setPlayers(data));
  }, [players, countriesData, playersData]);

  return (
    <>
      {players.map((player) => {
        return (
          <div key={player.name} className="playerTabContainer">
            <div className="playerNameContainer">
              {player.countryDisplayName && (
                <h1 className="bold" style={{ color: intToHex(player.color!) }}>
                  [{player.countryDisplayName}]
                </h1>
              )}
              <h1>{player.name}</h1>
            </div>
            <div className="hearts">{getHearts(player.name, player.hearts)}</div>
          </div>
        );
      })}
    </>
  );
};

const getHearts = (player_name: string, heartCount: number) => {
  const list = [];

  for (let i = 0; i < Math.floor(heartCount / 2); i++)
    list.push(<img key={player_name + "_" + i} alt="full heart" src={fullHeart}></img>);

  if (heartCount % 2 === 1)
    list.push(<img key={player_name + "_half"} alt="healf heart" src={halfHeart}></img>);

  return list;
};

const hexTable = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

const intToHex = (color: number): string => {
  let s = "";

  while (color !== 0) {
    s = hexTable[color % 16] + s;
    color = Math.floor(color / 16);
  }

  for (let i = 0; i < 6 - s.length; i++) {
    s = "0" + s;
  }

  return "#" + s;
};

export default ConnectedPlayers;
