import { useEffect, useState } from "react";

type PlayerBodyProps = {
  playerName: string;
};

const PlayerBody = ({ playerName }: PlayerBodyProps) => {
  const [playerBody, setPlayerBody] = useState<string>();

  const bodyEndpoint = "https://visage.surgeplay.com/full/832/";
  const endpointParams = "?y=-40";

  useEffect(() => {
    fetch(bodyEndpoint + playerName + endpointParams).then(async (res) => {
      if (res.status !== 200) {
        res = await fetch("/X-Steve-Full.webp");
      }
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setPlayerBody(imageObjectURL);
    });
  }, [playerName]);

  return (
    <>
      <div className="playerContainer">
        <h1 className="player-tag">{playerName}</h1>
        {playerBody ? <img src={playerBody} alt={playerName} /> : <h1>Loading...</h1>}
      </div>
    </>
  );
};

export default PlayerBody;
