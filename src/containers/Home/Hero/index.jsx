import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import { NavLink } from "react-router-dom";



const HeroContainer = () => {
	return(
	    <section className="hero-section moving section-padding" id="home">
	        <div className="moving-bg"></div>
	        <div className="hero-section-content">
	            
	            <div className="container ">
	                <div className="row align-items-center">
	                    <div className="col-12 col-lg-6 col-md-12">
	                        <div className="welcome-content">
	                            <div className="promo-section">
	                                <h3 className="special-head gradient-text">NFTs WITH GAINS</h3>
	                            </div>
	                            <h1>ISORAW brings you a fresh take on awesome <span className="gradient-text"> NFTs</span> </h1>
	                            <p className="w-text"> Your digital assets become a passive income channel, to get you swole in no time. Not only will you own awesome artwork but they will unlock awesome rewards and/or earn $ISO coin for each NFT you own. </p> 
	                            <p><span className="gradient-text">It's all about the gains bro. </span></p>
	                            <div className="dream-btn-group">
								<NavLink to="/Discover" className="btn btn-Collect more-btn mr-3">Explore More</NavLink>

									<NavLink to="/createitem" className="btn btn-Collect more-btn">Upload NFT</NavLink>
	                            </div>
	                        </div>
	                    </div>
	                    <div className="col-lg-6"></div>
	                </div>
	            </div>
	        </div>
	    </section>
	)
}

export default HeroContainer