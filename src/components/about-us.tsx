// AboutUsPage.js
import React from 'react';
import '../styles/AboutUsPage.css';
import backgroundImage from '../assets/about-us/bg.png';
import {Navbar} from "../UserComponents/Navbar"; // Add path to your background image

const AboutUsPage = () => {
    return (
        <div className="about-us-container">
            <Navbar/>
            <div
                className="about-us-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <h1 className="about-us-title">About Us</h1>
            </div>
            <div className="about-us-content">
                <h2 className="about-us-heading">BIG LIFE, SMALL FOOTPRINT</h2>
                <p className="about-us-text">
                    Hi. Welcome to SAOLA. We're here to create sustainably made shoes from recycled materials that feel like a warm hug from an old friend.
                    We bring to life timeless styles that effortlessly shift from casual Fridays to weekend escapes, from urban streets to coastal boardwalks
                    and everything in between - because that's just how we roll.
                </p>
                <p className="about-us-text">
                    But we're about much more than shoes. Our values are stitched into every step we take—quite literally. Using recycled and sustainably
                    sourced materials in our ethically crafted footwear, we believe in providing the foundation for a life well-lived. A life where making
                    memories will always be the most important thing on the to-do list, now and 30 years down the road.
                </p>
                <p className="about-us-text">
                    So, as you find your path, no matter how winding, know every step you take with us is a step towards a big life with a small footprint.
                </p>
            </div>
        </div>
    );
};

export default AboutUsPage;
