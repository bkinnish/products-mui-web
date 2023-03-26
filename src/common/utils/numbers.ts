export const formatCurrency: (amount: number) => string = amount => {
    const formatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    });
    return formatter.format(amount || 0);
}
