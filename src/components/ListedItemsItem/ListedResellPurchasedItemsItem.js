import { NavLink } from "react-router-dom";
import React,{ useState } from "react";


const ListedResellPurchasedItemsItem = (props)=>{
  const isSold = props.children.sold


  return(
    <div className="col-lg-3 col-sm-6 col-xs-12">
        <div className="pricing-item ">
            <div className="wraper">
                <NavLink to={`/itemdetails/${props.children.itemId}`}><img src={props.children.image} alt="imageNft" /></NavLink>
                <NavLink to={`/itemdetails/${props.children.itemId}`}><h4>{props.children.title}</h4></NavLink>


                <span><span className="g-text">Price:</span> {props.children.price}  ISO <span className="g-text ml-15"></span></span> 
                <NavLink to={`/profile/${props.children.creator}`}><h4 className="pricing text-truncate g-text">Creator : {props.children.creator}  </h4> </NavLink>
                <div className="admire">

        <div >
	    

                    <div className="col-12 text-center ">
                      
                      {
                            <button onClick={()=>props.children.cancelResell(props.children.item)}  className="more-btn mb-15" >Cancel Resell</button>

                      }

                  
	              </div>
	              </div>      
          
               
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListedResellPurchasedItemsItem
