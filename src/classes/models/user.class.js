import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
    constructor(socket, id, playerId, latency, coords) {
        this.id = id;
        this.socket = socket;
        this.playerId = playerId;
        this.latency = latency;
        this.x = coords.x;
        this.y = coords.y;
        this.lastx = 0;
        this.lasty = 0;
        this.lastUpdateTime = Date.now();
    }

    updatePosition(x, y) {
        this.lastx = this.x;
        this.lasty = this.y;
        this.x = x;
        this.y = y;
        this.lastUpdateTime = Date.now();
    }

    ping() {
        const now = Date.now();

        this.socket.write(createPingPacket(now));
    }

    handlePong(data) {
        const now = Date.now();
        this.latency = (now - data.timestamp) / 2;
        console.log(`${this.latency}`);
    }

    calculatePosition(latency) {
        if (this.x === this.lastx && this.y === this.lasty) {
            return {
                x: this.x,
                y: this.y,
            };
        }

        const timdDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;

        const distance = this.speed + timdDiff;

        const directionX = this.x !== this.lastx ? Math.sign(this.x - this.lastx) : 0;
        const directionY = this.y !== this.lasty ? Math.sign(this.y - this.lasty) : 0;

        return {
            x : this.x + directionX * distance,
            y : this.y + directionY * distance,
        }
    }
}

export default User;
