import { ServiceBroker } from "moleculer";
import axios, { AxiosResponse } from "axios";
import TestService from "../../../src/api.service";
import S01 from "../../../src/s01.service";
import { config } from "../../../src/config";

/**
 *
 */
describe("Test Api service", () => {
  let broker = new ServiceBroker({ logger: false });
  broker.createService(S01);
  broker.createService(TestService);

  beforeAll(async () => {
    await broker.start();
  });
  afterAll(async () => {
    await broker.stop();
  });

  /**
   *
   */
  describe("Test 'POST /'", () => {
    /**
     *
     */
    it("should without errors", async () => {
      const res: AxiosResponse<void> = await axios.post(
        `http://localhost:${config.HTTP_PORT}/`,
        {
          timestamp: 123,
          user: "Adam",
          message: "ssssssss",
        },
        {}
      );
      expect(res.status).toBe(200);
    });

    /**
     *
     */
    it("should fails with an error", async () => {
      let err: any;
      try {
        await axios.post(
          "http://localhost:8080/",
          {
            timestamp: "123",
            user: 543,
            message: "ssssssss",
          },
          {}
        );
      } catch (e) {
        err = e;
      }
      expect(err?.response.status).toBe(422);
    });
  });
});
