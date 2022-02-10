import Web3 from "web3"
import {CreateItemDataImg , CreateItemDataInput} from '../../../../data/data-containers/data-ContactForm'
import React,{useState,useEffect,useContext} from 'react'
import { create } from 'ipfs-http-client'
import { useWeb3 } from '../../../../components/web3'
import { NavLink } from "react-router-dom"
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { connectMetamask, connectDefi,disconnect } from "../../../../store1/cart-actions";
import { cartActions } from "../../../../store1/cart-slice";




const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");


const ContactForm = () => {

const account=useSelector((state)=>state.cart.account)
const web=useSelector((state)=>state.cart.web3)
const provider=useSelector((state)=>state.cart.provider)
	//============<

   const history = useHistory();
const[buttonTitle,setButtonTitle]= useState("Please Fill All Fields")
  

   //Load Contracts Function
   const[nftContract,setNFtContract]= useState(null)
   const[marketContract,setMarketContract]= useState(null)
   const[unsoldItems,setUnsoldItems]= useState([])

   const[isActive,setIsActive]=useState(false)




   const [urlHash,setUrlHash] = useState()
   const onChange = async(e)=>{
	   const file = e.target.files[0];

	   console.log("before")

	   try{
		   console.log("after try")
		   const addedFile = await ipfsClient.add(file);
		   
			const ipfsUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
		   setUrlHash(ipfsUrl)

	   }catch(e){
		   console.log(e)
	   }

   }

   const [nftFormInput,setNftFormInput] =useState({
	   price:'',
	   name:"",
	   description:"",
	   category:""
   })

   const createMarketItem =  async()=>{
	   const {price,name,description,category}=nftFormInput;
	   if(!price||!name||!description||!category ||!urlHash) return
	   setButtonTitle("Wait Mint Processing the NFT")


	   const data = JSON.stringify({
		   name,description,category,image:urlHash
	   });


	   try{
		   setIsActive(false)
		   const addedFile = await ipfsClient.add(data);
		   
		   const ipfsUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
		   createMarketForSale(ipfsUrl);



	   }catch(e){
		   console.log(e)
	   }


   }

   useEffect(()=>{

      const {price,name,category,description}=nftFormInput;
	   if(!price||!name||!description||!category ||!urlHash) {
		 setIsActive(false)  
	   }else{
		   setIsActive(true)
	   }
   },[nftFormInput,urlHash])

   const[tokenContract,setTokenContract]= useState(null)
   const[tokenBalance,setTokenBalnce] =useState("0");
   useEffect(()=>{
	   const LoadContracts = async()=>{
		   //Paths of Json File

		  const netWorkId =  await web.eth.net.getId();


			//Get Token Contract
			const TokenContractFile = await fetch("/abis/Token.json");
			const  convertTokenContractFileToJson = await TokenContractFile.json();
			const tokenAbi = await convertTokenContractFileToJson.abi;
	
			const TokenMarketWorkObject =  convertTokenContractFileToJson.networks[netWorkId];

		  if(TokenMarketWorkObject){
		  
		   const tokenAddress = TokenMarketWorkObject.address;
		   console.log("Token Adresss",tokenAddress)
		   const deployedTokenContract = await new web.eth.Contract(tokenAbi,tokenAddress);
		   setTokenContract(deployedTokenContract);
		   if(account){
			 const getTokenBalance = await deployedTokenContract.methods.balanceOf(account).call();
			 const tokenPriceToWei =  Web3.utils.fromWei(getTokenBalance,"ether")
  
			 setTokenBalnce(tokenPriceToWei.toString());
			 console.log("my balnce Token  is ", tokenPriceToWei);
			 console.log( tokenPriceToWei);
		   }

		  }else{
			  window.alert("You are at Wrong Network, Connect with Cronos Please")
		  }


	   }
	   web&&account&&LoadContracts()

   },[web&&account])



	   const createMarketForSale = async(url)=>{
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
		   const marketAddress = nftMarketWorkObject.address;

		   const deployedNftContract = await new web.eth.Contract(nFTAbi,nftAddress);
		   setNFtContract(deployedNftContract)
		   const deployedMarketContract = await new web.eth.Contract(markrtAbi,marketAddress);
		   setMarketContract(deployedMarketContract)
		   
		   if(account){
						   //Start to create NFt Item Token To MarketPlace
		   let createTokenResult  = await deployedNftContract.methods.createNFtToken(url).send({from:account})

		   const tokenid = createTokenResult.events.Transfer.returnValues["2"]

		   console.log(tokenid)

		   setIsActive(false)
		   setButtonTitle("Wait Mint Processing the NFT")

		

		   const priceToWei = Web3.utils.toWei(nftFormInput.price,"ether")


			   const lanchTheNFtForSale = await deployedMarketContract.methods.createItemForSale(nftAddress,tokenid,priceToWei).send({from:account})
			   setButtonTitle("Wait Mint Processing the NFT")

			   if(lanchTheNFtForSale){
				history.push("/Purchased");

			   }
		   } else{
			   window.alert(" UNlock Your Wallet Or Please install any provider wallet like MetaMask")
			   
		   }

		



		  }else{
			  window.alert("You are at Wrong Netweok, Connect with Cronos Please")
		  }









	   }



  return (
    <>
	  <div className="contact_form">
	          <div className="row">
	              <div className="col-12">
	                  <div id="success_fail_info"></div>
	              </div>

	              <div className="col-12 col-md-12">
	                  <p className="w-text">Upload Item File</p>
	                  <div className="group-file">
					  {
                                            urlHash?    <img src={urlHash} alt="placeholder "/> :<img className=""  width = "200" src="./upload.png" alt="freepik image"/>


                                        }
					  
					  <div>
					  <p className="g-text">File type: PNG,JPG,JPEG,GIF</p>
						  <div >
						  <input  className="new_Btn more-btn form-contro" onChange={onChange} type="file" />
						  
						  </div>
						
					  </div>
	                     

	                      
	                  </div>
	              </div>
	              <div className="col-12 col-md-12">
	                  <div className="group">
	                      <input  className = "" type="text" name="name" id="name" required  
						  placeholder="Item name"
                onChange = {e=>setNftFormInput({...nftFormInput,name:e.target.value})}
				/>
	                      <span className="highlight"></span>
	                      <span className="bar"></span>
	                  </div>
	              </div>
	              <div className="col-12 col-md-12">
	               
	              </div>
	              <div className="col-12">
	                  <div className="group">
	                      <textarea name="Description" id="Description" required   
						  placeholder="Item Description"       
						         onChange ={e=>setNftFormInput({...nftFormInput,description:e.target.value})}
/>

	                      <span className="highlight"></span>
	                      <span className="bar"></span>
	                      
	                  </div>
	              </div>
	             
		
				  <div className="col-12 col-md-12">
	                  <div className="group">
	                      <input type="number" name="price" id="price" required  
						  placeholder="Item Price in ISO 999.00"
                onChange = {e=>setNftFormInput({...nftFormInput,price:e.target.value})}
				/>
	                      <span className="highlight"></span>
	                      <span className="bar"></span>
	                  </div>
	              </div>

				  <div>

				<select class="form-select" aria-label="Select Single Category" onChange={e=>setNftFormInput({...nftFormInput,category:e.target.value})}>
				<option selected>Select NFT Category</option>
			    <option value="ART">ART</option>
				<option value="COLLECTIBLES">COLLECTIBLES</option>
				<option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
				<option value="SPORT">SPORT</option>
				<option value="TRADING CARDS">TRADING CARDS</option>
				<option value="UTILITY">UTILITY</option>
				<option value="VIRTUAL WORDS">VIRTUAL WORDS</option>

			
				  
				</select>
		


				  </div>
				  

				  <div className=" col-12 col-md-12">
				  <label className=" text-white">Your Isoraw Token Balance is : {tokenBalance} ISO</label>

				  </div>
	              
	              <div className="col-12 text-center pt-5">
					  {
						  isActive? <button  className="more-btn mb-15 " onClick={createMarketItem}>Create NFT</button> :<button  className="btn text-warning mb-15 " >{buttonTitle}</button>
					  }
	                 
	              </div>
	          </div>
	  </div>
    </>
  );
}

export default ContactForm;