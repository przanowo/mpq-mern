interface OrderItem {
  price: number;
  qty: number;
}

function addDecimals(num: number): string {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems: OrderItem[]): {
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
} {
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Convert itemsPrice back to a number for comparison
  const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * Number(itemsPrice)).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
