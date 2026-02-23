import type { Algorithm, AlgorithmConstructorArgs } from "../algorithms/Algorithm.interface.ts";

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