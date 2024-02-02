import express from "express";
const router = express.Router();

import { getActiveUsers, getAdvancements, getCountries, getUsers } from "../Database";

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

router.get("/statistics", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    res.json([]);
    return;
  }

  // const apiRes = (await fetch(
  //   "http://" +
  //     process.env.MINECRAFT_HOST +
  //     ":" +
  //     process.env.MINECRAFT_API_PORT +
  //     "/api/statistics/" +
  //     username
  // ).then((res) => res.json())) as {
  //   statistics: {
  //     name: string;
  //     value: number;
  //     rank: number;
  //   }[];
  // };

  const statistics: {
    name: string;
    value: number;
    rank: number;
  }[] = [
    {
      name: "Block mined",
      value: 42,
      rank: 5,
    },
    {
      name: "Block mined",
      value: 10000,
      rank: 2,
    },
    {
      name: "Block mined",
      value: 999999,
      rank: 1,
    },
    {
      name: "Block mined",
      value: 5000,
      rank: 3,
    },
  ];

  res.json(statistics);
});

router.get("/advancements", async (req, res) => {
  const uuid = req.query.uuid;

  if (!uuid || uuid.length != 36) {
    res.json([]);
    return;
  }

  const advancements = await getAdvancements(uuid.toString());
  res.json(advancements);
});

export default router;
