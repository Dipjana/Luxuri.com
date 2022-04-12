import React, {useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import { AuthContext } from '../../AuthContext';
import moment from 'moment';
import "./header.css";
import {locationPlace} from '../../pages/home/apis';
function Header(){
    // const { REACT_APP_PUBLIC_URL } = process.env;
    // const authDetails = useContext(AuthContext);
    
    const [menuOpen, setMenuOpen]=useState(false);
    const [openCityStatus, setOpenCityStatus]=useState(false);
    const [locationList, setLocationList]= useState([]);

    //Location List
    useEffect(()=>{
        locationPlace().then(resp=>{
        //    console.log(resp.data)
           setLocationList(resp.data)
        });
    
     },[])

    // useEffect(() => {
    //     if(locationList.length===0){
    //         getLocations(authDetails.brokerId).then(resp=>{
    //             if(resp.data.Data!=null && resp.data.Data.length > 0){
    //                 let newLoc= resp.data.Data.filter(re=>{
    //                     if(re.locationID===2 || re.locationID===5 || re.locationID===3){
    //                         return false;
    //                     }
    //                     return re;
    //                 })
    //                 setLocationList([{locationID: 3, location: "Miami"},...newLoc]);
    //             }
    //         })
    //     }
    // },[locationList,authDetails]);

    

    return (
        <section className="header site-top-head">
          <nav className="navbar fixed-top navbar-dark bg-dark">
              <Link className="navbar-brand" to="/"><img src={"images/classic-logo---white_1.png"} alt="" width="100"/></Link>
              
              <button className="navbar-toggler" type="button" onClick={()=>{setMenuOpen(!menuOpen); setOpenCityStatus(false)}} style={{ zIndex:9 }}>
                {!menuOpen ? <i className="fa fa-bars" aria-hidden="true"></i> : <i className="fa fa-times" aria-hidden="true"></i> }
              </button>         
              <div className="overlay"  style={{ width:menuOpen ? '100%' : '0%' }}>
                <div style={{ width:menuOpen ? (window.innerWidth>=768 ? '35%' : '100%') : '0%'}} className="overlay-holder" >
                    <div className="overlay-content">
                        <ul className="navbar-nav mr-auto">
                                {!openCityStatus ? (
                                    <>
                                        <li className="nav-item dropdown">
                                            <button type="button" className="nav-link" onClick={()=>setOpenCityStatus(!openCityStatus)}>
                                                HOMES <span className="sr-only">(current)</span>
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/luxury-car-rentals-miami" onClick={()=>setMenuOpen(false)}>Cars</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/luxury-yacht-rentals-miami" onClick={()=>setMenuOpen(false)}>Yachts</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/concierge-services" onClick={()=>setMenuOpen(false)}>Concierge</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/luxuri-realtors" onClick={()=>setMenuOpen(false)}>About</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/contact-luxuri-team" onClick={()=>setMenuOpen(false)}>Contact</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                    <li className="nav-item dropdown">
                                        <button type="button" className="nav-link"  onClick={()=>setOpenCityStatus(!openCityStatus)}>
                                            <i className="fa fa-angle-left" aria-hidden="true"></i> BACK
                                        </button>
                                        
                                    </li>
                                    {locationList.length >0 ? (
                                        locationList.map((item)=>{
                                            const locationNameurl= item.place_name.replaceAll(' ','-');
                                            return (<li className="nav-item" key={item.place_id}>
                                                <Link  className="nav-link" to={{
                                                pathname: `/${locationNameurl.toLowerCase()}-vacation-homes`,
                                                search: `?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=${item.place_id}&locationName=${item.place_name}`,
                                            }} onClick={()=>{setMenuOpen(false)}}>{item.place_name}</Link></li>
                                            )
                                        })
                                    ) : null}
                                    </>
                                )}

                            
                            
                        </ul>
                    </div>
                  </div>
              </div>
          </nav>
      </section>
    );
}
export default Header;