const { validateInput } = require('../src/utils/inputValidators');

describe('validateInput', () => {
    it('valida textos não vazios', () => {
        expect(validateInput('Eric', 'non_empty')).toBe(true);
        expect(validateInput(' ', 'non_empty')).toBe(false);
    });

    it('valida inteiros positivos dentro do limite', () => {
        expect(validateInput('3', 'positive_integer')).toBe(true);
        expect(validateInput('0', 'positive_integer')).toBe(false);
        expect(validateInput('51', 'positive_integer')).toBe(false);
    });

    it('valida datas reais no formato brasileiro', () => {
        expect(validateInput('29/02/2028', 'date_br')).toBe(true);
        expect(validateInput('29/02/2027', 'date_br')).toBe(false);
        expect(validateInput('2027-02-28', 'date_br')).toBe(false);
    });

    it('compara uma data com outro campo do lead', () => {
        const context = { lead: { checkin: '20/10/2026' } };
        expect(validateInput('23/10/2026', 'date_after:checkin', context)).toBe(true);
        expect(validateInput('20/10/2026', 'date_after:checkin', context)).toBe(false);
        expect(validateInput('19/10/2026', 'date_after:checkin', context)).toBe(false);
    });

    it('rejeita validadores desconhecidos', () => {
        expect(() => validateInput('valor', 'desconhecido')).toThrow(/desconhecido/);
    });
});
