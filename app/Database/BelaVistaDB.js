"use strict";

const Database = use("Database");

class BelaVistaDB {
  getConnection() {
    return Database.connection("belavista");
  }
}

module.exports = BelaVistaDB;
