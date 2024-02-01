import "./ConnectedPlayers.css";
import { useContext } from "react";

import fullHeart from "@/assets/full_heart.png";
import halfHeart from "@/assets/half_heart.png";
import emptyHeart from "@/assets/empty_heart.png";
import { DbContext } from "../../..";
import { getColorFromInt } from "../../../utils/color";

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
                  <h1 className="bold" style={{ color: getColorFromInt(player.color!) }}>
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

export default ConnectedPlayers;
