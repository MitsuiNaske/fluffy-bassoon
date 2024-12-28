const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        if (!Logger.instance) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
            this.logsDir = path.join("./Logs", `/logs-${timestamp}`);
            
            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir);
            }

            this.logFilePath = path.join(this.logsDir, `Log-${timestamp}.log`);
            this.warnFilePath = path.join(this.logsDir, `Warn-${timestamp}.log`);
            this.errorFilePath = path.join(this.logsDir, `Error-${timestamp}.log`);
            
            this.logs = [];
            Logger.instance = this;
        }
        return Logger.instance;
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        const logMessage = `[Log]::[${timestamp}] ${message}`;
        console.log(logMessage);
        fs.appendFileSync(this.logFilePath, logMessage + "\n");
    }

    warn(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        const warnMessage = `[Warn]::[${timestamp}] ${message}`;
        console.warn(warnMessage);
        fs.appendFileSync(this.warnFilePath, warnMessage + "\n");
    }

    error(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        const errorMessage = `[Error]::[${timestamp}] ${message}`;
        console.error(errorMessage);
        fs.appendFileSync(this.errorFilePath, errorMessage + "\n");
    }

    getLogs() {
        return this.logs;
    }
}

module.exports = Logger;
