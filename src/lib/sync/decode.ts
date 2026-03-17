import type { StandardSchemaV1, InferInput, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { parse, safeParse } from "./parse.ts";

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
