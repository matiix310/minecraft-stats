import "./ConnectedPlayers.css";
import { useContext } from "react";

import fullHeart from "@/assets/full_heart.png";
import halfHeart from "@/assets/half_heart.png";
import emptyHeart from "@/assets/empty_heart.png";
import { DbContext } from "../../..";

const ConnectedPlayers = () => {
  const players = useContext(DbContext).connectedPlayersData;

  return (
    <>
      {players &&
        players.map((player) => {
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
              <div className="hearts">
                {getHearts(player.name, Math.ceil(Math.min(player.hearts, 20)))}
              </div>
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

  for (let i = 0; i < Math.floor((20 - heartCount) / 2); i++)
    list.push(<img key={player_name + "_" + i} alt="full heart" src={emptyHeart}></img>);

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

  s = "0".repeat(6 - s.length) + s;

  return "#" + s;
};

export default ConnectedPlayers;