import { describe, it, expect } from 'vitest';
import { formatEuro } from './format';

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
