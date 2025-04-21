import { GameScene } from './babylon';
import { GameWebSocket } from './services/websocket';
import '../style.css';

class Game {
    private gameScene!: GameScene;
    private ws: GameWebSocket;
    private playerColor: string = '#ffffff';
    private players: Map<number, { nickname: string, color: string, clicks: number }> = new Map();

    constructor() {
        this.ws = new GameWebSocket();
        this.setupUI();
        
        // Setup WebSocket event handlers
        this.ws.on('ball_clicked', (data) => {
            const currentBallColor = data.color;
            // Only update score if the ball wasn't already this player's color
            if (data.player && currentBallColor !== data.player.color) {
                this.updatePlayerScore(data.player.id);
            }
            this.gameScene.setColor(data.color);
        });
        
        this.ws.on('player_joined', (data) => {
            this.addPlayer(data.player);
        });

        this.ws.on('player_left', (data) => {
            this.removePlayer(data.player.id);
        });
    }

    private setupUI() {
        // Create game container with grid layout
        const container = document.createElement('div');
        container.className = 'h-screen grid grid-cols-[1fr_250px]';
        document.body.appendChild(container);

        // Create game canvas container (left side)
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'relative';
        container.appendChild(canvasContainer);

        // Create canvas for Babylon.js
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.className = 'w-full h-full block';
        canvasContainer.appendChild(canvas);

        // Create players sidebar (right side)
        const sidebar = document.createElement('div');
        sidebar.className = 'bg-gray-800/90 backdrop-blur-sm p-6 text-white shadow-xl border-l border-gray-700';
        sidebar.innerHTML = `
            <h2 class="text-2xl font-bold mb-6 text-center pb-3 border-b border-gray-700">Players</h2>
            <div id="playersList" class="space-y-3"></div>
        `;
        container.appendChild(sidebar);

        // Create player form overlay
        const form = document.createElement('div');
        form.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
        form.id = 'playerForm';
        form.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                <h2 class="text-2xl font-bold mb-4">Join Game</h2>
                <input type="text" id="nickname" placeholder="Enter nickname" 
                       class="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none">
                <input type="color" id="colorPicker" value="#ff0000"
                       class="block w-full p-1 mb-4 rounded bg-gray-700 border border-gray-600">
                <button id="joinButton" 
                        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    Join
                </button>
            </div>
        `;
        document.body.appendChild(form);

        // Initialize game scene
        this.gameScene = new GameScene(canvas, () => {
            const material = this.gameScene.getCurrentColor();
            this.ws.sendClick(material);
            this.gameScene.setColor(this.playerColor);
        });

        // Handle join button click
        const joinButton = document.getElementById('joinButton')!;
        joinButton.addEventListener('click', () => {
            const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
            const color = (document.getElementById('colorPicker') as HTMLInputElement).value;
            
            if (nickname) {
                this.playerColor = color;
                this.ws.join(nickname, color);
                document.getElementById('playerForm')?.remove();
            }
        });
    }

    private addPlayer(player: { id: number, nickname: string, color: string }) {
        this.players.set(player.id, { ...player, clicks: 0 });
        this.updatePlayersList();
    }

    private removePlayer(playerId: number) {
        this.players.delete(playerId);
        this.updatePlayersList();
    }

    private updatePlayerScore(playerId: number) {
        const player = this.players.get(playerId);
        if (player) {
            player.clicks++;
            this.updatePlayersList();
            
            // Check for game end
            if (player.clicks >= 42) {
                this.showGameOver();
            }
        }
    }

    private updatePlayersList() {
        const playersList = document.getElementById('playersList');
        if (playersList) {
            playersList.innerHTML = Array.from(this.players.values())
                .map(player => `
                    <div class="flex items-center justify-between p-3 mb-2 rounded bg-gray-700/50 backdrop-blur-sm">
                        <span class="flex items-center gap-3">
                            <span class="w-4 h-4 rounded-full" style="background-color: ${player.color}"></span>
                            <span class="text-lg" style="color: ${player.color}">${player.nickname}</span>
                        </span>
                        <span class="font-mono text-xl font-bold">${player.clicks}</span>
                    </div>
                `).join('');
        }
    }

    private showGameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center';
        
        const sortedPlayers = Array.from(this.players.values())
            .sort((a, b) => b.clicks - a.clicks);

        overlay.innerHTML = `
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg text-white max-w-md w-full">
                <h2 class="text-3xl font-bold mb-6 text-center">🏆 Game Over!</h2>
                <div class="space-y-3">
                    ${sortedPlayers.map((player, index) => `
                        <div class="flex items-center justify-between p-3 ${index === 0 ? 'bg-yellow-500/20' : 'bg-gray-700'} rounded">
                            <span class="flex items-center gap-2">
                                ${index === 0 ? '👑' : ''}
                                <span class="w-3 h-3 rounded-full" style="background-color: ${player.color}"></span>
                                <span>${player.nickname}</span>
                            </span>
                            <span class="font-mono font-bold">${player.clicks}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
