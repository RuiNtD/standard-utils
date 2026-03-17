import type { StandardSchemaV1, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { parse, safeParse } from "./parse.ts";

export function parser<T extends StandardSchemaV1>(
  schema: T,
): (
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
) => InferOutput<T> {
  return (input, options) => parse(schema, input, options);
}

export function safeParser<T extends StandardSchemaV1>(
  schema: T,
): (
  input: unknown,
  options?: StandardSchemaV1.Options | undefined,
) => Result<InferOutput<T>> {
  return (input, options) => safeParse(schema, input, options);
}

export { safeParser as validater };
