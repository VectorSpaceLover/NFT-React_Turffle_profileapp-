import React from 'react'

function PartProfile({address , croBalnce ,isoBalnce, img1 ,img2 ,data}){
    function copy(that){
var inp =document.createElement('input');
document.body.appendChild(inp)
inp.value =that.textContent
inp.select();
document.execCommand('copy',false);
inp.remove();
}
	return(
      <div className="col-12 col-lg-3">

         <div className="service_single_content collection-item">
            
              <div className="collection_icon">
                  <img src={img1} className="center-block" alt="" />
              </div>
              <span className="aut-info">
                  <img src={img2} width="50" alt="" />
              </span>
              <div className="collection_info text-center">
                  <h6>Auther Address</h6>
                  <p className="w-text mr-5p">{address}</p>
                  <p className="mt-15">Your CRO Balance is {croBalnce} CRO</p>
                  <p className="mt-15">Your ISO Balance is {isoBalnce} ISO</p>


                  <div className="search-widget-area mt-15">
                      <form >
                          <input type="text" name="wallet" id="wallet" value={`localhost.com/profile/${address}` }/>
                          <button className="btn" onClick={() => {navigator.clipboard.writeText(`localhost.com/profile/${address}`)}}><i className="fa fa-copy"></i></button>
                      </form>
                  </div>

                  <ul className="social-links mt-30 mb-30">
                    {data && data.map((item , i) => (
                      <li key={i}><a href="#"><span className={item.classIcon}></span></a></li>  
                    ))}
                 </ul>
                  <a href="profile.html" className="more-btn">Follow</a>
              </div>
              
          </div>
      </div>
	)
}

export default PartProfile