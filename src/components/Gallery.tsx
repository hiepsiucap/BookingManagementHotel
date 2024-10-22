/** @format */
"use client";
import styled from "styled-components";
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
const StyledLeftNav = styled.button`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;

  .image-gallery-icon {
    width: 100%;
    height: 100%;
  }
`;

const StyledRightNav = styled.button`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;

  .image-gallery-icon {
    width: 100%;
    height: 100%;
  }
`;
const Gallery = ({
  images,
}: {
  images: Array<{ original: string; thumbnail: string }>;
}) => {
  return (
    <ImageGallery
      items={images}
      renderLeftNav={() => null} // Không render nút trái
      renderRightNav={() => null}
    />
  );
};

export default Gallery;
