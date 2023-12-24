import React, { useEffect, useState } from "react";
import "./music.css";
import Slider from "react-slick";
import Heading from "../../../common/heading/Heading";
import axios from "axios";
import {url} from "../../../../../src/api/index";

const Music = () => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
    autoplay: true, // Autoplay option
    autoplaySpeed: 1500, // Slide change duration in milliseconds (1 second)
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchImageURL = async (filename) => {
      try {
        const response = await axios.get(`${url}/api/getImageURL?filename=${filename}`);
        return response.data.imageUrl;
      } catch (error) {
        console.error("Error fetching image:", error);
        return ''; // Return an empty string on error
      }
    };

    axios.get(`${url}/api/v2/posts?category=Fun`)
      .then(async (response) => {
        let fetchedItems = response.data.results.map(async (result) => {
          const imageUrl = await fetchImageURL(result.banner_img);
          return { ...result, imageUrl };
        });

        Promise.all(fetchedItems).then((data) => {
          setItems(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const cleanHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <section className='music'>
      <Heading title='Music News' />
      <div className='content'>
        <Slider {...settings}>
          {items.map((val, index) => (
            <div className='items' key={index}>
              <div className='box shadow flexSB'>
                <div className='images'>
                  <div className='img'>
                  {val.imageUrl && <img src={`${url}${val.imageUrl}`} alt='' />}
                  </div>
                  <div className='category category1'>
                    <span>{val.catgeory}</span>
                  </div>
                </div>
                <div className='text'>
                  <h1 className='title'>{val.title.slice(0, 40)}...</h1>
                  <div className='date'>
                    <i className='fas fa-calendar-days'></i>
                    <label>{val.date}</label>
                  </div>
                  <p className='desc'>{cleanHTML(val.content).slice(0, 250)}...</p>
                  <div className='comment'>
                    <i className='fas fa-share'></i>
                    <label>Share / </label>
                    <i className='fas fa-comments'></i>
                    <label>{val.comments}</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Music;
