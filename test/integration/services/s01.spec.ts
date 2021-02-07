import {Context, ServiceBroker} from "moleculer";
import TestService from "../../../src/s01.service";

const maxExcessMsec = 5e3;
const message = "ssssssss";
const timeoutMsec = message.length * 1e3;

jest.setTimeout(timeoutMsec + maxExcessMsec + 5e3);

/**
 *
 */
describe("Test S01 service", () => {
  let broker = new ServiceBroker({ logger: false });
  broker.createService(TestService);

  /**
   *
   */
  describe("Test 's01.exec' action", () => {
    /**
     *
     */
    it("should return in timeout", async (done) => {
      const startMsec = Date.now();
      broker.createService({
        name: "listener",
        events: {
          "stdout.write"(ctx: Context) {
            const durationMsec = Date.now() - startMsec;
            expect(durationMsec).toBeGreaterThanOrEqual(timeoutMsec);
            expect(durationMsec).toBeLessThan(timeoutMsec + maxExcessMsec);
            done();
          },
        },
      });
      await broker.start();
      await broker.call("s01.exec", {
        timestamp: 123,
        user: "Adam",
        message,
      });
      await broker.stop();
    });
  });
});
