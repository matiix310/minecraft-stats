import express, { Express } from "express";
import path from "path";
import https from "https";
import fs from "fs";
import "dotenv/config";
import apiRouter from "./api";

export class Server {
  private app: Express;

  constructor(app: Express) {
    this.app = app;

    // api router
    this.app.use("/api", apiRouter);

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
      server.listen(443, () => console.log(`Server listening on port ${port}!`));
    } catch (e) {
      console.warn("Running without SSL certificate!");
      this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
  }
}
