import { NavLink } from "react-router-dom";
import {SortingCard} from '../../utils'
import CollectionItem from './CollectionItem'
import Breadcumb from '../../components/Breadcumb'
import {ProfileData} from '../../data/data-containers/data-Profile.js'
import React,{useState,useEffect,useContext} from "react";
import axios from 'axios'

import { useWeb3 } from '../../components/web3'
import Web3 from "web3"
import '../../assets/css/profile.css'
import ListedItemsItem from '../../components/ListedItemsItem'
import Head from "../../layouts/Head";
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect } from "../../store1/cart-actions";
import { cartActions } from "../../store1/cart-slice";


const ProfileContainer = () => {

	
	
	const account=useSelector((state)=>state.cart.account)
	const web=useSelector((state)=>state.cart.web3)
	const provider=useSelector((state)=>state.cart.provider)
	 
		const[noProvider,setNoProvider] = useState(true);
	
	
	  
	
		//Create LoadAccounts Function
		const[accountBalance,setAccountBalance]= useState(0);
	
	
		const [isLoading,setIsLoading] = useState(true);
	
	
		//Load Contracts Function
		const[nftContract,setNFtContract]= useState(null)
		const[marketContract,setMarketContract]= useState(null)
		const[nftAddress,setNFtAddress]= useState(null)
		const[marketAddress,setMarketAddress]= useState(null)
		const[unsoldItems,setUnsoldItems]= useState([])
	
		const[tokenContract,setTokenContract]= useState(null)
		const[tokenBalance,setTokenBalnce] =useState("0");
		const [creatorCommissionValueInwei,setCreatorCommissionValueInwei]= useState(null)
	
  
  
	  //Load Contracts Function
	  const[creathedItems,setcreathedItems]= useState([])
	  const[soldItems,setSoldItems]= useState([])
  
  
	  useEffect(()=>{
		  const LoadContracts = async()=>{
		   //Paths of Json File
		   const nftContratFile =  await fetch("/abis/NFT.json");
		   const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
//Convert all to json
		  const  convertNftContratFileToJson = await nftContratFile.json();
		  const  convertMarketContractFileToJson = await marketContractFile.json();
//Get The ABI
		  const markrtAbi = convertMarketContractFileToJson.abi;
		  const nFTAbi = convertNftContratFileToJson.abi;

		  const netWorkId =  await web.eth.net.getId();

		  const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
		  const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

			//Get Token Contract
			const TokenContractFile = await fetch("/abis/Token.json");
			const  convertTokenContractFileToJson = await TokenContractFile.json();
			const tokenAbi = await convertTokenContractFileToJson.abi;
	
			const TokenMarketWorkObject =  convertTokenContractFileToJson.networks[netWorkId];

		  if(nftMarketWorkObject && nftMarketWorkObject&&TokenMarketWorkObject){
		   const nftAddress = nftNetWorkObject.address;
		   setNFtAddress(nftAddress)
		   const marketAddress = nftMarketWorkObject.address;
		   setMarketAddress(marketAddress)

		   const deployedNftContract = await new web.eth.Contract(nFTAbi,nftAddress);
		   setNFtContract(deployedNftContract)
		   const deployedMarketContract = await new web.eth.Contract(markrtAbi,marketAddress);
		   setMarketContract(deployedMarketContract)

		   const tokenAddress = TokenMarketWorkObject.address;
		   console.log("Token Adresss",tokenAddress)
		   const deployedTokenContract = await new web.eth.Contract(tokenAbi,tokenAddress);
		   setTokenContract(deployedTokenContract);
		   console.log("account from index",account);
		   if(account){
			 const myBalance = await web.eth.getBalance(account)
			 const convertBalance = await  web.utils.fromWei(myBalance,"ether")
			 setAccountBalance(convertBalance)
			 console.log("myBalance",myBalance);

			 const getTokenBalance = await deployedTokenContract.methods.balanceOf(account).call();
			 const tokenPriceToWei =  Web3.utils.fromWei(getTokenBalance,"ether")
  
			 setTokenBalnce(tokenPriceToWei.toString());
			 console.log("my balnce Token  is ", tokenPriceToWei);
			 console.log( tokenPriceToWei);
			
		   }

			 if(account){
			  const data =  await deployedMarketContract.methods.getMyItemCreated().call({from:account})
			  const items = await Promise.all(data.map(async item=>{
			   const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
			   console.log(nftUrl)
			   console.log(item)
			   const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
			   const metaData =  await axios.get(nftUrl);

			   let classChange;

			   if((item.sold||item.isResell)){
				   classChange = "branding"
				   
			   }else{
				classChange = "design"
			   }

  
  //TODO: fix this object
			 let myItem = {
				 
				ClassChange:classChange,
                price:priceToWei,
                itemId : item.id,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,
                oldPrice:item.oldPrice,
                image:metaData.data.image,
                title:metaData.data.name,
                description:metaData.data.description,
                isResell:item.isResell,
		   }
  
		   return myItem;
  
			 }))
  
			 const mySoldItems = items.filter(item=>(item.sold||item.isResell));
			 //setSoldItems(mySoldItems)
			 setcreathedItems(items)
			 
			 }
			
		   
  
  
  
   
			 }else{
				 window.alert("You are at Wrong Netweok, Connect with Cronos Please")
			 }
  
  
  
		  }
		  setIsLoading(false) 
		  web&&LoadContracts()
  
	  },[account])

	//   setIsLoading(false)


	
//Create nft Buy Function
const buyNFT = async (nftItem)=>{
    console.log("********")
    console.log(account)
    console.log(nftAddress)
    console.log(marketContract)

    const nftPriceToWei = Web3.utils.toWei((nftItem.price).toString(),"ether")
    const convertIdtoInt = Number(nftItem.itemId)
  

    //TODO send the nft price to the seller
    if(account && tokenContract){
      if(nftItem.isResell){
        let priceinNumber  = (Number(nftItem.price));
        
        console.log("priceinNumber",priceinNumber)
        try{

                  //Calculate The creatorCommission
            const creatorCommission =  ((Number(nftItem.price) / 100) ) * (10);
            console.log(typeof nftItem.price);

            const creatorCommissionPriceToWei = Web3.utils.toWei((creatorCommission).toString(),"ether")

            console.log("creatorCommission",typeof creatorCommission);
            setCreatorCommissionValueInwei(creatorCommissionPriceToWei)

         
           
            let sellerMoney = priceinNumber - creatorCommission;

            const sellerMoneypriceToWei = Web3.utils.toWei((sellerMoney).toString(),"ether")

            if(creatorCommission){
                   //send the seller price
    
            const sendNftCommissionToCreator = await tokenContract.methods.transfer(nftItem.creator,creatorCommissionPriceToWei).send({from:account})

            const sendNftPriceToSeller = await tokenContract.methods.transfer(nftItem.seller,sellerMoneypriceToWei).send({from:account})
            if(sendNftPriceToSeller){
              const result =  await marketContract.methods.createMarketForSale(nftAddress,convertIdtoInt).send({from:account})
              console.log(result)
            }
            }

       

        ////
        

        }catch(e){
          console.log(e,"error in filter user data")

        }

      } else {
        try{
          const sendNftPriceToSeller = await tokenContract.methods.transfer(nftItem.seller,nftPriceToWei).send({from:account})
          if(sendNftPriceToSeller){
            const result =  await marketContract.methods.createMarketForSale(nftAddress,convertIdtoInt).send({from:account})
            console.log(result)
          }
    
       
         }catch(e){
           console.log(e)
         }
      }
   


    }

 
  

}
    useEffect(() => {
      SortingCard()
    },[creathedItems])
	console.log("creathedItems",creathedItems)

  return (

    <>
		<Breadcumb  
		          namePage='Author Profile'
		          title=' Author Profile'
		/>
	{
			isLoading ?<>Loading</>:<>{account?<section className="blog-area section-padding-100">
		    <div className="container">

		        <div className="row">

	                  <CollectionItem />

		            <div className="col-12 col-md-9">
		                
		                <div className="dream-projects-menu mb-50">
		                    <div className="text-center portfolio-menu">
		                        <button className="btn active" data-filter="*">All</button>
		                        <button className="btn" data-filter=".branding">Sold</button>
		                        <button className="btn" data-filter=".design">Created</button>
		                    </div>
		                </div>
		                <div className="row">
		                    
		                    <div className="container">
								
		                        <div className="row dream-portfolio" data-aos="fade-up">



		                        	{creathedItems && creathedItems.map((item , i) => (
			                            <div className={`col-12 col-md-6 col-lg-4 single_gallery_item ${item.ClassChange}`}>
			                                <div className="pricing-item ">
			                                    <div className="wraper ">
			                                        <NavLink to={`/itemdetails/${item.itemId}`}><img src={item.image} alt="" /></NavLink>
													<div className="">
													<NavLink to={`/itemdetails/${item.itemId}`}><h4>{item.title}</h4></NavLink>
													</div>
			                                       
			                        
			                                        <span><span className="g-text">Price: </span> {item.price}<span className="g-text ml-15">ISO</span></span> 
													<NavLink to={`/profile/${item.creator}`}><h4 className="pricing text-truncate ">Creator : {item.creator}  </h4> </NavLink>
			                                       
			                                    </div>
			                                </div>
			                            </div>
												

		                        	))}

		                        </div>


		                    </div>

	                
		                </div>
		            </div>

		            
		        </div>
		    </div>
		</section>:<h1>Please Connect Your Wallet</h1>}</>
	}
		
		<br/>

    </>
  );
}

export default ProfileContainer;