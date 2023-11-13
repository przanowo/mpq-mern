import { CartState } from '../types/CartType';

// export const addDecimals = (num: number) => {
//   return (Math.round(num * 100) / 100).toFixed(2);
// };

export const updateCart = (state: CartState) => {
  // Calculate items price
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculate shipping price (If order > 100, shipping is free)
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

  // Calculate tax price
  state.taxPrice = Number((0.23 * state.itemsPrice).toFixed(2));

  // Calculate total price
  state.totalPrice =
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice);

  // Update localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
