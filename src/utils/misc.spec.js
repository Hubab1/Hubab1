import { prettyCurrency } from './misc';

describe('prettyCurrency', () => {
    it('Makes currency currency', () => {
        expect(prettyCurrency(120.50)).toEqual('$120.50');
        expect(prettyCurrency(120)).toEqual('$120');
        expect(prettyCurrency(0)).toEqual('$0');
        expect(prettyCurrency(null)).toEqual('');
    });
    it('Optional argument decimal places rounds numbers', () => {
        expect(prettyCurrency(120.50, 0)).toEqual('$121');
        expect(prettyCurrency(120.49, 0)).toEqual('$120');
    });
});
