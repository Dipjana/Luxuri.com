import ReactGA from 'react-ga';
function TrackPage(pageName){
    const { REACT_APP_GOOGLE_ANALYTICS_STATUS } = process.env;
    if(REACT_APP_GOOGLE_ANALYTICS_STATUS==='1'){
        //console.log('track',pageName);
        ReactGA.pageview(pageName);
    }
    
}

export default TrackPage;