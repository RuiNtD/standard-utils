import type { StandardSchemaV1, InferInput, InferOutput } from "../types.ts";
import type { Result } from "../common.ts";
import { parse, safeParse } from "./parse.ts";
import { decode, safeDecode } from "./decode.ts";
import { pipe, type PipedAsyncSchema } from "./pipe.ts";

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
