import { useEffect, useRef, useState } from "react";
import { PlayerData } from "../../db";
import "./Members.css";

type MembersProp = {
  playersData: PlayerData[];
};

const Members = ({ playersData }: MembersProp) => {
  const headEndpoint = "https://visage.surgeplay.com/head/256/";

  const selectorRef = useRef<HTMLSpanElement>(null);
  const [players, setPlayers] = useState<{ name: string; img: string }[]>([]);

  useEffect(() => {
    playersData.forEach((player) => {
      fetch(headEndpoint + player.name).then(async (res) => {
        if (res.status !== 200) {
          res = await fetch("/X-Steve.webp");
        }
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setPlayers((p) => [...p, { name: player.name, img: imageObjectURL }]);
      });
    });
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

  return (
    <div className="headsContainer">
      {players.map((player) => (
        <img
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          key={player.name}
          src={player.img}
          alt={player.name}
        ></img>
      ))}
      {missingPlayers(playersData.length - players.length)}
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
