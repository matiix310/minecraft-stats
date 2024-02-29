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
      const fetchData = async () => {
        let res: null | Response = null;
        try {
          res = await fetch(bodyEndpoint + playerName + endpointParams);
        } catch (error) {
          console.error(error);
          console.log(
            `Can't load body for player ${playerName}, fallback to steve body.`
          );
        }

        if (!res || res.status !== 200) {
          res = await fetch("/X-Steve-Full.webp");
        }
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setPlayersFullSkin({ ...playersFullSkin, [playerName]: imageObjectURL });
      };

      fetchData();
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
