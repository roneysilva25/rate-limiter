export interface RateLimiter {
    capacity: number;
    timeWindowInMs: number;
    forwardCb: (packetKey: string) => void;
    dropCb:(packetKey: string) => void;
    handle: (packetKey: string) => void;
}