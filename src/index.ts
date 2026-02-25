import type { NextFunction, Request, Response } from "express";
import { Storage } from "./db/Storage.js";
import { RateLimiterController } from "./controllers/RateLimiterController.js";
import { AlgorithmFactory } from "./factories/AlgorithmFactory.js";
import type { RateLimiterArgs } from "./interfaces.js";

function validateIP(req: Request, res: Response) {
    if (!req.ip) {
        return res.status(400).send("Invalid IP Address.");
    }
}

function rateLimiter({
    algorithm = "fixed_window",
    capacity = 200,
    timeWindowInMs = 120000,
    storage = Storage
}: RateLimiterArgs) {
    const controller = new RateLimiterController(); 
    const algFactory = new AlgorithmFactory().get({
        algorithm,
        config: {
            timeWindowInMs,
            storage,
            capacity,
        },
    });
    
    return {
        limit(req: Request, res: Response, next: NextFunction) {
            validateIP(req, res);

            return algFactory.handle({
                packetKey: req.ip as string,
                dropCb: (packetInfo) => controller.drop({
                    req,
                    res,
                    packetInfo,
                    limiterInfo: {
                        capacity,
                        timeWindowInMs,
                    },
                }),
                forwardCb: (packetInfo) => controller.forward({
                    req,
                    res,
                    next,
                    packetInfo,
                    limiterInfo: {
                        capacity,
                        timeWindowInMs,
                    },
                }),
            });
        }
    }
}

export {
    rateLimiter,
}