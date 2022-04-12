import {Link} from "react-router-dom";
function Contact() {
    return (
        <section className="footer-top">
          <div className="container-fluid">
              <div className="row justify-content-sm-center">
                  <div className="col-12">
                      <h1 className="contact-us-text">Looking for the Perfect Vacation?</h1>
                      <p><Link to="/contact-luxuri-team" className="contact-us-btn" >Contact Us</Link></p>
                  </div>
              </div>
          </div>
        </section> 
    )
}
export default Contact;