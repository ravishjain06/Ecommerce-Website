import React from 'react'
import HeroSection from './HeroSection'
import FaishonCard from './FaishonCard'
import NewArrival from './NewArrival'
import BigSavingZone from './BigSavingZone'
import Poster from './Poster'
import MenCategory from './MenCategory'
import WomenCategory from './WomenCategory'
import TopBrand from './TopBrand'
import Limelight from './Limelight'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FaishonCard />
      <NewArrival />
      {/* <BigSavingZone /> */}
      <MenCategory />
      <WomenCategory />
      <TopBrand />
      
      <Limelight />
    </div>
  )
}

export default Home