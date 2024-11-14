import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import aboutBg from '../assets/aboutBg.png'

const About:React.FC = () => {
  return (
    <div>
        <Navbar />
        <div>
            <div>
                <img src={aboutBg} alt="about us background" className=' object-fit'/>
            </div>
            <div className='flex flex-col gap-8 justify-center items-center p-20'>
                <h1 className='text-5xl font-semibold pb-10'>BIG LIFE, SMALL FOOTPRINT</h1>
                <p className='px-40 text-lg'>Hi. Welcome to PRAK. We're here to create sustainably made shoes from recycled materials that feel like a warm hug from an old friend.
                    We bring to life timeless styles that effortlessly shift from casual Fridays to weekend escapes, from urban streets to coastal boardwalks
                    and everything in between - because that's just how we roll.</p>
                <p className='px-40 text-lg'>But we're about much more than shoes. Our values are stitched into every step we take—quite literally. Using recycled and sustainably
                    sourced materials in our ethically crafted footwear, we believe in providing the foundation for a life well-lived. A life where making
                    memories will always be the most important thing on the to-do list, now and 30 years down the road.</p>
                <p className='px-40 text-lg'>So, as you find your path, no matter how winding, know every step you take with us is a step towards a big life with a small footprint.</p>
            </div>
        </div>
    </div>
  )
}

export default About