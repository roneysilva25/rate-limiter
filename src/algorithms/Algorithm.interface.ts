import type { Storage } from "../db/Storage.ts";
import type { PacketPayload } from "./FixedWindow.interfaces.ts";

export interface HandleArgs {
    packetKey: string;
    forwardCb: (packetInfo: PacketPayload) => void;
    dropCb:(packetInfo: PacketPayload) => void;
}

export interface Algorithm {
    readonly storage: typeof Storage,
    capacity: number;
    timeWindowInMs: number;
    handle: (args: HandleArgs) => void;
}

export type AlgorithmConstructorArgs = Omit<Algorithm, "handle">;