import { ChangeEvent, useCallback, useState } from "react";
import _debounce from 'lodash/debounce';
import '../App.css';

type ImageCard = {
  id: string;
  name: string;
  image_uris: {
    small: string;
  }
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<ImageCard[]>([]);
  const baseUrl = 'https://api.scryfall.com';

  const fetchImages = async (q: string) => {
    const response = await fetch(`${baseUrl}/cards/search?q=${q}`);
    const result = (await response.json()).data as ImageCard[];
    setImages(result);
  }

  const debouncedFetchImages = useCallback(_debounce(fetchImages, 500), []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setQuery(value);
    debouncedFetchImages(value);
  }

  return (
    <div>
      Search
      <input type='tet' value={query} onChange={handleChange} placeholder='Search card images...'/>
      <div>Images fetched: {images?.length}</div>
      <div className='grid'>
        {
          images?.map(img => {
            return <img key={img.id} src={img.image_uris?.small} alt={img.name}/>
          })
        }
      </div>
    </div>
    
  )
}