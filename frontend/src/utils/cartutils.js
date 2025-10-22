export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
     state.itemsPrice = Number(
            addDecimals(
              state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            )
          );
    
          // shipping price (free if order > $100 else $10)
          state.shippingPrice = Number(addDecimals(state.itemsPrice > 100 ? 0 : 10));
    
          // tax price (15% of items price)
          state.taxPrice = Number(addDecimals(state.itemsPrice * 0.15));
    
          // total price
          state.totalPrice = (
            Number(state.itemsPrice) +
            Number(state.shippingPrice) +
            Number(state.taxPrice)
          ).toFixed(2);
    
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    
            return state;
}