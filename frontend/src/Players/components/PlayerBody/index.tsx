import { useContext, useEffect } from "react";
import { DbContext } from "../../..";

type PlayerBodyProps = {
  playerName: string;
};

const PlayerBody = ({ playerName }: PlayerBodyProps) => {
  const { playersFullSkin, setPlayersFullSkin } = useContext(DbContext);

  const bodyEndpoint = "https://visage.surgeplay.com/full/832/";
  const endpointParams = "?y=-40";

  useEffect(() => {
    if (!playersFullSkin[playerName]) {
      fetch(bodyEndpoint + playerName + endpointParams).then(async (res) => {
        if (res.status !== 200) {
          res = await fetch("/X-Steve-Full.webp");
        }
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setPlayersFullSkin({ ...playersFullSkin, [playerName]: imageObjectURL });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName]);

  return (
    <>
      <div className="playerContainer">
        <h1 className="player-tag">{playerName}</h1>
        {playersFullSkin[playerName] ? (
          <img src={playersFullSkin[playerName]} alt={playerName} />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default PlayerBody;
