import React from "react";
import {
    Switch,
    Route
 
  } from "react-router-dom";
import ReactGA from 'react-ga';
import Header from '../header/Header';
import Footer from '../footer/Footer';
// import moment from 'moment';
import GoToTop from '../../hooks/GoToTop'


function Layout(){
    const { REACT_APP_GOOGLE_ANALYTICS_STATUS, REACT_APP_GOOGLE_ANALYTICS_CODE } = process.env;
    if(REACT_APP_GOOGLE_ANALYTICS_STATUS==='1'){
        ReactGA.initialize(REACT_APP_GOOGLE_ANALYTICS_CODE);
        //console.log('init', REACT_APP_GOOGLE_ANALYTICS_CODE)
    }

    const HomepageComponent = React.lazy(() => import('../../pages/home/Homepage'));
    const ListingComponent = React.lazy(() => import('../../pages/listing/Listing'));
    const AboutComponent = React.lazy(() => import('../../pages/about/About'));
    const ContactComponent = React.lazy(() => import('../../pages/contact/Contact'));
    const ConciergeComponent = React.lazy(() => import('../../pages/concierge/Concierge'));
    const PropertyDetailsComponent = React.lazy(() => import('../../pages/propertyDetails/PropertyDetails'));
  
    const CarsComponent = React.lazy(() => import('../../pages/cars/Cars'));
    const CarDetailsComponent = React.lazy(() => import('../../pages/carDetails/CarDetails'));
    const YachtsComponent = React.lazy(() => import('../../pages/yachts/Yachts'));
    const YachtDetailsComponent = React.lazy(() => import('../../pages/yachtDetails/YachtDetails'));
  
    const SuccessComponent = React.lazy(() => import('../../pages/success/Success'));
    const MiamiSuccessComponent = React.lazy(() => import('../../pages/success/Miami'));
    const CarSuccessComponent = React.lazy(() => import('../../pages/success/Car'));
    const YachtSuccessComponent = React.lazy(() => import('../../pages/success/Yacht'));
    const ConciergeSuccessComponent = React.lazy(() => import('../../pages/success/Concierge'));



    return (
        <>
            <Header/>
            <Switch>
              <Route path="/" exact component={HomepageComponent}/>
              
              <Route exact path="/luxury-car-rentals-miami" component={CarsComponent}/>
              <Route path="/luxury-yacht-rentals-miami" component={YachtsComponent}/>
              <Route path="/luxuri-realtors" component={AboutComponent}/>
              <Route path="/concierge-services" component={ConciergeComponent}/>
              <Route path="/property-details/:city/:slug" component={PropertyDetailsComponent}/>
              <Route path="/car-details/:id" component={CarDetailsComponent}/>
              <Route path="/yacht-details/:id" component={YachtDetailsComponent}/>

              <Route path="/success" exact component={SuccessComponent}/>
              <Route path="/miami-home-rental-inquiry" exact component={MiamiSuccessComponent}/>
              <Route path="/aspen-home-rental-inquiry" exact component={MiamiSuccessComponent}/>
              <Route path="/washington-dc-home-rental-inquiry" exact component={MiamiSuccessComponent}/>
              <Route path="/los-angeles-home-rental-inquiry" exact component={MiamiSuccessComponent}/>
              <Route path="/miami-car-rental-inquiry" exact component={CarSuccessComponent}/>
              <Route path="/miami-yacht-rental-inquiry" exact component={YachtSuccessComponent}/>
              <Route path="/concierge-service-inquiry" exact component={ConciergeSuccessComponent}/>

              
              <Route path="/contact-luxuri-team" component={ContactComponent}/>
              
              {/* <Route exact path="/miami-vacation-homes">
                <Redirect to={`/miami-vacation-homes?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=3&locationName=Miami`} />
              </Route>
              
              <Route exact path="/aspen-vacation-homes">
                <Redirect to={`/aspen-vacation-homes?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=1&locationName=Aspen`} />
              </Route>
              <Route exact path="/washington-dc-vacation-homes">
                <Redirect to={`/washington-dc-vacation-homes?noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=4&locationName=Washington DC`} />
              </Route> */}
              
              <Route path="/:city" component={ListingComponent}/>

            </Switch>
            <GoToTop/>
            <Footer/>
        </>
    );
}
export default Layout;