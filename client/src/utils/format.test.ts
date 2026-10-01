import { describe, expect, it } from 'vitest'
import { formatCOP, formatNumber } from '@utils/format'

describe('formatCOP', () => {
  it('formatea pesos colombianos sin decimales', () => {
    // Intl usa espacio duro (U+00A0) después del símbolo de moneda
    expect(formatCOP(150000)).toBe('$\u00a0150.000')
  })

  it('formatea valores en cero', () => {
    expect(formatCOP(0)).toBe('$\u00a00')
  })

  it('formatea valores grandes', () => {
    expect(formatCOP(1234567)).toBe('$\u00a01.234.567')
  })
})

describe('formatNumber', () => {
  it('agrega separadores de miles', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('redondea decimales', () => {
    expect(formatNumber(1234.56)).toBe('1.235')
  })

  it('formatea cero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})
