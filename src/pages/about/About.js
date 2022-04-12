import React, {useEffect} from 'react';
import TrackPage from '../../hooks/TrackPage';
import Contact from '../../common/contact/Contact'
function About() {
    // const { REACT_APP_PUBLIC_URL } = process.env;
    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = "Luxuri Realtors";  
    }, []);

    const contactUsAr=[
        {
            name:"Larry Shinbaum",
            email: "larry@luxuri.com",
            phone_no:"(305) 975-7880",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625582581340-L72DCMKNA4662L67KOO2/Larry.png"
        },
        {
            name:"Elizabeth Bender",
            email: "bender@luxuri.com",
            phone_no:"(786) 375-7547",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625585865064-F6FTPXBUVFWU0H8R65JZ/Elizabeth+Bender.png"
        },
        {
            name:"Rebecca Geornas",
            email: "rebecca@luxuri.com",
            phone_no:"(305) 922-5720",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625606802149-J2SQJF7II4M7CVVGFDUM/Rebecca+Geornas.png"
        },
        {
            name:"Jonathan Rosenthal",
            email: "jonathan@luxuri.com",
            phone_no:"(754) 422-3068",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625586680423-KG7UZ0WAXCYUAV19BDTY/Jonathan.png"
        },
        {
            name:"Gisela Coloma",
            email: "gigi@luxuri.com",
            phone_no:"(786) 269-5250",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625586220702-KBGSOGMZYO5ZFRBZZJIQ/Gisela+Coloma.png"
        },
        {
            name:"Jay Damota",
            email: "damota@luxuri.com",
            phone_no:"(786) 352-9705",
            image: "https://images.squarespace-cdn.com/content/v1/5eee946aa384c5543daf3596/1625586875064-EAG7ZKS0HQHIET1PMTJO/Jonathan+Damota.png"
        }
    ];

    return (
        <>
            <section className="main">
                <div className="fixed-header-gap text-center">       
                    <h1>Luxuri Realtors Team</h1>
                </div>

                {/* <div className="our-mission">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <h2>OUR MISSION</h2>
                                <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                            </div>
                        </div>           
                    </div>
                </div> */}
                <div className="container" style={{ marginTop:'50px' }}>
                        <div className="row">
                            {contactUsAr.map((contact, index)=>{
                                return (
                                    <div key={index} className="col-md-4 about-page-item" style={{ textAlign:'center' }}>
                                        <img src={contact.image} alt=""/>
                                        <h5 style={{ marginTop:'10px' }}>{contact.name}</h5>
                                        <p>{contact.email}</p>
                                        <p>{contact.phone_no}</p>
                                    </div>
                                )
                            })}
                            
                            
                        </div>           
                    </div>
                {/* <div className="our-story">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-7">
                                <h4>OUR STORY</h4>
                                <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                                <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                                <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                                <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                                
                            </div>
                            <div className="col-md-5">
                                <div className="story-image">
                                    <img src={REACT_APP_PUBLIC_URL+"images/about-banner-2.jpeg"} alt=""/>
                                </div>
                            </div>
                        </div>           
                    </div>
                </div>
                
                <div className="property-slider our-founder">
                    <div className="founder-details">       
                        <h3>Our CEO and FOUNDER</h3>
                        <p>LUXURI ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed augue lacus. Eu turpis egestas pretium aenean.</p>
                    </div>
                </div> */}



            </section> 
            <Contact/>
        </>
    );
}

export default About;