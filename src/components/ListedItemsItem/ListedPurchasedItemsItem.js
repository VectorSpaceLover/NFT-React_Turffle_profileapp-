import { NavLink } from "react-router-dom";
import { useState } from "react";
import React from 'react'


const ListedPurchasedItemsItem = (props)=>{
  const isSold = props.children.sold
  const[newPrice,setNewPrice]=useState(0)


  return(
    <div className="col-lg-3 col-sm-6 col-xs-12">
        <div className="pricing-item ">
            <div className="wraper">
                <NavLink to={`/itemdetails/${props.children.itemId}`}><img src={props.children.image} alt="imageNft" /></NavLink>
                <NavLink to={`/itemdetails/${props.children.itemId}`}><h4>{props.children.title}</h4></NavLink>


                <span><span className="g-text">Price:</span> {props.children.price}  ISO <span className="g-text ml-15"></span></span> 
                <NavLink to={`/profile/${props.children.creator}`}><h4 className="pricing text-truncate g-text">Creator : {props.children.creator}  </h4> </NavLink>
                <div className="admire">
                  {!isSold? <div className="col-12 text-center">
	                  <button  onClick={props.children.buy}  className="more-btn mb-15" >Buy Now</button>
	              </div>:""}

                {/* Create Resell input */}
        <div >
	                  <div className="group text-center">
	                      <input type="number" name="price" id="price" required  
						         placeholder="set new item price in ISO"
                     onChange = {e=>setNewPrice(e.target.value)}
              
              />
	                      <span className="highlight"></span>
	                      <span className="bar"></span>
	                  </div>

                    <div className="col-12 text-center ">
                      
                      {
                        newPrice?	                  <button onClick={()=>{props.children.resell(props.children.item,newPrice.toString())}} className="more-btn mb-15" >Resell Item</button>
:	                  <button  className="more-btn   mb-15 disabled"  disabled aria-disabled="true">Resell Item</button>

                      }

                  
	              </div>
	              </div>      
          
               
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListedPurchasedItemsItem
