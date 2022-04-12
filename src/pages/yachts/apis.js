import api from '../../api';

// export function getYachts(order){
//     console.log(order)
//     return api(`http://localhost:8080/api/yecht?sortOrder=${order}`)
// }
export function getYachts(order){
   
    return api(`http://localhost:8080/api/yecht`)
}
