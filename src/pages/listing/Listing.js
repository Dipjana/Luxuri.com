import React, {useState, useContext, useEffect, useRef} from 'react';
import { AuthContext } from '../../AuthContext';
import DatePicker from "react-datepicker";
import queryString from 'query-string';
import { Range } from 'rc-slider';
import {getMatchedEnquiries, getVillaByLocation} from './apis';
import 'rc-slider/assets/index.css';
import moment from 'moment';
import TrackPage from '../../hooks/TrackPage';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import {AddCircleOutline, RemoveCircleOutline} from '@material-ui/icons';
import {
    Redirect
  } from "react-router-dom";
  import MetaTags from 'react-meta-tags';

function Listing(props) {
    const authDetails = useContext(AuthContext);
    const { REACT_APP_PUBLIC_URL } = process.env;

    const datepickerRef = useRef(null);

    const urlParams = queryString.parse(props.location.search)
    if(urlParams.location==undefined){
        let loc=1;
        let loc_name='Miami'
        if(props.location.pathname==="/aspen-vacation-homes"){
            loc=2;
            loc_name='Aspen'
        }else if(props.location.pathname==="/washington-dc-vacation-homes"){
            loc=3;
            loc_name='Washington Dc'
        }
        else if(props.location.pathname==="/los-angeles-vacation-homes"){
            loc=2;
            loc_name='Los Angeles'
        }
        let queryString=`noOfGuest=1&checkInDate=${moment().format('Y-MM-DD')}&checkOutDate=${moment().add(3, 'd').format('Y-MM-DD')}&location=${loc}&locationName=${loc_name}`;
        const newRoute = `${props.location.pathname}?${queryString}`;
        //props.history.push(newRoute);
        window.location.href=newRoute
    }
    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    let LocationName=urlParams?.locationName ?? '';
    LocationName=LocationName.replace(' Vacation Homes','')

    useEffect(() => {
        document.title = LocationName+' Vacation Homes';  
      }, [LocationName]);

    const [noOfGuest, setNoOfGuest]= useState(urlParams.noOfGuest ??  0);
    const [checkInDate, setCheckInDate]= useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [checkOutDate, setCheckOutDate]= useState(urlParams.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [showSortDropdown, setShowSortDropdown]= useState(false);
    const [properties, setProperties]= useState(null);
    const [listproperties, setListProperties]= useState(null);


   
    //console.log(moment(urlParams.checkInDate))
    
    const [lowerBudget, setLowerBudget]= useState(0);
    const [upperBudget, setUpperBudget]= useState(2000000);
    const [lowerValue, setLowerValue]= useState(urlParams?.lowerValue ?? 0);
    const [upperValue, setUpperValue]= useState(urlParams?.upperValue ?? 2000000);
    const [maxAmount, setMaxAmount]= useState(2000000);
    const [initPage, setInitPage]= useState(true);

    const [loading, setLoading]= useState(true);
    const [rangeFlag, setRangeFlag]= useState(true);
    const [sortOrder, setSortOrder]= useState(urlParams?.sortOrder ?? 'price_low_to_high');


    let locationId=urlParams.location;

    const propertyList=()=>{
      
        getVillaByLocation(locationId).then(resp=>{
            if(resp.data!=null && resp.data.length > 0){
                setProperties(resp.data);

                let propertyOrder=resp.data;
      
                let maxValueProperty=0;
                propertyOrder.map(el=>{
                    if(el.price>maxValueProperty){
                        maxValueProperty=el.price
                    }
                })
                setUpperBudget(maxValueProperty)
                if(initPage===false){
                    setUpperValue(maxValueProperty)
                    setLowerValue(0)
                    
                }else{
                    propertyOrder=propertyOrder.filter(p=>{
                        if(p.price>=lowerValue && p.price<=upperValue){
                            return p;
                        }
                        return false
                    })
                }
                if(sortOrder==="price_low_to_high"){
                    propertyOrder.sort(function(a, b){
                        if (a.price < b.price) 
                        {
                        return -1;
                        }    
                        else if (a.price > b.price)
                        {
                        return 1;
                        }   
                        return 0;
                    });
                }else if(sortOrder==="price_high_to_low"){
                    propertyOrder.sort(function(a, b){
                        if (a.price > b.price) 
                        {
                        return -1;
                        }    
                        else if (a.price < b.price)
                        {
                        return 1;
                        }   
                        return 0;
                    });
                }else if(sortOrder==="guest_low_to_high"){
                    propertyOrder.sort(function(a, b){
                        if (a.numberOfGuests < b.numberOfGuests) 
                        {
                        return -1;
                        }    
                        else if (a.numberOfGuests > b.numberOfGuests)
                        {
                        return 1;
                        }   
                        return 0;
                    });
                }else if(sortOrder==="guest_high_to_low"){
                    propertyOrder.sort(function(a, b){
                        if (a.numberOfGuests > b.numberOfGuests) 
                        {
                        return -1;
                        }    
                        else if (a.numberOfGuests < b.numberOfGuests)
                        {
                        return 1;
                        }   
                        return 0;
                    });
                }
    
                setProperties(propertyOrder)
                if(initPage===true){
                    window.scroll({
                        top: urlParams?.scrollPosition ?? 0,
                        behavior: 'smooth'
                      });
                }
                setInitPage(false)

                setRangeFlag(false)
             
                
            }else{
                setProperties(null)
                setListProperties(null)
                
            }
            setLoading(false)
        }).catch((err,resp)=>{
            setLoading(false)
            setProperties(null)
            setListProperties(null)
        })
    };

    
    /*================ My Code start ================*/
    


  useEffect(()=>{
    propertyList();
  },[])
        
        
    
/*======end==========*/

    const filterByPriceRange=()=>{
        let propertyOrder=[...properties];
        propertyOrder=propertyOrder.filter(p=>{
            if(p.price>=lowerValue && p.price<=upperValue){
                return p;
            }
            return false
        })
       
        setProperties(propertyOrder)
    }

    useEffect(() => {
        if(properties!==null){
         
            let propertyOrder=[...properties];
         
            if(sortOrder==="price_low_to_high"){
                propertyOrder.sort(function(a, b){
                    if (a.price < b.price) 
                    {
                    return -1;
                    }    
                    else if (a.dsp > b.dsp)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }else if(sortOrder==="price_high_to_low"){
                propertyOrder.sort(function(a, b){
                    if (a.price > b.price) 
                    {
                    return -1;
                    }    
                    else if (a.price < b.price)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }else if(sortOrder==="guest_low_to_high"){
                propertyOrder.sort(function(a, b){
                    if (a.numberOfGuests < b.numberOfGuests) 
                    {
                    return -1;
                    }    
                    else if (a.numberOfGuests > b.numberOfGuests)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }else if(sortOrder==="guest_high_to_low"){
                propertyOrder.sort(function(a, b){
                    if (a.numberOfGuests > b.numberOfGuests) 
                    {
                    return -1;
                    }    
                    else if (a.numberOfGuests < b.numberOfGuests)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }

            setProperties(propertyOrder)
        }
    
    },[sortOrder]);

    useEffect(() => {
        propertyList();
    },[locationId, noOfGuest, authDetails]);
    useEffect(() => {
        setRangeFlag(true)
    
    },[locationId, checkInDate, checkOutDate, noOfGuest]);



    useEffect(() => {
        // const startDate = moment(checkInDate);
        // const endDate = moment(checkOutDate);
        // let difference = endDate.diff(startDate, 'days');
        // if(difference==0){
        //     difference=1;
        // }
        // setUpperBudget(difference*maxAmount);
        // setUpperValue(difference*maxAmount);
        propertyList();
    },[checkInDate, checkOutDate])

    const openDetailsPage=(villa_id, place_id, propertyFriendlyName, location, dsp)=>{
        const scrollPosition=window.pageYOffset || document.documentElement.scrollTop
        let queryStringP=`noOfGuest=${noOfGuest}&checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&location=${urlParams.location}&locationName=${urlParams.locationName}&scrollPosition=${scrollPosition}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryStringP}`);

        propertyFriendlyName= propertyFriendlyName.replaceAll(' ','-');
        location= location.replaceAll(' ','-');
        let queryString=`propertyId=${villa_id}&noOfGuest=${noOfGuest}&checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}`;
        props.history.push(`/property-details/${location.toLowerCase()}-vacation-homes/${propertyFriendlyName}?${queryString}`);
        
    };

    
    const numberFormat=(x)=> {
        x=parseInt(x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const opendatePicker = () => { // bind with an arrow function
        const datepickerElement = datepickerRef.current;
        datepickerElement.setOpen(true);
    }
    const replaceUrl=()=>{
        const scrollPosition=urlParams?.scrollPosition ?? (window.pageYOffset || document.documentElement.scrollTop)
        let queryString=`noOfGuest=${noOfGuest}&checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&location=${urlParams.location}&locationName=${urlParams.locationName}&scrollPosition=${scrollPosition}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryString}`);
    }
    useEffect(() => {
        if(checkOutDate===null) return;
        replaceUrl()
    },[noOfGuest, sortOrder, checkOutDate]);

    let footerContent=null;
    if(props.location.pathname==="/aspen-vacation-homes"){
        footerContent=(
            <div>
                <h2 className="property-footer-h2">Looking for more options?</h2>
                <p className="property-footer-p">We have an extensive, exceptional collection of luxurious and lavish homes sprinkled all across Aspen, and the assortment is only growing larger. Exclusive mansions and villas are incorporated every month into the catalog to give our unique customers a broader range of choices. Reach out through chat support to get assistance with finding the ideal home, satisfy special requests, and ensure that your stay in Aspen is beyond the elite’s standards.</p>
            </div>
        );
    }

    return (
        <>
        <MetaTags>
            <meta name="description" content={LocationName+' Vacation Homes'} />
        </MetaTags>
      <section className="main">    
        <div className="list-filter-block fixed-header-gap">       
            <div className="container-fluid">
                <div className="list-page-filter">
                    <div className="row justify-content-md-center">
                        <div className="col-md-9 col-lg-7">
                            <div className="filter-heading">
                                <h1>{LocationName} Vacation Homes</h1>
                                <small><em>*Note: Depending on the area, some homes may only be rented by the month and some homes are only rented for a minimum of 6 months and 1 day.</em></small>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-md-9 col-lg-7">
                            <div className="list-filter">
                                <div className="guest-book">
                                    <div className="row">
                                    
                                        <div className="col-sm-6 col-md-6">
                                            <div className="check-ins property-details-datepicker" style={{ borderRadius:"50px", width: "100%"}}>
                                            <label onClick={opendatePicker} className="url-cursor" htmlFor="checkInDate" style={{ width: "100%" }}>Check-In / Check-Out</label>
                                                

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
                                    
                                        <div className="col-6 col-md-3">
                                            <div className="guest-numbers url-cursor" style={{ minHeight:'43px' }} onClick={()=>setShowSortDropdown(!showSortDropdown)}>                 
                                                <div className="dropdown">
                                                    <button className="btn dropdown-toggle sort-button" type="button" >
                                                        Sort
                                                    </button>
                                                    <div className={`dropdown-menu ${showSortDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                                        <p className="dropdown-item url-cursor" onClick={()=>{setSortOrder('price_low_to_high'); setShowSortDropdown(!showSortDropdown)}}>Price Low to High</p>
                                                        <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('price_high_to_low'); setShowSortDropdown(!showSortDropdown)}}>Price High to Low</p>
                                                        <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('guest_low_to_high'); setShowSortDropdown(!showSortDropdown)}}>Guests Low to High</p>
                                                        <p className="dropdown-item url-cursor" onClick={()=>{setSortOrder('guest_high_to_low'); setShowSortDropdown(!showSortDropdown)}}>Guests High to Low</p>
                                                    </div>
                                                </div>
                                                <div>{sortOrder!=null ? sortOrder.replaceAll('_',' ') : null}</div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="guest-numbers">
                                                <label htmlFor="checkOutDate">Guests</label>
                                                <div className="number-change">
                                                    <div className="value-button" id="decreaseW" onClick={()=>{if((noOfGuest-1) >=0) { setNoOfGuest(parseInt(noOfGuest)-1); }}}>
                                                        < RemoveCircleOutline/>
                                                    </div>
                                                    <input readOnly type="number" id="numberWidth" value={noOfGuest} onChange={(e)=>{setNoOfGuest(e.target.value)}}/>
                                                    <div className="value-button" id="increaseW" onClick={()=>{setNoOfGuest(parseInt(noOfGuest)+1); }}>
                                                    <AddCircleOutline/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="col-md-9 col-lg-7">
                            <div className="price-range">
                                <p>
                                    <label>Total Budget (${numberFormat(lowerValue)} - ${numberFormat(upperValue)})</label>
                                </p>                
                                <Range allowCross={false} min={lowerBudget} max={upperBudget} value={[lowerValue, upperValue]} tipFormatter={value => `${value}`} defaultValue={[lowerValue, upperValue]} onChange={(value)=>{
                                    setLowerValue(value[0]);
                                    setUpperValue(value[1]);
                                }}
                                onAfterChange={()=>{
                                    filterByPriceRange();
                                    replaceUrl()
                                }}  />
                
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="property-list-block">
                    <div className="row">
                        {loading===true ? (
                            <>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                            </>
                        ) : null}
                        {properties!=null && properties.length >0 && !loading ? (
                            properties.map((property, index)=>(
                                <div className="col-md-6" key={index}>
                                    <div className="property-listing url-cursor" >
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="property-image" onClick={()=>openDetailsPage(property.villa_id, property.place_id, property.villa_name, property.location)} style={{ height:"210px" }}>
                                                    <img  src= {`img/${property.imageFilePath}`} alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="property-desc" onClick={()=>openDetailsPage(property.villa_id, property.place_id, property.villa_name, property.location)}>
                                                    <h4 style={{ wordBreak:"break-all" }}>{property.villa_name}</h4>
                                                    <ul>
                                                        <li>
                                                            <strong className="feature-item">Bedrooms : </strong>
                                                            <span className="feature-value">{property.numberOfBedrooms}</span>
                                                        </li>
                                                        <li>
                                                            <strong className="feature-item">Guests : </strong>
                                                            <span className="feature-value">{property.numberOfGust}</span>
                                                        </li>
                                                        <li>
                                                            <strong className="feature-item">Location : </strong>
                                                            <span className="feature-value">{property.location}</span>
                                                        </li>                                        
                                                    </ul>

                                                    <p className="daily-rate"><strong>${property.price}</strong>/Night</p>

                                                    {/* <div className="facilities-available">
                                                        <ul>
                                                            {property.amenities.length>0 ? (
                                                                property.amenities.map((aminity, i)=>(
                                                                    aminity.imageFilePath!=null ? (<li key={'am'+i}><img src={aminity.imageFilePath} alt=""/></li>) : null
                                                                ))
                                                            ) : null}
                                                            
                                                            
                                                        </ul>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        
                            ))
                        ) : null}
                        
                    </div>
                </div>
                {footerContent}
            </div>
        </div>

    </section>
    
    <Contact/>
    </>
    );
  }
  
  export default Listing;