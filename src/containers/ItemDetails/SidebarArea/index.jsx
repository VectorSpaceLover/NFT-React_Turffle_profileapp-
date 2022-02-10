import { NavLink } from "react-router-dom";
import iconsf1 from "../../../assets/img/icons/f1.png"
import authors8 from "../../../assets/img/authors/8.png"
import authors2 from "../../../assets/img/authors/2.png"
import artworkfire from "../../../assets/img/art-work/fire.png"
import details from '../../../data/data-containers/data-ItemDetails-SidebarArea.json'
import React from 'react'

const SidebarArea = (props) => {
  console.log("SidebarArea",props.children.title)
  const isSold = props.children.sold
 


  return (
    <>
      <div className="col-12 col-lg-4 mt-s">
          <div className="sidebar-area">
              <div className="donnot-miss-widget">
                  <div className="who-we-contant">
                    
                      <h4>{props.children.title}</h4>
                  </div>
                  <div className="mb-15 gray-text"><span className="w-text mr-15 gradient-text">Current Price {props.children.price} ISO </span></div>
                  <div className="details-list">
                  <p >Artist Creator: <span>{props.children.creator}</span></p>  
                  <p >Seller: <span>{props.children.seller}</span></p>  
                  <p >Category: <span>{props.children.category}</span></p>  
                  <span className="gradient-text">Item Description</span>
                  <p className="w-text p-3">{props.children.description}</p>



                  </div>
                  {
                    isSold?<>""</>:
                     <button  className="open-popup-link more-btn width-100 mt-30" onClick={props.children.buy} >{props.children.buttonTitle}</button>
                   

                  }
                 
              </div>
          </div>
      </div>
    </>
  );
}

export default SidebarArea;