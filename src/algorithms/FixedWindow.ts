import { Storage } from "../db/Storage.js";
import type { PacketPayload } from "./FixedWindow.interfaces.js";
import type { HandleArgs, Algorithm, AlgorithmConstructorArgs } from "./Algorithm.interface.js";

export class FixedWindow implements Algorithm {
    capacity: number;
    timeWindowInMs: number; 
    storage: typeof Storage;

    constructor({ 
        capacity,  
        timeWindowInMs,
        storage,
    }: AlgorithmConstructorArgs) {
        this.capacity = capacity;
        this.timeWindowInMs = timeWindowInMs;
        this.storage = storage;
    }

    handle({ packetKey, forwardCb, dropCb }: HandleArgs) {
        const existingPacket = this.storage.retrieve<PacketPayload>(packetKey);
        const currentTime = new Date().getTime();

        if (!existingPacket || currentTime - existingPacket.createdAt >= this.timeWindowInMs) {
            const createdPacket = this.storage.store<PacketPayload>({
                key: packetKey,
                payload: {
                    createdAt: currentTime,
                    allowance: this.capacity - 1,
                },
            });

            return forwardCb(createdPacket);
        }

        if (existingPacket.allowance - 1 >= 0) {
            const updatedPacket = this.storage.store<PacketPayload>({
                key: packetKey,
                payload: {
                    createdAt: existingPacket.createdAt,
                    allowance: existingPacket.allowance - 1,
                },
            });

            return forwardCb(updatedPacket);
        }

        return dropCb(existingPacket);
    }
}