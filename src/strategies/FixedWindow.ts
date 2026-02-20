import type { RateLimiter } from "./RateLimiter.interface.js";

export class FixedWindow implements RateLimiter {
    private currentTime: number;
    private allowance: number;

    capacity: number;
    dropCb: (packetKey: string) => void;
    forwardCb: (packetKey: string) => void;
    timeWindowInMs: number;

    constructor({ capacity, dropCb, forwardCb, timeWindowInMs }: RateLimiter) {
        this.currentTime = new Date().getTime();
        this.allowance = capacity;
        this.capacity = capacity;
        this.dropCb = dropCb;
        this.forwardCb = forwardCb;
        this.timeWindowInMs = timeWindowInMs;
    }

    handle(packetKey: string) {
        const currentTime = new Date().getTime();

        if (currentTime - this.currentTime >= this.timeWindowInMs) {
            this.allowance = this.capacity;
            this.currentTime = currentTime;
        }

        if (this.allowance < 1) {
            return this.dropCb(packetKey);
        }

        this.allowance -= 1;
        return this.forwardCb(packetKey);
    }
}