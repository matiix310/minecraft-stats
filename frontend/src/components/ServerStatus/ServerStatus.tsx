import { useEffect, useState } from "react";
import "./ServerStatus.css";
const mcs = require("node-mcstatus");

const ServerStatus = () => {
  const serverIp = "play.matiix310.dev";

  const [online, setOnline] = useState(false);
  const [serverIcon, setServerIcon] = useState<string>("");
  const [motd, setMotd] = useState("Pinging... Please wait.");

  useEffect(() => {
    mcs
      .statusJava(serverIp, 25565, { query: true })
      .then((result: any) => {
        setOnline(true);
        setServerIcon(result.icon);
        setMotd(result.motd.html);
      })
      .catch((error: any) => {
        setOnline(false);
        setServerIcon("");
        setMotd("The server is currently offline.");
      });
  }, []);

  return (
    <div className="statusContainer">
      <img src={serverIcon} alt="" />
      <div className="rightStatusContainer">
        <div className="labelsContainer">
          <h1>{serverIp}</h1>
          {online ? (
            <h1 className="statusOnline">
              <span></span>Online
            </h1>
          ) : (
            <h1 className="statusOffline">
              <span></span>Offline
            </h1>
          )}
        </div>
        <div className="serverMotd" dangerouslySetInnerHTML={{ __html: motd }} />
      </div>
    </div>
  );
};

export default ServerStatus;
