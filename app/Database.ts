// Get the client
import mysql from "mysql2/promise";

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "minecraft",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const getUsers = async () => {
  try {
    const [result] = await pool.query("SELECT * FROM users");
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getCountries = async () => {
  try {
    const [result] = await pool.query("SELECT * FROM teams");
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getActiveUsers = async (dates: string[]) => {
  const query =
    "SELECT * FROM active_users WHERE " + dates.map((d) => "date=?").join(" OR ");
  try {
    const [result] = await pool.execute(query, dates);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAdvancements = async (uuid: string) => {
  const query = "SELECT * FROM advancements WHERE uuid=?";
  try {
    const [result] = await pool.execute(query, [uuid]);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getMinecraftUUID = async (discordUUID: String): Promise<String | null> => {
  const query = "SELECT minecraft_uuid FROM discord WHERE discord_uuid=?";
  try {
    const [result] = await pool.execute(query, [discordUUID]);
    const content = result as String[];

    if (content.length == 0) return null;
    return content[0]["minecraft_uuid"];
  } catch (error) {
    console.error(error);
  }
};

const getVisibleOnMapPlayers = async (): Promise<String[]> => {
  const query = "SELECT uuid FROM users WHERE visible_on_map=1";
  try {
    const [result] = await pool.execute(query);
    const content = result as String[];

    return content.map((c) => c["uuid"]);
  } catch (error) {
    console.error(error);
  }
};

const changeVisibleOnMap = async (
  minecraftUUID: String,
  visibleOnMap: String
): Promise<Boolean> => {
  const query = "UPDATE users SET visible_on_map=? WHERE uuid=?;";
  try {
    const _ = await pool.execute(query, [visibleOnMap, minecraftUUID]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export {
  getCountries,
  getUsers,
  getActiveUsers,
  getAdvancements,
  getMinecraftUUID,
  getVisibleOnMapPlayers,
  changeVisibleOnMap,
};
