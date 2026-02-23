import type { Storage } from "./db/Storage";

interface RateLimiterConstructorArgs {
    algorithm: "fixed_window";
    capacity: number;
    timeWindowInMs: number;
    storage?: typeof Storage;
}

export type {
    RateLimiterConstructorArgs,
}