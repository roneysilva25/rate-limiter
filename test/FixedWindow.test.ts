import { FixedWindow } from "../src/algorithms/FixedWindow";

describe("FixedWindow", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockGetTime = jest.fn();
    const mockStore = jest.fn();
    const mockRetrieve = jest.fn();
    const mockStorage = {
        store: mockStore,
        retrieve: mockRetrieve, 
    }
    const mockDropCb = jest.fn();
    const mockForwardCb = jest.fn();

    const fixedWindowArgs = {
        capacity: 200,
        timeWindowInMs: 1000*60*2,
        storage: mockStorage,
    }

    //@ts-ignore
    const fixedWindow = new FixedWindow(fixedWindowArgs);

    jest.spyOn(Date.prototype, "getTime").mockImplementation(mockGetTime);

    it("should create a packet with maximum allowance, the current timestamp and call forwardCb, all if the packet does not exist yet ", () => {
        const createdPacket = {
            key: "packetKey",
            payload: {
                createdAt: 1,
                allowance: fixedWindowArgs.capacity - 1, 
            },
        }

        mockGetTime.mockReturnValueOnce(1);
        mockRetrieve.mockReturnValueOnce(undefined);
        mockStore.mockReturnValueOnce(createdPacket);

        fixedWindow.handle({ 
            packetKey: "packetKey",  
            dropCb: mockDropCb,
            forwardCb: mockForwardCb,
        });

        expect(mockStore).toHaveBeenCalledWith(createdPacket);
        expect(mockForwardCb).toHaveBeenCalledWith(createdPacket);
    });

    it("should update an existing packet with reset allowance and timestamp, and call forwardCb if the time window has passed", () => {
        const resetAllowance = fixedWindowArgs.capacity - 1
        const updatedPacket = {
            createdAt: fixedWindowArgs.timeWindowInMs,
            allowance: resetAllowance,
        };
        const currentTimestamp = fixedWindowArgs.timeWindowInMs;

        mockGetTime.mockReturnValueOnce(currentTimestamp);
        mockRetrieve.mockReturnValueOnce({
            createdAt: 0,
            allowance: 10,
        });
        mockStore.mockReturnValueOnce(updatedPacket);

        fixedWindow.handle({ 
            packetKey: "packetKey",  
            dropCb: mockDropCb,
            forwardCb: mockForwardCb,
        });

        expect(mockForwardCb).toHaveBeenCalledWith(updatedPacket);
    });

    it("should update an existing packet, decreasing its allowance by 1 and keeping the same createdAt timestamp, when the allowance has not reached 0 (zero)", () => {
        const foundPacket = {
            createdAt: 10,
            allowance: 4,
        }

        const updatedPacket = {
            createdAt: foundPacket.createdAt,
            allowance: 3,
        }

        mockGetTime.mockReturnValueOnce(foundPacket.createdAt + 1);
        mockRetrieve.mockReturnValueOnce(foundPacket);
        mockStore.mockReturnValueOnce(updatedPacket);

        fixedWindow.handle({ 
            packetKey: "packetKey",  
            dropCb: mockDropCb,
            forwardCb: mockForwardCb,
        });

        expect(mockStore).toHaveBeenCalledWith({
            key: "packetKey",
            payload: updatedPacket,
        });
        expect(mockForwardCb).toHaveBeenCalledWith(updatedPacket);
    });

    it("should call the dropCb when the allowance has already reached zero.", () => {
        const foundPacket = {
            createdAt: 10,
            allowance: 0,
        };

        mockGetTime.mockReturnValueOnce(foundPacket.createdAt + 10);
        mockRetrieve.mockReturnValueOnce(foundPacket);

        fixedWindow.handle({ 
            packetKey: "packetKey",  
            dropCb: mockDropCb,
            forwardCb: mockForwardCb,
        });

        expect(mockDropCb).toHaveBeenCalledWith(foundPacket);
    });
});