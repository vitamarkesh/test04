import { Service, Context } from "moleculer";
import { IInData } from "./IInData";
import { schemaInData } from "./schemaInData";

/**
 *
 */
export default class S01 extends Service {
  /**
   *
   */
  private isTimer: boolean = false;

  /**
   *
   */
  constructor(broker: any) {
    super(broker);

    this.parseServiceSchema({
      name: "s01",

      actions: {
        exec: {
          params: schemaInData,
          handler: this.exec,
        },
      },

      events: {},
    });
  }

  /**
   *
   */
  async exec(ctx: Context<IInData>) {
    if (this.isTimer) {
      console.log("Request rejected by timeout");
      return;
    }
    const timeout = ctx.params.message.length * 1e3;
    this.isTimer = true;
    setTimeout(() => {
      console.log(ctx.params);
      this.broker.emit("stdout.write", ctx.params);
      this.isTimer = false;
    }, timeout);
  }
}
