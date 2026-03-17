import type { StandardSchemaV1, InferOutput } from "../types.ts";
import { parse, safeParse } from "./parse.ts";

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
