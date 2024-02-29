import { useContext, useEffect } from "react";
import styles from "./index.module.css";
import { Advancement, FormatedAdvancement, getAdvancements } from "../../../db";
import moment from "moment";
import advancementsDbJSON from "../../../assets/advancements.json";
import { DbContext } from "../../..";

type AdvancementsProps = {
  uuid: string;
};

const advancementsDb: {
  [key: string]: {
    [key: string]: {
      name: string;
      description: string;
      frame: string;
      x: number;
      y: number;
    };
  };
} = advancementsDbJSON;

const Advancements = ({ uuid }: AdvancementsProps) => {
  const { advancements, setAdvancements } = useContext(DbContext);

  useEffect(() => {
    if (!advancements[uuid]) {
      getAdvancements(uuid).then((rowAdvancements: Advancement[]) => {
        if (rowAdvancements.length === 0) {
          setAdvancements({
            ...advancements,
            [uuid]: [],
          });
        } else {
          for (let i = 0; i < rowAdvancements.length; i++) {
            const rowAdvancement = rowAdvancements[i];

            const [title, subtitle] = rowAdvancement.id.split(":");

            const formattedAdvancement: FormatedAdvancement = {
              ...advancementsDb[title][subtitle],
              date: rowAdvancement.date,
              id: rowAdvancement.id,
            };
            setAdvancements({
              ...advancements,
              [uuid]: [...(advancements[uuid] ?? []), formattedAdvancement],
            });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  return (
    <div className={styles.advancementsContainer}>
      {advancements[uuid] &&
        advancements[uuid].map((advancement) => {
          const date = moment.unix(advancement.date);
          const day = date.format("DD / MM");
          const year = date.format("YYYY");
          return (
            <div className={styles.advancementContainer}>
              <div className={styles.nameContainer}>
                <h1 className={[styles.name, "bold"].join(" ")}>{advancement.name}</h1>
                <h1 className={styles.description}>{advancement.description}</h1>
              </div>
              <div className={styles.frame}>
                <img
                  alt="adv-frame"
                  src={"/" + advancement.frame}
                  decoding="async"
                  loading="lazy"
                  width="100%"
                  height="100%"
                  style={{ imageRendering: "pixelated" }}
                ></img>
                <span
                  className={styles.frameIcon}
                  style={{
                    backgroundImage: "url(/InvSprite.png)",
                    backgroundPosition: `${advancement.x}px ${advancement.y}px`,
                  }}
                ></span>
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

export default Advancements;
