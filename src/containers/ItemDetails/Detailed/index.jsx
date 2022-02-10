import DetailedImg from "../../../assets/img/art-work/detailed.jpg"
import React from 'react'

const Detailed = (props) => {

  return (
    <>
      <div className="col-12 col-lg-5">
          <div className="detailed-img">
          <img src={props.children[1].image} alt="" />
          </div>
      </div>
    </>
  );
}

export default Detailed;