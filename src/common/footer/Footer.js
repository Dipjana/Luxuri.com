import {Link} from "react-router-dom";
import moment from 'moment';
function Footer() {
    // const { REACT_APP_PUBLIC_URL } = process.env;
    return (
        <>
         {/* <section className="footer-top">
          <div className="container-fluid">
              <div className="row justify-content-sm-center">
                  <div className="col-sm-6 col-md-5 col-lg-4">
                      <p>Sign up to our newsletter</p>
                      <div className="input-group">
                          <input type="text" className="form-control" placeholder="Your Email Address" aria-label="Your Email Address" aria-describedby="button-addon2"/>
                          <div className="input-group-append">
                              <button className="btn btn-primary" type="button" id="button-addon2"><img src={REACT_APP_PUBLIC_URL+"images/icons8-send-email-100-2.png"} width="20" alt=""/></button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </section>  */}

        
            <section className="footer" style={{ marginTop:'20px' }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <div className="footer-logo">
                                <Link to="/">
                                    <img src={"images/logo-black.png"}  alt="logo"/>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="footer-links">
                                <ul>
                                    <li><Link to={{
                                            pathname: `/miami-vacation-homes`,
                                            search: `?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=3&locationName=Miami`,
                                        }}>Luxury Homes</Link></li>
                                    <li><Link to="/luxury-car-rentals-miami">Exotic Cars</Link></li>
                                    <li><Link to="/luxury-yacht-rentals-miami">Yachts</Link></li>
                                    <li><Link to="/concierge-services">Concierge</Link></li>
                                    <li><Link to="/luxuri-realtors">About</Link></li>
                                    <li><Link to="/contact-luxuri-team">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            
                        </div>
                    </div>
                </div>
            </section>
                <section className="footer-bottom">
                <div className="container-fluid">
                <div className="row">
                        <div className="col-12">
                        <div className="social-links">
                                <ul>
                                    <li><a target="_blank" rel="noreferrer" href="https://www.instagram.com/luxurirentals/"> <img src={"images/instagram.png"} alt="instagram"/></a></li>
                                    
                                </ul>
                            </div>
                            </div>
                            </div>
                    <div className="row">
                    
                        <div className="col-12">
                            Copyright &copy;{moment().format('Y')} Luxuri | All Rights Reserved
                        </div>
                        <div className="col-12">
                            Powered by WoodenDoor
                        </div>
                    </div>
                </div>
            </section>
      </>
    );
}

export default Footer;