import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../AuthContext';
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import {GetACarDetails, createLeads, createInquiries, contactPreferences} from './api';
import queryString from 'query-string';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import FsLightbox from 'fslightbox-react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import TrackPage from '../../hooks/TrackPage';
import TrackEvent from '../../hooks/TrackEvent';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';
function CarDetails(props) {
    const authDetails = useContext(AuthContext);
    

    const urlParams = queryString.parse(props.location.search)
    const [car, setCar]= useState(null);
    const [carId, setCarId]= useState(props.match.params.id);
    // const [noOfGuest, setNoOfGuest]= useState(0);
    const [checkInDate, setCheckInDate]= useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [checkOutDate, setCheckOutDate]= useState(urlParams.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [selectedTab, setSelectedTab]= useState('description');

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalName, SetModalName] = useState('');
    const [modalCheckInDate, SetModalCheckInDate] = useState(checkInDate);
    const [modalCheckOutDate, SetModalCheckOutDate] = useState(checkOutDate);
    const [modalSpecialRequest, SetModalSpecialRequest] = useState('');
    const [modalContactType, SetModalContactType] = useState(3);
    const [modalEmail, SetModalEmail] = useState('');
    const [modalPhoneNo, SetModalPhoneNo] = useState('');
    const [errors , setErrors] = useState({});
    const [contactTypes , setContactTypes] = useState([]);

    const [secondaryImages, setSecondaryImages]= useState([]);
    const [secondaryImagesList, setSecondaryImagesList]= useState([]);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    const [carName, setCarName]= useState('');
    
    const openLightboxOnSlide=(number)=> {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    Modal.setAppElement('#root');

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])
    useEffect(() => {
        document.title = carName+' | Luxuri';  
      }, [carName]);

    const getCarData=async ()=> {
        let carData=await GetACarDetails(carId);
        carData=carData.data[0];
        
        setCar(carData);
        setCarName(carData.friendlyName)
        let secondaryImagesList=carData.secondaryImagesList;
        if(secondaryImagesList!=null){
            secondaryImagesList.sort(function(a, b){
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
            let images=secondaryImagesList.map(elem=>{
                return elem.imageFilePath
            })
            setSecondaryImagesList(secondaryImagesList)
            let newImages=[carData.imageFileName].concat(images)
            setSecondaryImages(newImages)
        }else{
            setSecondaryImages([carData.imageFileName])
            setSecondaryImagesList(null)
        }

    }

    useEffect(()=>{
        getCarData();
    },[carId]);

    useEffect(() => {
        if(contactTypes.length===0){
            contactPreferences().then(resp=>{
                if(resp.data!=null && resp.data.length > 0){

                    setContactTypes(resp.data);
                }
            })
        }
    },[contactTypes, authDetails]);

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

    const numberFormat=(x)=> {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
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
        if(phoneNo.length!==10){
            return false;
        }
        return true;
    };
    const handleInquiriSubmit=async(e)=> {
        e.preventDefault()
        
        let errors={};
        if(modalName===""){
            errors.modalName="Name Can not be blank";
        }
        if(modalCheckInDate >= modalCheckOutDate){
            errors.modalCheckOutDate="Check out date must be grater than check in date.";
        }

        if(modalContactType===1){
            if(modalEmail===""){
                errors.modalEmail="Email Can not be blank";
            }else if(validateEmail(modalEmail)===false){
                errors.modalEmail="Email is not valid";
            }
        }else if(modalContactType===2 || modalContactType===3){
            if(phoneNoValidation(modalPhoneNo)===false){
                errors.modalPhoneNo="Phone no is not valid";
            }
        }
        setErrors(errors)
        if(Object.keys(errors).length===0){

            const nameOb=splitName(modalName)
            const createLeadsPayload={
                "firstName": nameOb.first_name,
                "lastName": nameOb.last_name,
                "leadVerificationStatusID": 1,
                "brokerID": authDetails.brokerId,
                "phone": (modalContactType===2 || modalContactType===3) ? modalPhoneNo : '',
                "address": null,
                "email": (modalContactType===1) ? modalEmail : '',
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
                    "numberOfGuests":1,
                    "numberOfCars": 1,
                    "carRental": 1,
                    "boatRental": 0,
                    "districtID": "",
                    "transactionStatusID": 1,
                    "specialRequest": modalSpecialRequest,
                    "description": "",
                    "inquiryAmenities": ""
                };
    
                const createInquiriResp= await createInquiries(authDetails.employeeId, authDetails.brokerId, car.locationName, car.locationID, car.friendlyName, createEnquiriPayload).catch(e => Promise.resolve(e));
                TrackEvent({
                    category: 'Car',
                    action: 'Create Inquire',
                    label: 'Car',
                    value: createEnquiriPayload
                })
                if(createInquiriResp.status===500){
                    toast.error("Something wrong happend. Please contact with our support.");
                }else{
                    //toast.success("Your inquire has been submitted.");
                    closeModal();
                    props.history.push(`/miami-car-rental-inquiry`);
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
        if (last_name === null || last_name === '') {
            last_name = "cp_LastName";
        }
        last_name=last_name.trim()
        return {first_name, last_name};
    };

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
                <meta name="description" content={car?.friendlyName} />
            </MetaTags>
        <section className="main">  
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={secondaryImages}
                slide={lightboxController.slide}
            />      
            <div className="list-details-block fixed-header-gap">
                <div className="container-fluid">
                    {car!==null ? (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="gallery-image rotated-overlay">
                                        {(car.imageFilePath!=="" && car.imageFilePath!==null) ? (<img className="url-cursor" onClick={()=>openLightboxOnSlide(1)} src={`img/${car.imageFilePath}`} alt={car.friendlyName}/>) : null}
                                        
                                    </div>
                                    <div className="gallery-image-thumb">
                                        
                                        {/* <Carousel responsive={responsive} transitionDuration={100} centerMode={true}>
                                            {images!=null && images.length>0 ? (
                                                images.map(function(image, i){
                                                    return <img key={i} src={image} alt=""/>;
                                                })
                                            ) : null}
                                        </Carousel> */}

                                        {car.image!=null && car.image.length>0 ? (
                                            <Carousel responsive={responsive} transitionDuration={100} >
                                            {car.image.map((image, index)=>(
                                                <img className="url-cursor" onClick={()=>openLightboxOnSlide(index+2)} key={image.img_id} src={`img/${image.file}`} alt=""/>
                                            ))}
                                            </Carousel>
                                        ) : null }
                                    </div>
                                </div>
                                <div className="col-md-6">                   
                                    <div className="property-desc">
                                        <h1>{car.model_name}</h1>
                                        <ul>
                                            
                                            <li>
                                                <label className="feature-item">Number Of Seats :</label>
                                                <span className="feature-value">{car.numberOfSeats}</span>
                                            </li>
                                            <li>
                                                <label className="feature-item">Zero To 60 :</label>
                                                <span className="feature-value">{car.zeroTo60}</span>
                                            </li>
                                            <li>
                                                <label className="feature-item">Transmission Type :</label>
                                                <span className="feature-value">{car.transmissionType}</span>
                                            </li> 

                                            {car.horsePower!=null ? (
                                                <li>
                                                    <label className="feature-item">Horse Power :</label>
                                                    <span className="feature-value">{car.horsePower}</span>
                                                </li>
                                            ) : null}
                                            {car.topMPH!=null ? (
                                                <li>
                                                    <label className="feature-item">MPH :</label>
                                                    <span className="feature-value">{car.MPH}</span>
                                                </li>
                                            ) : null}
                                            {car.minimumNumberOfDays!=null ? (
                                                <li>
                                                    <label className="feature-item">Minimum Number Of Days :</label>
                                                    <span className="feature-value">{car.numberOfDays}</span>
                                                </li>
                                            ) : null}
                                            {car.securityDeposit!=null ? (
                                                <li>
                                                    <label className="feature-item">Security Deposit :</label>
                                                    <span className="feature-value">{car.securityDeposit}</span>
                                                </li>
                                            ) : null}
                                            {car.milesPerDayIncluded!=null ? (
                                                <li>
                                                    <label className="feature-item">Miles Per Day Included :</label>
                                                    <span className="feature-value">{car.milesPerDayIncluded}</span>
                                                </li>
                                            ) : null}
                                            
                                         
                                                                               
                                        </ul>

                                        <p className="daily-rate" style={{ marginLeft:'15px' }}><strong>${numberFormat(car.price)}</strong>/Day</p>
                                    </div>                   

                                    <div className="list-filter">
                                        <div className="guest-book">
                                            <div className="row">
                                            
                                                <div className="col-sm-12 col-md-12">
                                                    <div className="check-ins property-details-datepicker" style={{ borderRadius:"50px", width: "100%" }}>
                                                        <label htmlFor="checkInDate" style={{ width: "100%" }}>Pick up / Drop off</label>
                                                        <DatePicker className="form-control" selected={checkInDate}
                                                            minDate={new Date(moment().format('MM/DD/Y'))}
                                                            customInput={<DatepickerInput />}
                                                            selectsRange
                                                            startDate={checkInDate}
                                                            endDate={checkOutDate}
                                                            monthsShown={window.screen.width <=480 ? 1 : 2}
                                                            withPortal
                                                            portalId="root"
                                                            onChange={dates => {
                                                                let [start, end] = dates;
                                                                if(start!==null){
                                                                    start=new Date(moment(start).format('MM/DD/Y'))
                                                                }
                                                                if(end!==null){
                                                                    end=new Date(moment(end).format('MM/DD/Y'))
                                                                }
                                                                setCheckInDate(start);
                                                                setCheckOutDate(end);

                                                                SetModalCheckInDate(start);
                                                                SetModalCheckOutDate(end);
                                                                
                                                                // setCheckInDate(date);
                                                                // if(date>checkOutDate){
                                                                //     setCheckOutDate(date);
                                                                // }
                                                            }}
                                                            
                                                            />
                                                    </div>
                                                    
                                                </div>                               
                                                
                                            </div>
                                        </div>
                                        <div className="terms-submit">
                                            {/* <div className="form-group form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                                <label className="form-check-label" htmlFor="exampleCheck1">I agree with <strong><Link to="/">Terms and Conditions</Link></strong></label>
                                            </div> */}
                                            <button type="button" onClick={openModal} className="btn button-custom">Inquire</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                                <div className="overview-section">
                                    <div className="row">
                                        <div className="col-md-6">
                                            
                                        </div>
                                        <div className="col-md-6">
                                        {(car?.description!==null && car?.description!=="" && car?.description!=="na") ? (
                                            <div className="overview-desc">
                                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                    
                                                    <li className="nav-item">
                                                        <Link to="#" className={`nav-link ${selectedTab==='description' ? 'active' : ''}`} onClick={()=>setSelectedTab('description')}>Overview</Link>
                                                    </li>
                                                
                                                </ul>
                                                <div className="tab-content">
                                                    
                                                    <div className={`tab-pane fade ${selectedTab==='description' ? 'show active' : ''}`} >
                                                        <p>
                                                            {car.description}
                                                        </p>
                                                    </div> 
                                                                                
                                                </div>
                                            </div>
                                             ) : null}
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
                            <label >Do you have any special request</label>
                            <textarea rows="3" className="form-control" value={modalSpecialRequest} onChange={(e)=>SetModalSpecialRequest(e.target.value)}></textarea>
                        </div>

                        <div className="form-group">
                            <label >How do you prefer to be contacted?</label>
                            <select className="form-control" onChange={(e)=>{SetModalContactType(e.target.value);}} value={modalContactType}>
                                {/* <option value="email">Email</option>
                                <option value="phone_no">Phone No</option> */}
                                {contactTypes.map(el=>{
                                    return (
                                        <option key={el.id} value={el.id}>{el.type}</option>
                                    )
                                })}
                            </select>
                        </div>
                        {modalContactType===1 ? (
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
                    <div className="modal-footer">
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
  
  export default CarDetails;