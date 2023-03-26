import { formatCurrency } from './numbers';

describe('Number utils', () => {

  describe('formatCurrency', () => {
    describe('When a number amount is 100', () => {
      it('should return "$100.00"', () => {
        const value = formatCurrency(100);
        expect(value).toEqual('$100.00');
      });
    });

    describe('When a number amount is -100', () => {
      it('should return "-$100.00"', () => {
        const value = formatCurrency(-100);
        expect(value).toEqual('-$100.00');
      });
    });
  });

});