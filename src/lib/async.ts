import type { StandardSchemaV1, InferInput, InferOutput } from "./types.ts";
import { SchemaError, type Result, convertResult } from "./common.ts";

/** Asynchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 */
export async function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Promise<InferOutput<T>> {
  const result = await safeParse(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
/** Asynchronously validates the input against the schema.
 * @returns The result of the validation.
 */
export async function safeParse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Promise<Result<InferOutput<T>>> {
  let result = schema["~standard"].validate(input, options);
  if (result instanceof Promise) result = await result;
  return convertResult(result);
}
export { safeParse as validate };

/** Asynchronously validates the input against the schema.
 * @param input Unlike {@link parse}, this is strongly-typed to match the schema's input type.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 */
export async function decode<T extends StandardSchemaV1>(
  schema: T,
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Promise<InferOutput<T>> {
  return await parse(schema, input, options);
}
/** Asynchronously validates the input against the schema.
 * @param input Unlike {@link validate}, this is strongly-typed to match the schema's input type.
 * @returns The result of the validation.
 */
export async function safeDecode<T extends StandardSchemaV1>(
  schema: T,
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Promise<Result<InferOutput<T>>> {
  return await safeParse(schema, input, options);
}

/** A class that wraps a Standard Schema and provides asynchronous utility methods. */
export class WrappedAsyncSchema<
  Input,
  Output = Input,
> implements StandardSchemaV1<Input, Output> {
  constructor(public readonly schema: StandardSchemaV1<Input, Output>) {}

  get ["~standard"](): StandardSchemaV1<Input, Output>["~standard"] {
    return this.schema["~standard"];
  }

  /** @see {@link parse} */
  async parse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Output> {
    return await parse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  async safeParse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Result<Output>> {
    return await safeParse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  validate = this.safeParse;

  /** @see {@link decode} */
  async decode(
    input: Input,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Output> {
    return await decode(this.schema, input, options);
  }
  /** @see {@link safeDecode} */
  async safeDecode(
    input: Input,
    options?: StandardSchemaV1.Options | undefined,
  ): Promise<Result<Output>> {
    return await safeDecode(this.schema, input, options);
  }

  pipe<Output>(
    ...schemas: [...StandardSchemaV1[], StandardSchemaV1<unknown, Output>]
  ): PipedAsyncSchema<Input, Output> {
    return pipe(this.schema, ...schemas);
  }
}

/** Wraps a Standard Schema in a class that provides asynchronous utility methods. */
export function wrap<T extends StandardSchemaV1>(
  schema: T,
): WrappedAsyncSchema<InferInput<T>, InferOutput<T>> {
  return new WrappedAsyncSchema(schema);
}

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
