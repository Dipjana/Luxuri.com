import api from '../../api';

export function getPropertiesByLocation(brokerID, locationId){
    return api(`/api/properties/GetPropertiesByLocation?brokerID=${brokerID}&locationID=${locationId}`)
}

export function getMatchedEnquiries(brokerID, locationId, employeeID, payload){
    return api(`/api/inquiries/Web_MatchedInquiries?brokerID=${brokerID}&employeeID=${employeeID}&fuzzyDays=0&fuzzyGuests=0&locationID=${locationId}`,payload,'PUT')
}

export function getVillaByLocation(locationId){
    return api(`http://localhost:8080/api/vacation-house?location=${locationId}`)
}