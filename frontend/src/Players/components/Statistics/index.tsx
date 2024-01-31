import { useEffect, useState } from "react";
import { Statistic, getStatistics } from "../../../db";

// styles
import styles from "./index.module.css";

type StatisticsProps = {
  username: string;
};

const Statistics = ({ username }: StatisticsProps) => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  useEffect(() => {
    getStatistics(username).then(setStatistics);
  }, [username]);

  return (
    <div className={styles.statsContainer}>
      {statistics.map((stat) => (
        <div key={stat.name} className={styles.statContainer}>
          <h1 className="bold" style={getStyle(stat.rank)}>
            #{stat.rank}
          </h1>
          <div className={styles.subStatContainer}>
            <h1>{stat.name}</h1>
            <h1 className="bold">{stat.value}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStyle = (rank: number): React.CSSProperties => {
  switch (rank) {
    case 1:
      return {
        color: "#ffde5a",
        textShadow: "#FC0 1px 0 10px",
      };
    case 2:
      return {
        color: "#cecece",
        textShadow: "#a7a7a7 1px 0 10px",
      };
    case 3:
      return {
        color: "#cb7000",
        textShadow: "#f79d2e 1px 0 10px",
      };
    default:
      return {};
  }
};

export default Statistics;
