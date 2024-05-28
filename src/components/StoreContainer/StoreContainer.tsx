import { useState, ChangeEvent, useCallback } from "react";
import Products from "../Products";
import Cart from "../Cart";
import { Product } from "../../models/Product";
import useProducts from "../../hooks/useProducts";
import debounce from 'lodash/debounce';
import "./StoreContainer.css";

function StoreContainer() {
  const [cart, setCart] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const {products, loading, error} = useProducts();
  const filteredProducts = products.filter(product => product.product_name.toLowerCase().includes(query.toLowerCase()));

  const handleSearch = useCallback((newQuery: string) => {
    debounce(() => {
      setQuery(newQuery);
    }, 500)
  }, []);


  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearch(event.target.value);
  };

  const handleAddToCartChange = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(p => p.id === product.id);

      if (existingProduct) {
        return prevCart.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
      } else {
        return [...prevCart, { ...product, quantity: 1}];
      }
    });
  }, []);

  // todo: wrap in use callback
  const handleRemoveFromCartChange = (product: Product) => {
    setCart((prevCart) => {
      // TODO: remove item from cart
      return prevCart;
    })
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products {error}</div>;

  return (
    <>
    <h1 className='title'>Store Container</h1>
    <div className="store-container">
      <div className="item-outer-container">
        <p>Filter</p>
        <div>
          <label>Search Products</label>
          <input type="text" value={query} onChange={handleSearchChange} />
        </div>
      </div>
      <div className="item-outer-container">
        <p>Products</p>
        <div>
          <Products
            products={filteredProducts}
            addToCart={handleAddToCartChange}
          />
        </div>
      </div>
      <div className="item-outer-container">
        <p>Cart</p>
        <div>
          <Cart products={cart} removeFromCart={handleRemoveFromCartChange} />
        </div>
      </div>
    </div>
    </>
  );
}

export default StoreContainer;

