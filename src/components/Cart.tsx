import { Product } from "../models/Product";

type CartProps = {
  products: Product[];
  removeFromCart: Function;
}

export default function Cart({ products, removeFromCart }: CartProps) {
  return (
    <div>
      {products.map((product) => {
        return (
          <div key={product.id}>
            <p>
              {product.product_name} costs ${product.price}
            </p>
            <button onClick={() => removeFromCart(product)}>
              Remove from cart
            </button>
          </div>
        );
      })}
    </div>
  );
}

