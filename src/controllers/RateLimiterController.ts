import type { ConfigResponseHeaders, DropArgs, ForwardArgs } from "./RateLimiterController.interfaces.js";

export class RateLimiterController {
    private configResponseHeaders({ limiterInfo, packetInfo, res  }: ConfigResponseHeaders) {
        const resetsIn = limiterInfo.timeWindowInMs + packetInfo.createdAt - new Date().getTime();
        res.setHeader("X-RateLimit-Limit", limiterInfo.capacity);
        res.setHeader("X-RateLimit-Remaining", packetInfo.allowance);
        res.setHeader("X-RateLimit-Reset", resetsIn);
    }

    public drop({ res, req, packetInfo, limiterInfo }: DropArgs) {
        this.configResponseHeaders({ res, limiterInfo, packetInfo });
        return res.status(429).send();
    }

    public forward({ req, res, next, packetInfo, limiterInfo }: ForwardArgs) {
        this.configResponseHeaders({ res, limiterInfo, packetInfo });
        next();
    }
}