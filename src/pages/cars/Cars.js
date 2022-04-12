import React, { useState, useContext, useEffect, useRef } from 'react';
// import { AuthContext } from '../../AuthContext';
import DatePicker from "react-datepicker";
import queryString from 'query-string';
import { Range } from 'rc-slider';
import { getCars, carsByMake, carsByModel, modelsByMake, getTransportationTypesData } from './apis';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import TrackPage from '../../hooks/TrackPage';
import DatepickerInput from '../../hooks/DatepickerInput'
import Contact from '../../common/contact/Contact'
import MetaTags from 'react-meta-tags';

function Cars(props) {
    // const authDetails = useContext(AuthContext);

    const urlParams = queryString.parse(props.location.search)
    const [checkInDate, setCheckInDate] = useState(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const [checkOutDate, setCheckOutDate] = useState(urlParams.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().add(1, 'd').format('Y/MM/DD')));
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const [lowerBudget, setLowerBudget] = useState(0);
    const [upperBudget, setUpperBudget] = useState(200000);
    const [lowerValue, setLowerValue] = useState(urlParams?.lowerValue ?? 0);
    const [upperValue, setUpperValue] = useState(urlParams?.upperValue ?? 200000);
    const [maxAmount, setMaxAmount] = useState(200000);
    const [sortOrder, setSortOrder] = useState(urlParams?.sortOrder ?? 'low_to_high');

    const [makeId, setMakeid] = useState(urlParams?.make ?? '');
    const [modelId, setModelId] = useState(urlParams?.model ?? '');

    const [makeList, setMakelList] = useState([]);
    const [modelList, setModelList] = useState([]);

    const [initPage, setInitPage] = useState(true);

    const datepickerRef = useRef(null);

    const startDate = moment(urlParams.checkInDate ? new Date(moment(urlParams.checkInDate).format('Y/MM/DD')) : new Date(moment().format('Y/MM/DD')));
    const endDate = moment(urlParams.checkOutDate ? new Date(moment(urlParams.checkOutDate).format('Y/MM/DD')) : new Date(moment().add(1, 'd').format('Y/MM/DD')));
    let difference = endDate.diff(startDate, 'days');
    if (difference === 0) {
        difference = 1;
    }

    const [cars, setCars] = useState(null);
    const [carsMain, setCarMain] = useState(null);

    useEffect(() => {
        TrackPage(window.location.pathname + window.location.search)
    }, [window.location.pathname + window.location.search])

    useEffect(() => {
        document.title = 'Luxury car rentals miami';
    }, []);

    /*================= Get car Details =================*/
    const carFilter = async () => {
        let resp = null;
        if (modelId !== '') {
            resp = await carsByModel(modelId);
        } else if (makeId !== '') {
            resp = await carsByMake(makeId);
        } else {
            resp = await getCars();
        }

       
            setCars(resp.data);
            setCarMain(resp.data);
            let getMaxAmount = 0;
            let carOrder = resp.data;
            if (carOrder !== null) {
                carOrder.filter((elem) => {
                    if (elem.price > getMaxAmount) {
                        getMaxAmount = elem.price;
                    }
                });
                setMaxAmount(getMaxAmount);
                setUpperBudget(difference * getMaxAmount);

                if (initPage === false) {
                    setUpperValue(difference * getMaxAmount)
                    setLowerValue(0)

                } else {
                    carOrder = carOrder.filter(car => {
                        if (car.price >= lowerValue && car.price <= upperValue) {
                            return car;
                        }
                        return false
                    })
                }

                if (sortOrder === "low_to_high") {
                    carOrder.sort(function (a, b) {
                        if (a.price < b.price) {
                            return -1;
                        }
                        else if (a.price > b.price) {
                            return 1;
                        }
                        return 0;
                    });
                } else if (sortOrder === "high_to_low") {
                    carOrder.sort(function (a, b) {
                        if (a.price > b.price) {
                            return -1;
                        }
                        else if (a.price < b.price) {
                            return 1;
                        }
                        return 0;
                    });
                }

                setCars(carOrder)
                if (initPage === true) {
                    window.scroll({
                        top: urlParams?.scrollPosition ?? 0,
                        behavior: 'smooth'
                    });
                }
                setInitPage(false)

            }
    };

    useEffect(() => {
            carFilter()
    }, []);

    /*=================== get model list by maker id ================*/
    useEffect(() => {
        if (makeId !== "") {
            modelsByMake(makeId).then(resp => {
                setModelList(resp.data)

                if (initPage === false) {
                    setModelId('')
                } else {
                    setModelId(urlParams?.model ?? '')
                }
            })
        } else {
            setModelId('')
            setModelList([])
        }
    }, [makeId])

    useEffect(() => {
        carFilter()
    }, [makeId, modelId]);

    /*================ car list by maker ===============*/
    useEffect(() => {
        getTransportationTypesData().then(resp => {
            if (resp.data != null) {
                setMakelList(resp.data)
            }
        })
    }, []);


    useEffect(() => {
        if (checkOutDate === null) return;
        const startDate = moment(checkInDate);
        const endDate = moment(checkOutDate);
        let difference = endDate.diff(startDate, 'days');
        if (difference == 0) {
            difference = 1;
        }
        setUpperBudget(difference * maxAmount);
        if (initPage === false) {
            setUpperValue(difference * maxAmount)
        }


    }, [checkInDate, checkOutDate])

    const openDetailsPage = (id) => {

        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
        let queryStringN = `checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&scrollPosition=${scrollPosition}&make=${makeId}&model=${modelId}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryStringN}`);

        let queryString = `checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}`;
        props.history.push(`/car-details/${id}?${queryString}`);
    };
    const numberFormat = (x) => {
        x = parseFloat(x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

/*2nd call */
    const filterData = () => {
        if (carsMain !== null) {
            let carOrder = [...carsMain];
        
            carOrder = carOrder.filter(car => {
                if (car.price >= lowerValue && car.peice <= upperValue) {
                    return car;
                }
                return false
            })
            if (sortOrder === "low_to_high") {
                carOrder.sort(function (a, b) {
                
                    if (a.price < b.price) {    
                        return -1;
                    }
                    else if (a.price > b.price) {
                        return 1;
                    }
                    return 0;
                });
            } else if (sortOrder === "high_to_low") {
                carOrder.sort(function (a, b) {
                    if (a.price > b.price) {
                        return -1;
                    }
                    else if (a.price < b.price) {
                        return 1;
                    }
                    return 0;
                });
            }

            setCars(carOrder)
        }

    }
    
    useEffect(() => {
            filterData();
    }, [sortOrder])




    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const opendatePicker = () => { // bind with an arrow function
        const datepickerElement = datepickerRef.current;
        datepickerElement.setOpen(true);
    }

    const replaceUrl = () => {
        const scrollPosition = urlParams?.scrollPosition ?? (window.pageYOffset || document.documentElement.scrollTop)
        let queryString = `checkInDate=${moment(checkInDate).format('Y-MM-DD')}&checkOutDate=${moment(checkOutDate).format('Y-MM-DD')}&sortOrder=${sortOrder}&lowerValue=${lowerValue}&upperValue=${upperValue}&scrollPosition=${scrollPosition}&make=${makeId}&model=${modelId}`;
        window.history.replaceState(null, null, `${props.location.pathname}?${queryString}`);
    }
    useEffect(() => {
        if (checkOutDate === null) return;
        replaceUrl()
    }, [sortOrder, checkOutDate, makeId, modelId]);




    return (
        <>
            <MetaTags>
                <meta name="description" content="Luxury car rentals miami" />
            </MetaTags>
            <section className="main">

                <div className="list-filter-block fixed-header-gap">
                    <div className="container-fluid">
                        <div className="list-page-filter">

                            <div className="row justify-content-md-center">
                                <div className="col-md-9 col-lg-7">
                                    <div className="filter-heading">
                                        <h1>Luxuri car Rentals</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-md-center">
                                <div className="col-md-9 col-lg-7">
                                    <div className="list-filter">
                                        <div className="guest-book">
                                            <div className="row">


                                                <div className="col-sm-6 col-md-6">
                                                    <div className="check-ins property-details-datepicker" style={{ borderRadius: "50px", width: "100%" }}>
                                                        <label onClick={opendatePicker} className="url-cursor" htmlFor="checkInDate" style={{ width: "100%" }}>Pick up / Drop off</label>


                                                        <DatePicker className="form-control" selected={checkInDate}
                                                            ref={datepickerRef}
                                                            minDate={new Date()}
                                                            customInput={<DatepickerInput />}
                                                            selectsRange
                                                            startDate={checkInDate}
                                                            endDate={checkOutDate}
                                                            monthsShown={window.screen.width <= 480 ? 1 : 2}
                                                            withPortal
                                                            portalId="root"
                                                            onChange={dates => {
                                                                const [start, end] = dates;
                                                                setCheckInDate(start);
                                                                setCheckOutDate(end);

                                                            }}

                                                        />
                                                    </div>

                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="guest-numbers url-cursor" style={{ minHeight: '43px' }} onClick={() => setShowSortDropdown(!showSortDropdown)}>
                                                        <div className="dropdown">
                                                            <button className="btn dropdown-toggle sort-button" type="button" >
                                                                Sort
                                                            </button>
                                                            <div className={`dropdown-menu ${showSortDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                                                <p className="dropdown-item url-cursor" onClick={() => { setSortOrder('low_to_high'); setShowSortDropdown(!showSortDropdown) }}>Price Low to High</p>
                                                                <p className="dropdown-item url-cursor" onClick={() => { setSortOrder('high_to_low'); setShowSortDropdown(!showSortDropdown) }}>Price High to Low</p>

                                                            </div>

                                                        </div>
                                                        <div>{sortOrder != null ? capitalizeFirstLetter(sortOrder.replaceAll('_', ' ')) : null}</div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-12 col-md-6" style={{ paddingTop: '15px' }}>
                                                    <select className="guest-numbers" style={{ width: '100%', height: '40px' }} value={makeId} onChange={(e) => { setMakeid(e.target.value) }}>
                                                        <option value="">Select Make</option>
                                                        {makeList.map((el, key) => <option key={el.band_id} value={el.band_id}>{el.band_name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-12 col-md-6" style={{ paddingTop: '15px' }}>
                                                    <select className="guest-numbers" style={{ width: '100%', height: '40px' }} value={modelId} onChange={(e) => { setModelId(e.target.value) }}>
                                                        <option value="">Select Model</option>
                                                        {modelList.map((el, key) => <option key={el.model_id} value={el.model_id}>{el.model_name}</option>)}
                                                    </select>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="col-md-9 col-lg-7">
                                    <div className="price-range">
                                        <p>
                                            <label>Total Budget (${numberFormat(lowerValue)} - ${numberFormat(upperValue)})</label>
                                        </p>
                                        <Range allowCross={false} min={lowerBudget} max={upperBudget} value={[lowerValue, upperValue]} tipFormatter={value => `${value}`} defaultValue={[lowerValue, upperValue]} onChange={(value) => {
                                            setLowerValue(value[0]);
                                            setUpperValue(value[1]);
                                        }} onAfterChange={() => {
                                            filterData();
                                            replaceUrl()
                                        }} />

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="property-list-block">
                            <div className="row">
                                {cars === null ? (
                                    <>
                                        <div className="col-md-6" ><div className="shine" style={{ minHeight: '200px', width: '100%' }}></div></div>
                                        <div className="col-md-6" ><div className="shine" style={{ minHeight: '200px', width: '100%' }}></div></div>
                                        <div className="col-md-6" ><div className="shine" style={{ minHeight: '200px', width: '100%' }}></div></div>
                                        <div className="col-md-6" ><div className="shine" style={{ minHeight: '200px', width: '100%' }}></div></div>
                                    </>
                                ) : null}
                                {cars != null && cars.length > 0 ? (
                                    cars.map((car) => (
                                        <div className="col-md-6" key={car.model_id}>
                                            <div className="property-listing url-cursor" >
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="property-image" onClick={() => openDetailsPage(car.model_id)} style={{ height: "210px" }}>
                                                            <img  src={`img/${car.imageFilePath}`} alt=""/>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="property-desc" onClick={() => openDetailsPage(car.model_id)}>
                                                            <h4 style={{ wordBreak: "break-all" }}>{car.model_name}</h4>
                                                            <ul>
                                                                <li>
                                                                    <strong className="feature-item">Number Of Seats : </strong>
                                                                    <span className="feature-value">{car.numberOfSeats}</span>
                                                                </li>
                                                                <li>
                                                                    <strong className="feature-item">Zero To 60 : </strong>
                                                                    <span className="feature-value">{car.zeroTo60}</span>
                                                                </li>
                                                                <li>
                                                                    <strong className="feature-item">Transmission Type : </strong>
                                                                    <span className="feature-value">{car.transmissionType}</span>
                                                                </li>
                                                            </ul>

                                                            <p className="daily-rate"><strong>${numberFormat(car.price)}</strong>/Day</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                ) : (
                                    <div className="col-md-6">
                                        <p >No record found</p>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>

            </section>
            <Contact />
        </>
    );
}

export default Cars;