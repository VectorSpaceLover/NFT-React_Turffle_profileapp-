
import SidebarArea from './SidebarArea'
import HighestBid from './HighestBid'
import TestPopup from './TestPopup'
import React,{useState,useEffect,useContext} from "react";
import { useWeb3 } from '../../components/web3'
import Web3 from "web3"
import axios from 'axios'
import Detailed from "../ItemDetails/Detailed"

import '../../assets/css/itemDetails.css'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect } from "../../store1/cart-actions";
import { cartActions } from "../../store1/cart-slice";
import Preloader from '../../components/Preloader'


const ItemDetailsContainer = (props) => {
  console.log("ItemDetailsContainer bahaa",props.children.itemId)
  //1-Fetch signle post Data
// const web3Api = useContext(WebContext)
      const itemId = props.children.itemId
      // const [validToViewSinglePost,setValidToViewSinglePost] = useState(true)


  const account=useSelector((state)=>state.cart.account)
  const web=useSelector((state)=>state.cart.web3)
  const provider=useSelector((state)=>state.cart.provider)

      const history = useHistory();

      //const account =   web3Api.account;
      console.log("user login in purchased",account)


      let localProvider;

      localProvider = new Web3.providers.HttpProvider("https://cronos-testnet-3.crypto.org:8545");
      //localProvider =  new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
 
     let localWeb3 = new Web3(localProvider)
     const[isLoading,setIsloading]=useState(true)


    const [validToViewSinglePost,setValidToViewSinglePost] = useState(true)
    const[tokenContract,setTokenContract]= useState(null)
    const[tokenBalance,setTokenBalnce] =useState("0");

    const [buyButtonTitle,setBuyButtonTitle]=useState("Loading ...")


    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[singleItem,setSingleItem]= useState([])
    const[creatorCommissionValueInwei,setCreatorCommissionValueInwei]= useState(0)


    useEffect(()=>{
        const LoadContracts = async()=>{
          let localNetWork = 338;
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
           if(netWorkId===338 && account != null ){
            setBuyButtonTitle("Buy Now")
           }else {
            setBuyButtonTitle("Wrong Network")
           }
            //Get Token Contract
            const TokenContractFile = await fetch("/abis/Token.json");
            const  convertTokenContractFileToJson = await TokenContractFile.json();
            const tokenAbi = await convertTokenContractFileToJson.abi;

          const TokenMarketWorkObject =  convertTokenContractFileToJson.networks[localNetWork];
           const nftNetWorkObject =  convertNftContratFileToJson.networks[localNetWork];
           const nftMarketWorkObject =  convertMarketContractFileToJson.networks[localNetWork];
           console.log("BEFORE NETWOEK CHECK &&&&&&&")

           if(nftMarketWorkObject && nftMarketWorkObject&&TokenMarketWorkObject){
            console.log("AFTER NETWOEK CHECK ******")

            const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            const deployedNftContract =  new localWeb3.eth.Contract(nFTAbi,nftAddress);

            const deployedNftContractWithWallet = await new web.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContractWithWallet)

            const deployedMarketContract =  new localWeb3.eth.Contract(markrtAbi,marketAddress);

            const deployedMarketContractWithWallet = await new web.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContractWithWallet)


            const tokenAddress = TokenMarketWorkObject.address;
            console.log("Token Adresss",tokenAddress)


            const deployedTokenContract =  new localWeb3.eth.Contract(tokenAbi,tokenAddress);

            const deployedTokenContractWithWallet = await new web.eth.Contract(tokenAbi,tokenAddress);
            setTokenContract(deployedTokenContractWithWallet);


            console.log(account);
            //Fetch all unsold items
            console.log("Fetch all unsold items",itemId)

            try{
                if(Number(itemId)){
                    const item =  await deployedMarketContract.methods.fetchSingleItem(itemId).call()

                console.log("DATATATATA",item)

                if(account){
                  const getTokenBalance = await deployedTokenContract.methods.balanceOf(account).call();
                              const tokenPriceToWei =  Web3.utils.fromWei(getTokenBalance,"ether")
                
                              setTokenBalnce(tokenPriceToWei.toString());
                              console.log("my balnce Token  is ", tokenPriceToWei);
                              console.log( tokenPriceToWei);
                
                
                }

                    

                const nftUrl = await deployedNftContract.methods.tokenURI(itemId).call();

                const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                const metaData =  await axios.get(nftUrl);


                let myItem = {
                    price:priceToWei,
                    itemId : item.tokenId,
                    owner :item.owner,
                    seller:item.seller,
                    creator:item.creator,
                    sold:item.sold,
                    image:metaData.data.image,
                    title:metaData.data.name,
                    category:metaData.data.category,
                    description:metaData.data.description,
                    isResell:item.isResell

                }

                setSingleItem(myItem)
                setIsloading(false)





                console.log("Item from Item",singleItem)

                return myItem;




    }

            }catch(e){
                console.log(e)
            }


           }else{
               window.alert("You are at Wrong Netweok, Connect with Cronos Please")
           }


        }

        web&&LoadContracts()

    },[web,account ])


    const [transactions,setTransaction]=useState([]);

const loadTransactions = async ()=>{
  const getTransactions = await nftContract.getPastEvents("Transfer",{fromBlock:0,toBlock:"latest",filter:{tokenId:itemId}});

  // const getTransactions = await nftContract.getPastEvents("Transfer");

  // const getTransactions = await nftContract.getPastEvents("Transfer");
  //const getmarketTransactions = await marketContract.getPastEvents("Transfer");

  console.log("from Get Transaction",getTransactions);

  setTransaction(getTransactions)
}
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
          history.push("/Purchased");
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
        history.push("/Purchased");

      }


     }catch(e){
       console.log(e)
     }
  }



}





}

  //2-send the data to seperated component with 

  return (
    <>
     {isLoading?<Preloader Title={"loading Single NFT "} />:<section className="section-padding-100">
          <div className="container">

              <div className="row p-4">
              <Detailed > {{image:singleItem.image}} </Detailed>
              <SidebarArea>{{buttonTitle:buyButtonTitle,sold:singleItem.sold,title:singleItem.title,price:singleItem.price,creator:singleItem.creator,seller:singleItem.seller,description:singleItem.description,category:singleItem.category,buy:async()=>buyNFT(singleItem) }}</SidebarArea>
                 
              </div>
          </div>
      </section>}
  
 
    </>
  );
}

export default ItemDetailsContainer;

