const { renderTemplate } = require('../src/utils/template');

describe('renderTemplate', () => {
    it('substitui valores aninhados', () => {
        expect(renderTemplate('Olá, {{ lead.name }}!', { lead: { name: 'Eric' } })).toBe(
            'Olá, Eric!',
        );
    });

    it('substitui valores ausentes por texto vazio', () => {
        expect(renderTemplate('Telefone: {{lead.phone}}', { lead: {} })).toBe('Telefone: ');
    });
});
