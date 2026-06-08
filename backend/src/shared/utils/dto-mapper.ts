export const decimalToNumber = (value: any): number => {
    if (value && typeof value.toNumber === "function") {
        return value.toNumber();
    }
    return value;
};

export const mapProductDTO = (product: any): any => ({
    ...product,
    price: decimalToNumber(product.price),
});

export const mapCartItemDTO = (cartItem: any): any => ({
    ...cartItem,
    product: mapProductDTO(cartItem.product),
});
