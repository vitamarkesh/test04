import { Service, Validators, Errors as MoleculerErrors } from "moleculer";
import ApiGateway from "moleculer-web";
import { Request, Response } from "express";
import { IInData } from "./IInData";
import { schemaInData } from "./schemaInData";
import { config } from "./config";

const validator = new Validators.Fastest();
const checkInData = validator.compile(schemaInData);

/**
 *
 */
export default class Api extends Service {
  /**
   *
   */
  constructor(broker: any) {
    super(broker);

    this.parseServiceSchema({
      name: "api",

      mixins: [ApiGateway],

      dependencies: ["s01"],

      settings: {
        port: process.env.HTTP_PORT || config.HTTP_PORT,

        routes: [
          {
            path: "/",

            bodyParsers: {
              json: { type: "application/json" },
            },

            aliases: {
              "POST /": this.exec,
            },
          },
        ],
      },
    });
  }

  /**
   *
   */
  async exec(req: Request, res: Response) {
    try {
      this.checkValid(req.body, checkInData);
      const data: IInData = req.body;
      this.broker.call("s01.exec", data).catch((e) => {
        throw e;
      });
      res.end();
    } catch (e) {
      // console.error({ e });
      res.statusCode = e.code || 500;
      res.end(
        JSON.stringify(
          {
            error: e.message,
            type: e.type,
            data: e.data,
          },
          null,
          2
        )
      );
    }
  }

  /**
   *
   */
  checkValid(params: {}, check: Function): void | never {
    const validOrError = check(params);
    if (validOrError !== true) {
      throw new MoleculerErrors.ValidationError(
        "validation error",
        "VALIDATION_ERROR",
        validOrError
      );
    }
  }
}
