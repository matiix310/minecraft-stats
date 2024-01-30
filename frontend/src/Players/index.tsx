import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import PlayerBody from "./components/PlayerBody";

const Player = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="Player">
      <div className="bentoContainerPlayer">
        <div className="bento">
          <img
            onClick={(_) => navigate("/")}
            className="dashboard-logo"
            src="/minecraft-stats.png"
            alt="Dashboard"
          />
        </div>
        <div className="bento"></div>
        <div className="bento">
          <h1 className="title">Statistics</h1>
        </div>
        <div className="bento">
          <h1 className="title">Advancements</h1>
        </div>
        <div className="bento">
          <PlayerBody playerName={params.playerName ?? "NoName"} />
        </div>
      </div>
    </div>
  );
};

export default Player;
