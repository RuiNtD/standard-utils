import type { StandardSchemaV1, InferInput, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { parse, safeParse } from "./parse.ts";
import { decode, safeDecode } from "./decode.ts";
import { parser, safeParser } from "./parser.ts";
import { decoder, safeDecoder } from "./decoder.ts";
import { assert, is } from "./typeguard.ts";
import { pipe, type PipedSyncSchema } from "./pipe.ts";

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

  /** @see {@link parser} */
  parser(): (
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ) => Output {
    return parser(this.schema);
  }
  /** @see {@link safeParser} */
  safeParser(): (
    input: unknown,
    options?: StandardSchemaV1.Options | undefined,
  ) => Result<Output> {
    return safeParser(this.schema);
  }

  /** @see {@link decoder} */
  decoder(): (
    input: Input,
    options?: StandardSchemaV1.Options | undefined,
  ) => Output {
    return decoder(this.schema);
  }
  /** @see {@link safeDecoder} */
  safeDecoder(): (
    input: Input,
    options?: StandardSchemaV1.Options | undefined,
  ) => Result<Output> {
    return safeDecoder(this.schema);
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
