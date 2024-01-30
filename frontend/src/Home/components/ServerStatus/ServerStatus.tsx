import { useContext, useEffect } from "react";
import "./ServerStatus.css";
import { DbContext } from "../../..";
const mcs = require("node-mcstatus");

const ServerStatus = () => {
  const serverIp = "play.matiix310.dev";

  const { serverQueryData, setServerQueryData } = useContext(DbContext);

  useEffect(() => {
    if (!serverQueryData.fetched)
      mcs
        .statusJava(serverIp, 25565, { query: true })
        .then((result: any) => {
          setServerQueryData({
            online: true,
            icon: result.icon,
            motd: result.motd.html.replaceAll("\n", "<br/>"),
            fetched: true,
          });
        })
        .catch((error: any) => {
          setServerQueryData({
            online: false,
            icon: "",
            motd: "The server is currently offline.",
            fetched: true,
          });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="statusContainer">
      <img src={serverQueryData?.icon} alt="" />
      <div className="rightStatusContainer">
        <div className="labelsContainer">
          <h1>{serverIp}</h1>
          {serverQueryData.online ? (
            <h1 className="statusOnline">
              <span></span>Online
            </h1>
          ) : (
            <h1 className="statusOffline">
              <span></span>Offline
            </h1>
          )}
        </div>
        <div
          className="serverMotd"
          dangerouslySetInnerHTML={{ __html: serverQueryData.motd }}
        />
      </div>
    </div>
  );
};

export default ServerStatus;
