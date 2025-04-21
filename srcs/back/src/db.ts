import sqlite3 from 'sqlite3';
import { join } from 'path';

const db = new sqlite3.Database(join(__dirname, '../data/database.sqlite3'));

interface Player {
    id?: number;
    nickname: string;
    color: string;
}

interface Score {
    username: string;
    score: number;
    timestamp: string;
}

// Custom promisified functions
const runQuery = (query: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            resolve(this);
        });
    });
};

const getOne = (query: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

const getAll = (query: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

export const createPlayer = async (nickname: string, color: string): Promise<Player> => {
    const result = await runQuery(
        'INSERT INTO players (nickname, color) VALUES (?, ?)',
        [nickname, color]
    );
    return {
        id: result.lastID,
        nickname,
        color
    };
};

export const recordClick = async (playerId: number): Promise<void> => {
    await runQuery('INSERT INTO clicks (player_id) VALUES (?)', [playerId]);
};

export const getPlayerClicks = async (playerId: number): Promise<number> => {
    const result = await getOne(
        'SELECT COUNT(*) as count FROM clicks WHERE player_id = ?',
        [playerId]
    ) as { count: number };
    return result.count;
};

export const getAllPlayers = async (): Promise<Player[]> => {
    return await getAll('SELECT * FROM players');
};

export const saveScore = async (username: string, score: number): Promise<void> => {
    await runQuery(
        'INSERT INTO scores (username, score, timestamp) VALUES (?, ?, datetime("now"))',
        [username, score]
    );
};

export const getLeaderboard = async (): Promise<Score[]> => {
    return await getAll(
        'SELECT username, score, timestamp FROM scores ORDER BY score DESC LIMIT 10'
    );
};