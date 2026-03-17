import type { StandardSchemaV1, InferInput, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { parse, safeParse } from "./parse.ts";

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
