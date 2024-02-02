import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Advancement, getAdvancements } from "../../../db";
import moment from "moment";
import advancementsDbJSON from "../../../assets/advancements.json";

type AdvancementsProps = {
  uuid: string;
};

type FormatedAdvancement = {
  id: string;
  date: number;
  name: string;
  description: string;
  frame: string;
  x: number;
  y: number;
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
  const [advancements, setAdvancements] = useState<FormatedAdvancement[]>([]);

  useEffect(() => {
    getAdvancements(uuid).then((rowAdvancements: Advancement[]) => {
      for (let i = 0; i < rowAdvancements.length; i++) {
        const rowAdvancement = rowAdvancements[i];

        const [title, subtitle] = rowAdvancement.id.split(":");

        const formattedAdvancement: FormatedAdvancement = {
          ...advancementsDb[title][subtitle],
          date: rowAdvancement.date,
          id: rowAdvancement.id,
        };
        setAdvancements((old) => [...old, formattedAdvancement]);
      }
    });
  }, [uuid]);

  return (
    <div className={styles.advancementsContainer}>
      {advancements.map((advancement) => {
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
