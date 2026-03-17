import {
  type StandardSchemaV1,
  SchemaError,
  type Result,
  convertResult,
} from "./common.ts";

/** Synchronously validates the input against the schema.
 * @returns The output of the schema.
 * @throws {SchemaError} if validation fails.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function parse<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): StandardSchemaV1.InferOutput<T> {
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
): Result<StandardSchemaV1.InferOutput<T>> {
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
  input: StandardSchemaV1.InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): StandardSchemaV1.InferOutput<T> => parse(schema, input, options);
/** Synchronously validates the input against the schema.
 * @param input Unlike {@link validate}, this is strongly-typed to match the schema's input type.
 * @returns The result of the validation.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export const safeDecode = <T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
  options?: StandardSchemaV1.Options | undefined,
): Result<StandardSchemaV1.InferOutput<T>> => safeParse(schema, input, options);

/** Synchronously checks if the input matches the schema.
 * Provides type-guarding.
 * @returns `true` if validation succeeds, `false` otherwise.
 * @throws {TypeError} if the schema validation is asynchronous.
 */
export function is<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
): input is StandardSchemaV1.InferOutput<T> {
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
): asserts input is StandardSchemaV1.InferOutput<T> {
  parse(schema, input, options);
}

/** A class that wraps a Standard Schema and provides synchronous utility methods. */
export class WrappedSyncSchema<T extends StandardSchemaV1> {
  constructor(public readonly schema: T) {}

  /** @see {@link parse} */
  parse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): StandardSchemaV1.InferOutput<T> {
    return parse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  safeParse(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): Result<StandardSchemaV1.InferOutput<T>> {
    return safeParse(this.schema, input, options);
  }
  /** @see {@link safeParse} */
  validate = this.safeParse;

  /** @see {@link decode} */
  decode(
    input: StandardSchemaV1.InferInput<T>,
    options?: StandardSchemaV1.Options | undefined,
  ): StandardSchemaV1.InferOutput<T> {
    return decode(this.schema, input, options);
  }
  /** @see {@link safeDecode} */
  safeDecode(
    input: StandardSchemaV1.InferInput<T>,
    options?: StandardSchemaV1.Options | undefined,
  ): Result<StandardSchemaV1.InferOutput<T>> {
    return safeDecode(this.schema, input, options);
  }

  /** @see {@link is} */
  is(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): input is StandardSchemaV1.InferOutput<T> {
    return is(this.schema, input, options);
  }
  /** @see {@link assert} */
  assert(
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ): asserts input is StandardSchemaV1.InferOutput<T> {
    assert(this.schema, input, options);
  }
}

/** Wraps a Standard Schema in a class that provides synchronous utility methods. */
export function wrap<T extends StandardSchemaV1>(
  schema: T,
): WrappedSyncSchema<T> {
  return new WrappedSyncSchema(schema);
}
