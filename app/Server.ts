import express, { Express } from "express";
import session from "express-session";
import path from "path";
import https from "https";
import fs from "fs";
import passport from "passport";
import "dotenv/config";
import apiRouter from "./api";
import "./Auth";
import { getVisibleOnMapPlayers } from "./Database";

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

export class Server {
  private app: Express;

  constructor(app: Express) {
    this.app = app;

    this.app.use(
      session({
        secret: process.env.EXPRESS_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // api router
    this.app.use("/api", apiRouter);

    this.app.use("/map/tiles/players.json", async (req, res) => {
      const playersPath = process.env.MINECRAFT_SQUAREMAP_PATH + "/tiles/players.json";
      const rowData = fs.readFileSync(playersPath, "utf-8");

      if (rowData.includes("[]")) {
        const data = JSON.parse(
          rowData //.replace("max", '"max"').replace("players", '"players"')
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
        visiblePlayers.push(
          req.session["passport"].user.minecraftUUID.replaceAll("-", "")
        );
      }

      data["players"] = data["players"].filter((p) => visiblePlayers.includes(p.uuid));

      return res.json(data);
    });

    this.app.use("/map", express.static(process.env.MINECRAFT_SQUAREMAP_PATH));

    this.app.get("/auth/discord", passport.authenticate("discord"));

    app.get(
      "/auth/discord/callback",
      passport.authenticate("discord", {
        failureRedirect: "/map?error=true",
      }),
      function (req, res) {
        res.redirect("/map"); // Successful auth
      }
    );

    // expose static assets
    this.app.use(express.static(path.resolve("./") + "/build/frontend"));

    // redirect everything else to the react router
    this.app.get("*", (req, res): void => {
      res.sendFile(path.resolve("./") + "/build/frontend/index.html");
    });
  }

  public start(port: number): void {
    // setup the ssl certificate
    try {
      var key = fs.readFileSync(path.resolve("./") + "/sslcert/server.key");
      var cert = fs.readFileSync(path.resolve("./") + "/sslcert/server.crt");
      var options = {
        key: key,
        cert: cert,
      };
      var server = https.createServer(options, this.app);
      server.listen(443, () => console.log(`Server listening on port 443!`));
    } catch (e) {
      console.warn("Running without SSL certificate!");
      this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
  }
}
