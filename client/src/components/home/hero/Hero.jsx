import React, { useState, useEffect } from "react";
import "./hero.css";
import Card from "./Card";
import axios from "axios";
import {url} from "../../../../src/api/index";
const Hero = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${url}/api/posts`)
      .then((response) => {
        const totalPosts = response.data.next.totalDocuments || 0;
        const totalPages = Math.ceil(totalPosts / 5);
  
        axios.get(`${url}/api/posts?page=${totalPages}`)
          .then((newResponse) => {
            if (newResponse.data && newResponse.data.results.length >= 4) {
              setItems(newResponse.data.results.slice(-4));
            } else if (totalPages > 1) {
              // Fetch from the previous page if the last page contains less than 4 items
              axios.get(`${url}/api/posts?page=${totalPages - 1}`)
                .then((previousResponse) => {
                  if (previousResponse.data && previousResponse.data.results) {
                    setItems(previousResponse.data.results.slice(-4));
                  } else {
                    console.error("Invalid data format received in the adjusted request:", previousResponse.data);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("No items available");
            }
          })
          .catch((error) => {
            console.log(error);
          });
  
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  return (
    <section className='hero'>
      <div className='container'>
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item._id} item={item} />
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </section>
  );
};

export default Hero;
