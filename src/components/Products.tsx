import { Product } from "../models/Product";

type ProductProps = {
  products: Product[];
  addToCart: Function;
}

export default function Products({ products, addToCart }: ProductProps) {
  return (
    <div>
      {products.map((product) => {
        return (
          <div key={product.id}>
            <p>
              {product.product_name} costs ${product.price}
            </p>
            <button onClick={() => addToCart(product)}>Add to cart</button>
          </div>
        );
      })}
    </div>
  );
}
