import type { StoreArgs } from "./Storage.interfaces.js";

export class Storage {
    private static instance: Storage;
    private storage: Map<string, any>;

    private constructor() {
        this.storage = new Map();
    }

    private static getInstance(): Storage {
        if (!this.instance) {
            this.instance = new Storage();
        }

        return this.instance;
    }

    public static store<Payload>({ key, payload }: StoreArgs<Payload>): Payload {
        return this.getInstance().storage.set(key, payload).get(key);
    }

    public static retrieve<Payload>(key: string): Payload | undefined {
        return this.getInstance().storage.get(key);
    }
}