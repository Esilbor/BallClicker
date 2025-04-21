import Fastify, { FastifyInstance } from 'fastify';
import { createPlayer, recordClick, getPlayerClicks, getAllPlayers, saveScore, getLeaderboard } from './db';
import { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from 'ws';

// Type augmentation for Fastify
declare module 'fastify' {
    interface RouteOptions {
        wsHandler?: (connection: { socket: any }, request: FastifyRequest) => void | Promise<void>;
    }
}

const fastify = Fastify({
    logger: true
});

// Register WebSocket plugin
void fastify.register(require('@fastify/websocket'));

interface WebSocketClient {
    socket: WebSocket;
    player: {
        id: number;
        nickname: string;
        color: string;
    };
}

// Connected clients store
const clients = new Map<WebSocket, WebSocketClient>();

// Broadcast to all connected clients
const broadcast = (message: unknown) => {
    for (const client of clients.values()) {
        client.socket.send(JSON.stringify(message));
    }
};

// WebSocket connection handler
fastify.register(async function (fastify: FastifyInstance) {
    fastify.route({
        method: 'GET',
        url: '/ws',
        handler: () => {}, // Required but unused in WebSocket mode
        wsHandler: async (connection: { socket: any }, request: FastifyRequest) => {
            const { socket } = connection;

            socket.on('message', async (messageRaw: Buffer | string) => {
                try {
                    const message = messageRaw.toString();
                    const data = JSON.parse(message) as { type: string; nickname?: string; color?: string };
                    
                    switch (data.type) {
                        case 'join':
                            if (!data.nickname || !data.color) {
                                throw new Error('Missing nickname or color');
                            }
                            const player = await createPlayer(data.nickname, data.color);
                            if (!player.id) {
                                throw new Error('Player ID not generated');
                            }
                            clients.set(socket as WebSocket, { 
                                socket: socket as WebSocket, 
                                player: {
                                    id: player.id,
                                    nickname: player.nickname,
                                    color: player.color
                                }
                            });
                            broadcast({
                                type: 'player_joined',
                                player
                            });
                            break;
                            
                        case 'click':
                            const client = clients.get(socket as WebSocket);
                            if (client) {
                                await recordClick(client.player.id);
                                broadcast({
                                    type: 'ball_clicked',
                                    color: client.player.color,
                                    player: client.player
                                });
                            }
                            break;
                    }
                } catch (err) {
                    fastify.log.error(err);
                }
            });

            socket.on('close', () => {
                const client = clients.get(socket as WebSocket);
                if (client) {
                    clients.delete(socket as WebSocket);
                    broadcast({
                        type: 'player_left',
                        player: client.player
                    });
                }
            });
        }
    });
});

// REST endpoints
fastify.get('/api/players', async (request: FastifyRequest, reply: FastifyReply) => {
    const players = await getAllPlayers();
    return { players };
});

fastify.get('/api/clicks/:playerId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { playerId } = request.params as { playerId: string };
    const clicks = await getPlayerClicks(parseInt(playerId));
    return { clicks };
});

// POST /api/score
fastify.post('/api/score', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, score } = request.body as { username: string; score: number };

    if (!username || typeof score !== 'number') {
        return reply.code(400).send({ error: 'Invalid input' });
    }

    try {
        await saveScore(username, score);
        return { message: 'Score saved ✅' };
    } catch (err: any) {
        console.error('💥 DB error:', err.message);
        return reply.code(500).send({ error: 'Failed to save score' });
    }
});

// GET /api/leaderboard
fastify.get('/api/leaderboard', async (_: FastifyRequest, reply: FastifyReply) => {
    try {
        const scores = await getLeaderboard();
        return { scores };
    } catch (err) {
        return reply.code(500).send({ error: 'Failed to fetch leaderboard' });
    }
});

// Health check endpoint
fastify.get('/', async () => {
    return { status: 'Backend Ball Clicker is running 🚀' };
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: 5000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
