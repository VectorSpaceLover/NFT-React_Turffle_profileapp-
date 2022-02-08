import React from 'react'

import {useState,useEffect,useContext} from "react";
import TopCollectionsItem from '../TopCollectionsItem'
import InfoComponent from '../InfoComponent'
import { useWeb3 } from '../web3'
import Web3 from "web3"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect } from "../../store1/cart-actions";
import { cartActions } from "../../store1/cart-slice";


import {TopCollectionsData} from '../../data/data-components/data-TopCollections.js'

import Preloader from '../../components/Preloader'


// import TopCollectionsData from './data.json'

function TopCollectionsContainer(){

  ////===================>>>>>>>>>>>>>

  const account=useSelector((state)=>state.cart.account)
  const web=useSelector((state)=>state.cart.web3)
  const provider=useSelector((state)=>state.cart.provider)

  // const web3Api =useContext(WebContext);
  // console.log("From index",web3Api)
 
    const[noProvider,setNoProvider] = useState(false);
    const[isLoading,setIsloading]=useState(false)


  

    //Create LoadAccounts Function
    const[accountBalance,setAccountBalance]= useState(0);
    // const account =   web3Api.account;
    let localProvider;
   localProvider = new Web3.providers.HttpProvider("https://cronos-testnet-3.crypto.org:8545");
    //localProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));


    // const localProvider = new Web3.providers.HttpProvider("https://cronos-testnet-3.crypto.org:8545");
    let localWeb3 = new Web3(localProvider)


    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[unsoldItems,setUnsoldItems]= useState([])

    const[tokenContract,setTokenContract]= useState(null)
    const[tokenBalance,setTokenBalnce] =useState("0");
    const [creatorCommissionValueInwei,setCreatorCommissionValueInwei]= useState(null)

  const indexOfunsold = unsoldItems.length;

    const firstOne = unsoldItems[indexOfunsold-1 ]
    const seconsOne = unsoldItems[indexOfunsold-2]
    const thirdOne = unsoldItems[indexOfunsold-3]
    const fourthOne = unsoldItems[indexOfunsold-4]
    const fivthOne = unsoldItems[indexOfunsold-5]

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

            //Fetch all unsold items
            const data =  await deployedMarketContract.methods.getAllUnsoldItems().call()
            console.log(data)
               const items = await Promise.all(data.map(async item=>{
                const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
                console.log(nftUrl)
                console.log(item)
                const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                const metaData =  await axios.get(nftUrl);

//TODO: fix this object
              let myItem = {
                price:priceToWei,
                itemId : item.id,
                tokenId:item.tokenId,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,

                oldPrice:item.oldPrice,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description,
                isResell:item.isResell,
            }
            console.log(item)

            return myItem;

  
            
  
              }))

              setUnsoldItems(items)
              setIsloading(false)




 
           }else{
               window.alert("You are at Wrong Netweok, Connect with Cronos Please")
           }


        }
        web&&LoadContracts()

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

////===================>>>>>>>>>>>>>

  return(
    <>
    {
      isLoading?<Preloader Title={"loading Top 4 "} /> :  <section className="section-padding-100 clearfix" >
      <div className="container">
          <InfoComponent
            titleSm='Our Top New NFTs'
            titleLg='Popular and Unique Design'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo.'
          />
          <div className="row">
            {
              (unsoldItems.length<4)? <>Items Not More than3</> : <>
              <div className="row">
              <TopCollectionsItem
                  img={firstOne.image}
                  title={firstOne.name}
                  text={firstOne.seller} 
                  itemId={firstOne.tokenId}
                     />
                    <TopCollectionsItem
                  img={seconsOne.image}
                  title={seconsOne.name}
                  text={seconsOne.seller}  
                  itemId={seconsOne.tokenId}
                    />
                    <TopCollectionsItem
                  img={thirdOne.image}
                  title={thirdOne.name}
                  text={thirdOne.seller}  
                  itemId={thirdOne.tokenId}

                    />
                    <TopCollectionsItem
                  img={fourthOne.image}
                  title={fourthOne.name}
                  text={fourthOne.seller}  
                  itemId={fourthOne.tokenId}

                    />

              </div>
              </>
            }
          
          </div>
         
      </div>
  </section>
    }
    </>
  
  )
}

export default TopCollectionsContainer

