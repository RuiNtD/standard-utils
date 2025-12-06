Some convenience utils for [Standard Schema],
expanding upon the existing [@standard-schema/utils].

Mainly provides functions that make it easier to use Standard Schema without having to reuse code.

# Usage

```ts
// The default export assumes Async Schemas...
import * as ss from "@ruintd/standard-utils";
// But there's also an export for Sync Schemas!
import * as ssSync from "@ruintd/standard-utils/sync";

// You can also access Sync methods from the Async export
// by appending Sync to the method names, and vice versa.

import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number(),
});
const data = { username: "billie", xp: 100 };
const badData = { username: 42, xp: "100" };

await ss.parse(Player, data);
// { username: "billie", xp: 100 }
await ss.decode(Player, badData);
// Similar to parse, but expects a strongly typed input.
// Argument of type '...' is not assignable to parameter of type '...'.

await ss.validate(Player, data);
// { success: true, value: { username: "billie", xp: 100 } }
await ss.safeParse(Player, badData); // alias of "validate"
// { success: false, issues: [ ... ] }
```

## Handling Errors

For error handling, we export a `prettifyError` function;
which can take a `FailureResult` (from validate),
`Issue[]` (from `FailureResult.issues`), a single `Issue`, or a `SchemaError`;
and returns a user-friendly error message, similar to Zod's `prettifyError`:

```ts
try {
  await ss.parse(Player, badData);
} catch (e) {
  if (e instanceof ss.SchemaError) {
    console.log(ss.prettifyError(e));
    /*
      ✖ Invalid input: expected string, received number
        → at username
      ✖ Invalid input: expected number, received string
        → at xp
    */
  }
}
```

Or `validate` will return an object containing an `issues` array:

```ts
await ss.validate(Player, badData);
/* {
  success: false,
  issues: [
    {
      expected: "string",
      code: "invalid_type",
      path: [ "username" ],
      message: "Invalid input: expected string, received number"
    },
    {
      expected: "number",
      code: "invalid_type",
      path: [ "xp" ],
      message: "Invalid input: expected number, received string"
    }
  ]
} */
```

## Type Guarding

Since TypeScript doesn't allow type guarding with async functions[^1],
type guarding is only available for sync schemas.

[^1]: https://github.com/microsoft/typescript/issues/37681

```ts
data; // unknown
if (ssSync.is(Player, data)) {
  data; // Player
}

data; // unknown
ssSync.assert(Player, data);
data; // Player
```

## Wrapping Schemas

```ts
const schema = ssSync.wrap(Player);
schema.parse(data);
schema.decode(data);
schema.validate(data);
schema.safeParse(data);
// Only on Wrapped *Sync* Schemas:
schema.is(data);
schema.assert(data);
```

## Extra Exports

We also export [SchemaStandardV1], as well as
[getDotPath] and [SchemaError] from [@standard-schema/utils].

[Standard Schema]: https://standardschema.dev/
[@standard-schema/utils]: https://jsr.io/@standard-schema/utils
[SchemaStandardV1]: https://jsr.io/@standard-schema/spec/doc/~/StandardSchemaV1
[getDotPath]: https://jsr.io/@standard-schema/utils/doc/~/getDotPath
[SchemaError]: https://jsr.io/@standard-schema/utils/doc/~/SchemaError
