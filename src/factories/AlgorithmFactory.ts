import { FixedWindow } from "../algorithms/FixedWindow.js";
import type { Algorithm } from "../algorithms/Algorithm.interface.js";
import type { GetArgs, IAlgorithmFactory } from "./AlgorithmFactory.interfaces.js";

export class AlgorithmFactory implements IAlgorithmFactory {
    public get({ algorithm, config }: GetArgs): Algorithm {    
        switch (algorithm) {
            case "fixed_window":
                return new FixedWindow(config);
            default:
                throw new Error(`Unknown algorithm: ${algorithm}.`);
        }
    }
}