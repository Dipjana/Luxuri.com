import api from '../../api';

export function GetACarDetails(carID){
  return api(`http://localhost:8080/api/transportation/${carID}`)
}

export function createLeads(employeeID, payload){
  return api(`/api/leads/CreateLeads?employeeID=${employeeID}`, payload, 'POST')
}

export function createInquiries(employeeID, brokerID, location, locationId, friendlyName, payload){
  return api(`/api/inquiries/Web_TransportationObjectInquiries?brokerID=${brokerID}&employeeID=${employeeID}&location=${location}&locationID=${locationId}&transportationObjectFriendlyName=${friendlyName}`, payload, 'POST')
}

export function contactPreferences(){
  return api(`http://localhost:8080/api/leads/GetContactPreferences`)
}