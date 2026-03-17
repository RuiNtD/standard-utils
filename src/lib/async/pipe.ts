import type { StandardSchemaV1 } from "../types.ts";
import { SchemaError } from "../common.ts";
import { WrappedAsyncSchema } from "./wrap.ts";
import { parse } from "./parse.ts";

/** A class that pipes multiple Standard Schemas together asynchronously. */
export class PipedAsyncSchema<Input, Output = Input>
  extends WrappedAsyncSchema<Input, Output>
  implements StandardSchemaV1<Input, Output>
{
  public readonly schemas: StandardSchemaV1[];

  private async _validate(
    input: unknown,
    options: StandardSchemaV1.Options | undefined,
  ): Promise<StandardSchemaV1.Result<Output>> {
    let value: unknown = input;
    try {
      for (const schema of this.schemas)
        value = await parse(schema, value, options);
      return { value: value as Output };
    } catch (e) {
      if (e instanceof SchemaError) return { issues: e.issues };
      throw e;
    }
  }

  constructor(
    inSchema: StandardSchemaV1<Input, unknown>,
    ...rest: [...StandardSchemaV1[], StandardSchemaV1<unknown, Output>]
  ) {
    super({
      ["~standard"]: {
        version: 1,
        vendor: "@ruintd/standard-utils",
        validate: (value, options) => this._validate(value, options),
      },
    });
    this.schemas = [inSchema, ...rest];
  }
}

/** Wraps multiple Standard Schemas in a class that pipes them together asynchronously. */
export function pipe<Input, Output = Input>(
  inSchema: StandardSchemaV1<Input, unknown>,
  ...rest: [...StandardSchemaV1[], StandardSchemaV1<unknown, Output>]
): PipedAsyncSchema<Input, Output> {
  return new PipedAsyncSchema(inSchema, ...rest);
}
