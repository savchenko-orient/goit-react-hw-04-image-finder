import { useEffect } from 'react';
import css from './Modal.module.css';
import PropTypes from 'prop-types';


export default function Modal({ imgAlt, imgLargeSrc, onKeyPress, onModalClose }) {

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
  })

  return (
    <>
      <div
        id="overlay"
        onClick={() => onModalClose()}
        className={css.Overlay}
      ></div>
      <div>
        <img className={css.Modal} src={imgLargeSrc} alt={imgAlt} />
      </div>
    </>
  );
}



Modal.propTypes = {
  imgAlt: PropTypes.string.isRequired,
  imgLargeSrc: PropTypes.string.isRequired,
};

