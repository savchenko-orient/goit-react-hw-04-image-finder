import { useState, useEffect } from 'react';
import { fetchImages } from '../Services/Api';
import css from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const perPage = 12;

export default function App() {

  let [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  let [page, setPage] = useState(1);
  let [totalHits, setTotalHits] = useState(0);
  let [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [imgLargeSrc, setImgLargeSrc] = useState(null);
  const [imgAlt, setImgAlt] = useState(null);

  const loadImages = (response) => {
    setImages(() => images = response.hits)
    setTotalHits(() => totalHits = response.totalHits)
  }
  const loadMoreImages = (response) => {
    setImages((images) => [...images, ...response.hits]);
  }

  useEffect(() => {
    if (query === '') return

    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetchImages(query, page);

        if (page === 1) {
          loadImages(response);
        }

        if (page >= 2) {
          loadMoreImages(response)
        }
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, page])

  const handleFormSubmit = newQuery => {
    setQuery(() => newQuery);
    setPage(() => 1);
    setImages(() => []);
  };

  const handleLoadMore = () => {
    setPage(() => page + 1)
  };

  const handleshowModal = event => {
    setImgAlt(() => event.target.alt);
    setImgLargeSrc(() => event.target.srcset);
    setIsOpenModal(() => !isOpenModal);
  };
  const onKeyPress = event => {
    if (event.keyCode === 27) {
      onModalClose()
    }
  };

  const onModalClose = () => {
    setImgAlt(() => '');
    setImgLargeSrc(() => '');
    setIsOpenModal(() => !isOpenModal);
  };
  return (
    <div className={css.App}>
      <Searchbar
        onSubmit={handleFormSubmit}
      />
      <ImageGallery images={images} handleshowModal={handleshowModal} />
      <Loader isLoading={isLoading} />

      {images.length > 0 && page * perPage < totalHits && (
        <Button
          buttonText={isLoading ? 'Loading...' : 'Load More'}
          handleLoadMore={handleLoadMore}
        />
      )}
      {isOpenModal && (
        <Modal
          imgAlt={imgAlt}
          imgLargeSrc={imgLargeSrc}
          onKeyPress={onKeyPress}
          onModalClose={onModalClose}
        />
      )}
    </div>
  )
}