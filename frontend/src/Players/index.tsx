import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import PlayerBody from "./components/PlayerBody";
import Statistics from "./components/Statistics";
import Advancements from "./components/Advancements";
import CountryInfo from "./components/CountryInfo";

const Player = () => {
  const params = useParams();
  const navigate = useNavigate();

  const username = params.playerName;
  if (!username) {
    navigate("/");
    return <h1>Redirecting... Please wait</h1>;
  }

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
        <div className="bento">
          <CountryInfo username={username} />
        </div>
        <div className="bento">
          <h1 className="title">Statistics</h1>
          <Statistics username={username} />
        </div>
        <div className="bento">
          <h1 className="title">Achievements</h1>
          <Advancements username={username} />
        </div>
        <div className="bento">
          <PlayerBody playerName={username} />
        </div>
      </div>
    </div>
  );
};

export default Player;
