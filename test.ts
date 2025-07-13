import { z } from "npm:zod/v4";
import { formatError, wrapSync } from "./main.ts";

const schema = wrapSync(
  z.strictObject({
    username: z.string(),
    favoriteNumbers: z.array(z.number()),
  })
);

const data = {
  username: 1234,
  favoriteNumbers: [1234, "4567"],
  extraKey: 1234,
};

// const test1 = schema.safeParse(data);
// if (test1.error) console.log(z.prettifyError(test1.error));

// console.log();

const test2 = schema.safeParse(data);
if (test2.issues) console.log(formatError(test2.issues));
