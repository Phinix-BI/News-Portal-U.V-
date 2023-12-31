import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../../../common/heading/Heading";
import axios from "axios";
import "../Ppost/ppost.css";
import {url} from "../../../../../src/api/index";

const Life = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
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

    axios.get(`${url}/api/posts`)
      .then((response) => {
        const totalPosts = response.data.next.totalDocuments || 0;
        const totalPages = Math.ceil(totalPosts / 5);

        const pageNumbersToFetch = [];
        if (totalPages > 6) { // Considering the scenario where there are at least 7 pages
          pageNumbersToFetch.push(totalPages - 4); // Fetch data from the last 2 pages
          pageNumbersToFetch.push(totalPages - 5);
        } else {
          // Fetch the available pages if there are less than 7 pages
          for (let i = totalPages; i > 0 && pageNumbersToFetch.length < 2; i--) {
            pageNumbersToFetch.push(i);
          }
        }

        Promise.all(
          pageNumbersToFetch.map(page => axios.get(`${url}/api/posts?page=${page}`))
        ).then(async (pageResponses) => {
          let fetchedItems = [];
          for (const pageResponse of pageResponses) {
            if (pageResponse.data && pageResponse.data.results) {
              for (const result of pageResponse.data.results) {
                const imageUrl = await fetchImageURL(result.banner_img);
                fetchedItems.push({ ...result, imageUrl });
              }
            }
          }

          setItems(fetchedItems.reverse());
        }).catch((error) => {
          console.log(error);
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className='popularPost life'>
      <Heading title='Life Style' />
      <div className='content'>
        <Slider {...settings}>
          {items.map((val, index) => (
            <div className='items' key={index}>
              <div className='box shadow'>
                <div className='images Life-images'>
                  <div className='img Life-img'>
                    {val.imageUrl && <img src={`${url}${val.imageUrl}`} alt='' />}
                  </div>
                  <div className='category category1'>
                    <span>{val.catgeory}</span>
                  </div>
                </div>
                <div className='text'>
                 <a href={`/SinglePage/${val._id}` }>
                  <h1 className='title'>{val.title.slice(0, 40)}...</h1>
                  <div className='date'>
                    <i className='fas fa-calendar-days'></i>
                    <label>{val.date}</label>
                  </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Life;
