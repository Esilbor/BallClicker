type MessageHandler = (data: any) => void;

export class GameWebSocket {
    private ws: WebSocket;
    private messageHandlers: Map<string, MessageHandler[]> = new Map();
    private currentColor: string = '';

    constructor() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        this.ws = new WebSocket(`${wsProtocol}${window.location.host}/ws`);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const handlers = this.messageHandlers.get(data.type) || [];
            handlers.forEach(handler => handler(data));
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    public on(type: string, handler: MessageHandler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type)!.push(handler);
    }

    public send(data: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    public join(nickname: string, color: string) {
        this.currentColor = color;
        this.send({
            type: 'join',
            nickname,
            color
        });
    }

    public sendClick(currentBallColor: string) {
        // Only send click if the ball isn't already the player's color
        if (currentBallColor !== this.currentColor) {
            this.send({
                type: 'click'
            });
        }
    }
}