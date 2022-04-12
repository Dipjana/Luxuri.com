import React, {useState, useEffect, useRef, useContext} from 'react';
import { AuthContext } from '../../AuthContext';
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from 'moment';
import {propertyHeroes, carHeroes, getLocations, yatchHeroes, vacationHouse, locationList, locationPlace} from './apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import TrackPage from '../../hooks/TrackPage';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';
import {AddCircleOutline, RemoveCircleOutline, Search} from '@material-ui/icons';

function Homepage(props) {
    
    const { REACT_APP_PUBLIC_URL } = process.env;
    const authDetails = useContext(AuthContext);

    const isMobile= window.innerWidth<768 ? true : false;

    const [noOfGuest, setNoOfGuest]= useState(0);
    const [checkInDate, setCheckInDate]= useState(new Date(moment().format('Y/MM/DD')));
    const [checkOutDate, setCheckOutDate]= useState(new Date(moment().add(3, 'd').format('Y/MM/DD')));
    const [showLocationDropdown, setShowLocationDropdown]= useState(false);
    const [location, setLocation]= useState('');
    const [locationName, setLocationName]= useState('');
    const [locationList, setLocationList]= useState([]);
    const [carParallex, setCarParallex]= useState(isMobile);
    const [yachtParallex, setYachtParallex]= useState(isMobile);

    const [properties, setProperties]= useState(null);
    const [cars, setCars]= useState(null);
    const [yachts, setYachts]= useState(null);

    const carRef = useRef(null);
    const carWrapperRef = useRef(null);

    const yachtRef = useRef(null);
    const yachtWrapperRef = useRef(null);

    const datepickerRef = useRef(null);

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = "Luxuri";  
      }, []);

    useEffect(() => {
        
        
        if(carRef.current!==null){
            if(carParallex===false){
                const car_controller = new window.ScrollMagic.Controller()
                const car_controller2 = new window.ScrollMagic.Controller({
                    vertical: false
                })
                const car_el = carRef.current;
                const car_wrapper = carWrapperRef.current
                const car_slides = car_el.querySelectorAll('.El__slide')
                const car_horizontalMovement = new window.TimelineMax()
            
                car_horizontalMovement
                  .add([
                    window.TweenMax.to(car_wrapper, 1, { x: `-50%` })
                  ])
                  new window.ScrollMagic.Scene({
                      triggerElement: car_el,
                      triggerHook: 'onLeave',
                      duration: `${car_slides.length * 100}%`
                  })
                  .setPin(car_el)
                  .setTween(car_horizontalMovement)
                  .addTo(car_controller)
              
                  car_slides.forEach((item, index) => {
                 
              
                  new window.ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 1,
                    duration: '100%'
                  }).addTo(car_controller2)
                })
                setCarParallex(true);
            }
        }

        if(yachtRef.current!==null){
            if(yachtParallex===false){
                const yacht_controller = new window.ScrollMagic.Controller()
                const yacht_controller2 = new window.ScrollMagic.Controller({
                    vertical: false
                })
                const yacht_el = yachtRef.current;
                const yacht_wrapper = yachtWrapperRef.current
                const yacht_slides = yacht_el.querySelectorAll('.El__slide')
                const yacht_horizontalMovement = new window.TimelineMax()
            
                yacht_horizontalMovement
                  .add([
                    window.TweenMax.to(yacht_wrapper, 1, { x: `-50%` })
                  ])
                  new window.ScrollMagic.Scene({
                      triggerElement: yacht_el,
                      triggerHook: 'onLeave',
                      duration: `${yacht_slides.length * 100}%`
                  })
                  .setPin(yacht_el)
                  .setTween(yacht_horizontalMovement)
                  .addTo(yacht_controller)
              
                  yacht_slides.forEach((item, index) => {
                 
              
                  new window.ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 1,
                    duration: '100%'
                  }).addTo(yacht_controller2)
                })
                setYachtParallex(true);
            }
        }

    },[carParallex, yachtParallex])
    useEffect(() => {
        if(properties===null){
            propertyHeroes().then(resp=>{
                if(resp.data!=null && resp.data.length > 0){
                    setProperties(resp.data);
                }else{
                    setProperties([])
                }
            })
        }
    },[properties]);

    useEffect(() => {
        if(cars===null){
            carHeroes().then(resp=>{
                if(resp.data!=null && resp.data.length > 0){
                    setCars(resp.data);
                }else{
                    setCars([])
                }
            })
        }
    },[cars]);

