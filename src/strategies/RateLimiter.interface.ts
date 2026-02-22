import type { Storage } from "../db/Storage.js";
import type { PacketPayload } from "./FixedWindows.interfaces.js";

export interface RateLimiter {
    readonly storage?: typeof Storage,
    capacity: number;
    timeWindowInMs: number;
    forwardCb: (packetInfo: PacketPayload) => void;
    dropCb:(packetInfo: PacketPayload) => void;
    handle: (packetKey: string) => void;
}