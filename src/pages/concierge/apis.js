import api from '../../api';

export function create(employeeID, brokerID, payload){
    return api(`/api/inquiries/Web_Concierge?brokerID=${brokerID}&employeeID=${employeeID}`, payload, 'POST')
}

export function getServices(brokerID){
    return api(`/api/inquiries/GetConciergeServices`)
}

export function contactPreferences(){
    return api(`/api/leads/GetContactPreferences`)
  }