// my code
// useEffect(()=>{
//     vacationHouse();
// },[])



    useEffect(() => {
        if(yachts===null){
            yatchHeroes().then(resp=>{
                if(resp.data!=null && resp.data.length > 0){
                    setYachts(resp.data);
                }else{
                    setYachts([])
                }
            })
        }
    },[yachts]);

    //Location List
    useEffect(()=>{
        locationPlace().then(resp=>{
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
    //                  setLocationList([{locationID: 3, location: "Miami"},...newLoc]);
    //             }
    //         })
    //     }
    // },[locationList,authDetails]);

    const updatePropertyType=(type, locationName)=>{
        setLocation(type);
        setLocationName(locationName)
        setShowLocationDropdown(false);
    };

    const handleSubmitSearch=()=>{
        if(location===""){
            toast.error('Please select a location.');
            return;
        }
        if(checkOutDate===null){
            toast.error('Please select checkout date.');
            return;
        }
        if(moment(checkInDate).format('Y-MM-DD')===moment(checkOutDate).format('Y-MM-DD')){
            toast.error('Check Out Date must be grater than check In Date.');
            return;
        }
        if(noOfGuest===0){
            toast.error("Please choose Number of Guests");
            return;
        }
        let queryString=`noOfGuest=${noOfGuest}&checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}&location=${location}&locationName=${locationName}`;
        const locationNameurl= locationName.replaceAll(' ','-');
        const newRoute = `/${locationNameurl.toLowerCase()}-vacation-homes?${queryString}`;
        props.history.push(newRoute);
    };

    const propertyDetailspage=(locationId, locationDetails)=>{
        console.log(locationDetails)
        let queryString=`noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=${locationId}&locationName=${locationDetails}`;
        const locationNameurl= locationDetails.replaceAll(' ','-');
        const newRoute = `/${locationNameurl.toLowerCase()}?${queryString}`;
        props.history.push(newRoute);
    };

    const goToCars=()=>{
        props.history.push('/luxury-car-rentals-miami');
    }

    const goToYachts=()=>{
        props.history.push('/luxury-yacht-rentals-miami');
    }

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 3
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };

    const opendatePicker = () => { // bind with an arrow function
        const datepickerElement = datepickerRef.current;
        datepickerElement.setOpen(true);
    }

    return (
      <>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            <MetaTags>
                <meta name="description" content="Home | Luxuri" />
            </MetaTags>
        <section className="main">
            <section className="video-banner">
                <div className="background-video w-background-video w-background-video-atom">
                    <video autoPlay={true} loop={true} style={{ backgroundImage:"url("+REACT_APP_PUBLIC_URL+"videos/luxuri_video_image.png)" }} muted={true} playsInline="" data-wf-ignore="true" data-object-fit="cover">
                        <source src={'videos/luxuri_video.mp4'} type="video/mp4"/>
                    </video>
                    {/* <div className="banner-logo">
                        <img src={REACT_APP_PUBLIC_URL+'images/classic-logo---white_1.png'} alt=""/>
                    </div> */}

                   

                    <div className="guest-book">
                        <div className="row">
                            <div className="col-5 col-md-3">
                                <div className="location-search mobile-border">
                                    <div className="dropdown" style={{ textAlign:'center' }}>
                                        <button className="btn dropdown-toggle" onClick={()=>setShowLocationDropdown(!showLocationDropdown)} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{locationName!=="" ? locationName : 'Location'}</button>
                                        <div className={`dropdown-menu ${showLocationDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                            {locationList.length >0 ? (
                                                locationList.map((item)=>(
                                                    <Link key={item.place_id} className="dropdown-item" to="#" onClick={()=>{updatePropertyType(item.place_id, item.place_name)}}>{item.place_name}</Link>
                                                ))
                                            ) : null}
                                            

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-7 col-md-3">
                                <div className="guest-numbers  make-center mobile-border" style={{ textAlign: 'center' }}>
                                    <label htmlFor="checkOutDate" style={{ marginBottom:'0px' }}>Guests</label>
                                    <div className="number-change">
                                        <div className="value-button" id="decreaseW" onClick={()=>{if((noOfGuest-1) >=0) { setNoOfGuest(noOfGuest-1); }}}>
                                       < RemoveCircleOutline/>

                                        </div>
                                        <input readOnly type="number" id="numberWidth" value={noOfGuest} onChange={(e)=>{setNoOfGuest(e.target.value)}}/>
                                        <div className="value-button" id="increaseW" onClick={()=>setNoOfGuest(noOfGuest+1)}>
                                            <AddCircleOutline/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="col-12 col-md-3">
                                <div className="check-outs property-details-datepicker make-center remove-lineheight mobile-border">
                                    <label className="url-cursor" htmlFor="checkOutDate" onClick={opendatePicker}>Check-In / Check-Out</label>
                                    <DatePicker className="form-control" selected={checkInDate}
                                        ref={datepickerRef}
                                        minDate={new Date()}
                                        customInput={<DatepickerInput />}
                                        selectsRange
                                        startDate={checkInDate}
                                        endDate={checkOutDate}
                                        monthsShown={window.screen.width <=480 ? 1 : 2}
                                        withPortal
                                        portalId="root"
                                        onChange={dates => {
                                            const [start, end] = dates;
                                            setCheckInDate(start);
                                            setCheckOutDate(end);
        
                                        }}
                                        
                                        />
                                </div>
                            </div>
                            
                            <div className="col-12 col-md-3">
                                <div className="search-button ">
                                    <button type="button" onClick={()=>handleSubmitSearch()}><Search/> Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="property-block car-block">
                <div className="container-fluid">
                   
                    <div className="dashboard-carousel">
                            {properties!==null ? (
                                <Carousel responsive={responsive} transitionDuration={100}  itemClass="dashboard-carousel-item">
                                {properties.map((item, index)=>(
                                    <div className="dashboard-carousel-item-wrapper url-cursor" key={index} onClick={()=>propertyDetailspage(item.heroObjectCategoryID, item.name)}>
                                        <div className="property-image">
                                            {item.imageFilePath!=="" ? (<img src={`img/${item.imageFilePath}`} alt=""/>) : null}
                                        </div>
                                        <h5>{item.name}</h5>
                                    </div>
                                ))}
                                
                                </Carousel>
                            ) : (
                                <div className="row">
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                </div>
                            ) }
                        
                    </div>
                </div>
            </div>
            
            
            
            
            <div className="property-slider car-slider">
                <h1>Luxury Exotics</h1>
            </div>
            <div className="El" ref={carRef}>
                <div className={!isMobile ? 'El__wrapper' : ''} ref={carWrapperRef}>
                    <div className="El__slide car-top">
                        <h1>MAKE A STUNNING FIRST IMPRESSION</h1>
                    </div>
                    <div className="El__slide car-bottom">
                            <Link className="slider-button" to="/luxury-car-rentals-miami">Click here</Link>
                    </div>
                </div>
            </div>

            <div className="property-block car-block">
                <div className="container-fluid">
                    <div className="row" style={{ marginBottom:'15px' }}>
                        <div className="col-12">
                            <h3>Super Car Experience: Exotics</h3>
                        </div>
                    </div>
                    <div className="dashboard-carousel">
                        {cars!==null ? (
                                <Carousel responsive={responsive} transitionDuration={100}  itemClass="dashboard-carousel-item">
                                {cars.map((item, index)=>(
                                    <div className="dashboard-carousel-item-wrapper url-cursor" key={index} onClick={()=>goToCars()}>
                                        <div className="property-image">
                                            {item.imageFilePath!=="" ? (<img src={`img/${item.imageFilePath}`} alt=""/>) : (<img src={'images/car-2.jpg'} alt=""/>)}
                                        </div>
                                        <h5>{item.name}</h5>
                                    </div>
                                ))}
                                
                                </Carousel>
                            ) : (
                                <div className="row">
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                </div>
                            ) }
                       
                    </div>
                </div>
            </div>
            
            <div className="property-slider yacht-slider">
                <h1>Luxury Yachts</h1>
            </div>
            <div className="El" ref={yachtRef}>
                <div className={!isMobile ? 'El__wrapper' : ''} ref={yachtWrapperRef}>
                    <div className="El__slide yacht-top">
                        <h1>MAKE A STUNNING FIRST IMPRESSION</h1>
                    </div>
                    <div className="El__slide yacht-bottom">
                            <Link className="slider-button" to="/luxury-yacht-rentals-miami">Click here</Link>
                    </div>
                </div>
            </div>
            
            <div className="property-block car-block">
                <div className="container-fluid">
                    <div className="row" style={{ marginBottom:'15px' }}>
                        <div className="col-12">
                            <h3>Yachts</h3>
                        </div>
                    </div>
                    <div className="dashboard-carousel">
                        {yachts!==null ? (
                                <Carousel responsive={responsive} transitionDuration={100}  itemClass="dashboard-carousel-item">
                                {yachts.map((item, index)=>(
                                    <div className="dashboard-carousel-item-wrapper url-cursor" key={index} onClick={()=>goToYachts()}>
                                        <div className="property-image">
                                            {item.imageFilePath!=="" ? (<img src={`img/${item.imageFilePath}`} alt=""/>) : (<img src={'images/car-2.jpg'} alt=""/>)}
                                        </div>
                                        <h5>{item.name}</h5>
                                    </div>
                                ))}
                                
                                </Carousel>
                            ) : (
                                <div className="row">
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                    <div className="col-md-4" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                </div>
                            ) }
                       
                    </div>
                </div>
            </div>
        </section>
        <Contact/>
      
      </>
    );
  }
  
  export default Homepage;