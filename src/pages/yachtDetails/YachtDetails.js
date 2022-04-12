import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../AuthContext';
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import {GetAYachtDetails, createLeads, createInquiries, contactPreferences} from './api';
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

function YachtDetails(props) {
    const authDetails = useContext(AuthContext);
    const urlParams = queryString.parse(props.location.search)

    const [yacht, setYacht]= useState(null);
    const [yachtId, setYachtId]= useState(props.match.params.id);
    const [checkInDate, setCheckInDate]= useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [selectedTab, setSelectedTab]= useState('description');

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalName, SetModalName] = useState('');
    const [modalCheckInDate, SetModalCheckInDate] = useState(checkInDate);
    const [modalSpecialRequest, SetModalSpecialRequest] = useState('');
    const [modalContactType, SetModalContactType] = useState(3);
    const [modalEmail, SetModalEmail] = useState('');
    const [modalPhoneNo, SetModalPhoneNo] = useState('');
    const [errors , setErrors] = useState({});
    const [contactTypes , setContactTypes] = useState([]);

    const [secondaryImages, setSecondaryImages]= useState([]);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    const [yachtName, setYachtName]= useState('Yachts');
        
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
        document.title = yachtName+' | Luxuri';    
      }, [yachtName]);

    const getYachtData=async ()=> {
        let yachtData=await GetAYachtDetails(yachtId);
        console.log(yachtData.data[0].name);

        yachtData=yachtData.data[0];
        setYacht(yachtData);
        setYachtName(yachtData.friendlyName)
        if(yachtData.secondaryImagesList!=null){
            let images=yachtData.secondaryImagesList.map(elem=>{
                return elem.imageFilePath
            })
            let newImages=[yachtData.imageFileName].concat(images)
            setSecondaryImages(newImages)
        }else{
            setSecondaryImages([yachtData.imageFileName])
        }
    }

    useEffect(()=>{
        getYachtData();
    },[yachtId]);

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
                "address": null,
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
                    "endDate": moment(modalCheckInDate).format('MM/DD/Y'),
                    "leadID": leadId,
                    "cityID": 1,
                    "minBudget": 5500,
                    "maxBudget": 7500,
                    "numberOfGuests":1,
                    "numberOfCars": 0,
                    "carRental": 0,
                    "boatRental": 1,
                    "districtID": "",
                    "transactionStatusID": 1,
                    "specialRequest": modalSpecialRequest,
                    "description": "",
                    "inquiryAmenities": ""
                };
    
                const createInquiriResp= await createInquiries(authDetails.employeeId, authDetails.brokerId, yacht.locationName, yacht.locationID, yacht.friendlyName, createEnquiriPayload).catch(e => Promise.resolve(e));
                TrackEvent({
                    category: 'Yacht',
                    action: 'Create Inquire',
                    label: 'Yacht',
                    value: createEnquiriPayload
                })
                if(createInquiriResp.status===500){
                    toast.error("Something wrong happend. Please contact with our support.");
                }else{
                    //toast.success("Your inquire has been submitted.");
                    closeModal();
                    props.history.push(`/miami-yacht-rental-inquiry`);
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
                <meta name="description" content={yacht?.friendlyName} />
            </MetaTags>
        <section className="main"> 
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={secondaryImages}
                slide={lightboxController.slide}
            />        
            <div className="list-details-block fixed-header-gap">
                <div className="container-fluid">
                    {yacht!==null ? (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="gallery-image rotated-overlay">
                                        {(yacht.imageFilePath!=="" && yacht.imageFilePath!==null) ? (<img className="url-cursor" onClick={()=>openLightboxOnSlide(1)} src={`img/${yacht.imageFilePath}`} alt={yacht.friendlyName}/>) : null}
                                        
                                    </div>
                                    <div className="gallery-image-thumb">
                                        {yacht.image!=null && yacht.image.length>0 ? (
                                            <Carousel responsive={responsive} transitionDuration={100}  >
                                            {yacht.image.map((image, index)=>(
                                                <img className="url-cursor" onClick={()=>openLightboxOnSlide(index+2)} key={image.img_id} src={`img/${image.file}`} alt=""/>
                                            ))}
                                            </Carousel>
                                        ) : null }
                                    </div>
                                </div>
                                <div className="col-md-6">                   
                                    <div className="property-desc">
                                        <h1>{yacht.name}</h1>
                                        <ul>
                                            
                                            <li>
                                                <label className="feature-item">Total Feet :</label>
                                                <span className="feature-value">{yacht.feet}</span>
                                            </li>
                                            <li>
                                                <label className="feature-item">Number Of Seats :</label>
                                                <span className="feature-value">{yacht.seats}</span>
                                            </li>
                                            {yacht.locationName!=null ? (
                                                <li>
                                                    <label className="feature-item">Location :</label>
                                                    <span className="feature-value">{yacht.location}</span>
                                                </li>
                                            ) : null}
                                                                               
                                        </ul>

                                        {yacht.fourHourRate!=null ? (<p className="daily-rate"><strong>${numberFormat(yacht.fourHourRate)}</strong>/4-hours</p>) : null }
                                        {yacht.sixHourRate!=null ? (<p className="daily-rate"><strong>${numberFormat(yacht.sixHourRate)}</strong>/6-hours</p>) : null }
                                        {yacht.eightHourRate!=null ? (<p className="daily-rate"><strong>${numberFormat(yacht.eightHourRate)}</strong>/8-hours</p>) : null }
                                        
                                                    
                                    </div>                   

                                    <div className="list-filter">
                                        <div className="guest-book">
                                            <div className="row">
                                            
                                                <div className="col-sm-12 col-md-12">
                                                    <div className="check-ins property-details-datepicker" style={{ borderRadius:"50px", width: "100%" }}>
                                                        <label htmlFor="checkInDate" style={{ width: "100%" }}>Check-In</label>
                                                        
                                                        <DatePicker className="form-control" selected={checkInDate}
                                                            minDate={new Date(moment().format('MM/DD/Y'))}
                                                            customInput={<DatepickerInput />}
                                                            withPortal
                                                            portalId="root"
                                                            onChange={date => {
                                                                if(date!==null){
                                                                    date=new Date(moment(date).format('MM/DD/Y'))
                                                                }
                                                                setCheckInDate(date);
                                                                SetModalCheckInDate(date);
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
                                            <button type="button" onClick={openModal}  className="btn button-custom">Inquire</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overview-section">
                                <div className="row">
                                    <div className="col-md-6">
                                        
                                    </div>
                                    <div className="col-md-6">
                                        {(yacht?.description!=null && yacht?.description!="") ? (
                                            <div className="overview-desc">
                                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                    
                                                    <li className="nav-item">
                                                        <Link to="#" className={`nav-link ${selectedTab==='description' ? 'active' : ''}`} onClick={()=>setSelectedTab('description')}>Description</Link>
                                                    </li>
                                                
                                                </ul>
                                                <div className="tab-content">
                                                    
                                                    <div className={`tab-pane fade ${selectedTab==='description' ? 'show active' : ''}`} >
                                                        <p>
                                                            {yacht.description}
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
                        <div className="form-group">
                            <label >Check In Date</label>
                            <DatePicker className="form-control" selected={modalCheckInDate}
                                        minDate={new Date()}
                                        customInput={<DatepickerInput />}
                                        onChange={date => {
                                            date=new Date(moment(date).format('MM/DD/Y'))
                                            SetModalCheckInDate(date);
                                            
                                        }}
                                        />
                        </div>
                        <div className="form-group">
                            <label >Do you have any special request</label>
                            <textarea rows="3" className="form-control" value={modalSpecialRequest} onChange={(e)=>SetModalSpecialRequest(e.target.value)}></textarea>
                        </div>

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
  
  export default YachtDetails;