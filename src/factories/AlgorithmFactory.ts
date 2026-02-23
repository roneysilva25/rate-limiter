import { FixedWindow } from "../algorithms/FixedWindow";
import type { Algorithm } from "../algorithms/Algorithm.interface";
import type { GetArgs, IAlgorithmFactory } from "./AlgorithmFactory.interfaces";

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