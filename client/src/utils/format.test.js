import { describe, it, expect } from 'vitest';
import { formatEuro, formatNumero, parseEuro } from './format.js';

// Intl mette uno spazio non separabile (U+00A0) prima del simbolo €.
// Lo trasformo in spazio normale per poter scrivere i valori attesi in modo leggibile.
const normSpace = (text) => text.replace(/\u00A0/g, ' ');

describe('formatEuro', () => {
    it('converte i centesimi in euro', () => {
        expect(normSpace(formatEuro(1999))).toBe('19,99 €');
    });

    it('separa le migliaia con il punto', () => {
        expect(normSpace(formatEuro(150000))).toBe('1.500,00 €');
        expect(normSpace(formatEuro(99999))).toBe('999,99 €');
        expect(normSpace(formatEuro(1250000))).toBe('12.500,00 €');
    });

    it('formatta anche lo zero', () => {
        expect(normSpace(formatEuro(0))).toBe('0,00 €');
    });

    it('stringa vuota con null', () => {
        expect(formatEuro(null)).toBe('');
    });

    it('stringa vuota con undefined', () => {
        expect(formatEuro(undefined)).toBe('');
    });
});

describe('formatNumero', () => {
  it('scrive i centesimi con virgola e punto delle migliaia', () => {
    expect(formatNumero(123456)).toBe('1.234,56')
    expect(formatNumero(100000)).toBe('1.000,00')
  })

  it('formatta zero, valori piccoli e valori mancanti', () => {
    expect(formatNumero(0)).toBe('0,00')
    expect(formatNumero(5)).toBe('0,05')
    expect(formatNumero(null)).toBe('0,00')
  })
})

describe('parseEuro', () => {
  it('legge il formato italiano', () => {
    expect(parseEuro('1.234,56')).toBe(123456)
    expect(parseEuro('12,5')).toBe(1250)
    expect(parseEuro('12')).toBe(1200)
  })

  it('senza virgola il punto è un decimale', () => {
    expect(parseEuro('1000.50')).toBe(100050)
  })

  it('un testo non valido o vuoto vale zero', () => {
    expect(parseEuro('')).toBe(0)
    expect(parseEuro('abc')).toBe(0)
  })

  it('è l\'inverso di formatNumero', () => {
    expect(parseEuro(formatNumero(987654))).toBe(987654)
  })
})