const DISCORD_EPOCH = 1420070400000;

class UseridGenerator {
    constructor(workerId = 1, processId = 1) {
        this.workerId = workerId & 0x3FF;
        this.processId = processId & 0x3FF;
        this.sequence = 0;
        this.lastTimestamp = -1;
    }

    generate() {
        let timestamp = Date.now();

        if (timestamp < this.lastTimestamp) {
            throw new Error("err: Clock");
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & 0xFFF;

            if (this.sequence === 0) {
                while (timestamp <= this.lastTimestamp) {
                    timestamp = Date.now();
                }
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        const timestampPart = BigInt(timestamp - DISCORD_EPOCH) << 22n;
        const workerIdPart = BigInt(this.workerId) << 12n;
        const processIdPart = BigInt(this.processId) << 12n;
        const sequencePart = BigInt(this.sequence);

        return timestampPart | workerIdPart | processIdPart | sequencePart;
    }
}


module.exports = UseridGenerator;