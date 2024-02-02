import { useContext, useEffect, useState } from "react";
import { getStatistics } from "../../../db";

// styles
import styles from "./index.module.css";
import { DbContext } from "../../..";

type StatisticsProps = {
  uuid: string;
};

const Statistics = ({ uuid }: StatisticsProps) => {
  const { statistics, setStatistics } = useContext(DbContext);
  const [visibilityList, setVisibilityList] = useState<boolean[]>();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!statistics[uuid]) {
      getStatistics(uuid).then((stats) => {
        setVisibilityList(Object.keys(stats).map((_) => false));
        setStatistics({ ...statistics, [uuid]: stats });
      });
    } else {
      setVisibilityList(Object.keys(statistics[uuid]).map((_) => false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!statistics[uuid]) return;

    const search = e.target.value;

    if (search === "") setVisibilityList(Object.keys(statistics[uuid]).map((_) => false));
    else setVisibilityList(Object.keys(statistics[uuid]).map((_) => true));

    setSearch(search);
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.searchInputContainer}>
        <input
          className={styles.searchInput}
          type="text"
          name="search"
          placeholder="Need something?"
          onChange={handleSearchChange}
        />
      </div>
      <div className={styles.statsSubContainer}>
        {statistics[uuid] &&
          visibilityList &&
          Object.keys(statistics[uuid])
            .sort()
            .map((statParent, i) => {
              const stats = statistics[uuid][statParent];
              return (
                <>
                  <div
                    key={statParent}
                    className={styles.parentStatContainer}
                    onClick={(_) =>
                      setVisibilityList((old) => old!.map((v, j) => (i === j ? !v : v)))
                    }
                  >
                    <span style={visibilityList[i] ? { transform: "rotate(90deg)" } : {}}>
                      {">"}
                    </span>
                    <div className={styles.parentSubStatContainer}>
                      <h1 className="bold">
                        {statParent.split(":")[1].replaceAll("_", " ")}
                      </h1>
                    </div>
                  </div>
                  {visibilityList[i] &&
                    stats
                      .filter(
                        (stat) =>
                          search.length === 0 ||
                          (statParent.split(":")[1] + stat.name.split(":")[1])
                            .toLowerCase()
                            .replaceAll("_", " ")
                            .replaceAll(" ", "")
                            .includes(search.replaceAll(" ", "").toLowerCase())
                      )
                      .map((stat) => (
                        <div key={stat.name} className={styles.statContainer}>
                          <h1 className="bold" style={getStyle(stat.rank)}>
                            #{stat.rank}
                          </h1>
                          <div className={styles.subStatContainer}>
                            <h1>{stat.name.split(":")[1].replaceAll("_", " ")}</h1>
                            <h1 className="bold">{stat.value}</h1>
                          </div>
                        </div>
                      ))}
                </>
              );
            })}
      </div>
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
