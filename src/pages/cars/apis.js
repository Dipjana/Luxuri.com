import api from '../../api';

// export function getCars(brokerID){
//     return api(`/api/transportation/GetTObjectList?brokerID=${brokerID}&tObjectTypeID=1&employeeID=1`)
// }
export function getCars(){
    return api(`http://localhost:8080/api/transportation/GetAllCarList`)
}

// export function carsByMake(brokerID, employeeID, makeID){
//     return api(`/api/transportation/GetTObjectListByMake?tObjectTypeID=1&employeeID=${employeeID}&brokerID=${brokerID}&makeID=${makeID}`)
// }

//problem solve
export function carsByMake( makeID){
    return api(`http://localhost:8080/api/transportation/GetTObjectListByMake?maker=${makeID}`)
}

// export function carsByModel(brokerID, employeeID, modelID){
//     return api(`/api/transportation/GetTObjectListByModel?tObjectTypeID=1&employeeID=${employeeID}&brokerID=${brokerID}&modelID=${modelID}`)
// }

//problem
export function carsByModel( modelID){
    return api(`http://localhost:8080/api/transportation/GetTObjectListByModel?model=${modelID}`)
}

// export function modelsByMake(makeID){
//     return api(`/api/transportation/GetTObjectModelsByMake?objectTypeID=1&makeID=${makeID}`)
// }
export function modelsByMake(makeID){
    return api(`http://localhost:8080/api/transportation/GetTObjectModelsByMake?maker=${makeID}`)
}


// export function getTransportationTypesData(brokerID){
//     return api(`/api/transportation/GetTransportationTypesData?brokerID=${brokerID}&objectTypeID=1&locationID=3&transactionStatusID=1`)
// }
export function getTransportationTypesData(){
    return api(`http://localhost:8080/api/transportation/GetTransportationTypeData`)
}