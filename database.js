const DBSOURCE = "db.sqlite";
const sqlite3 = require("sqlite3");

class DB {
  constructor() {
    this.database = new sqlite3.Database(DBSOURCE, err => {
      if (err) {
        console.error(err.message);
        throw err;
      } else {
        console.log("Connected to the SQLite database.");
      }
    });

    this.database.run(
      `CREATE TABLE event (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location text, 
                date text
                )`,
      err => {
        if (err) {
          console.error(err);
        } else {
          const insert = "INSERT INTO event (location, date) VALUES (?,?)";
          this.database.run(insert, ["Barcelona", "2019-07-08"]);
          this.database.run(insert, ["Madrid", "2019-07-09"]);
        }
      }
    );
  }

  getAll(date, location, order, max) {
    let sql = `SELECT * from event`;
    const params = [];
    if (date || location) {
      sql += " WHERE ";

      if (date && isDate(date)) {
        sql += "date=?";
        params.push(new Date(date).toISOString().substring(0, 10));
      }
      if (location) {
        sql += `${date && " AND"} location LIKE ?`;
        params.push(`%${location}%`);
      }
    }

    if (order === "location" || order === "date") {
      sql += "ORDER BY ? ASC";
      params.push(order);
    }

    if (max) {
      sql += " LIMIT ?";
      params.push(max);
    }

    return new Promise((resolve, reject) => {
      this.database.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  getById(id) {
    const sql = "SELECT * from event WHERE ID = ?";

    return new Promise((resolve, reject) => {
      this.database.get(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  add(event) {
    const sql = "INSERT INTO event (location, date) VALUES (?,?)";
    let date = isDate(event.date) ? new Date(event.date) : new Date();

    return new Promise((resolve, reject) => {
      this.database.run(
        sql,
        [event.location, date.toISOString().substring(0, 10)],
        function(err, _) {
          if (err) {
            reject(err);
          }
          resolve({
            data: {
              ...event,
              id: this.lastID
            }
          });
        }
      );
    });
  }

  update(event) {
    const sql =
      "UPDATE event SET location = COALESCE(?,location), date = COALESCE(?,date) WHERE id = ?";

    return new Promise((resolve, reject) => {
      this.database.run(sql, [event.location, event.date, event.id], function(
        err,
        _
      ) {
        if (err) {
          reject(err);
        }
        resolve({
          data: event
        });
      });
    });
  }

  delete(id) {
    const sql = "DELETE FROM event WHERE id = ?";

    return new Promise((resolve, reject) => {
      this.database.run(sql, id, function(err, _) {
        this;
        if (err) {
          reject(err);
        }
        resolve({
          changes: this.changes
        });
      });
    });
  }
}

function isDate(date) {
  return (
    Boolean(date) && new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
  );
}

module.exports = DB;
