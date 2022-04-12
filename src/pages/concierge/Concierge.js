import React, {useState, useEffect, useContext, useRef} from 'react';
import { AuthContext } from '../../AuthContext';
import {create, getServices, contactPreferences} from './apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrackPage from '../../hooks/TrackPage';
import TrackEvent from '../../hooks/TrackEvent';
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';
function Concierge(props) {
    const { REACT_APP_PUBLIC_URL } = process.env;
    const authDetails = useContext(AuthContext);

    const [selectedType, setSelectedType]=useState('massage_therapist');

    const [errors , setErrors] = useState({});
    const [services , setServices] = useState([]);
    const [user_name , setUserName] = useState("");
    const [request , setRequest] = useState("");
    const [serviceIds , setServiceIds] = useState([]);
    const [phone , setPhone] = useState("");
    const [email, SetEmail] = useState('');
    const [contactPreferenceTypeID , setContactPreferenceTypeID] = useState(3);
    const [contactTypes , setContactTypes] = useState([]);

    

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = "Concierge Services";  
      }, []);

    /*const checkScrollDirectionIsUp=(event)=> {
        if (event.wheelDelta) {
          return event.wheelDelta > 0;
        }
        return event.deltaY < 0;
    }

    useEffect(() => {
        window.onwheel = (event) => {
            if (checkScrollDirectionIsUp(event)) {
                //console.log('UP', selectedType);
                if(selectedType==="private_travel"){
                    setSelectedType('exclusive_reservation')
                }else if(selectedType==="exclusive_reservation"){
                    setSelectedType('private_villa')
                }else if(selectedType==="private_villa"){
                    setSelectedType('vip_protection')
                }else if(selectedType==="vip_protection"){
                    setSelectedType('massage_therapist')
                }
            } else {
                //console.log('DOWN', selectedType);
                if(selectedType==="massage_therapist"){
                    setSelectedType('vip_protection')
                }else if(selectedType==="vip_protection"){
                    setSelectedType('private_villa')
                }else if(selectedType==="private_villa"){
                    setSelectedType('exclusive_reservation')
                }else if(selectedType==="exclusive_reservation"){
                    setSelectedType('private_travel')
                }
            }
        }
    }, [selectedType]);*/


    const massage_therapist_ref = useRef(null)
    const vip_protection_ref = useRef(null)
    const private_villa_ref = useRef(null)
    const exclusive_reservation_ref = useRef(null)
    const private_travel_ref = useRef(null)

    useEffect(() => {
        if(contactTypes.length===0){
            contactPreferences().then(resp=>{
                if(resp.data.Data!=null && resp.data.Data.length > 0){

                    let newData= resp.data.Data;

                    setContactTypes(newData);
                }
            })
        }
    },[contactTypes, authDetails]);


    useEffect(() => {
        if(services.length===0){
            getServices().then(resp=>{
                if(resp.data.Data!=null && resp.data.Data.length > 0){
                    setServices(resp.data.Data);
                }
            })
        }
    },[services,authDetails]);

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

    

    const setServiceData=(serveid)=>{
        let ids=[...serviceIds];
        if(ids.includes(parseInt(serveid))){
            ids=ids.filter(el=>{
                if(el!=serveid){
                    return true;
                }
                return false;
            })
        }else{
            ids.push(parseInt(serveid));
        }
        setServiceIds(ids);
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleSubmit=async(e)=> {
        e.preventDefault()
        let errors={};
        if(user_name==""){
            errors.user_name="Name can not be blank";
        }
        if(request==""){
            errors.request="Requirement Can not be blank";
        }
        if(serviceIds.length==0){
            errors.serviceIds="Please select a service.";
        }
        if(contactPreferenceTypeID==""){
            errors.contactPreferenceTypeID="Contact Preference Can not be blank";
        }
        if(contactPreferenceTypeID==1){
            if(email==""){
                errors.email="Email Can not be blank";
            }else if(validateEmail(email)==false){
                errors.email="Email is not valid";
            }
        }else if(contactPreferenceTypeID==2 || contactPreferenceTypeID==3){
            if(phoneNoValidation(phone)===false){
                errors.phone="Phone no is not valid";
            }
        }
        
        setErrors(errors)
        if(Object.keys(errors).length==0){
            
            let newService=[...services];
            let selectedServices=newService.filter(sr=>{
                if(serviceIds.includes(sr.conciergeServiceID)){
                    return sr;
                }
                return false
            });

            let contactPreferenceType= contactTypes.find(el=>el.contactPreferenceTypeID==contactPreferenceTypeID);
            const nameOb=splitName(user_name)
            const Payload={
                "firstName": nameOb.first_name,
                "lastName": nameOb.last_name,
                "request": request,
                "contactPreferenceType": contactPreferenceType.contactPreferenceType,
                "contactPreferenceTypeID": contactPreferenceTypeID,
                "phone": (contactPreferenceTypeID==2 || contactPreferenceTypeID==3) ? phone : '',
                'email':(contactPreferenceTypeID==1) ? email : '',
                "services": selectedServices
            }
           
            const resp= await create(authDetails.employeeId, authDetails.brokerId, Payload).catch(e => Promise.resolve(e));
            TrackEvent({
                category: 'Concierge',
                action: 'Create Concierge',
                label: 'Concierge',
                value: Payload
            })

            const ecData = {
                "email":  (contactPreferenceTypeID==1) ? email : '',
                "phone_number": (contactPreferenceTypeID==2 || contactPreferenceTypeID==3) ? phone : '',
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

            if(resp.status===500){
                toast.error("Something wrong happend. Please contact with our support.");
            }else{
                // setUserName('');
                // setRequest('');
                // setPhone('');
                // setServiceIds([]);
                // toast.success("Your request has been submitted.");
                props.history.push(`/concierge-service-inquiry`);
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


    const handleSectionToggle=(type)=>{
        if(selectedType!==type){
            setSelectedType(type)
        }
    }

    const setType=(type)=>{
        const behavious={behavior: "smooth", block: "center", inline: "center"};
        if(type==="massage_therapist"){
            massage_therapist_ref.current.scrollIntoView(behavious)
        }else if(type==="vip_protection"){
            vip_protection_ref.current.scrollIntoView(behavious)
        }else if(type==="private_villa"){
            private_villa_ref.current.scrollIntoView(behavious)
        }else if(type==="exclusive_reservation"){
            exclusive_reservation_ref.current.scrollIntoView(behavious)
        }else if(type==="private_travel"){
            private_travel_ref.current.scrollIntoView(behavious)
        }
        setSelectedType(type)
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
            <meta name="description" content="concierge-services" />
        </MetaTags>
        <section className="main" >
            <div className="concierge-top-panel">
                <div className="row">
                    <div className="col-12 col-md-12" style={{ color:'#fff', textAlign:'center' }}>
                            <h6>AN INTRODUCTION TO:</h6>
                            <h2>THE WORLD OF LUXURI CONCIERGE</h2>
                    </div>
                </div>
            </div>
            <div className="concierge-banner concierge-top-section">
                
                <div className="row" >
                    <div className="col-12 col-md-4 concierge-leftpanel">
                        <div className="concierge-desc">
                            
                            <ul style={window.innerWidth>=768 ? {position:'fixed',top:'36%'} : {}}>
                                <li><span onClick={()=>setType('massage_therapist')} className={`url-cursor ${selectedType=='massage_therapist' ? 'concierge-active' : ''}`}>Massage Therapist</span></li>
                                <li><span onClick={()=>setType('vip_protection')} className={`url-cursor ${selectedType=='vip_protection' ? 'concierge-active' : ''}`}>VIP Protection Services</span></li>
                                <li><span onClick={()=>setType('private_villa')} className={`url-cursor ${selectedType=='private_villa' ? 'concierge-active' : ''}`}>Private Villa Chef</span></li>
                                <li><span onClick={()=>setType('exclusive_reservation')} className={`url-cursor ${selectedType=='exclusive_reservation' ? 'concierge-active' : ''}`}>Exclusive Reservations &amp; Tickets</span></li>
                                <li><span onClick={()=>setType('private_travel')} className={`url-cursor ${selectedType=='private_travel' ? 'concierge-active' : ''}`}>Private Travel &amp; Luxury Tours</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="concierge-right-holder">
                            <div ref={massage_therapist_ref} onMouseEnter={()=>handleSectionToggle('massage_therapist')} className="concierge-right">
                                <div className="concierge-image">
                                    <img src={"images/Massage Therapist.png"} alt=""/>
                                </div>
                                <div className="service-details">
                                    <h3>Massage Therapist</h3>
                                    <p>Deep tissue massage, stretch therapy, hot stone massage, massage cupping, and cranial release technique are some of the methods that our licensed massage therapists use to help you relieve pain, rehabilitate injuries, reduce stress, and increase overall relaxation.</p>
                                
                                </div>
                            </div>
                            <div ref={vip_protection_ref} onMouseEnter={()=>handleSectionToggle('vip_protection')} className="concierge-right">
                                <div className="concierge-image">
                                    <img src={"images/VIP Protection.png"} alt=""/>
                                </div>
                                <div className="service-details">
                                    <h3>VIP Protection Services</h3>
                                    <p>The highest level of trained protection officers can be arranged during your stay with us. Our security personnel have worked with political figures, celebrities, and high profile individuals.</p>

                                </div>
                            </div>
                            <div ref={private_villa_ref} onMouseEnter={()=>handleSectionToggle('private_villa')} className="concierge-right">
                                <div className="concierge-image">
                                    <img src={"images/Private Villa Chef.png"} alt=""/>
                                </div>
                                <div className="service-details">
                                    <h3>Private Villa Chef</h3>
                                    <p>A private in-villa Chef is available to prepare a variety of healthy meals and personalized menus for our guests on a full-time basis or for a once off special occasion. Our Chef will arrive at your luxury villa to prepare, cook, and serve your food at the event or for later consumption.</p>
                            
                                </div>
                            </div>
                            <div ref={exclusive_reservation_ref} onMouseEnter={()=>handleSectionToggle('exclusive_reservation')} className="concierge-right">
                                <div className="concierge-image">
                                    <img src={"images/Exclusive Reservations & Tickets.png"} alt=""/>
                                </div>
                                <div className="service-details">
                                    <h3>Exclusive Reservations &amp; Tickets</h3>
                                    <p>Our concierge service recommends and provides access to tickets for exclusive events, exhibitions and festivals as well as fine dining reservations.</p>
                        
                                </div>
                            </div>
                            <div ref={private_travel_ref} onMouseEnter={()=>handleSectionToggle('private_travel')} className="concierge-right">
                                <div className="concierge-image">
                                    <img src={"images/Private Travel_Tours.png"} alt=""/>
                                </div>
                                <div className="service-details">
                                    <h3>Private Travel &amp; Luxury Tours</h3>
                                    <p>All manner of private travel and tours both locally and abroad can be arranged prior to your arrival or during your stay. Luxury tours and outdoor adventures can be an intricate part of your visit to Miami and the Keys. We offer trips to private game hunting and Bahamas island packages. Our professional concierges will take care of your every requirement.</p>
                                
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                
                
            </div>

            <div className="our-service">
                <div className="container">
                
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Request Your Desired Service(s)</h3>
                            
                            {/* service-request */}
                            <div className="contact-form" style={{ backgroundColor:'#000' }}>
                            <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">Name</label>
                                        <input type="text" className={`form-control ${errors.hasOwnProperty('user_name') ? "is-invalid" : ""}`} value={user_name}  onChange={(e)=>setUserName(e.target.value)} id="exampleFormControlInput1" placeholder="Your Name"/>
                                        {errors.hasOwnProperty('user_name') ?  (
                                            <div className="invalid-feedback">{errors.user_name}</div>
                                        ) : null}
                                </div>
                                    <div className="form-group">
                                        <h5>Service(S) Requested*</h5>
                                    </div>
                                    {services.map(service=>{
                                        return (
                                            <div className="form-group" key={service.conciergeServiceID}>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={service.conciergeServiceID} id={`invalidCheck${service.conciergeServiceID}`} checked={serviceIds.includes(service.conciergeServiceID) ? true : false } onChange={(e)=>{setServiceData(e.target.value)}}/>
                                                    <label className="form-check-label" htmlFor={`invalidCheck${service.conciergeServiceID}`}>{service.conciergeService}</label>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {errors.hasOwnProperty('serviceIds') ?  (
                                            <div className="invalid-feedback" style={{ display:'block' }}>{errors.serviceIds}</div>
                                        ) : null}
                                    
                                    
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlTextarea1">Do You Have Any Special Request(s)?</label>
                                        <textarea className={`form-control ${errors.hasOwnProperty('request') ? "is-invalid" : ""}`} value={request}  onChange={(e)=>setRequest(e.target.value)} id="exampleFormControlTextarea1" rows="3"></textarea>
                                        {errors.hasOwnProperty('request') ?  (
                                            <div className="invalid-feedback">{errors.request}</div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Contact type</label>
                                        <select className="form-control" onChange={(e)=>setContactPreferenceTypeID(e.target.value)} value={contactPreferenceTypeID}>
                                            {contactTypes.map(el=>{
                                                return (
                                                    <option key={el.contactPreferenceTypeID} value={el.contactPreferenceTypeID}>{el.contactPreferenceType}</option>
                                                )
                                            })}
                                        </select>
                                        
                                        {errors.hasOwnProperty('contactPreferenceTypeID') ?  (
                                            <div className="invalid-feedback" style={{ display:'block' }}>{errors.contactPreferenceTypeID}</div>
                                        ) : null}
                                    </div>
                                    {contactPreferenceTypeID==1 ? (
                                        <div className="form-group">
                                            <label >Email</label>
                                            <input type="text" className={`form-control ${errors.hasOwnProperty('email') ? "is-invalid" : ""}`} value={email}  onChange={(e)=>SetEmail(e.target.value)}/>
                                            {errors.hasOwnProperty('email') ?  (
                                                    <div className="invalid-feedback">{errors.email}</div>
                                                ) : null}
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlInput2">Best Contact Number</label>
                                            <input type="text" className={`form-control ${errors.hasOwnProperty('phone') ? "is-invalid" : ""}`} value={phone}  onChange={(e)=>setPhone(maskPhoneNo(e.target.value))} id="exampleFormControlInput2" placeholder="Your Contact Number"/>
                                            {errors.hasOwnProperty('phone') ?  (
                                                <div className="invalid-feedback">{errors.phone}</div>
                                            ) : null}
                                        </div>
                                    )}
                                    
                                    <button type="submit" className="btn button-custom">Submit</button>
                                </form>
                            </div>
                            
                        </div>
                        <div className="col-md-6 desktop-only">
                            
                        </div>
                    </div>           
                </div>
            </div>
            
            
        </section>   
        <Contact/>
        </>
    );
}

export default Concierge;