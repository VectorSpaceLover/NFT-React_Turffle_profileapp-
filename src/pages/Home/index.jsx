import React from 'react'
import '../../assets/css/home.css'
// import './home.css'
import Head from '../../layouts/Head';
import HomeContainer from '../../containers/Home';
import Footer from '../../layouts/Footer';




const Home = () => {

  return (
  	<>
			<div>
			<Head Title='ISO RAW' />
			<HomeContainer />
			<Footer />
			</div>

  		
    </>
  );
}

export default Home;

