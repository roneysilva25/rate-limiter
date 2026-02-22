import { Storage } from "../db/Storage.js";
import type { PacketPayload } from "./FixedWindows.interfaces.js";
import type { RateLimiter } from "./RateLimiter.interface.js";

export class FixedWindow implements RateLimiter {
    capacity: number;
    dropCb: (packetInfo: PacketPayload) => void;
    forwardCb: (packetInfo: PacketPayload) => void;
    timeWindowInMs: number; 
    storage: typeof Storage;

    constructor({ 
        capacity, 
        dropCb, 
        forwardCb, 
        timeWindowInMs,
        storage = Storage,
    }: RateLimiter) {
        this.capacity = capacity;
        this.dropCb = dropCb;
        this.forwardCb = forwardCb;
        this.timeWindowInMs = timeWindowInMs;
        this.storage = storage;
    }

    handle(packetKey: string) {
        const existingPacket = this.storage.retrieve<PacketPayload>(packetKey);
        const currentTime = new Date().getTime();

        if (!existingPacket || existingPacket.createdAt - currentTime >= this.timeWindowInMs) {
            const createdPacket = this.storage.store<PacketPayload>({
                key: packetKey,
                payload: {
                    createdAt: currentTime,
                    allowance: this.capacity - 1,
                },
            });

            return this.forwardCb(createdPacket);
        }

        if (existingPacket.allowance - 1 >= 1) {
            const updatedPacket = this.storage.store<PacketPayload>({
                key: packetKey,
                payload: {
                    createdAt: existingPacket.createdAt,
                    allowance: existingPacket.allowance - 1,
                },
            });

            return this.forwardCb(updatedPacket);
        }

        return this.dropCb(existingPacket);
    }
}