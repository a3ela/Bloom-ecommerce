import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cartItems')
  ? { cartItems: JSON.parse(localStorage.getItem('cartItems')) }
  : { cartItems: [] };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // items price
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

        localStorage.setItem('cartItems', JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.action; 

export default cartSlice.reducer;
