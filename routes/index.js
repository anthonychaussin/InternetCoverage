let express = require('express');
let router = express.Router();
let MongoClient = require("mongodb").MongoClient;


const client = new MongoClient("mongodb://localhost:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
let db = null;
client.connect(err => {
    db = client.db("IOP")
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'DS_JS'});
});
router.get('/admin', function (req, res, next) {
    db.collection("IOU").aggregate([
        {
            '$lookup': {
                'from': 'CodeInfo',
                'localField': 'Code',
                'foreignField': 'ISO3_CODE',
                'as': 'Detail'
            }
        }, {
            '$unwind': {
                'path': '$Detail',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$project': {
                'Year': 1,
                'Percent': 1,
                'Title': '$Detail.LABEL_FR'
            }
        }
    ]).toArray(function (err, documents) {
        res.render('admin', {title: "Admin", json: JSON.parse(JSON.stringify(documents))});
    })
});

router.get("/data", function (req, res) {
    var year = req.query.Year;
    db.collection("IOU").aggregate([
        {
            '$lookup': {
                'from': 'CodeInfo',
                'localField': 'Code',
                'foreignField': 'ISO3_CODE',
                'as': 'Detail'
            }
        }, {
            '$unwind': {
                'path': '$Detail',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$match': {
                'Year': year + ""
            }
        }, {
            '$project': {
                'Year': 1,
                'Percent': 1,
                'Latitude': '$Detail.Lattitude',
                'Longitude': '$Detail.Longitude',
                'Title': '$Detail.LABEL_FR'
            }
        }, {
            '$addFields': {
                'latitude': {
                    '$toDouble': '$Latitude'
                },
                'longitude': {
                    '$toDouble': '$Longitude'
                }
            }
        }, {
            '$project': {
                'Year': 1,
                'Percent': 1,
                'latitude': 1,
                'longitude': 1,
                'Title': 1
            }
        }
    ]).toArray(function (err, documents) {
        res.json(documents)
    })

})

router.get("/show", function (req, res) {
    var city = req.query.city;
    db.collection("IOU").aggregate([
        {
            '$lookup': {
                'from': 'CodeInfo',
                'localField': 'Code',
                'foreignField': 'ISO3_CODE',
                'as': 'Detail'
            }
        }, {
            '$unwind': {
                'path': '$Detail',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$match': {
                'Detail.LABEL_FR': city
            }
        }, {
            '$project': {
                'Year': 1,
                'Percent': 1
            }
        }
    ]).toArray(function (err, documents) {
        res.render('show', {title: city, json: JSON.stringify(documents)});
    })

})
router.get("/histo", function (req, res) {
    var city = req.query.city;
    db.collection("IOU").aggregate([
        {
            '$lookup': {
                'from': 'CodeInfo',
                'localField': 'Code',
                'foreignField': 'ISO3_CODE',
                'as': 'Detail'
            }
        }, {
            '$unwind': {
                'path': '$Detail',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$match': {
                'Detail.LABEL_FR': city
            }
        }, {
            '$project': {
                'Year': 1,
                'Percent': 1
            }
        }
    ]).toArray(function (err, documents) {
        res.json(documents);
    })

})
module.exports = router;
