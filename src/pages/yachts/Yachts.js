import React, {useState, useContext, useEffect, useRef} from 'react';
import { AuthContext } from '../../AuthContext';
import DatePicker from "react-datepicker";
import queryString from 'query-string';
import { Range } from 'rc-slider';
import {getYachts} from './apis';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import TrackPage from '../../hooks/TrackPage';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';
import { FilterList } from '@material-ui/icons';

function Yachts(props) {
    const authDetails = useContext(AuthContext);

    const urlParams = queryString.parse(props.location.search)
    const [checkInDate, setCheckInDate]= useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [showSortDropdown, setShowSortDropdown]= useState(false);
    const [lowerBudget, setLowerBudget]= useState(0);
    const [upperBudget, setUpperBudget]= useState(600);
    const [lowerValue, setLowerValue]= useState(urlParams?.lowerValue ?? 0);
    const [upperValue, setUpperValue]= useState(urlParams?.upperValue ?? 600);
    const [sortOrder, setSortOrder]= useState(urlParams?.sortOrder ?? 'length_low_to_high');

    const [yachts, setYachts]= useState(null);
    const [yachtMain, setYachtMain]= useState(null);
    const [initPage, setInitPage]= useState(true);

    const datepickerRef = useRef(null);

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = 'Yuxury yacht rentals miami';  
      }, []);

     

    //   useEffect(() => {
       
    //        getYachts().then(e=>{
    //            setYachts(e.data);
    //        })
        
    // },[]);


    const yatchFilter= async()=>{
        
           let resp = await getYachts();
           console.log(resp)
           console.log(resp.data);
           
                setYachts(resp.data);
                setYachtMain(resp.data)
               
                if(resp.data!==null){
                    let yachtData=resp.data;
                    let maxFeet=0;
                    yachtData.filter(elem=>{
                        if(elem.feet>maxFeet){
                            maxFeet=elem.feet
                        }
                    })
                    setUpperBudget(maxFeet)
                    if(initPage===false){
                        setUpperValue(maxFeet)
                        setLowerValue(0)
                        
                    }else{
                        yachtData=yachtData.filter(yacht=>{
                            if(yacht.feet>=lowerValue && yacht.feet<=upperValue){
                                return yacht;
                            }
                            return false
                        })
                    }
                    
                    if(sortOrder==="length_low_to_high"){
                        yachtData.sort(function(a, b){
                            if (a.feet < b.feet) 
                            {
                            return -1;
                            }    
                            else if (a.feet > b.feet)
                            {
                            return 1;
                            }   
                            return 0;
                        });
                    }else if(sortOrder==="length_high_to_low"){
                        yachtData.sort(function(a, b){
                            if (a.feet > b.feet) 
                            {
                            return -1;
                            }    
                            else if (a.feet < b.feet)
                            {
                            return 1;
                            }   
                            return 0;
                        });
                    }
        
                    if(initPage===true){
                        window.scroll({
                            top: urlParams?.scrollPosition ?? 0,
                            behavior: 'smooth'
                          });
                    }
                    setInitPage(false)
                }
       
    }

  useEffect(()=>{
    yatchFilter();
  },[])


    const openDetailsPage=(id)=>{

        const scrollPosition=window.pageYOffset || document.documentElement.scrollTop
        let queryStringN=`checkInDate=${moment(checkInDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&scrollPosition=${scrollPosition}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryStringN}`);

        let queryString=`checkInDate=${moment(checkInDate).format('Y-MM-DD')}`;
        props.history.push(`/yacht-details/${id}?${queryString}`);
    };
    const numberFormat=(x)=> {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const filterData=()=>{
        if(yachtMain!==null){
            let yachtOrder=[...yachtMain];

            yachtOrder=yachtOrder.filter(yacht=>{
                if(yacht.feet>=lowerValue && yacht.feet<=upperValue){
                    return yacht;
                }
                return false
            })
              if(sortOrder==="length_low_to_high"){
                yachtOrder.sort(function(a, b){
                    if (a.feet < b.feet) 
                    {
                    return -1;
                    }    
                    else if (a.feet > b.feet)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }else if(sortOrder==="length_high_to_low"){
                yachtOrder.sort(function(a, b){
                    if (a.feet > b.feet) 
                    {
                    return -1;
                    }    
                    else if (a.feet < b.feet)
                    {
                    return 1;
                    }   
                    return 0;
                });
            }

            setYachts(yachtOrder)
        }
        
    }
    useEffect(() => {
        filterData();
    },[sortOrder])

    const capitalizeFirstLetter=(string)=> {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const opendatePicker = () => { // bind with an arrow function
        const datepickerElement = datepickerRef.current;
        datepickerElement.setOpen(true);
    }
    const replaceUrl=()=>{
        const scrollPosition=urlParams?.scrollPosition ?? (window.pageYOffset || document.documentElement.scrollTop)
        let queryString=`checkInDate=${moment(checkInDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&scrollPosition=${scrollPosition}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryString}`);
    }
    useEffect(() => {
        replaceUrl()
    },[sortOrder, checkInDate]);
    


    
    return (
        <>
        <MetaTags>
            <meta name="description" content="Luxury yacht rentals miami" />
        </MetaTags>
      <section className="main">    
        <div className="list-filter-block fixed-header-gap">       
            <div className="container-fluid">
                <div className="list-page-filter">
                
                <div className="row justify-content-md-center">
                        <div className="col-md-9 col-lg-7">
                            <div className="filter-heading">
                                <h1>Luxuri Yacht Rentals</h1>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-md-9 col-lg-7">
                            <div className="list-filter">
                                <div className="guest-book">
                                    <div className="row">
                                    
                                    <div className="col-sm-6 col-md-6">
                                        <div className="check-ins" style={{ width:"100%", borderRadius:'30px' }}>
                                            <label onClick={opendatePicker} className="url-cursor" htmlFor="checkInDate">Pick up</label>
                                            <DatePicker className="form-control" selected={checkInDate}
                                                ref={datepickerRef}
                                                minDate={new Date()}
                                                customInput={<DatepickerInput />}
                                                withPortal
                                                portalId="root"
                                                onChange={date => {
                                                    setCheckInDate(date);
                                                    
                                                }}
                                                />
                                        </div>
                                        
                                    </div>
                                
                                    <div className="col-12 col-md-6">
                                        <div className="guest-numbers url-cursor" style={{ minHeight:'43px' }} onClick={()=>setShowSortDropdown(!showSortDropdown)}>                     
                                                <div className="dropdown">
                                                    <button className="btn dropdown-toggle sort-button" type="button" >
                                                        Sort
                                                    </button>
                                                    <div className={`dropdown-menu ${showSortDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                                        {/* <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('price_low_to_high'); setShowSortDropdown(!showSortDropdown)}}>Price Low to High</p>
                                                        <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('price_high_to_low'); setShowSortDropdown(!showSortDropdown)}}>Price High to Low</p> */}
                                                        <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('length_low_to_high'); setShowSortDropdown(!showSortDropdown)}}>Length Low to High</p>
                                                        <p className="dropdown-item url-cursor"  onClick={()=>{setSortOrder('length_high_to_low'); setShowSortDropdown(!showSortDropdown)}}>Length High to Low</p>
                                                    
                                                    </div>
                                                </div>
                                                <div>{sortOrder!=null ? capitalizeFirstLetter(sortOrder.replaceAll('_',' ')) : null}</div>
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
                                    <label>Yacht Length ({numberFormat(lowerValue)} - {numberFormat(upperValue)}ft.)</label>
                                </p>                
                                <Range allowCross={false} min={lowerBudget} max={upperBudget} value={[lowerValue, upperValue]} tipFormatter={value => `${value}`} defaultValue={[lowerBudget, upperBudget]} onChange={(value)=>{
                                    setLowerValue(value[0]);
                                    setUpperValue(value[1]);
                                }}  onAfterChange={()=>{
                                    FilterList();
                                    replaceUrl()
                                }} />
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div className="property-list-block">
                    <div className="row">
                        {yachts===null ? (
                            <>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                                <div className="col-md-6" ><div className="shine" style={{ minHeight:'200px', width:'100%' }}></div></div>
                            </>
                        ) : null}
                        {yachts!=null && yachts.length >0 ? (
                            yachts.map((yacht)=>(
                                <div className="col-md-6" key={yacht.yecht_id}>
                                    <div className="property-listing url-cursor">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="property-image" onClick={()=>openDetailsPage(yacht.yecht_id)} style={{ height:"210px" }}>
                                                    <img src= {`img/${yacht.imageFilePath}`} alt=""/>
                                                   
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="property-desc" onClick={()=>openDetailsPage(yacht.yecht_id)}>
                                                    <h4 style={{ wordBreak:"break-all" }}>{yacht.name}</h4>
                                                    <ul>
                                                        <li>
                                                            <strong className="feature-item">Total Feet : </strong>
                                                            <span className="feature-value">{yacht.feet}</span>
                                                        </li>
                                                        <li>
                                                            <strong className="feature-item">Number Of Seats : </strong>
                                                            <span className="feature-value">{yacht.seats}</span>
                                                        </li>
                                                                                               
                                                    </ul>
                                                    {yacht.fourHourRate!== 0 ? (<p className="daily-rate"><strong>${yacht.fourHourRate}</strong>/4-hours</p>) : null }
                                                     {yacht.sixHourRate!== 0 ? (<p className="daily-rate"><strong>${yacht.sixHourRate}</strong>/6-hours</p>) : null }
                                                    {yacht.eightHourRate!== 0 ? (<p className="daily-rate"><strong>${yacht.eightHourRate}</strong>/8-hours</p>) : null } 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        
                            ))
                        ) : (
                            <div className="col-md-6">
                                <p >No record found</p>
                            </div>
                        )}
                        
                    </div>
                </div>

            </div>
        </div>

    </section>
    <Contact/>
    </>
    );
  }
  
  export default Yachts;