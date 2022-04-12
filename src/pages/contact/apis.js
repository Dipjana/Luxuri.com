import api from '../../api';

export function createContact(employeeID, brokerID, payload){
    return api(`/api/inquiries/Web_ContactUs?brokerID=${brokerID}&employeeID=${employeeID}`, payload, 'POST')
}

export function getLocations(brokerID){
    return api(`/api/properties/GetLocations?brokerID=${brokerID}`)
}

export function contactPreferences(){
    return api(`/api/leads/GetContactPreferences`)
}