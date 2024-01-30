import { useContext, useEffect, useRef } from "react";
import "./Members.css";
import { useNavigate } from "react-router-dom";
import { DbContext } from "../../..";

const Members = () => {
  const headEndpoint = "https://visage.surgeplay.com/head/256/";

  const selectorRef = useRef<HTMLSpanElement>(null);
  const { playersData, playersHead, setPlayersHead } = useContext(DbContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (playersData && playersHead.length === 0)
      playersData.forEach(async (player) => {
        let res;
        try {
          res = await fetch(headEndpoint + player.name);
        } catch (error) {
          console.error(error);
          console.log(
            `Can't load head for player ${player.name}, fallback to steve head.`
          );
        }
        if (!res || res.status !== 200) {
          res = await fetch("/X-Steve-Head.webp");
        }
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setPlayersHead((d) => [...d, { playerName: player.name, image: imageObjectURL }]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playersData]);

  const handleHover = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!selectorRef.current) return;

    const img = e.target as HTMLImageElement;

    selectorRef.current.innerText = img.alt;
    selectorRef.current.style.display = "unset";
    selectorRef.current.style.left =
      img.offsetLeft +
      (img.width - selectorRef.current.clientWidth) / 2 -
      (img.parentElement?.scrollLeft ?? 0) +
      "px";
    selectorRef.current.style.top =
      img.offsetTop - selectorRef.current.clientHeight + "px";
  };

  const handleLeave = () => {
    if (!selectorRef.current) return;

    selectorRef.current.style.display = "none";
  };

  if (!playersData) {
    return <></>;
  }

  return (
    <div className="headsContainer">
      {playersHead.map(({ playerName, image }) => (
        <img
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          key={playerName}
          src={image}
          alt={playerName}
          onClick={(_) => navigate("/players/" + playerName)}
        ></img>
      ))}
      {missingPlayers(playersData.length - playersHead.length)}
      <span className="headSelector" ref={selectorRef}></span>
    </div>
  );
};

const missingPlayers = (count: number) => {
  const missingPlayer = [];
  for (let i = 0; i < count; i++) {
    missingPlayer.push(<span className="loadingPlayer" key={"missingPlayer" + i}></span>);
  }
  return missingPlayer;
};

export default Members;
