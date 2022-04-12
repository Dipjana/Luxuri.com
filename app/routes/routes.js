const express = require('express');
const router = express.Router();
const db = require('../models/db');
var _ = require('lodash/core');
var _ = require('lodash');

/*========================= Heros ========================*/
router.get("/properties/GetHeros", (req, res) => {
    let type = req.query.typeOfHeros 
    db.query(`SELECT imageFilePath, name FROM heros WHERE type='${type}';`, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})



/* ============================ Cars Section ============================*/

/*================= Get cars band or Maker list  ==================*/
router.get("/transportation/GetTransportationTypeData", (req, res) => {
    db.query("SELECT band_id, band_name FROM band", (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})

/*==================== Get cars model list =======================*/
router.get("/transportation/GetTObjectModelsByMake", (req, res) => {
    let bandId = req.query.maker
    db.query(`SELECT model_id, model_name FROM model WHERE band_id=${bandId}`, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)
        }
    })
})


/*=========================== get all cars list =====================*/
router.get("/transportation/GetAllCarList", (req, res) => {

    db.query(`SELECT band_id, model_id, model_name, numberOfSeats, zeroTo60, transmissionType, price, imageFilePath FROM model`, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})


/*======================= get all cars list by band_id(maker) =====================*/
router.get("/transportation/GetTObjectListByMake", (req, res) => {
    let bandId = req.query.maker
    // let order=req.query.sortOrder
    db.query(`SELECT band_id, model_id, model_name, numberOfSeats, zeroTo60, transmissionType, price, imageFilePath FROM model WHERE model.band_id=${bandId} `, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})
/*======================== get all cars list by model_id ==========================*/
router.get("/transportation/GetTObjectListByModel", (req, res) => {
    let modelId = req.query.model
    db.query(`SELECT band_id, model_id, model_name, numberOfSeats, zeroTo60, transmissionType, price, imageFilePath FROM model WHERE model.model_id=${modelId} `, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})



/*================== Get car details =====================*/
router.get("/transportation/:id", (req, res) => {

    db.query(`SELECT model_id, model_name, numberOfSeats, zeroTo60, transmissionType,MPH, horsePower, numberOfDays,price, imageFilePath, file, img_id FROM model INNER JOIN images ON (model.model_id=images.type_id) WHERE model_id='${req.params.id}'`, (err, row, fields) => {
        if (!err) {
            var group_to_values = row.reduce(function (obj, item) {
                obj[item.model_id] = obj[item.model_id] || [];
                obj[item.model_id].push({ file: item.file, img_id: item.img_id, model_name: item.model_name, model_id: item.model_id, numberOfSeats: item.numberOfSeats, zeroTo60: item.zeroTo60, transmissionType: item.transmissionType, MPH: item.MPH, horsePower: item.horsePower, numberOfDays: item.numberOfDays,price:item.price, imageFilePath: item.imageFilePath });

                return obj;
            }, {});
            //console.log(group_to_values)
            res.json(Object.keys(group_to_values).map(function (key) {
                return { model_id: key, model_name: group_to_values[key][0].model_name, numberOfSeats: group_to_values[key][0].numberOfSeats, zeroTo60: group_to_values[key][0].zeroTo60, transmissionType: group_to_values[key][0].transmissionType, MPH: group_to_values[key][0].MPH, horsePower: group_to_values[key][0].horsePower, numberOfDays: group_to_values[key][0].numberOfDays,price:group_to_values[key][0].price, imageFilePath: group_to_values[key][0].imageFilePath, image: group_to_values[key].map(x => ({ file: x.file, img_id: x.img_id })) };
            }));
        }
        else {
            console.log(err)

        }
    })
})
/*======== End Cars Section ===========*/

/*=============================== Get Location List ===========================*/
router.get("/location", (req, res) => {
    // console.log(req.params.model_id)
    placeId = req.query.location;
    db.query("SELECT place_id, place_name FROM place", (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})

/*============================ Get vacation house list ================================*/
router.get("/vacation-house", (req, res) => {
    // console.log(req.params.model_id)
    placeId = req.query.location;

    db.query(`SELECT villa_id, place_id, des, villa_name,numberOfBedrooms,numberOfGust,location,price, imageFilePath  FROM villa WHERE villa.place_id=${placeId};`, (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})

/*========================== Get miami vacation house details ==========================*/
router.get("/vacation-house-details", (req, res) => {
    villa_id = req.query.propertyId
    db.query(`SELECT a.villa_id, a.place_id, a.villa_name, a.numberOfGust, a.numberOfBedrooms, a.numberOfBarthrooms, a.location, a.des
        , a.price,a.imageFilePath, b.file, b.img_id , c.name FROM villa a JOIN images b ON (a.villa_id=b.type_id) JOIN 
        amenities c JOIN villa_amenities d ON (c.ame_id=d.ame_id) WHERE d.villa_id='${villa_id}' AND b.type_id ='${villa_id}' AND b.type= 'villa'; `, (err, row, fields) => {
        if (!err) {
            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };

            var res0 = groupBy(row, 'villa_name');

            var res2 = [];
            Object.keys(res0).forEach((item) => {

                var newObj = { villa_name: item, imageFilePath:res0[item][0].imageFilePath, villa_id: res0[item][0].villa_id, place_id: res0[item][0].place_id, numberOfGust: res0[item][0].numberOfGust, numberOfBedrooms: res0[item][0].numberOfBedrooms, numberOfBarthrooms: res0[item][0].numberOfBarthrooms, location: res0[item][0].location, des: res0[item][0].des, price: res0[item][0].price, image: [], amenities: [] };

                let images = [];
                res0[item].forEach((obj) => {
                    images.push({ file: obj.file, img_id: obj.img_id })
                    //   newObj.image.push({ file: obj.file, img_id: obj.img_id });
                });
                newObj.image.push(Object.values(images.reduce((a, c) => (a[c.file] = c, a), {})));

                let amine = [];
                res0[item].forEach((obj) => {
                    amine.push({ name: obj.name })
                });
                newObj.amenities.push(Object.values(amine.reduce((a, c) => (a[c.name] = c, a), {})));

                res2.push(newObj);
            });

            res.json(res2);

        }
        else {
            console.log(err)

        }
    })



})


    /

    /*=============== Get Yacht List ===============*/
    router.get("/yecht", (req, res) => {
        db.query(`SELECT yecht.yecht_id as yecht_id, name, feet, seats, fourHourRate, sixHourRate, eightHourRate, imageFilePath FROM yecht  ;`, (err, row, fields) => {
            if (!err) {
                res.json(row);

            }
            else {
                console.log(err)

            }
        })
    })


/*==================== Get yeacht details =====================*/
router.get("/yecht-details/:id", (req, res) => {
    // console.log(req.params.model_id)
    yeactId = req.query.location
    db.query(`SELECT yecht_id, name, feet, seats, location,fourHourRate, sixHourRate, eightHourRate, imageFilePath, file, img_id FROM yecht INNER JOIN images ON (yecht.yecht_id=images.type_id) WHERE yecht_id='${req.params.id}' `, (err, row, fields) => {
        if (!err) {

            /*         res.json(row);
           res.json(row.reduce((prev, curr) => {
               const found = prev.find(o => o.yecht_id === curr.yecht_id)
               found ?
                   found.file.push(curr.file) 
                   : prev.push({ ...curr, file: [curr.file] })
           
               return prev
           }, []))*/

            var group_to_values = row.reduce(function (obj, item) {
                obj[item.yecht_id] = obj[item.yecht_id] || [];
                obj[item.yecht_id].push({ file: item.file, img_id: item.img_id, name: item.name, feet: item.feet, seats: item.seats, location: item.location, fourHourRate: item.fourHourRate, sixHourRate: item.sixHourRate, eightHourRate: item.eightHourRate, imageFilePath: item.imageFilePath });

                return obj;
            }, {});
            //console.log(group_to_values)
            res.json(Object.keys(group_to_values).map(function (key) {
                return { yecht_id: key, name: group_to_values[key][0].name, seats: group_to_values[key][0].seats, feet: group_to_values[key][0].feet, location: group_to_values[key][0].location, fourHourRate: group_to_values[key][0].fourHourRate, sixHourRate: group_to_values[key][0].sixHourRate, eightHourRate: group_to_values[key][0].eightHourRate, imageFilePath: group_to_values[key][0].imageFilePath, image: group_to_values[key].map(x => ({ file: x.file, img_id: x.img_id })) };
            }));




        }
        else {
            console.log(err)

        }
    })
})

/*================= test ===================*/


/*=================== Contact =====================*/

/*============ get contact prefarance List ===========*/

router.get("/leads/GetContactPreferences", (req, res) => {

    db.query("SELECT id, type FROM contactpreferencetype", (err, row, fields) => {
        if (!err) {
            res.json(row);
        }
        else {
            console.log(err)

        }
    })
})

/*============ created contact from ===============*/
router.post("/inquiries/Web_ContactUs", (req, res) => {

})



module.exports = router;