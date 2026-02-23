import type { NextFunction, Request, Response } from "express";
import { Storage } from "./db/Storage.ts";
import type { Algorithm } from "./algorithms/Algorithm.interface.ts";
import { RateLimiterController } from "./controllers/RateLimiterController.ts";
import { AlgorithmFactory } from "./factories/AlgorithmFactory.ts";
import type { RateLimiterConstructorArgs } from "./interfaces.ts";

export class RateLimiter {
    private readonly algorithm: Algorithm;
    private readonly controller: RateLimiterController;
    private readonly capacity: number;
    private readonly timeWindowInMs: number;

    constructor({
        algorithm,
        capacity,
        timeWindowInMs,
        storage = Storage,
    }: RateLimiterConstructorArgs) {
        this.capacity = capacity;
        this.timeWindowInMs = timeWindowInMs;
        this.controller = new RateLimiterController();
        this.algorithm = new AlgorithmFactory().get({
            algorithm,
            config: {
                timeWindowInMs,
                storage,
                capacity,
            },
        });
    }

    private validateIP(req: Request, res: Response) {
        if (!req.ip) {
            return res.status(400).send("Invalid IP Address.");
        }
    }

    limit(req: Request, res: Response, next: NextFunction) {
        this.validateIP(req, res);

        return this.algorithm.handle({
            packetKey: req.ip as string,
            dropCb: (packetInfo) => this.controller.drop({
                req,
                res,
                packetInfo,
                limiterInfo: {
                    capacity: this.capacity,
                    timeWindowInMs: this.timeWindowInMs,
                },
            }),
            forwardCb: (packetInfo) => this.controller.forward({
                req,
                res,
                next,
                packetInfo,
                limiterInfo: {
                    capacity: this.capacity,
                    timeWindowInMs: this.timeWindowInMs,
                },
            }),
        });
    }
}