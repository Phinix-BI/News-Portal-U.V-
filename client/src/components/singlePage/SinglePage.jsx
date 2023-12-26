import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SinglePageSlider from "./slider/SinglePageSlider";
import Side from "../home/sideContent/side/Side";
import { url } from "../../api/index";
import "./singlepage.css";

const SinglePage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

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

    axios.get(`${url}/api/posts/${id}`)

      .then(async (response) => {
        const result = response.data;
        const imageUrl = await fetchImageURL(result.banner_img);
        setItem({ ...result, imageUrl });
      })
      .catch((error) => {
        console.log(error);
        setItem(null); // Set item to null on error
      });

  }, [id]);

  const renderHTML = (html) => {
    return { __html: html };
  };
  
  return (
    <>
       {item ? (
        <main>
          <SinglePageSlider />
          <div className='container'>
            <section className='mainContent details'>
              <h1 className='title'>{item.title}</h1>

              <div className='social'>
                <div className='socBox'>
                  <i className='fab fa-facebook-f'></i>
                  <span>SHARE</span>
                </div>
                <div className='socBox'>
                   <i className='fab fa-twitter'></i>
                   <span>TWITTER</span>
                 </div>
                 <div className='socBox'>
                   <i className='fab fa-pinterest'></i>
                   <span>Pinterest</span>
                 </div>
                 <div className='socBox'>
                   <i className='fa fa-envelope'></i>
                   <span>Redit</span>
                 </div>
                {/* Other social media share options */}
              </div>

              {/* Displaying the image */}
              <img src={`${url}${item.imageUrl}`}  alt={item.caption} />

              <div className='author'>
                {/* Assuming the article doesn't have an author */}
                <span>by&nbsp;</span>
                {/* <img src=Author image URL alt='' /> */}
                <p>ABC NEWS CO.</p>
                <label>On &nbsp;{item.date}</label>
              </div>

              {/* Article content */}
              <div dangerouslySetInnerHTML={renderHTML(item.content)} />

              

              {/* Other content sections */}
              {/* ... */}

            </section>
            <section className='sideContent'>
              <Side />
            </section>
          </div>
        </main>
      ) : (
        <h1>Not found</h1>
      )}
    </>
  );
};

export default SinglePage;

