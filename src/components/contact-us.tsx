// ContactUsPage.js
import React from 'react';
import '../styles/contact-us.css';
import backgroundImage from '../assets/about-us/bg.png';
import {Navbar} from "../UserComponents/Navbar"; // Add path to your background image

const ContactUsPage = () => {
    return (
        <div className="contact-us-container">
            <Navbar/>
            <div
                className="contact-us-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <h1 className="contact-us-title">Contact Us</h1>
            </div>
            <div className="contact-us-content">
                <h2 className="contact-us-heading">WE'D LOVE TO HEAR FROM YOU</h2>
                <p className="contact-us-text">
                    Have questions, feedback, or just want to say hello? Reach out to us!
                    We're here to assist you with any inquiries and make your experience as smooth as possible.
                </p>
                <form className="contact-form">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required></textarea>

                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsPage;
