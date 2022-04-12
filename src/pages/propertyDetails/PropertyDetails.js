import React, {useState, useEffect, useContext, useRef} from 'react';
import { AuthContext } from '../../AuthContext';
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import { getPropertyCalendarEvents, morePropertiesLike, createLeads, createInquiries, contactPreferences, GetVillaDetails} from './api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import queryString from 'query-string';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" 
import moment from 'moment';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FsLightbox from 'fslightbox-react';
import TrackPage from '../../hooks/TrackPage';
import TrackEvent from '../../hooks/TrackEvent';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';
import { useParams } from 'react-router-dom';
const DatepickerLabel = React.forwardRef(({ value, onClick }, ref) => (
    <p style={{ margin:0 }} onClick={onClick} ref={ref}>
      {value}
    </p>
  ));

function PropertyDetails(props) {
    
    
    const { REACT_APP_PUBLIC_URL } = process.env;
    const authDetails = useContext(AuthContext);
    const urlParams = queryString.parse(props.location.search)
    
    const [property, setProperty]= useState(null);
    const [similarProperty, setSimilarProperty]= useState([]);
    const [calenderEvents, setCalenderEvents]= useState([]);
    const [ameneties, setAmeneties]= useState([]);
    const [propertyId, setPropertyId]= useState(0);
    const [locationId, setLocationId]= useState(0);
    const [villaId, setVillaId]= useState(urlParams.propertyId);
    const [noOfGuest, setNoOfGuest]= useState(urlParams.noOfGuest ?? 1);

    const [averagePerNight, setAveragePerNight]= useState(null);// Also knows as DSP
    
    const [checkInDate, setCheckInDate]= useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [checkOutDate, setCheckOutDate]= useState(urlParams.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().add(3,'d').format('Y/MM/DD')));
    const [selectedTab, setSelectedTab]= useState('amenities');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [secondaryImages, setSecondaryImages]= useState([]);

    const [modalName, SetModalName] = useState('');
    const [modalCheckInDate, SetModalCheckInDate] = useState(checkInDate);
    const [modalCheckOutDate, SetModalCheckOutDate] = useState(checkOutDate);
    const [modalSpecialRequest, SetModalSpecialRequest] = useState('');
    const [modalContactType, SetModalContactType] = useState(3);
    const [modalEmail, SetModalEmail] = useState('');
    const [modalPhoneNo, SetModalPhoneNo] = useState('');
    const [errors , setErrors] = useState({});
    const [contactTypes , setContactTypes] = useState([]);
    const [blockedDates, setBlockedDates]= useState([]);
    const [propertyName, setPropertyName]= useState('');

    const [isMobile, setMobile] = useState(window.innerWidth < 768);

    const updateMedia = () => {
        setMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    },[]);

    const datepickerRef = useRef(null);

    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });
        
    const openLightboxOnSlide=(number)=> {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    let calendarComponentRef = React.createRef();


    Modal.setAppElement('#root');

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = propertyName+' | Luxuri';  
      }, [propertyName]);

    const urlcheckInDate=urlParams?.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD'));
    const urlcheckOutDate=urlParams?.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().add(3,'d').format('Y/MM/DD'));


    

    const getPropertyData=async ()=> { 
      
   
        let propertyData=await GetVillaDetails( villaId);
        propertyData=propertyData.data;
     
            
            setProperty(propertyData[0]);
            setLocationId(propertyData[0].place_id)
            setPropertyId(propertyData[0].villa_id)
        
            setPropertyName(propertyData[0].villa_name)
            setAmeneties(propertyData[0].amenities)
            // if(propertyData[0].amenities!=null){
            //     let amAr=propertyData[0].amenities;
            //     amAr.sort(function(a, b) {
            //         return a.displayOrder - b.displayOrder;
            //     });
               
            //     setAmeneties(amAr);
            // }
            let secondaryImages=propertyData[0].images;
            
              
            if(secondaryImages!=null){
                secondaryImages.sort(function(a, b){
                    if (a.imageOrder < b.imageOrder) 
                    {
                      return -1;
                    }    
                    else if (a.imageOrder > b.imageOrder)
                    {
                      return 1;
                    }   
                    return 0;
                  });
                let images=secondaryImages.map(elem=>{
                    return elem.imageFilePath
                })
                let newImages=[propertyData[0].imageFilePath].concat(images)
                setSecondaryImages(newImages)
            }else{
                setSecondaryImages([propertyData[0].imageFilePath])
            }
    }
    
   
    const getCalenderEvents=async ()=>{
        if(checkOutDate!=null && checkInDate!=null){
            const propertycal=await getPropertyCalendarEvents(propertyId,moment(checkInDate).format('MM/DD/Y'), moment(checkOutDate).format('MM/DD/Y'));
            let caldata=propertycal.data.Data;
            if(caldata!==null){
                
                caldata= caldata.map((elem, index)=>{
                    let avprice=elem?.avgPricePerNight ? elem.avgPricePerNight : 0
                    if(index===0){
                        setAveragePerNight(avprice)
                    }
                    if(elem.propertyAvailabilityStatusID===2 || elem.propertyAvailabilityStatusID===3){
                        return {
                            title: '$'+numberFormat(avprice),
                            date: moment(elem.date).format('Y-MM-DD'),
                            color: 'green'
                        }
                    }else if(elem.propertyAvailabilityStatusID===1 || elem.propertyAvailabilityStatusID===4){
                        return {
                            title: '',
                            date: moment(elem.date).format('Y-MM-DD'),
                            color: 'red'
                        }
                    }
                    return false;
                });
                caldata=[...caldata,{title: 'Check-Out',
                date: moment(checkOutDate).format('Y-MM-DD'),
                color: 'green'}]

                
            }else{
                
                caldata=[];
            }
            const newStartdate=moment(checkInDate).subtract(1,'M').format('MM/DD/Y')
            const newEnddate=moment(checkOutDate).add(24,'M').format('MM/DD/Y')
            const blockedcal=await getPropertyCalendarEvents(propertyId,newStartdate, newEnddate);
            let blockedCaldata=blockedcal.data.Data;
            let excludeDates=[];
            if(blockedCaldata!=null){
                blockedCaldata= blockedCaldata.filter(elem=>{
                    if(elem.propertyAvailabilityStatusID===1 || elem.propertyAvailabilityStatusID===4){
                        return true
                    }
                    return false;
                });
                blockedCaldata= blockedCaldata.map(elem=>{
                        return {
                            title: '',
                            date: moment(elem.date).format('Y-MM-DD'),
                            color: 'red'
                        }
                   
                });

                excludeDates=blockedCaldata.map(elem=>{return new Date(moment(elem.date).format('Y/MM/DD'))})
            }else{
                blockedCaldata=[];
            }
            setBlockedDates(excludeDates)
            let NewCalenderData=[...caldata,...blockedCaldata];
            if(NewCalenderData.length > 0){
                setCalenderEvents(NewCalenderData);
            }else{
                setCalenderEvents([]);
            }
                
           
        }
        
    };

    useEffect(()=>{
        getPropertyData();
    },[]);

    useEffect(() => {
        if(contactTypes.length===0){
            contactPreferences().then(resp=>{
                if(resp.data!=null && resp.data.length > 0){

                    setContactTypes(resp.data);
                }
            })
        }
    },[contactTypes]);

    useEffect(()=>{
        if(calendarComponentRef.current!==null){
            let calendarApi = calendarComponentRef.current.getApi();
            calendarApi.gotoDate(checkInDate);
        }
    },[calendarComponentRef])

    // useEffect(()=>{
    //     if(averagePerNight!=null){
    //         const payload={
    //             "startDate": moment(urlcheckInDate).format('MM/DD/Y'),
    //             "endDate": moment(urlcheckOutDate).format('MM/DD/Y'),
    //             "minBudget": 0,
    //             "maxBudget": 200000,
    //             "numberOfGuests": noOfGuest
    //         };
    //         morePropertiesLike(authDetails.brokerId, locationId, propertyId,payload, averagePerNight).then(resp=>{
    //             let similarProp=resp.data.Data;
    //             if(similarProp!==null){
    //                 setSimilarProperty(similarProp);
    //             }else{
    //                 setSimilarProperty([]);
    //             }
                
    //         })
    //     }
        
    // },[averagePerNight, authDetails]);

    useEffect(()=>{
        morePropertiesLike(locationId).then(resp=>{
        setSimilarProperty(resp.data)

        })
    },[])

    useEffect(()=>{
        if(propertyId!==0){
            getCalenderEvents();
        }
        
    },[checkOutDate, propertyId]);
    const numberFormat=(x)=> {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const numberFormatWithRound=(x)=> {
        x=x.toFixed(0);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
    };

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 1920 },
          items: 12,
          slidesToSlide: 3
        },
        desktop: {
          breakpoint: { max: 1919, min: 1366 },
          items: 8,
          slidesToSlide: 3
        },
        desktopSmall: {
            breakpoint: { max: 1365, min: 1024 },
            items: 6,
            slidesToSlide: 3
        },
        tablet: {
          breakpoint: { max: 1023, min: 464 },
          items: 5,
          slidesToSlide: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 4,
          slidesToSlide: 3
        }
    };

    const handleDateClick = (arg) => { // bind with an arrow function
        //console.log( arg)

        //openModal()
        if(moment(arg.dateStr).format('Y/MM/DD')>=moment().format('Y/MM/DD')){
            let newDate=new Date(moment(arg.dateStr).format('Y/MM/DD'));
            //setCheckInDate(new Date(moment(arg.date).format('Y-MM-DD')));
            setCheckInDate(newDate)
            setCheckOutDate(null)
            const datepickerElement = datepickerRef.current;
            datepickerElement.setOpen(true);
        }
        
    }

    const handleEventClick=(info)=>{
        if(moment(info.event.startStr).format('Y/MM/DD')>=moment().format('Y/MM/DD')){
            let newDate=new Date(moment(info.event.startStr).format('Y/MM/DD'));
            //setCheckInDate(new Date(moment(arg.date).format('Y-MM-DD')));
            setCheckInDate(newDate)
            setCheckOutDate(null)
            const datepickerElement = datepickerRef.current;
            datepickerElement.setOpen(true);
        }
    }

    const openDetailsPage=(propertyFriendlyName,villa_id, location)=>{
        propertyFriendlyName= propertyFriendlyName.replaceAll(' ','-');
        location= location.replaceAll(' ','-');
        setSelectedTab('amenities')
        let inDate=urlcheckInDate;
        if(inDate===null){
            inDate=moment().format('Y-MM-DD')
        }else{
            inDate=moment(urlcheckInDate).format('Y-MM-DD')
        }
        let outDate=urlcheckOutDate;
        if(outDate===null){
            outDate=moment().format('Y-MM-DD')
        }else{
            outDate=moment(urlcheckOutDate).format('Y-MM-DD')
        }
        let queryString=`propertyId=${villa_id}&noOfGuest=${noOfGuest}&checkInDate=${inDate}&checkOutDate=${outDate}`;

        TrackPage(`/property-details/${location.toLowerCase()}-vacation-homes/${propertyFriendlyName}?${queryString}`)
        // setSlug(propertyFriendlyName)
        props.history.push(`/property-details/${location.toLowerCase()}-vacation-homes/${propertyFriendlyName}?${queryString}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    };

    const responsiveSimilar = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 1920 },
            items: 6,
            slidesToSlide: 1
          },
          desktop: {
            breakpoint: { max: 1919, min: 1366 },
            items: 4,
            slidesToSlide: 1
          },
          desktopSmall: {
              breakpoint: { max: 1365, min: 1024 },
              items: 4,
              slidesToSlide: 1
          },
          tablet: {
            breakpoint: { max: 1023, min: 464 },
            items: 2,
            slidesToSlide: 1
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
          }
    };
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const maskPhoneNo=(phoneNo)=>{
        phoneNo = phoneNo.replace(/ /gm, '');
        let numbAr = phoneNo.match(/\d/g);
        if(numbAr===null){
          return "";
        }
        phoneNo=numbAr.join("");
        phoneNo=phoneNo.substring(0, 10);
        let newNo="";
        if(phoneNo.length>3){
          newNo+=`(${phoneNo.substring(0, 3)})`;
        }else{
          newNo+=`(${phoneNo.substring(0, 3)}`;
        }
    
        if(phoneNo.length>=4){
          newNo+=` ${phoneNo.substring(3, 6)}`;
        }else{
          newNo+=`${phoneNo.substring(3, 6)}`;
        }
    
        if(phoneNo.length>=7){
          newNo+=`-${phoneNo.substring(6, phoneNo.length)}`;
        }else{
          newNo+=`${phoneNo.substring(6, phoneNo.length)}`;
        }
        return newNo;
      };
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const phoneNoValidation=(phoneNo)=>{
        if(phoneNo==null){
          return false;
        }
        phoneNo = phoneNo.replace(/ /gm, '');
        let numbAr = phoneNo.match(/\d/g);
        if(numbAr==null){
          return false;
        }
        phoneNo=numbAr.join("");
        if(phoneNo.length!=10){
            return false;
        }
        return true;
    };
    const handleInquiriSubmit=async(e)=> {
        e.preventDefault()
        let errors={};
        if(modalName==""){
            errors.modalName="Name Can not be blank";
        }
        if(modalCheckInDate >= modalCheckOutDate){
            errors.modalCheckOutDate="Check out date must be grater than check in date.";
        }

        let newStartdate=moment(modalCheckInDate).format('Y-MM-DD')
        let newEnddate=moment(modalCheckOutDate).format('Y-MM-DD')

        let flag=true;
        blockedDates.map(elem=>{
            let compareDate = moment(elem, "Y-MM-DD");
            if(compareDate.isBetween(newStartdate, newEnddate)){
                flag=false;
            }
        })
        if(flag===false){
            errors.modalCheckOutDate="Some dates are not available between your checkin and checkout date.";
        }

        if(modalContactType==1){
            if(modalEmail==""){
                errors.modalEmail="Email Can not be blank";
            }else if(validateEmail(modalEmail)==false){
                errors.modalEmail="Email is not valid";
            }
        }else if(modalContactType==2 || modalContactType==3){
            if(phoneNoValidation(modalPhoneNo)===false){
                errors.modalPhoneNo="Phone no is not valid";
            }
        }
        setErrors(errors)
        if(Object.keys(errors).length==0){
            
            const nameOb=splitName(modalName)
            
            const createLeadsPayload={
                "firstName": nameOb.first_name,
                "lastName": nameOb.last_name,
                "leadVerificationStatusID": 1,
                "brokerID": authDetails.brokerId,
                "phone": (modalContactType==2 || modalContactType==3) ? modalPhoneNo : '',
                "address":  null,
                "email": (modalContactType==1) ? modalEmail : '',
                "dob": null,
                "transactionStatusID": 1,
                "assignedEmployeeID": 1,
                "leadSourceID": 9,
                "leadProfessionID": 1,
                "imageFileName": "",
                "city": null,
                "stateID": null,
                "stateOrProvince": null,
                "countryID": null,
                "zipCode": null,
                "referringBrokerName": null,
                "referringBrokerID": null,
                "contactPreferenceTypeID": modalContactType
            };

            const createLeadResp= await createLeads(authDetails.employeeId, createLeadsPayload).catch(e => Promise.resolve(e));
            TrackEvent({
                category: 'Lead',
                action: 'Create Lead',
                label: 'Lead',
                value: createLeadsPayload
            })

            //console.log(createLeadResp);
            const leadId=createLeadResp.data.Data;
            //console.log(leadId);//"229"
            if(leadId!=null){
                const createEnquiriPayload={
                    "startDate": moment(modalCheckInDate).format('MM/DD/Y'),
                    "endDate": moment(modalCheckOutDate).format('MM/DD/Y'),
                    "leadID": leadId,
                    "cityID": 1,
                    "minBudget": 5500,
                    "maxBudget": 7500,
                    "numberOfGuests": noOfGuest,
                    "numberOfCars": 3,
                    "carRental": 0,
                    "boatRental": 1,
                    "districtID": "",
                    "transactionStatusID": 1,
                    "specialRequest": modalSpecialRequest,
                    "description": "",
                    "inquiryAmenities": ""
                };
    
                const createInquiriResp= await createInquiries(authDetails.employeeId, authDetails.brokerId, property.locationArea,locationId, property.propertyFriendlyName, createEnquiriPayload).catch(e => Promise.resolve(e));
                //toast.success("Your inquire has been submitted.");
                TrackEvent({
                    category: 'Property',
                    action: 'Create Inquire',
                    label: 'Inquire',
                    value: createEnquiriPayload
                })
                const ecData = {
                    "email":  (modalContactType==1) ? modalEmail : '',
                    "phone_number": (modalContactType==2 || modalContactType==3) ? modalPhoneNo : '',
                    "first_name": nameOb.first_name,
                    "last_name": nameOb.last_name,
                    "home_address": {
                        "street": '',
                        "city": '',
                        "region": '',
                        "postal_code": '',
                        "country": ''
                    }
                }
                window.dataLayer.push({'event':'formSubmitted', 'ecData': ecData});
                closeModal();
                if(property.locationID==1){
                    props.history.push(`/aspen-home-rental-inquiry`);
                }else if(property.locationID==3){
                    window.gtag('event', 'conversion', {'send_to': 'AW-732821331/2LzHCOeogooDENPut90C'});
                    props.history.push(`/miami-home-rental-inquiry`);
                }else if(property.locationID==2){
                    props.history.push(`/los-angeles-home-rental-inquiry`);
                }else if(property.locationID==4){
                    props.history.push(`/washington-dc-home-rental-inquiry`);
                }else {
                    props.history.push(`/success?type=property`);
                }
                
            }else{
                toast.error("Something wrong happend. Please contact with our support.");
            }
            
        }
    }

    const splitName=(username)=>{
        username = username.trim();
        var nameAr = username.split(' ');
        var first_name = nameAr[0];
        var last_name = username.substring(nameAr[0].length);
        if (last_name == null || last_name == '') {
            last_name = "cp_LastName";
        }
        last_name=last_name.trim()
        return {first_name, last_name};
    };

    const opendatePicker = () => { // bind with an arrow function
        const datepickerElement = datepickerRef.current;
        datepickerElement.setOpen(true);
    }

    let propertyInfo=null;
    if(property!==null){
        propertyInfo=(
            <div className="overview-desc property-details-tab" >
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <button type="button" className={`url-cursor  ${selectedTab==='amenities' ? 'active' : ''}`} onClick={()=>setSelectedTab('amenities')}>Amenities</button>
                    </li>
                    {property.des.length>=100 ? (
                        <li className="nav-item">
                            <button type="button" className={`url-cursor ${selectedTab==='overview' ? 'active' : ''}`} onClick={()=>setSelectedTab('overview')}>Overview</button>
                        </li>
                    ) : null}
                    {/* {property.bedroomConfigurations!=null && property.bedroomConfigurations.length>0 ? (
                        <li className="nav-item">
                        <button type="button" className={`url-cursor  ${selectedTab==='bedroomConfiguration' ? 'active' : ''}`} onClick={()=>setSelectedTab('bedroomConfiguration')}>Bedroom Configuration</button>
                    </li>
                    ) : null} */}
                    
                    
                    
                </ul>
                <div className="tab-content">
                    <div className={`tab-pane fade ${selectedTab==='amenities' ? 'show active' : ''}`} >
                        <div className="property-details">
                            <div className="facilities-available">
                                <ul>
                                    {ameneties!=null && ameneties.length>0 ? (
                                        ameneties.map((ameniti, i)=>(
                                            <li key={'am'+i}>
                                                    {/* {ameniti.imageFilePath!=null ? (<img src={ameniti.imageFilePath} alt=""/>) : null} */}
                                                    <span className="facility-name">{ameniti.name}</span>
                                            </li>
                                        ))
                                    ) : null}   
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`tab-pane fade ${selectedTab==='overview' ? 'show active' : ''}`} >
                        <p className="property-desc-p">
                            {property.des}
                        </p>
                    </div> 
                    {/* <div className={`tab-pane fade ${selectedTab==='bedroomConfiguration' ? 'show active' : ''}`} >
                        <div className="facilities-available">
                            <ul>
                                {property.bedroomConfigurations!=null && property.bedroomConfigurations.length>0 ? (
                                    property.bedroomConfigurations.map((bed, i)=>{
                                        return (
                                            <li key={'bp'+i}>
                                                    <span className="facility-name">Bedroom {i+1} : {bed.bedType}</span>
                                            </li>
                                        ) 
                                        
                                        })
                                ) : null}   
                            </ul>
                        </div>
                    </div>                                 */}
                </div>
            </div>
        );
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
                <meta name="description" content={property?.description} />
            </MetaTags>
        <section className="main">   
        <FsLightbox
                toggler={lightboxController.toggler}
                sources={secondaryImages}
                slide={lightboxController.slide}
            />       
            <div className="list-details-block fixed-header-gap">
                <div className="container-fluid">
                    {property!==null ? (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="gallery-image rotated-overlay">
                                        {property.imageFilePath!=="" ? (<img className="url-cursor" onClick={()=>openLightboxOnSlide(1)} src={`img/${property.imageFilePath}`} alt={property.villa_name}/>) : null}
                                        
                                    </div>
                                    <div className="gallery-image-thumb">


                                        {property.image!=null && property.image.length>0 ? (
                                            <Carousel responsive={responsive} transitionDuration={100}  >
                                                {property.image.map((image, index)=>(
                                                    <img className="url-cursor" onClick={()=>openLightboxOnSlide(index+2)} key={image.img_id} src={`img/${image.file}`} alt=""/>
                                                ))}
                                                
                                            
                                            </Carousel>
                                        ) : null }
                                    </div>
                                    
                                    {isMobile===false ? propertyInfo : ''}
                                    
                                </div>
                                <div className="col-md-6">                   
                                    <div className="property-desc">
                                        <h1>{property.villa_name}</h1>
                                        <ul>
                                        <li>
                                                <label className="feature-item">Max Guests :</label>
                                                <span className="feature-value">{property.numberOfGust}</span>
                                            </li>
                                            <li>
                                                <label className="feature-item">Bedrooms :</label> 
                                                <span className="feature-value">{property.numberOfBedrooms}</span>
                                            </li>  
                                            <li>
                                                <label className="feature-item">Bathrooms :</label>
                                                <span className="feature-value">{property.numberOfBarthrooms}</span>
                                            </li>
                                            <li>
                                                <label className="feature-item">Location :</label>
                                                <span className="feature-value">{property.location}</span>
                                            </li>
                                                                               
                                        </ul>

                                        <p className="daily-rate" style={{ marginLeft:'15px' }}><strong>${numberFormat(averagePerNight ?? 0)}</strong>/Night</p>
                                    </div>
                                    {isMobile ? (<div style={{ paddingTop:'10px' }}>{propertyInfo}</div> ) : ''}                  
                                    
                                    <div className="list-filter">
                                        <div className="guest-book">
                                            <div className="row">
                                                <div className="col-md-12 fullcalender-holder">
                                                    <FullCalendar
                                                        plugins={[ dayGridPlugin, interactionPlugin ]}
                                                        initialView="dayGridMonth"
                                                        selectable={true}
                                                        events={calenderEvents}
                                                        dateClick={handleDateClick}
                                                        eventClick={handleEventClick}
                                                        height= {430}
                                                        ref={calendarComponentRef}
                                                        />
                                                </div>
                                            </div>
                                            <div className="row" >
                                            
                                                <div className="col-sm-12 col-md-12">
                                                    <div className="check-ins property-details-datepicker" style={{ borderRadius:"50px", width: "100%", marginTop:'10px' }}>
                                                        <label className="url-cursor" onClick={opendatePicker} htmlFor="checkInDate" style={{ width: "100%" }}>Check-In / Check-Out</label>
                                                        <DatePicker className="form-control" selected={checkInDate}
                                                            ref={datepickerRef}
                                                            disabledKeyboardNavigation
                                                            customInput={<DatepickerLabel />}
                                                            minDate={new Date(moment().format('MM/DD/Y'))}
                                                            selectsRange
                                                            startDate={checkInDate}
                                                            endDate={checkOutDate}
                                                            excludeDates={blockedDates}
                                                            monthsShown={window.screen.width <=480 ? 1 : 2}
                                                            withPortal
                                                            portalId="root"
                                                            onChange={dates => {
                                                                let [start, end] = dates;
                                                                if(start!==null){
                                                                    start=new Date(moment(start).format('Y/MM/DD'))
                                                                }
                                                                if(end!==null){
                                                                    end=new Date(moment(end).format('Y/MM/DD'))
                                                                }
                                                                
                                                                setCheckInDate(start);
                                                                SetModalCheckInDate(start);

                                                                if(start!==null && end!==null){

                                                                    let newStartdate=moment(start).format('Y-MM-DD')
                                                                    let newEnddate=moment(end).format('Y-MM-DD')

                                                                    let flag=true;
                                                                    blockedDates.map(elem=>{
                                                                        let compareDate = moment(elem, "Y-MM-DD");
                                                                        if(compareDate.isBetween(newStartdate, newEnddate)){
                                                                            flag=false;
                                                                        }
                                                                    })
                                                                    if(flag===true){
                                                                        setCheckOutDate(end);
                                                                        SetModalCheckOutDate(end);
                                                                    }else{
                                                                        setCheckInDate(null);
                                                                        SetModalCheckInDate(null);
                                                                        setCheckOutDate(null);
                                                                        SetModalCheckOutDate(null);
                                                                        toast.error("Some dates are not available between your checkin and checkout date. Please select your checkin and checkout date again.")
                                                                    }
                                                                    
                                                                }else{
                                                                    setCheckOutDate(end);
                                                                    SetModalCheckOutDate(end);
                                                                }
                                                                

                                                                if(start!=null){
                                                                    let calendarApi = calendarComponentRef.current.getApi();
                                                                    calendarApi.gotoDate(start);
                                                                }
                                                                    

                                                                // setCheckInDate(date);
                                                                // if(date>checkOutDate){
                                                                //     setCheckOutDate(date);
                                                                // }
                                                            }}
                                                            
                                                            />
                                                    </div>
                                                    
                                                </div>                               
                                                {/* <div className="col-sm-6 col-md-5">
                                                    <div className="guest-numbers">
                                                        <label htmlFor="checkOutDate">Guests</label>
                                                        <div className="number-change">
                                                            <div className="value-button" id="decreaseW" onClick={()=>{if((noOfGuest-1) >=0) { setNoOfGuest(parseInt(noOfGuest)-1); }}}>
                                                                <img src={REACT_APP_PUBLIC_URL+"images/minus.png"} alt="-"/>
                                                            </div>
                                                            <input type="number" id="numberWidth" value={noOfGuest} onChange={(e)=>{setNoOfGuest(e.target.value)}}/>
                                                            <div className="value-button" id="increaseW" onClick={()=>setNoOfGuest(parseInt(noOfGuest) + 1)}>
                                                                <img src={REACT_APP_PUBLIC_URL+"images/plus.png"} alt="+"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="terms-submit">
                                            {/* <div className="form-group form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                                <label className="form-check-label" htmlFor="exampleCheck1">I agree with <strong><Link to="/">Terms and Conditions</Link></strong></label>
                                            </div> */}
                                            <button type="button" onClick={openModal} className="btn button-custom">Inquire</button>
                                            <div style={{ marginTop:'10px' }}>You won't be charged</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overview-section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="gallery-image overview-image">
                                            <img src={property.other_image} alt=""/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        
                                    
                                    </div>
                                </div>
                            </div>
                    
                    
                        </>
                    ) : (
                        <div className="row">
                            <div className="col-md-6" ><div className="shine" style={{ minHeight:'400px', width:'100%' }}></div></div>
                            <div className="col-md-6" >
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                                <div className="shine" style={{ minHeight:'20px', width:'100%' }}></div>
                            </div>
                        </div>
                    )}
                    
                    <div className="property-list-block explore-more">
                        <div className="row">
                            <div className="col-12">
                                <h3>Explore Similar Homes</h3>
                            </div>
                        </div>
                     
                        <div className="row">
                            <div className="col-12">
                                {similarProperty!==null ? (
                                    <Carousel responsive={responsiveSimilar} transitionDuration={100}  itemClass="dashboard-carousel-item">
                                        {similarProperty.map((item, index)=>(
                                                <div className="property-listing property-listing-carusel url-cursor" key={index} onClick={()=>openDetailsPage(item.villa_name, item.location, item.villa_id)}>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="property-image" style={{ display:'flex' }}>
                                                                {item.propertyImage!=="" ? (<img style={{ padding:'0px' }} src={item.propertyImage} alt=""/>) : null}
                                                            </div>
                                                            <div className="property-desc" style={{ textAlign:'left', marginTop:'2px' }}>
                                                                <h5>{item.villa_name}</h5>
                                                                <ul>
                                                                    <li>
                                                                        <label className="feature-item">Bedrooms :</label>
                                                                        <span className="feature-value">{item.numberOfBedrooms}</span>
                                                                    </li>
                                                                    <li>
                                                                        <label className="feature-item">Guests :</label>
                                                                        <span className="feature-value">{item.numberOfGust}</span>
                                                                    </li>
                                                                    <li>
                                                                        <label className="feature-item">Location :</label>
                                                                        <span className="feature-value">{item.location}</span>
                                                                    </li>                                        
                                                                </ul>
                                                                <p className="daily-rate"><strong>${numberFormatWithRound(item.price)}</strong>/Night</p>       
                                                                
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            
                                        ))}
                                        
                                        </Carousel>
                                    ) : (
                                        <div className="row">
                                            <div className="col-md-3" ><div className="shine" style={{ minHeight:'300px', width:'100%' }}></div></div>
                                            <div className="col-md-3" ><div className="shine" style={{ minHeight:'300px', width:'100%' }}></div></div>
                                            <div className="col-md-3" ><div className="shine" style={{ minHeight:'300px', width:'100%' }}></div></div>
                                            <div className="col-md-3" ><div className="shine" style={{ minHeight:'300px', width:'100%' }}></div></div>
                                        </div>
                                    ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Inquire Modal" style={customStyles}>
                <form onSubmit={handleInquiriSubmit}>                        
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Inquire</h5>
                        <button type="button" className="close" onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label >Name</label>
                            <input type="text" className={`form-control ${errors.hasOwnProperty('modalName') ? "is-invalid" : ""}`} value={modalName}  onChange={(e)=>SetModalName(e.target.value)}/>
                            {errors.hasOwnProperty('modalName') ?  (
                                <div className="invalid-feedback">{errors.modalName}</div>
                            ) : null}
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label >Check In Date</label>
                                    <DatePicker className="form-control" selected={modalCheckInDate}
                                                minDate={new Date()}
                                                customInput={<DatepickerInput />}
                                                excludeDates={blockedDates}
                                                onChange={date => {
                                                    date=new Date(moment(date).format('MM/DD/Y'))
                                                    SetModalCheckInDate(date);
                                                    if(date>modalCheckOutDate){
                                                        SetModalCheckOutDate(date);
                                                    }
                                                }}
                                                />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label >Check Out Date</label>
                                    <DatePicker className={`form-control ${errors.hasOwnProperty('modalCheckOutDate') ? "is-invalid" : ""}`} selected={modalCheckOutDate}
                                                minDate={new Date()}
                                                customInput={<DatepickerInput />}
                                                excludeDates={blockedDates}
                                                onChange={date => {
                                                    date=new Date(moment(date).format('MM/DD/Y'))
                                                    SetModalCheckOutDate(date);
                                                }}
                                                />
                                    {errors.hasOwnProperty('modalCheckOutDate') ?  (
                                        <div className="invalid-feedback" style={{ display:'block' }}>{errors.modalCheckOutDate}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label >Do you have any special request?</label>
                            <textarea rows="3" className="form-control" value={modalSpecialRequest} onChange={(e)=>SetModalSpecialRequest(e.target.value)}></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label >How do you prefer to be contacted?</label>
                                
                                    <select className="form-control" onChange={(e)=>SetModalContactType(e.target.value)} value={modalContactType}>
                                    {contactTypes.map(el=>{
                                            return (
                                                <option key={el.id} value={el.id}>{el.type}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {modalContactType==1 ? (
                            <div className="form-group">
                                <label >Email</label>
                                <input type="text" className={`form-control ${errors.hasOwnProperty('modalEmail') ? "is-invalid" : ""}`} value={modalEmail}  onChange={(e)=>SetModalEmail(e.target.value)}/>
                                {errors.hasOwnProperty('modalEmail') ?  (
                                        <div className="invalid-feedback">{errors.modalEmail}</div>
                                    ) : null}
                            </div>
                        ) : (
                            <div className="form-group">
                                <label >Best Contact Number</label>
                                <input type="text" className={`form-control ${errors.hasOwnProperty('modalPhoneNo') ? "is-invalid" : ""}`} value={modalPhoneNo}  onChange={(e)=>SetModalPhoneNo(maskPhoneNo(e.target.value))}/>
                                {errors.hasOwnProperty('modalPhoneNo') ?  (
                                        <div className="invalid-feedback">{errors.modalPhoneNo}</div>
                                    ) : null}
                            </div>
                        )}
                        
                        

                    </div>
                    <div className="modal-footer" >
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        
                    </div>
                   
                </form>
            </Modal>
        </section> 
        <Contact/>
        </>
    );
  }
  
  export default PropertyDetails;