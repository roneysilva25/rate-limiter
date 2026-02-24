import type { Storage } from "./db/Storage.js";

interface RateLimiterArgs {
    algorithm: "fixed_window";
    capacity: number;
    timeWindowInMs: number;
    storage?: typeof Storage;
}

export type {
    RateLimiterArgs
}