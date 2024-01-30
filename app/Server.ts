import { Express } from "express";
import express from "express";
import path from "path";
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
    this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
  }
}
