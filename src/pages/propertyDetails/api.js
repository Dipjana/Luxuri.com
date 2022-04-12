import api from '../../api';

// export function GetAPropertyDetails(propertyID, slug){
//   slug= slug.replaceAll('-',' ');
//   return api(`/api/properties/GetAPropertyDetails?propertyID=${propertyID}&propertyFriendlyName=${slug}`)
// }
export function GetVillaDetails(propertyID){

  return api(`http://localhost:8080/api/vacation-house-details?propertyId=${propertyID}`)
}
export function getPropertiesByLocation(brokerID, locationId){
  return api(`/api/properties/GetPropertiesByLocation?brokerID=${brokerID}&locationID=${locationId}`)
}

export function getPropertyCalendarEvents(propertyID, firstDate, lastDate){
  return api(`/api/properties/Web_GetPropertyCalendarEvents?propertyID=${propertyID}&firstDate=${firstDate}&lastDate=${lastDate}`)
}

// export function morePropertiesLike(brokerID, locationId, selectedPropertyID, payload, dsp){
//   return api(`/api/inquiries/Web_MorePropertiesLike?brokerID=${brokerID}&dsp=${dsp}&fuzzyDays=0&fuzzyGuests=0&locationID=${locationId}&selectedPropertyID=${selectedPropertyID}`,payload,'PUT')
// }

export function morePropertiesLike(locationId){
  return api(`http://localhost:8080/api/vacation-house?location=${locationId}`)
}

export function createLeads(employeeID, payload){
  return api(`/api/leads/CreateLeads?employeeID=${employeeID}`, payload, 'POST')
}

export function createInquiries(employeeID, brokerID, location, locationID, propertyFriendlyName, payload){
  return api(`/api/inquiries/Web_CreateInquiries?brokerID=${brokerID}&employeeID=${employeeID}&location=${location}&locationID=${locationID}&propertyFriendlyName=${propertyFriendlyName}`, payload, 'POST')
}

export function contactPreferences(){
  return api(`http://localhost:8080/api/leads/GetContactPreferences`)
}