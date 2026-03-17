import type { StandardSchemaV1, InferInput, InferOutput } from "./types.ts";
import { SchemaError, type Result, convertResult } from "./common.ts";

/** Synchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): InferOutput<T> {
  const result = safeParse(schema, input, options);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}
/** Synchronously validates the input against the schema.
 * @returns The result of the validation.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function safeParse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): Result<InferOutput<T>> {
  const result = schema["~standard"].validate(input, options);
  if (result instanceof Promise)
    throw new TypeError("Schema validation must be synchronous");
  return convertResult(result);
}
export { safeParse as validate };

/** Synchronously validates the input against the schema.
 * @param input Unlike {@link parse}, this is strongly-typed to match the schema's input type.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export const decode = <T extends StandardSchemaV1>(
  schema: T,
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): InferOutput<T> => parse(schema, input, options);
/** Synchronously validates the input against the schema.
 * @param input Unlike {@link validate}, this is strongly-typed to match the schema's input type.
 * @returns The result of the validation.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export const safeDecode = <T extends StandardSchemaV1>(
  schema: T,
  input: InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Result<InferOutput<T>> => safeParse(schema, input, options);

/** Synchronously checks if the input matches the schema.
 * Provides type-guarding.
 * @returns `true` if validation succeeds, `false` otherwise.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function is<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): input is InferOutput<T> {
  return safeParse(schema, input, options).success;
}
/** Synchronously asserts that the input matches the schema.
 * Provides type-guarding.
 * @throws {SchemaError} if validation fails.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function assert<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): asserts input is InferOutput<T> {
  parse(schema, input, options);
}

/** A class that wraps a Standard Schema and provides synchronous utility methods. */
export class WrappedSyncSchema<
  Input,
  Output = Input,
> implements StandardSchemaV1<Input, Output> {
  constructor(public readonly schema: StandardSchemaV1<Input, Output>) {}

  get ["~standard"](): StandardSchemaV1<Input, Output>["~standard"] {
    return this.schema["~standard"];
  }

  /** @see {@link parse} */
  parse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Output {
    return parse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  safeParse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Result<Output> {
    return safeParse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  validate = this.safeParse;

  /** @see {@link decode} */
  decode(input: Input, options?: StandardSchemaV1.Options | undefined): Output {
    return decode(this.schema, input, options);
  }
  /** @see {@link safeDecode} */
  safeDecode(
    input: Input,
    options?: StandardSchemaV1.Options | undefined,
  ): Result<Output> {
    return safeDecode(this.schema, input, options);
  }

  /** @see {@link is} */
  is(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): input is Output {
    return is(this.schema, input, options);
  }
  /** @see {@link assert} */
  assert(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): asserts input is Output {
    assert(this.schema, input, options);
  }

  pipe<Output>(
    ...schemas: [...StandardSchemaV1[], StandardSchemaV1<unknown, Output>]
  ): PipedSyncSchema<Input, Output> {
    return pipe(this.schema, ...schemas);
  }
}

/** Wraps a Standard Schema in a class that provides synchronous utility methods. */
export function wrap<T extends StandardSchemaV1>(
  schema: T,
): WrappedSyncSchema<InferInput<T>, InferOutput<T>> {
  return new WrappedSyncSchema(schema);
}

/** A class that pipes multiple Standard Schemas together synchronously. */
export class PipedSyncSchema<Input, Output = Input>
  extends WrappedSyncSchema<Input, Output>
  implements StandardSchemaV1<Input, Output>
{
  public readonly schemas: StandardSchemaV1[];

  private _validate(
    input: unknown,
    options: StandardSchemaV1.Options | undefined,
  ): StandardSchemaV1.Result<Output> {
    let value: unknown = input;
    try {
      for (const schema of this.schemas) value = parse(schema, value, options);
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

/** Wraps multiple Standard Schemas in a class that pipes them together synchronously. */
export function pipe<Input, Output = Input>(
  inSchema: StandardSchemaV1<Input, unknown>,
  ...rest: [...StandardSchemaV1[], StandardSchemaV1<unknown, Output>]
): PipedSyncSchema<Input, Output> {
  return new PipedSyncSchema(inSchema, ...rest);
}
