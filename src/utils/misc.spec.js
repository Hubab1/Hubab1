import { prettyCurrency, getHasApplicationForUnit } from './misc';

describe('prettyCurrency', () => {
    it('Makes currency currency', () => {
        expect(prettyCurrency(120.5)).toEqual('$120.50');
        expect(prettyCurrency(120)).toEqual('$120');
        expect(prettyCurrency(0)).toEqual('$0');
        expect(prettyCurrency(null)).toEqual('');
    });
    it('Optional argument decimal places rounds numbers', () => {
        expect(prettyCurrency(120.5, 0)).toEqual('$121');
        expect(prettyCurrency(120.49, 0)).toEqual('$120');
    });
});

describe('getHasApplicationForUnit', () => {
    it('returns true when unit is assigned to one of the applications, false otherwise', () => {
        const applications = [{ id: 1, unit: { id: 1 } }, { id: 2, unit: { id: 2 } }];

        expect(getHasApplicationForUnit(applications, 1)).toBe(true);
        expect(getHasApplicationForUnit(applications, 2)).toBe(true);
        expect(getHasApplicationForUnit(applications, 3)).toBe(false);
    });
});
