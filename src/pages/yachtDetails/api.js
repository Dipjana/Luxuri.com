import api from '../../api';

// export function GetAYachtDetails(yachtID, brokerId, employeeId){
//   return api(`/api/transportation/GetATObject?transportationObjectID=${yachtID}&employeeID=${employeeId}&brokerID=${brokerId}`)
// }
export function GetAYachtDetails(yachtID){
  return api(`http://localhost:8080/api/yecht-details/${yachtID}`)
}

export function createLeads(employeeID, payload){
  return api(`/api/leads/CreateLeads?employeeID=${employeeID}`, payload, 'POST')
}

export function createInquiries(employeeID, brokerID, location, locationID, friendlyName, payload){
  return api(`/api/inquiries/Web_TransportationObjectInquiries?brokerID=${brokerID}&employeeID=${employeeID}&location=${location}&locationID=${locationID}&transportationObjectFriendlyName=${friendlyName}`, payload, 'POST')
}

export function contactPreferences(){
  return api(`http://localhost:8080/api/leads/GetContactPreferences`)
}