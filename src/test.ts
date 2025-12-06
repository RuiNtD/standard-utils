// deno-lint-ignore-file no-import-prefix

import { z } from "jsr:@zod/zod@^4.1.1";
import * as ss from "./async.ts";
import * as ssS from "./sync.ts";

const schema = ss.wrap(
  z.strictObject({
    username: z.string(),
    favoriteNumbers: z.array(z.number()),
  }),
);

const data = {
  username: 1234,
  favoriteNumbers: [1234, "4567"],
  extraKey: 1234,
} as unknown;

// const test1 = schema.safeParse(data);
// if (test1.error) console.log(z.prettifyError(test1.error));

// console.log();

const test2 = await schema.safeParse(data);
if (test2.issues) console.log(ss.prettifyError(test2.issues));

await schema.validate(data);
if (ssS.is(schema.schema, data)) {
  data;
}
