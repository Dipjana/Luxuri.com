import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../AuthContext';
import Mailto from '../../common/mailto/Mailto';
import {createContact, contactPreferences} from './apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrackPage from '../../hooks/TrackPage';
import TrackEvent from '../../hooks/TrackEvent';
import MetaTags from 'react-meta-tags';
function Contact() {
    const { REACT_APP_PUBLIC_URL } = process.env;
    const authDetails = useContext(AuthContext);

    const [errors , setErrors] = useState({});
    const [user_name , setUserName] = useState("");
    const [request , setRequest] = useState("");
    const [contactPreferenceTypeID , setContactPreferenceTypeID] = useState(3);
    const [phone , setPhone] = useState("");
    const [email, SetEmail] = useState("");
    const [contactTypes , setContactTypes] = useState([]);

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    },[window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = "Contact Luxuri Team";  
      }, []);

    useEffect(() => {
        if(contactTypes.length===0){
            contactPreferences().then(resp=>{
                if(resp.data.Data!==null && resp.data.Data.length > 0){

                    let newData= resp.data.Data;

                    setContactTypes(newData);
                }
            })
        }
    },[contactTypes, authDetails]);


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
        if(phoneNo===null){
          return false;
        }
        phoneNo = phoneNo.replace(/ /gm, '');
        let numbAr = phoneNo.match(/\d/g);
        if(numbAr===null){
          return false;
        }
        phoneNo=numbAr.join("");
        if(phoneNo.length!==10){
            return false;
        }
        return true;
    };

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const handleSubmit=async(e)=> {
        e.preventDefault()
        let errors={};
        if(isEmpty(user_name)){
            errors.user_name="Name can not be blank";
        }
        
        if(isEmpty(request)){
            errors.request="Requirement Can not be blank";
        }

        if(isEmpty(contactPreferenceTypeID)){
            errors.contactPreferenceTypeID="Contact Preference Can not be blank";
        }
        
        if(contactPreferenceTypeID==1){
            if(email===""){
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
        if(Object.keys(errors).length===0){

            const nameOb=splitName(user_name)
            let contactPreferenceTypeOb= contactTypes.find(el=>el.contactPreferenceTypeID==contactPreferenceTypeID)
            const Payload={
                "firstName": nameOb.first_name,
                "lastName": nameOb.last_name,
                "request": request,
                "contactPreferenceTypeID": contactPreferenceTypeID,
                "contactPreferenceType":contactPreferenceTypeOb.contactPreferenceType,
                "phone": (contactPreferenceTypeID===2 || contactPreferenceTypeID===3) ? phone : '',
                'email':(contactPreferenceTypeID===1) ? email : ''
                
            };
            const resp= await createContact(authDetails.employeeId, authDetails.brokerId, Payload).catch(e => Promise.resolve(e));

            TrackEvent({
                category: 'Contact',
                action: 'Create Contact',
                label: 'Contact',
                value: Payload
            })

            if(resp.status===500){
                toast.error("Something wrong happend. Please contact with our support.");
            }else{
                setUserName('');
                setRequest('');
                setPhone('');
                SetEmail('');
                setContactPreferenceTypeID(1);
                toast.success("Your request has been submitted.");
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

    const isEmpty=(arg)=>{
        return (
          arg === null || // Check for null or undefined
          arg.length === 0 || // Check for empty String (Bonus check for empty Array)
          (typeof arg === 'object' && Object.keys(arg).length === 0) // Check for empty Object or Array
        );
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
            <meta name="description" content="contact-luxuri-team" />
        </MetaTags>
        <section className="main">
            <div className="contact-banner fixed-header-gap">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="contact-desc">
                                <h1>Contact Us</h1>
                                <p><span className="icon-image"><img src={REACT_APP_PUBLIC_URL+"images/email-icon.png"} alt=""/></span><Mailto label="booking@luxuri.com" mailto="mailto:booking@luxuri.com" /></p>
                                <p><span className="icon-image"><img src={REACT_APP_PUBLIC_URL+"images/phone-icon.png"} alt=""/></span><Mailto label="305. 925. 0789" mailto="tel:305. 925. 0789" /></p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="contact-form">
                                <h4>Have the Perfect Vacation that You Deserve</h4>
                                <p>We manage 100+ properties across Miami and Aspen. Tell us your needs and we will find the best fit for you. If you need a luxury car, yacht, chef, massage, or spa services to make your stay even better let us know. We look forward to helping you have the best vacation experience.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">Name*</label>
                                        <input type="text" className={`form-control ${errors.hasOwnProperty('user_name') ? "is-invalid" : ""}`} value={user_name}  onChange={(e)=>setUserName(e.target.value)} id="exampleFormControlInput1" placeholder="Your Name"/>
                                        {errors.hasOwnProperty('user_name') ?  (
                                            <div className="invalid-feedback">{errors.user_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput2">How Can We Help?*</label>
                                        <input type="text" className={`form-control ${errors.hasOwnProperty('request') ? "is-invalid" : ""}`} value={request}  onChange={(e)=>setRequest(e.target.value)} id="exampleFormControlInput2" placeholder="Please Tell Your requirement"/>
                                        {errors.hasOwnProperty('request') ?  (
                                            <div className="invalid-feedback">{errors.request}</div>
                                        ) : null}
                                    </div>
                                

                                    <div className="form-group">
                                        How Do You Prefer To Be Contacted?
                                    </div>
                                    
                                    <div className="form-group">
                                        
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
                        
                                    <button type="submit"  className="btn button-custom">Submit</button>
                        
                                </form>
                            </div>
                        </div>
                    </div>
                </div>       
            </div>
        </section>   
        </>
    );
}

export default Contact;