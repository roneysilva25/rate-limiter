import type { Algorithm, AlgorithmConstructorArgs } from "../algorithms/Algorithm.interface.js";

type Algorithms = "fixed_window";

interface GetArgs {
    algorithm: Algorithms;
    config: AlgorithmConstructorArgs;
}

interface IAlgorithmFactory {
    get(args: GetArgs): Algorithm; 
}

export {
    type IAlgorithmFactory,
    type GetArgs,
}