import express from "express";
const router = express.Router();

import { getActiveUsers, getCountries, getUsers } from "../Database";

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("[" + Date().toString().split(" (")[0] + "] " + req.url);
  next();
});

router.get("/", (req, res) => {
  res.json({
    routes: ["/teams", "/users"],
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
  const apiRes = (await fetch(
    "http://" + process.env.MINECRAFT_HOST + ":" + process.env.MINECRAFT_API_PORT + "/api"
  ).then((res) => res.json())) as {
    onlinePlayers: { name: string; health: number }[];
  };

  res.json(apiRes.onlinePlayers);
});

export default router;
