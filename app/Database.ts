// Get the client
import mysql from "mysql2/promise";

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: "localhost",
  user: "web",
  password: "web",
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

const getTeams = async () => {
  try {
    const [result] = await pool.query("SELECT * FROM teams");
    return result;
  } catch (error) {
    console.error(error);
  }
};

export { getTeams, getUsers };
