import { Product } from './../models/Product';
import { useEffect, useState } from "react";

const baseUrl = "https://random-data-api.com/api";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/commerce/random_commerce?size=10`, { signal });
        if (!response.ok) {
          throw new Error('HTTP error fetching products: ' + response.status);
        }
        const result = await response.json() as Product[];
        setProducts(result.map((pd: Product) => { return {...pd,quantity: 0} }));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };
    fetchProducts();
  }, []);

  return { products, loading, error};
}