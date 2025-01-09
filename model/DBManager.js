// DB MANAGER

import * as SQLite from "expo-sqlite";

export default class DBManager {
  constructor() {
    this.db = null;
    this.openDB();
  }

  async openDB() {
    try {
      this.db = await SQLite.openDatabaseAsync("appDB");
      const query = `CREATE TABLE IF NOT EXISTS MenuImages (
                  mid INTEGER PRIMARY KEY,
                  imageVersion INTEGER,
                  image TEXT
                );`;
      await this.db.execAsync(query);
    } catch (error) {
      console.warn("Error in openDB: ", error);
    }
  }

  async insertMenuImage(mid, imageVersion, image) {
    try {
      const query = `
                INSERT OR REPLACE INTO MenuImages (mid, imageVersion, image) 
                VALUES (?, ?, ?);
            `;
      await this.db.runAsync(query, [mid, imageVersion, image]);
    } catch (error) {
      console.warn("Error in insertMenuImage: ", error);
    }
  }

  async getImageByImageVersion(mid, imageVersion) {
    try {
      const query = `SELECT image FROM MenuImages WHERE mid = ? AND imageVersion = ?;`;
      const result = await this.db.getFirstAsync(query, [mid, imageVersion]);

      if (result && result.image) {
        return result.image;
      }
      return null;
    } catch (error) {
      console.warn("Error in getImageVersion: ", error);
      return null;
    }
  }
}
