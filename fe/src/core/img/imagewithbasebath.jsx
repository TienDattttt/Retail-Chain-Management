import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { base_path } from "../../environment";
const ImageWithBasePath = (props) => {
  // Check if src is a full URL (starts with http:// or https://)
  const isFullUrl = props.src.startsWith('http://') || props.src.startsWith('https://');
  
  let fullSrc;
  if (isFullUrl) {
    // Use the full URL as-is for external images (like Cloudinary)
    fullSrc = props.src;
  } else {
    // Combine the base path and the provided src for local images
    const srcPath = props.src.startsWith('/') ? props.src : `/${props.src}`;
    fullSrc = `${base_path}${srcPath}`;
  }
  
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

// Add PropTypes validation
ImageWithBasePath.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired, // Make 'src' required
  alt: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
};

export default ImageWithBasePath;
