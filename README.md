# 🎮 Ball Clicker - Educational Multiplayer Game

An interactive multiplayer game designed to teach modern web development concepts through hands-on experience.

## 📚 Educational Goals

This project demonstrates:
- Real-time multiplayer game development
- Modern TypeScript and Node.js practices
- WebSocket communication
- 3D graphics with Babylon.js
- Containerization with Docker
- Modern UI with Tailwind CSS

## 🎯 Game Rules

1. Players join by entering their nickname and choosing a unique color
2. A 3D ball appears in the center of the screen
3. Click the ball to change its color to yours
4. Each successful click (when the ball isn't already your color) increases your score
5. First player to reach 42 clicks wins!

## 🏗️ Technical Architecture

### Frontend Stack
- **TypeScript** - Type-safe programming
- **Babylon.js** - 3D graphics and game scene
- **Tailwind CSS** - Modern, utility-first styling
- **Vite** - Fast development and building
- **WebSocket** - Real-time game state updates

### Backend Stack
- **Node.js** - Runtime environment
- **Fastify** - Fast, low overhead web framework
- **SQLite** - Lightweight database
- **WebSocket** - Bidirectional communication
- **TypeScript** - Type safety and better DX

### Infrastructure
- **Docker** - Containerization
- **NGINX** - Reverse proxy and SSL termination
- **Docker Compose** - Multi-container orchestration

## 🔄 Game Flow

1. **Player Connection**
   ```typescript
   // Connection message format
   {
     type: 'join',
     nickname: string,
     color: string
   }
   ```

2. **Ball Click**
   ```typescript
   // Click message format
   {
     type: 'click',
     color: string,
     player: {
       id: number,
       nickname: string,
       color: string
     }
   }
   ```

3. **Score Update**
   - Scores update in real-time
   - Player names displayed in their chosen colors
   - Game ends at 42 clicks

## 🚀 Getting Started

### Local Development
1. Install prerequisites:
   - Docker and Docker Compose
   - Git

2. Clone and run:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Ball_Clicker.git
   cd Ball_Clicker
   make build
   ```

3. Visit `https://localhost` in your browser

## 🏫 Playing on School Network

### Host Setup
1. Find your local IP:
   ```bash
   ip addr show | grep "inet "
   ```
   Look for an IP starting with `192.168.` or `10.0.`

2. Start the game:
   ```bash
   cd Ball_Clicker
   make build
   ```

### Players Join
1. Open a browser
2. Enter `https://[HOST_IP]` (e.g., https://192.168.1.100)
3. Accept the security warning (self-signed certificate)
4. Choose a nickname and color
5. Start clicking!

### Network Requirements
- All players must be on the same local network
- Port 443 must be accessible
- Local network must allow peer-to-peer connections

### Troubleshooting
- **Cannot Connect**
  - Verify same network connection
  - Check firewall settings
  - Ensure ports 80/443 are open

- **Certificate Warning**
  - Normal for development setup
  - Accept the self-signed certificate
  - Chrome: Advanced → Proceed
  - Firefox: Accept Risk and Continue

## 🔧 Project Structure

```
ball-clicker/
├── srcs/
│   ├── back/                  # Backend service
│   │   ├── src/
│   │   │   ├── index.ts      # Main server
│   │   │   └── db.ts         # Database operations
│   │   └── database/
│   │       └── init.sql      # Database schema
│   ├── front/                # Frontend service
│   │   ├── src/
│   │   │   ├── main.ts      # Game initialization
│   │   │   ├── babylon.ts   # 3D scene management
│   │   │   └── services/
│   │   │       └── websocket.ts  # Real-time communication
│   │   └── nginx.conf       # NGINX configuration
│   └── docker-compose.yml   # Container orchestration
└── Makefile                 # Build automation
```

## 📈 Learning Opportunities

1. **Real-time Game Development**
   - WebSocket implementation
   - Game state management
   - Player synchronization

2. **3D Graphics Programming**
   - Scene setup and management
   - Material and lighting
   - User interaction handling

3. **Modern Web Development**
   - TypeScript type safety
   - Modern CSS with Tailwind
   - Component-based UI

4. **DevOps Practices**
   - Docker containerization
   - NGINX configuration
   - SSL/TLS setup

5. **Database Management**
   - SQLite operations
   - Score tracking
   - Player data management

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - Feel free to use this project for learning and teaching!