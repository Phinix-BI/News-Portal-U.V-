import React, { useState, useEffect } from "react"
import "./Popular.css"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// import { popular } from "../../../../dummyData"
import Heading from "../../../common/heading/Heading"
import axios from "axios"
import { url } from "../../../../api/index"
const Popular = () => {
 const settings = {
    className: "center",
    centerMode: false,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 2,
    speed: 500,
    rows: 4,
    slidesPerRow: 1,
    autoplay: true, // Autoplay option
    autoplaySpeed: 1500, // Slide change duration in milliseconds (1 second)
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 4,
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

        const lastFivePages = Array.from({ length: 6 }, (_, index) => totalPages - index);

        Promise.all(
          lastFivePages.map(page => axios.get(`${url}/api/posts?page=${page}`))
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
    <>
      <section className='popular'>
        <Heading title='Popular' />
        <div className='content'>
          <Slider {...settings}>
            {items.map((val, index) => {
              return (
                <div className='items' key={index}>
                  <div className='box shadow'>
                    <div className='images row'>
                   
                      <div className='img'>
                        {val.imageUrl && <img src={`${url}${val.imageUrl}`} alt='' />}
                      </div>
                      <div className='category category1'>
                        <span>{val.catgeory}</span>
                      </div>
                    </div> 
                    <div className='text row'>
                    <a href={`/SinglePage/${val._id}` }>
                      <h1 className='title'>{val.title.slice(0, 40)}...</h1>
                      <div className='date'>
                        <i className='fas fa-calendar-days'></i>
                        <label>{val.date}</label>
                      </div>
                      <div className='comment'>
                        <i className='fas fa-comments'></i>
                        <label>{val.comments}</label>
                      </div>
                      </a>
                    </div>
                    
                  </div>
                  
                </div>
              )
            })}
          </Slider>
        </div>
      </section>
    </>
  )
}

export default Popular
