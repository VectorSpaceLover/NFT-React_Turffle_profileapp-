import { NavLink } from "react-router-dom";
import React from 'react'


function TopCollectionsItem({img , title , text ,itemId }){
  return(
    <div className="col-12 col-md-6 col-lg-3">
            <div className="collection_icon">
            <NavLink to={`/itemdetails/${itemId}`}><img src={img} alt="imageNft" /></NavLink>
            </div>
            <div className="collection_info">
                <h5 className="text-bold">{title}</h5>
                <NavLink to={`/profile/${text}`}><h6 className="pricing text-truncate text-primary"> Creator : {text}  </h6> </NavLink>

            </div>
            
    </div>

  )
}

export default TopCollectionsItem