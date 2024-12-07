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
            console.log("Error in openDB: ", error);
        }
    }

    async insertMenuImage(mid, imageVersion, image) {
        try {
            const query = `INSERT INTO MenuImages (mid, imageVersion, image) VALUES (?, ?, ?);`;
            await this.db.execAsync(query, [mid, imageVersion, image]);
        } catch (error) {
            console.log("Error in insertMenuImage: ", error);
        }
    }

    async getImageByImageVersion(mid, imageVersion) {
        try {
            const query = `SELECT image FROM MenuImages WHERE mid = ? AND imageVersion = ?;`;
            await this.db.execAsync(query, [mid, imageVersion]);
        } catch (error) {
            console.log("Error in getImageVersion: ", error);
        }
    }
}