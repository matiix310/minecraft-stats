import { Express } from "express";
import express from "express";
import path from "path";
import apiRouter from "./api";

export class Server {
  private app: Express;

  constructor(app: Express) {
    this.app = app;

    this.app.use("/api", apiRouter);

    this.app.use(express.static(path.resolve("./") + "/build/frontend"));

    // this.app.get("*", (req: Request, res: Response): void => {
    //   res.sendFile(path.resolve("./") + "/build/frontend/index.html");
    // });
  }

  public start(port: number): void {
    this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
  }
}
