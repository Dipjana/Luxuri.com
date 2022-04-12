import ReactGA from 'react-ga';
function TrackEvent(eventOb){
    const { REACT_APP_GOOGLE_ANALYTICS_STATUS } = process.env;
    if(REACT_APP_GOOGLE_ANALYTICS_STATUS==='1'){
        ReactGA.event(eventOb);
    }
    
}

export default TrackEvent;