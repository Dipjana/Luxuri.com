import api from '../../api';

export function propertyHeroes(brokerID){
    return api(`http://localhost:8080/api/properties/GetHeros?typeOfHeros=location`)
}

export function carHeroes(brokerID){
    return api(`http://localhost:8080/api/properties/GetHeros?typeOfHeros=cars`)
}

export function yatchHeroes(brokerID){
    return api(`http://localhost:8080/api/properties/GetHeros?typeOfHeros=yacht`)
}

export function getLocations(brokerID){
    return api(`/api/properties/GetLocations?brokerID=${brokerID}`)
}


export function locationPlace(){
    return api(`http://localhost:8080/api/location`)
}