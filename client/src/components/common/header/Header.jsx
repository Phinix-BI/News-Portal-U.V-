import React, { useState } from "react"
import Head from "./Head"
import "./header.css"
import { Link } from "react-router-dom"
import {url} from "../../../../src/api/index";

console.log(url);
const adminLink = `${url}/Admin_Login`;

const Header = () => {
  const [navbar, setNavbar] = useState(false)

  return (
    <>
      <Head />
      <header>
        <div className='container paddingSmall'>
          <nav>
            <ul className={navbar ? "navbar" : "flex"} onClick={() => setNavbar(false)}>
              <li>
                <a href='/'>Home</a>
              </li>
              <li>
                <Link to='/hero'>Recent</Link>
              </li>
              <li>
                <Link to='/popular'>Popular</Link>
              </li>
              <li>
                <Link to='/music'>Music</Link>
              </li>
              <li>
                <Link to='/sports'>Sports</Link>
              </li>
              <li>
                <Link to='/life'>Lifestyle</Link>
              </li>
              <li>
                <Link to='/reviews'>Reviews</Link>
              </li>
              <li>
               {/* Use an anchor tag for external links */}
               <a href={adminLink} target='_blank' rel='noopener noreferrer'>Admin</a>
              </li>
            </ul>
            <button className='barIcon' onClick={() => setNavbar(!navbar)}>
              {navbar ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
