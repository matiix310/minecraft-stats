import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

import {
  changeVisibleOnMap,
  getActiveUsers,
  getCountries,
  getUsers,
  getVisibleOnMapPlayers,
} from "../Database";
import moment from "moment";

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("[" + Date().toString().split(" (")[0] + "] " + req.url);
  next();
});

router.get("/", (req, res) => {
  res.json({
    routes: ["/teams", "/users", "/activeUsers", "statistics"],
  });
});

router.get("/countries", async (req, res) => {
  const countriesData = await getCountries();
  res.json(countriesData);
});

router.get("/users", async (req, res) => {
  const usersData = await getUsers();
  res.json(usersData);
});

router.get("/activeUsers", async (req, res) => {
  const datesQuery = req.query.dates;

  if (!datesQuery) {
    res.json([]);
    return;
  }

  const activeUsers = await getActiveUsers(
    (datesQuery as string).replaceAll(".", "/").split("-")
  );

  res.json(activeUsers);
});

router.get("/onlinePlayers", async (req, res) => {
  try {
    const apiRes = (await fetch(
      "http://" +
        process.env.MINECRAFT_HOST +
        ":" +
        process.env.MINECRAFT_API_PORT +
        "/api"
    ).then((res) => res.json())) as {
      onlinePlayers: { name: string; health: number }[];
    };
    res.json(apiRes.onlinePlayers);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

router.get("/players", async (req, res) => {
  const playersPath = process.env.MINECRAFT_SQUAREMAP_PATH + "/tiles/players.json";
  const rowData = fs.readFileSync(playersPath, "utf-8");

  if (rowData.includes("[]")) {
    const data = JSON.parse(
      rowData.replace("max", '"max"').replace("players", '"players"')
    );
    return res.json(data);
  }

  const data = JSON.parse(rowData);

  const visiblePlayers = (await getVisibleOnMapPlayers()).map((uuid) =>
    uuid.replaceAll("-", "")
  );

  if (
    req.session["passport"] &&
    req.session["passport"].user.minecraftUUID &&
    !visiblePlayers.includes(req.session["passport"].user.minecraftUUID)
  ) {
    visiblePlayers.push(req.session["passport"].user.minecraftUUID.replaceAll("-", ""));
  }

  data["players"] = data["players"].filter((p) => visiblePlayers.includes(p.uuid));

  return res.json(data);
});

router.get("/statistics", async (req, res) => {
  const uuid = req.query.uuid;

  const statsPath = process.env.MINECRAFT_WORLD_PATH + "stats/";
  const playerStatsPath = statsPath + uuid + ".json";
  const ranksPath = path.resolve("./") + "/build/app/api/players-rank.json";

  if (!uuid || uuid.length != 36 || !fs.existsSync(playerStatsPath)) {
    res.json([]);
    console.log(!fs.existsSync(playerStatsPath));
    return;
  }

  type Ranks = {
    [stat: string]: { [subStat: string]: { uuids: string[]; lastUpdate: number } };
  };
  type Statistics = { [stat: string]: { [subStat: string]: number } };
  type StatisticsWithRank = {
    [stat: string]: { [subStat: string]: { value: number; rank: number } };
  };

  const playerStats: {
    stats: Statistics;
    DataVersion: number;
  } = JSON.parse(fs.readFileSync(playerStatsPath, "utf-8"));

  const othersStats: Map<string, Statistics> = new Map();

  for (let file of fs.readdirSync(statsPath)) {
    const playerStatsPath = statsPath + file;
    const playerUUID = file.substring(0, 36);
    othersStats.set(
      playerUUID,
      JSON.parse(fs.readFileSync(playerStatsPath, "utf-8")).stats
    );
  }

  const ranks: Ranks = JSON.parse(fs.readFileSync(ranksPath, "utf-8"));

  const playerStatsWithRank: StatisticsWithRank = {};
  let edited = false;

  for (let stat in playerStats.stats) {
    playerStatsWithRank[stat] = {};
    for (let subStat in playerStats.stats[stat]) {
      if (playerStats.stats[stat][subStat] === 0) continue;
      if (
        !ranks[stat] ||
        !ranks[stat][subStat] ||
        !ranks[stat][subStat].uuids.includes(uuid.toString()) ||
        ranks[stat][subStat].lastUpdate - Date.now() / 1000 > 3600 // 1h
      ) {
        // refresh the rank
        edited = true;
        const statRanks = Array.from(othersStats.keys())
          .filter(
            (uuid) => othersStats.get(uuid)[stat] && othersStats.get(uuid)[stat][subStat]
          )
          .sort(
            (a, b) =>
              othersStats.get(b)[stat][subStat] - othersStats.get(a)[stat][subStat]
          );
        // statRanks.push(
        //   ...Array.from(othersStats.keys()).filter(
        //     (uuid) =>
        //       !othersStats.get(uuid)[stat] || !othersStats.get(uuid)[stat][subStat]
        //   )
        // );
        if (!ranks[stat]) ranks[stat] = {};

        ranks[stat][subStat] = {
          lastUpdate: Date.now(),
          uuids: statRanks,
        };
      }

      playerStatsWithRank[stat][subStat] = {
        value: playerStats.stats[stat][subStat],
        rank: ranks[stat][subStat].uuids.indexOf(uuid.toString()) + 1,
      };
    }
  }

  if (edited) {
    fs.writeFileSync(ranksPath, JSON.stringify(ranks));
  }

  res.json(playerStatsWithRank);
});

router.get("/advancements", async (req, res) => {
  const uuid = req.query.uuid;
  const advancementsPath = process.env.MINECRAFT_WORLD_PATH + "advancements/";
  const playerAdvancementsPath = advancementsPath + uuid + ".json";

  if (!uuid || uuid.length != 36 || !fs.existsSync(playerAdvancementsPath)) {
    res.json([]);
    return;
  }

  type Advancement = {
    criteria: {
      [advName: string]: string;
    };
    done: boolean;
  };

  const playerAdvancementsRow = JSON.parse(
    fs.readFileSync(playerAdvancementsPath, "utf-8")
  );

  delete playerAdvancementsRow.DataVersion;

  const playerAdvancements: {
    [key: `minecraft:${string}`]: Advancement;
  } = playerAdvancementsRow;

  const advancements = Object.entries(playerAdvancements)
    .filter(([key, value]) => !key.startsWith("minecraft:recipes") && value.done)
    .map(([key, value]) => ({
      id: key,
      date: moment(
        Object.entries(value.criteria).sort((a, b) =>
          moment(a[1]).isAfter(moment(b[1])) ? 1 : -1
        )[0][1]
      ).unix(),
    }));

  res.json(advancements);
});

router.get("/checkLogin", async (req, res) => {
  return res.json({
    login:
      req.session["passport"] != undefined &&
      req.session["passport"]["user"] != undefined &&
      req.session["passport"]["user"]["minecraftUUID"] != null,
  });
});

router.get("/isVisibleOnMap", async (req, res) => {
  const error =
    req.session["passport"] == undefined ||
    req.session["passport"]["user"] == undefined ||
    req.session["passport"]["user"]["minecraftUUID"] == null;

  const visibleOnMap = error
    ? null
    : (await getVisibleOnMapPlayers()).includes(
        req.session["passport"]["user"]["minecraftUUID"]
      );

  return res.json({
    error,
    visibleOnMap,
  });
});

router.get("/changeVisibleOnMap", async (req, res) => {
  const visibleOnMap = req.query.visibleOnMap;

  if (
    req.session["passport"] == undefined ||
    req.session["passport"]["user"] == undefined ||
    req.session["passport"]["user"]["minecraftUUID"] == null ||
    visibleOnMap == undefined ||
    (visibleOnMap != "1" && visibleOnMap != "0")
  )
    return res.json({ error: true });

  const minecraftUUID = req.session["passport"]["user"]["minecraftUUID"];

  const done = await changeVisibleOnMap(minecraftUUID, visibleOnMap);

  return res.json({
    error: !done,
  });
});

export default router;
