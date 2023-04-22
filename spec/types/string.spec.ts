import { z, ZodString } from 'zod';
import { expectSchema, registerSchema } from '../lib/helpers';

describe('string', () => {
  it('generates OpenAPI schema for simple types', () => {
    expectSchema([registerSchema('SimpleString', z.string())], {
      SimpleString: { type: 'string' },
    });
  });

  it('supports exact length on string', () => {
    expectSchema([registerSchema('minMaxLengthString', z.string().length(5))], {
      minMaxLengthString: { type: 'string', minLength: 5, maxLength: 5 },
    });
  });

  it('supports minLength / maxLength on string', () => {
    expectSchema(
      [registerSchema('minMaxLengthString', z.string().min(5).max(10))],
      {
        minMaxLengthString: { type: 'string', minLength: 5, maxLength: 10 },
      }
    );
  });

  it('supports the combination of min/max + length on string', () => {
    expectSchema(
      [
        registerSchema('minAndLengthString', z.string().length(5).min(6)),
        registerSchema('maxAndLengthString', z.string().max(10).length(5)),
      ],
      {
        minAndLengthString: { type: 'string', minLength: 5, maxLength: 5 },
        maxAndLengthString: { type: 'string', minLength: 5, maxLength: 5 },
      }
    );
  });

  it('supports string literals', () => {
    expectSchema([registerSchema('Literal', z.literal('John Doe'))], {
      Literal: { type: 'string', enum: ['John Doe'] },
    });
  });

  it.each`
    format        | zodString                | expected
    ${'uuid'}     | ${z.string().uuid()}     | ${'uuid'}
    ${'email'}    | ${z.string().email()}    | ${'email'}
    ${'url'}      | ${z.string().url()}      | ${'uri'}
    ${'datetime'} | ${z.string().datetime()} | ${'date-time'}
  `(
    'maps a ZodString $format to $expected format',
    ({ zodString, expected }: { zodString: ZodString; expected: string }) => {
      expectSchema([registerSchema('ZodString', zodString)], {
        ZodString: { type: 'string', format: expected },
      });
    }
  );

  it('maps a ZodString regex to a pattern', () => {
    expectSchema(
      [registerSchema('RegexString', z.string().regex(/^hello world/))],
      {
        RegexString: { type: 'string', pattern: '^hello world' },
      }
    );
  });
});
