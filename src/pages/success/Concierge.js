import React, {useEffect} from 'react';
import queryString from 'query-string';
import {Link} from "react-router-dom";
import moment from 'moment';
import TrackPage from '../../hooks/TrackPage';
import Contact from '../../common/contact/Contact'
export default function Concierge(props){

   

    return (
        <>
        <section className="main" >
            <div className="concierge-banner fixed-header-gap" style={{ paddingTop:'5%' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 success-page">
                            <h1>Thank you for choosing Luxuri!</h1><br/>
                            <h3>One of our agents will give you call within the next hour.</h3><br/>
                            <h5>In the meantime, please explore the privileges of being a Luxuri member which include, but are not limited to, access to catalogs with wide variery of cars, yachts, and concierge services - all available during your stay.</h5>
                        </div>
                    </div>
                </div>
                <div className="property-block car-block">
                    <div className="container-fluid">
                    
                        <div className="dashboard-carousel">
                            <div className="row">  
                           
                 
                                <div className="col-md-4">
                                    <Link to="/luxury-yacht-rentals-miami">
                                        <div className="dashboard-carousel-item-wrapper url-cursor" >
                                            <div className="property-image">
                                                <img src="https://res.cloudinary.com/woodendoor-pm/image/upload/v1630681375/yachts/150_%20Palmer%20Johnson/150__Palmer_Johnson_cj8amp.jpg" alt=""/>
                                            </div>
                                            <h5>Yachts</h5>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <Link to={{
                                            pathname: `/miami-vacation-homes`,
                                            search: `?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=3&locationName=Miami`,
                                        }}>
                                        <div className="dashboard-carousel-item-wrapper url-cursor" >
                                            <div className="property-image">
                                                <img src="https://res.cloudinary.com/ddlx05ofh/image/upload/v1613511873/woodendoor/1263241834Villa%20Kos.jpg.jpg" alt=""/>
                                            </div>
                                            <h5>Properties</h5>
                                        </div>
                                    </Link>
                                </div>
                        
                                <div className="col-md-4">
                                    <Link to="/luxury-car-rentals-miami">
                                        <div className="dashboard-carousel-item-wrapper url-cursor" >
                                            <div className="property-image">
                                                <img src="https://res.cloudinary.com/woodendoor-pm/image/upload/v1630681154/cars/LAMBORGHINI%20URUS%20GREY/Main_nylb1f.jpg" alt=""/>
                                            </div>
                                            <h5>Cars</h5>
                                        </div>
                                    </Link>
                                </div>
                       
                                        
                            </div>     
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Contact/>
        </>
    );
}