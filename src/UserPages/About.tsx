import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import bgImg from '../assets/bg.png'

const About:React.FC = () => {
  return (
    <div>
      <Navbar />
      <div>
        <img src={bgImg} alt='prak-about-bg' className='object-cover' />
      </div>
      <div className='flex flex-col gap-6 pt-10 px-72 text-lg'>
        <h1 className='text-3xl font-bold text-center'>BIG LIFE, SMALL FOOTPRINT</h1>
        <p className=''>
        Hi. Welcome to PRAK. We're here to create sustainably made shoes from recycled materials that feel like a warm hug from an old friend.
                    We bring to life timeless styles that effortlessly shift from casual Fridays to weekend escapes, from urban streets to coastal boardwalks
                    and everything in between - because that's just how we roll.
        </p>
        <p>
        But we're about much more than shoes. Our values are stitched into every step we take—quite literally. Using recycled and sustainably
                    sourced materials in our ethically crafted footwear, we believe in providing the foundation for a life well-lived. A life where making
                    memories will always be the most important thing on the to-do list, now and 30 years down the road.
        </p>
        <p className='pb-20'>
          So, as you find your path, no matter how winding, know every step you take with us is a step towards a big life with a small footprint.
        </p>
      </div>
    </div>
  )
}

export default About