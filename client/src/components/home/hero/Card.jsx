import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import {url} from "../../../../src/api/index";

const Card = ({ item: { _id, banner_img, title, content, date } }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Fetch image URL from the server using the image file name (banner_img)
    axios.get(`${url}/api/getImageURL?filename=${banner_img}`)
      .then(response => {
        setImageUrl(response.data.imageUrl);
      })
      .catch(error => {
        console.error("Error fetching image:", error);
      });
  }, [banner_img]);

  return (
    <div className='box'>
      <div className='img'>
        {/* Display image once imageUrl is fetched */}
        {imageUrl && <img src={`${url}${imageUrl}`} alt='' />}
      </div>
      {/* Other parts of the card component remain the same */}
      <div className='text'>
        {/* Assuming 'category' is not present in your data */}
        {/* <span className='category'>{category}</span> */}
        <a href={`/SinglePage/${_id}`}>
          <h1 className='titleBg'>{title}</h1>
        </a>
        {/* Author and time fields may need to be adjusted based on your data */}
        <div className='author flex'>
          {/* Replace 'authorName' and 'time' with appropriate fields from your data */}
          {/* <span>by {authorName}</span>
          <span>{time}</span> */}
          <span>Date: {date}</span>
        </div>
      </div>
    </div>
    
  );
};

export default Card;
