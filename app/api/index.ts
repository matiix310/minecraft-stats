import express from "express";
const router = express.Router();

import { getTeams, getUsers } from "../Database";

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", (req, res) => {
  res.json({
    routes: ["/teams", "/users"],
  });
});

router.get("/teams", async (req, res) => {
  const teamsData = await getTeams();
  res.json(teamsData);
});

router.get("/users", async (req, res) => {
  const usersData = await getUsers();
  res.json(usersData);
});

export default router;
