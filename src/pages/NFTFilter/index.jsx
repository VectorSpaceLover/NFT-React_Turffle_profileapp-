import { NavLink } from "react-router-dom";
import {SortingCard} from '../../utils'
import CollectionItem from '../../containers/Profile/CollectionItem'
import Breadcumb from '../../components/Breadcumb'
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


const NFTFilter = () => {
 

  
	const [isLoading,setIsLoading] = useState(true);

	
	
   const account=useSelector((state)=>state.cart.account)
	const web=useSelector((state)=>state.cart.web3)
	const provider=useSelector((state)=>state.cart.provider)
	 
		const[noProvider,setNoProvider] = useState(false);
	
	
		let localProvider;
		localProvider = new Web3.providers.HttpProvider("https://cronos-testnet-3.crypto.org:8545");
		 //localProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
	 
	 
		 // const localProvider = new Web3.providers.HttpProvider("https://cronos-testnet-3.crypto.org:8545");
		 let localWeb3 = new Web3(localProvider)
	
		//Create LoadAccounts Function
		const[accountBalance,setAccountBalance]= useState(0);

	
	
	
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
  
      let localNetWork = 338;

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
 
			const nftNetWorkObject =  convertNftContratFileToJson.networks[localNetWork];
			const nftMarketWorkObject =  convertMarketContractFileToJson.networks[localNetWork];
 
			  //Get Token Contract
			  const TokenContractFile = await fetch("/abis/Token.json");
			  const  convertTokenContractFileToJson = await TokenContractFile.json();
			  const tokenAbi = await convertTokenContractFileToJson.abi;
	  
			  const TokenMarketWorkObject =  convertTokenContractFileToJson.networks[localNetWork];
		  if(nftMarketWorkObject && nftMarketWorkObject&&TokenMarketWorkObject){
			const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            

            const deployedNftContract = await new localWeb3.eth.Contract(nFTAbi,nftAddress);
            const deployedNftContractWithWallet = await new web.eth.Contract(nFTAbi,nftAddress);

            setNFtContract(deployedNftContractWithWallet)

            const deployedMarketContract = await new localWeb3.eth.Contract(markrtAbi,marketAddress);
            const deployedMarketContractWithWallet = await new web.eth.Contract(markrtAbi,marketAddress);

            setMarketContract(deployedMarketContractWithWallet)

            const tokenAddress = TokenMarketWorkObject.address;
            console.log("Token Adresss",tokenAddress)
            const deployedTokenContract = await new localWeb3.eth.Contract(tokenAbi,tokenAddress);
            const deployedTokenContractWithWallet = await new web.eth.Contract(tokenAbi,tokenAddress);

            setTokenContract(deployedTokenContractWithWallet);
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

			  const data =  await deployedMarketContract.methods.getAllUnsoldItems().call()
			  const items = await Promise.all(data.map(async item=>{
			   const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
			   console.log(nftUrl)
			   console.log(item)
			   const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
			   const metaData =  await axios.get(nftUrl);

		

  
  //TODO: fix this object
			 let myItem = {
				 
                price:priceToWei,
                itemId : item.tokenId,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,
                oldPrice:item.oldPrice,
                image:metaData.data.image,
                title:metaData.data.name,
                category:metaData.data.category,
                description:metaData.data.description,
                isResell:item.isResell,
		   }
  
		   return myItem;
  
			 }))
  
			 const mySoldItems = items.filter(item=>(item.sold||item.isResell));
			 //setSoldItems(mySoldItems)
			 setcreathedItems(items)
			 
		   
  
  
  
   
			 }else{
				 window.alert("You are at Wrong Netweok, Connect with Cronos Please")
			 }
  
  
  
		  }
		  setIsLoading(false) 
		  LoadContracts()
  
	  },[web,account])

	  
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
          console.log(e)

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
	{
		isLoading?"Loading":	<section className="blog-area section-padding-50">
		<div className="container">

			<div className="row">


				<div className="col-12 col-md-12">
					
					<div className="text-center dream-projects-menu mb-50 ">
						<div className="text-center portfolio-menu ">
							<button className="btn active " data-filter="*">All</button>
							<button className="btn " data-filter=".ART">ART</button>
							<button className="btn" data-filter=".COLLECTIBLES">COLLECTIBLES</button>
                            <button className="btn" data-filter=".PHOTOGRAPHY">PHOTOGRAPHY</button>

							<button className="btn" data-filter=".SPORT">SPORT</button>

							<button className="btn" data-filter=".TRADINGCARDS">TRADING CARDS</button>

							<button className="btn" data-filter=".UTILITY">UTILITY</button>
                            <button className="btn" data-filter=".VIRTUALWORDS">VIRTUAL WORDS</button>


						</div>
					</div>
					<div className="row">
						
						<div className="container col-md-9">
							
							<div className="row dream-portfolio" data-aos="fade-up">



								{creathedItems && creathedItems.map((item , i) => (
									<div className={`col-12 col-md-6 col-lg-4 single_gallery_item ${item.category}`}>
										<div className="pricing-item ">
											<div className="wraper ">
												<NavLink to={`/itemdetails/${item.itemId}`}><img src={item.image} alt="" /></NavLink>
												<div className="">
												<NavLink to={`/itemdetails/${item.itemId}`}><h4>{item.title}</h4></NavLink>
												</div>
											   
								
												<span><span className="g-text">Price:</span> {item.price} <span className="g-text ml-15">ISO</span></span> 
												<div className="pricing  text-truncate ">Creator :{item.creator} </div> 
												<span className=" pricing ">Category : {(item.category).toLowerCase()} </span> 

											   
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
	</section>
	}
		<br/>

    </>
  );
}

export default NFTFilter;