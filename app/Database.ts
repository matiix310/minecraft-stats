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

export { getCountries, getUsers, getActiveUsers, getAdvancements };
