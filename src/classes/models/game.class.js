import { createLocationPacket } from '../../utils/notification/game.notification.js';
import LatencyManager from '../managers/latency.manager.js';

class Game {
    constructor(id) {
        this.id = id;
        this.users = [];
        this.latencyManager = new LatencyManager();
    }

    addUser(user) {
        this.users.push(user);

        this.latencyManager.addUser(user.id, user.ping.bind(user), 1000);
    }

    getUser(userId) {
        return this.users.find((user) => user.id === userId);
    }

    removeUser(socket) {
        const index = this.users.findIndex((user) => user.socket === socket);
        if (index !== -1) {
            console.log(this.users.length);
            if (this.users.length === 1) {
                this.latencyManager.clearAll();
            }
            this.latencyManager.removeUser(this.users[index].id);
            return this.users.splice(index, 1)[0];
        }
    }

    getAllLocation(userId) {
        const maxLatency = this.getMaxLatency();

        const locationData = this.users
            .filter((user) => user.id !== userId)
            .map((user) => {
                const { x, y } = user.calculatePosition(maxLatency);
                return { id: user.id, playerId: user.playerId, x: x, y: y };
            });

        return createLocationPacket(locationData);
    }

    getMaxLatency() {
        let MaxLatency = 0;
        this.users.forEach((user) => {
            MaxLatency = Math.max(user.latency, MaxLatency);
        });
        return MaxLatency;
    }
}

export default Game;
