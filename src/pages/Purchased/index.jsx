import React,{useState,useEffect,useContext} from "react";
import { NavLink } from "react-router-dom";

import InfoComponent from '../../components/InfoComponent'
import ListedPurchasedItemsItem from '../../components/ListedItemsItem/ListedPurchasedItemsItem'
import {ListedItemsData} from '../../data/data-components/data-ListedItems.js'
import ListedResellPurchasedItemsItem from '../../components/ListedItemsItem/ListedResellPurchasedItemsItem'



// import ListedItemsData from './data.json'

import '../../components/ListedItems'
import TopCollectionsItem from '../../components/TopCollectionsItem'

import { useWeb3 } from '../../components/web3'
import Web3 from "web3"
import axios from 'axios'
import Head from "../../layouts/Head";
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect } from "../../store1/cart-actions";
import { cartActions } from "../../store1/cart-slice";
import Preloader from '../../components/Preloader'

 const Purchased = () => {
  
  const[isLoading,setIsloading]=useState(true)

  const account=useSelector((state)=>state.cart.account)
  const web=useSelector((state)=>state.cart.web3)
  const provider=useSelector((state)=>state.cart.provider)

    //Craete function to listen the change in account changed and network changes

    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[purchasedItems,setpurchasedItems]= useState([])
    const[newPrice,setNewPrice]=useState(0)
    const[resellItems,setResellItems]= useState([])


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

           if(nftMarketWorkObject && nftMarketWorkObject){
            const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            const deployedNftContract = await new web.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)

            console.log("Fetch all getMyNFTPurchased",account);
            //Fetch all unsold items
            if(account){
              try{
                const data =  await deployedMarketContract.methods.getMyNFTPurchased().call({from:account})
      
                console.log(data)
                   const items = await Promise.all(data.map(async item=>{
                    const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
                    console.log(nftUrl)
                    console.log(item)
                    const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                    const metaData =  await axios.get(nftUrl);
                  let myItem = {
                    price:priceToWei,
                    itemId : item.tokenId,
                    owner :item.owner,
                    seller:item.seller,
                    oldOwner :item.oldOwner,
                    creator:item.creator,
                    oldSeller :item.oldSeller,
                    sold:item.sold,
    
                    oldPrice:item.oldPrice,
                    image:metaData.data.image,
                    name:metaData.data.name,
                    category:metaData.data.category,
                    description:metaData.data.description,
                    isResell:item.isResell,
                }
                console.log("******",myItem)
      
                return myItem;
                  }));
                  
      
                  setpurchasedItems(items);
                  setIsloading(false)

      
              }catch(e){
                console.error(e)
              }
            }
      


              //Fetch my item i Publish  it as resell
              const myResellItemsResult =  await deployedMarketContract.methods.getMyResellItems().call({from:account})

          console.log("myResellItemsResult",myResellItemsResult)

            console.log("*************")

            const resellItems = await Promise.all(myResellItemsResult.map(async item=>{
              const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
              console.log(nftUrl)
              console.log(item)
              const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
              const metaData =  await axios.get(nftUrl);
            let myItem = {
              price:priceToWei,
                itemId : item.tokenId,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,
                sold:item.sold,

                oldPrice:item.oldPrice,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description,
                category:metaData.data.category,

                isResell:item.isResell,
          }
          
          console.log(myItem)
          return myItem;
            }))

            setResellItems(resellItems)
            setIsloading(false)

 
           }else{
               window.alert("You are at Wrong Netweok, Connect with Roposten Please")
           }


        }
        web&&LoadContracts()

    },[account])

    const resellItemFunction = async(item,newPrice)=>{
      console.log(marketContract)
      console.log(nftAddress)


      if(marketContract){

        // let marketFees = await marketContract.methods.gettheMarketFees().call()
        // marketFees =marketFees.toString()
        const priceToWei = Web3.utils.toWei(newPrice,"ether")
        console.log(priceToWei);

        if(account) {
          await marketContract.methods.putItemToResell(nftAddress,item.itemId,priceToWei).send({from:account});
          console.log("Resell NFt")
          window.reload()

        }else{
          window.alert(" UNlock Your Wallet Or Please install any provider wallet like MetaMask")
                
        }

      
      }
      
    }



    //Create nft Buy Function
const cancelResellNFT = async (nftItem)=>{
  console.log("********")
  console.log(account)
  console.log(nftAddress)
  console.log(marketContract)
  const convertIdtoInt = Number(nftItem.itemId)


  //TODO send the nft price to the seller
  if(account){
   try{
 
      const result =  await marketContract.methods.cancelResellWitholdPrice(nftAddress,convertIdtoInt).send({from:account})
      console.log(result)
      window.reload()

 
   }catch(e){
     console.log(e)
   }
  }


 


}
  
  ////===================>>>>>>>>>>>>>
  
    return(
        <div className="pt-5">
        <Head/>
        <br/>
        {isLoading?<Preloader Title={"loading ... "} /> :  <section className="features section-padding-0-100 ">
  
  <div className="container pt-5">
      <InfoComponent
 className="pt-5"        titleSm='Dicover Your Purchased Item'
      />

      <div className="row align-items-center">
          {
            purchasedItems<1? < InfoComponent className="container pt-5"
            titleSm='You dont Purchased Item Yet'
          />: purchasedItems.map((item , i) => (
            <ListedPurchasedItemsItem >{{item:item,image:item.image,title:item.name,price:item.price,creator:item.creator,itemId:item.itemId,sold:item.sold,resell:resellItemFunction}}</ListedPurchasedItemsItem>  
          ))}


         
      </div>
      
  </div>
</section>}

<br/>
{isLoading?<Preloader Title={"loading ...."} /> : <section className="features section-padding-0-100 ">
  
  <div className="container pt-5">
      <InfoComponent
 className="pt-5"        titleSm='Dicover Your Resell Items'
      />

      <div className="row align-items-center">
          {
            resellItems<1? < InfoComponent className="container pt-5"
            titleSm='You dont Have Resell Item Yet'
          />: resellItems.map((item , i) => (
            <ListedResellPurchasedItemsItem >{{item:item,image:item.image,title:item.name,price:item.price,creator:item.creator,itemId:item.itemId,sold:item.sold,cancelResell:cancelResellNFT}}</ListedResellPurchasedItemsItem>  
          ))}


         
      </div>
      
  </div>
</section>}

        
        </div>
     
    )
  
}

export default Purchased;