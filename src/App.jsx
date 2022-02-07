import React , { useEffect } from "react";
import {Helmet} from "react-helmet";

import Aos from 'aos'
import {
    Activity,
    Auctions,
    Authors,
    ConnectWallet,
    Contact,
    CreateItem,
    Discover,
    Home,
    ItemDetails,
    Profile,
    Login,
    SignUp,
} from './pages'
import Purchased from "./pages/Purchased";
import ProfileAsViewer from "./pages/ProfileAsViewer";

import 'aos/dist/aos.css';
import './assets/css/bootstrap.min.css'
import './assets/css/global.css'
// import '../../assets/css/style.css';
// import './global.css';

import 'bootstrap/dist/js/bootstrap.bundle.min';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { update} from "./store1/cart-actions";
import { cartActions } from "./store1/cart-slice";

const App = () => {
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(update())
    dispatch(cartActions.balance(12))
  },[])

  useEffect(() => {

    Aos.init({
      duration: 1000
      })
  },[])


  return (
    
    	<div className="App">

        <Helmet>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>
            NFT Marketplace
          </title>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
          <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Helmet>

  			<Switch>
          <Route path="/" exact component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/createitem" component={CreateItem} />
  				<Route path="/discover" component={Discover} />
          <Route path="/itemDetails/:itemId" component={ItemDetails} />
          <Route path="/profile/:creatorId" component={ProfileAsViewer} />
          <Route path="/profile"  component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/Purchased" component={Purchased} />
          
  			</Switch>
	    </div>
    	
    
  );
}

export default App;