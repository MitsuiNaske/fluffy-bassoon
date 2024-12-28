
class WebSocketManager {
    constructor() {
        if (!WebSocketManager.instance) {
            this.clients = new Map();
            WebSocketManager.instance = this;
        }
        return WebSocketManager.instance;
    }

    static getInstance() {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    addClient(userId, client) {
        this.clients.set(userId, client);
    }

    removeClient(userId) {
        this.clients.delete(userId);
    }

}

module.exports = WebSocketManager;