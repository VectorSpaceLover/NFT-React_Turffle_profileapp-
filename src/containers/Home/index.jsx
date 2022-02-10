import HeroContainer from './Hero'
import TopSellers from '../../components/TopSellers'
import TopCollections from '../../components/TopCollections'
import ListedItems from '../../components/ListedItems'
import LiveAuctions from '../../components/LiveAuctions'
import React from 'react'

import '../../assets/css/home.css'
import NFTFilter from '../../pages/NFTFilter'

const HomeContainer = () => {

  return (
  	<>
	  <HeroContainer />
		{/* <TopSellers /> */}
		<TopCollections />
		<NFTFilter/>
		{/* <ListedItems /> */}
		{/* <LiveAuctions /> */}

    </>
  );
}

export default HomeContainer;