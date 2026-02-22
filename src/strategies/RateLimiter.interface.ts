import type { Storage } from "../db/Storage.ts";
import type { PacketPayload } from "./FixedWindows.interfaces.ts";

export interface RateLimiter {
    readonly storage?: typeof Storage,
    capacity: number;
    timeWindowInMs: number;
    forwardCb: (packetInfo: PacketPayload) => void;
    dropCb:(packetInfo: PacketPayload) => void;
    handle: (packetKey: string) => void;
}

export type RateLimiterConstructor = Omit<RateLimiter, "handle">;