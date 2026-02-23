import type { Storage } from "./db/Storage.js";

interface RateLimiterConstructorArgs {
    algorithm: "fixed_window";
    capacity: number;
    timeWindowInMs: number;
    storage?: typeof Storage;
}

export type {
    RateLimiterConstructorArgs,
}