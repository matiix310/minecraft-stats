import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Achievement, getAchievements } from "../../../db";
import moment from "moment";

type AchievementsProps = {
  username: string;
};

const Achievements = ({ username }: AchievementsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    getAchievements(username).then(setAchievements);
  }, [username]);

  return (
    <div className={styles.achievementsContainer}>
      {achievements.map((achievement) => {
        const date = moment.unix(achievement.date);
        const day = date.format("DD / MM");
        const year = date.format("YYYY");
        return (
          <div className={styles.achievementContainer}>
            <div className={styles.nameContainer}>
              <h1 className={styles.name}>{achievement.name}</h1>
            </div>
            <div className={styles.dateContainer}>
              <h1 className={["bold", styles.date].join(" ")}>
                {day}
                <br />
                {year}
              </h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Achievements;
