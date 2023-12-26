import React, { useState, useEffect } from "react";
import Header from "./components/common/header/Header";
import "./App.css";
import Homepages from "./components/home/Homepages";
import Footer from "./components/common/footer/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SinglePage from "./components/singlePage/SinglePage";
import Culture from "./components/culture/Culture";
import Loader from "./components/Loader/loader"; // Import your Loader component
import { fetchDataFromBackend } from "./api/index";
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = setTimeout(() => {
      setLoading(false); // Set loading to false after your content is loaded
    }, 3000);

    // window.addEventListener('load', handleLoad); // Listen for the 'load' event

    return () => {
      // window.removeEventListener('load', handleLoad); // Clean up event listener on unmount
      clearTimeout(handleLoad);
    };
  }, []);

  return (
    <Router>
    {loading ? (
      <Loader /> // Use the Loader component while loading
    ) : (
      <>
        <Header />
        <Switch>
          <Route exact path='/' component={Homepages} />
          <Route path='/singlepage/:id' exact component={SinglePage} />
          <Route exact path='/culture' component={Culture} />
        </Switch>
        <Footer />
      </>
    )}
  </Router>
  );
};

export default App;
