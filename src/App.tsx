import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import './App.css';

/**
 * Instructions
 * 1. Call API -- done
 * 2. Display images on 5x6 grid -- done
 * 3. Add input to filter search requests to API -- done
 * 4. Optimize -- done
 */

type Data = {
  id: string;
  name: string;
  image_uris: {
    small: string;
  }
}

function App() {
  console.log('App mounted');
  const [images, setImages] = useState<Data[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const baseUrl = 'https://api.scryfall.com/cards/search?q='; // ex. query = c:white mv=1

  const debouncedChange = useRef(
    _debounce((nextValue: string) => {
      console.log('query change: ', nextValue);
      setQuery(nextValue);
    }, 500)
  ).current;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedChange(event.target.value);
  }

  useEffect(() => {
    console.log('Use Effect...');
    const controller = new AbortController();
    const signal = controller.signal;

    async function getImages(q: string): Promise<void> {
      console.log('set loading true...');
      setLoading(true);
      console.log('set error null...');
      setError(null)
      try {
        console.log('fetch api data');
        const response = (await fetch(baseUrl + q, { signal }));
        if (!response.ok) {
          throw new Error('Error fetching images!');
        }
        const result = (await response.json()).data as Data[];
        console.log('result: ', result);
        setImages(result);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    if (query) {
      console.log('fetching images with query: ', query);
      getImages(query);
    }

    return () => {
      console.log('Use Effect cleanup...');
      return controller.abort();
    }

  }, [query]);

  if (loading) return <div>Loading...</div>
  if (!images) return <div>No images loaded!</div>

  return (
    <div>
      <input type='text' ref={inputRef} defaultValue={query} onChange={handleChange} placeholder='Search cards...' />
      {!error &&
        <div className='grid'>
          {
            images.map(img => {
              return <img key={img.id} src={img.image_uris?.small} alt={img.name} />
            })
          }
        </div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default App;
