import { randomBytes } from 'crypto'
import type { Address } from 'abitype'
import { beforeEach, describe, expect, test } from 'vitest'
import { isCIP42, isCIP64, isEIP1559, isEmpty, isPresent } from './utils.js'

let mockAddress: Address

const emptyValues: any[] = [
  '0x000000',
  '0x',
  0n,
  0,
  0,
  0n,
  undefined,
  null,
  '0',
  '',
]

const exampleNonEmptyValues: any[] = [
  '0x0000001',
  '0x1',
  1n,
  2n,
  1,
  2,
  '1',
  'example-string',
]

beforeEach(() => {
  mockAddress = `0x${randomBytes(20).toString('hex')}`
})

describe('isEmpty', () => {
  test('it checks for empty values', () => {
    for (const emptyValue of emptyValues) {
      expect(
        isEmpty(emptyValue),
        `value ${emptyValue} should be considered as empty`,
      ).toBe(true)
    }
  })

  test('it checks for non empty values', () => {
    for (const nonEmptyValue of exampleNonEmptyValues) {
      expect(
        isEmpty(nonEmptyValue),
        `value ${nonEmptyValue} should not be considered as empty`,
      ).toBe(false)
    }
  })
})

describe('isPresent', () => {
  test('it checks for non present values', () => {
    for (const emptyValue of emptyValues) {
      expect(
        isPresent(emptyValue),
        `value ${emptyValue} should not be considered as present`,
      ).toBe(false)
    }
  })

  test('it checks for present values', () => {
    for (const nonEmptyValue of exampleNonEmptyValues) {
      expect(
        isPresent(nonEmptyValue),
        `value ${nonEmptyValue} should be considered as present`,
      ).toBe(true)
    }
  })
})

describe('isEIP1559', () => {
  test('it checks if a transaction is EIP-1159', () => {
    expect(isEIP1559({})).toBe(false)

    expect(
      isEIP1559({
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isEIP1559({
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isEIP1559({
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isEIP1559({
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 0n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isEIP1559({
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)
  })
})

describe('isCIP42', () => {
  test('it allows forcing the type even if transaction is not EIP-1159', () => {
    expect(
      isCIP42({
        type: 'cip42',
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
        from: mockAddress,
      }),
    ).toBe(true)
  })

  test('it recognizes valid CIP-42 without forced type', () => {
    expect(
      isCIP42({
        feeCurrency: mockAddress,
        gatewayFeeRecipient: mockAddress,
        gatewayFee: 789n,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)

    expect(
      isCIP42({
        feeCurrency: mockAddress,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)

    expect(
      isCIP42({
        gatewayFeeRecipient: mockAddress,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)

    expect(
      isCIP42({
        gatewayFee: 789n,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)
  })

  test('it does not recognize valid CIP-42', () => {
    expect(isCIP42({})).toBe(false)

    expect(
      isCIP42({
        feeCurrency: '0x',
        gatewayFeeRecipient: '0x',
        gatewayFee: 0n,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isCIP42({
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isCIP42({
        feeCurrency: mockAddress,
        gatewayFeeRecipient: mockAddress,
        gatewayFee: 789n,
        from: mockAddress,
      }),
    ).toBe(false)
  })
})

describe('isCIP64', () => {
  test('it allows forcing the type even if transaction is not EIP-1159', () => {
    expect(
      isCIP64({
        type: 'cip64',
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
        from: mockAddress,
      }),
    ).toBe(true)
  })

  test('it recognizes valid CIP-64 without forced type', () => {
    expect(
      isCIP64({
        feeCurrency: mockAddress,
        gatewayFeeRecipient: '0x',
        gatewayFee: 0n,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)

    expect(
      isCIP64({
        feeCurrency: mockAddress,
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(true)
  })

  test('it does not recognize valid CIP-64', () => {
    expect(isCIP64({})).toBe(false)

    expect(
      isCIP64({
        feeCurrency: '0x',
        maxFeePerGas: 123n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(false)

    expect(
      isCIP64({
        feeCurrency: mockAddress,
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 456n,
        from: mockAddress,
      }),
    ).toBe(false)
  })

  expect(
    isCIP64({
      feeCurrency: mockAddress,
      maxFeePerGas: 123n,
      maxPriorityFeePerGas: 0n,
      from: mockAddress,
    }),
  ).toBe(false)

  expect(
    isCIP64({
      maxFeePerGas: 123n,
      maxPriorityFeePerGas: 456n,
      from: mockAddress,
    }),
  ).toBe(false)
})
