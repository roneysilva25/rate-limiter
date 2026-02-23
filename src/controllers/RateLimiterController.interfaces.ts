import type { PacketPayload } from "../algorithms/FixedWindow.interfaces.js";
import type { NextFunction, Response, Request, } from "express";

interface LimiterInfo {
    capacity: number;
    timeWindowInMs: number;
}

interface ConfigResponseHeaders {
    res: Response;
    packetInfo: PacketPayload;
    limiterInfo: LimiterInfo;
}

interface DropArgs {
    req: Request;
    res: Response;
    packetInfo: PacketPayload;
    limiterInfo: LimiterInfo;
}

interface ForwardArgs {
    req: Request;
    res: Response;
    next: NextFunction;
    packetInfo: PacketPayload;
    limiterInfo: LimiterInfo;
}

export type {
    ConfigResponseHeaders,
    DropArgs,
    ForwardArgs,
}