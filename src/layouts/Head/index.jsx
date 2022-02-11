import React , {useEffect,useState,useContext} from "react";
import { NavLink } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";

import "jquery-syotimer";
import detectEthereumProvider from '@metamask/detect-provider'
import { DeFiWeb3Connector } from 'deficonnect'
import { Modal } from 'react-bootstrap'


// import './script.js'
import './navbar.css'
import {NavbarLogo} from '../../utils/allImgs'
import {Addshrink} from '../../utils'
import Preloader from '../../components/Preloader'
import { useWeb3 } from '../../components/web3'
import Web3 from "web3"
import WalletAlert from "../../components/WalletAlert";
import { Provider } from "react-redux";
import Store from "../../store1/index";
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect ,connectEther} from "../../store1/cart-actions";
import { cartActions } from "../../store1/cart-slice";
function Head({Title}){

    useEffect(() => {

        Addshrink()

    },[window.pageYOffset])


    const account=useSelector((state)=>state.cart.account)
    const web=useSelector((state)=>state.cart.web3)
    const provider=useSelector((state)=>state.cart.provider)

    const dispatch = useDispatch();
    //////////////////////////////////////////////////////////////////////
    const maskhandler = () => {
    dispatch(connectMetamask())
    }
    const defihandler = () => {
    dispatch(connectDefi());
    }

    const connectEtherhandler = () => {
      dispatch(connectEther());
      }
    const disconnecthandler = () => {
      dispatch(disconnect())
    }
    

          
  useEffect(() => {
    detectEthereumProvider().then((provider) => {
      if(provider) {
        web.setWe3Api({provider:provider});
        window.ethereum.request({
          method: 'eth_accounts'
        }).then((accounts) => {
          const addr = (accounts.length <= 0) ? '' : accounts[0];
          if (accounts.length > 0) {
            web.setWe3Api({account:addr});
          }
        }).catch((err) => {
          console.log(err);
        });
      }    
    }).catch ((err) => {
      console.log(err);
    });
  }, [])

  // useEffect(() => {
  //   if ( window.ethereum ) {
  //     window.ethereum.on('accountsChanged', async function (accounts) {
  //       if ( web.web3 ) {
  //         console.log("load");
  //         // setAccounts(accounts[0]);   
  //         // setAddress(accounts[0]);
  //         web.setWe3Api({account:accounts[0]});

  //         let amount = await web.web3.eth.getBalance(accounts[0]);
  //       }
  //     });
  //   }
  // }, [web.web3])
  
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleCloseDisconnect = () => setShowDisconnect(false);
  const handleShowDisconnect= () => setShowDisconnect(true);
      //Craete function to listen the change in account changed and network changes
      // const provider1 = new WalletConnectProvider({
      //   rpc: {
      //     338: "https://cronos-testnet-3.crypto.org:8545",
      //     100: "https://dai.poa.network",
      //     // ...
      //   },
      // });

      // const connectEther = async () => {
      //   console.log("))))")
      // await provider1.enable();

      // const web3 = new Web3(provider1);
      // console.log("****")


      // }
    



  return(
    <>
        <Preloader Title={Title} />
        <nav className="navbar navbar-expand-lg navbar-white fixed-top" id="banner">
            <div className="container">
                <div className="row ">
                <NavLink className="navbar-brand" to="/"><span><img src={NavbarLogo} alt="logo" /></span></NavLink>

                <NavLink className="navbar-brand text-secondary d-flex mr-1 pt-4" to="/">ISORAW</NavLink>

                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto">
                  
                        
                    <li className="nav-item ">
                            <NavLink className="nav-link text-secondary" to="/Discover">Collections</NavLink>
                        </li>
        
                        <li className="nav-item">
                            <NavLink className="nav-link text-secondary " to="/Purchased">Purchased</NavLink>
                        </li>
                        
                        <li className="nav-item">
                            <NavLink className="nav-link text-secondary" to="/profile">Profile</NavLink>
                        </li>
                     
                       
                        {/* <li className="lh-55px"><NavLink to="/connectwallet" className="btn login-btn ml-50">Connect Wallet</NavLink></li> */}

                    </ul>
                    {
                        account? 
                      <> 
                       <button  className="btn login-btn ml-50" onClick={handleShowDisconnect}>  {account.toString()}</button>  
     
                       <Modal show={showDisconnect} onHide={handleCloseDisconnect}>
                      <Modal.Header closeButton>
                      <Modal.Title>Are You Sure To Disconnect</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                      <button  className="btn login-btn ml-50" onClick={disconnecthandler}>
                          Disconnect WAllet
                      </button>
                
                      </Modal.Body>
                  </Modal>
                      </>
                         

                                           
                :    <button  className="btn login-btn ml-50"  onClick={handleShow}> Connect Wallet</button>

                    }
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Select Your Wallet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <button  className="btn login-btn ml-50" onClick={maskhandler}>
                            MetaMask
                        </button>
                        <button className="btn login-btn ml-50" onClick={defihandler}>
                            Defi Wallet
                        </button>
                        <button className="btn login-btn ml-50" onClick={connectEtherhandler}>
                            Mobile Wallet
                        </button>
                        </Modal.Body>
                    </Modal>


                    

                </div>
              
            </div>
          
        </nav>
    </>
  )
}

export default Head