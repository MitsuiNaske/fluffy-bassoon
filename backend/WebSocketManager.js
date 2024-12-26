
class WebSocketManager {
    constructor() {
        if (WebSocketManager.instance) {
            return WebSocketManager.instance;
        }
        this.clients = new Map();
        WebSocketManager.instance = this;
    }

    addClient(userId, client) {
        this.clients.set(userId, client);
    }

    removeClient(userId) {
        this.clients.delete(userId);
    }

}

module.exports = WebSocketManager;