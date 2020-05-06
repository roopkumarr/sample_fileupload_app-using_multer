const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
// importing fs for file retrival and deletion
const fs= require('fs');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads/file/single',express.static(path.join(__dirname, 'uploads/single')));
app.use('/uploads/file/array',express.static(path.join(__dirname, 'uploads/array')));
app.use('/uploads/file/multiple',express.static(path.join(__dirname, 'uploads/multiple')));


app.get('/',(req, res) =>{
    res.status(200).send(JSON.stringify({'message':'Api working'}));
});

// single file

let fileNameSingle;

const storageStrategySingle = multer.diskStorage({
    destination: './uploads/single/',
    filename: function (req, file, cb) {
        fileNameSingle = Date.now() + "_" + file.originalname;
        // console.log("===>", fileNameSingle);
        cb(null, fileNameSingle);
    }
});

const uploadSingle = multer({
    storage: storageStrategySingle
}).single('sample_file');

app.post('/upload_single',async(req, res)=>{
    await uploadSingle(req, res, (err) => {
        // console.log('req sent ==>', req.file);
        if(!req.file)
        {
            res.status(400).send(JSON.stringify({'message':'No File uploaded'}));
        }
        else
        {
            if(err)
            {
                res.status(400).send(JSON.stringify({'message':'File upload error'}));
            }else{
                // if you want to delete file from a specific location
                // fs.unlink(`./uploads/single/${fileNameSingle}`, function (err) {
                //     if (err) {
                //         console.log("error in deleting local images");
                //     }
                //     console.log("Post fs")
                // })
                res.status(200).send(JSON.stringify({'message':'File uploaded succesfully'}));
            }
        }
    });
});

// file array

let fileNameArray;

const storageStrategyArray = multer.diskStorage({
    destination: './uploads/array/',
    filename: function (req, file, cb) {
        fileNameArray = Date.now() + "_" + file.originalname;
        // console.log("===>", fileNameArray);
        cb(null, fileNameArray);
    }
});

const uploadArray = multer({
    storage: storageStrategyArray
}).array('sample_Array_file');

app.post('/upload_array',async (req, res)=>{
    await uploadArray(req, res, (err) => {
        // console.log('req sent ==>', req.files);
        if(req.files.length<= 0)
        {
            res.status(400).send(JSON.stringify({'message':'No Files where uploaded'}));
        }
        else
        {
            if(err)
            {
                res.status(400).send(JSON.stringify({'message':'Files upload error'}));
            }else{
                res.status(200).send(JSON.stringify({'message':'Files uploaded succesfully'}));
            }
        }
    });
});

// multiple field file

let fileNameMultiple;

const storageStrategyMultiple = multer.diskStorage({
    destination: './uploads/multiple/',
    filename: function (req, file, cb) {
        fileNameMultiple = Date.now() + "_" + file.originalname;
        // console.log("===>", fileNameMultiple);
        cb(null, fileNameMultiple);
    }
});

const uploadMultiple = multer({
    storage: storageStrategyArray
}).fields([{name:'sample_multiple_1', maxCount:1},{name:'sample_multiple_2', maxCount:1}]);

app.post('/upload_multiple', async(req, res)=>{
    await uploadMultiple(req, res, (err) => {
        const emptyobj ={}
        console.log('req sent ==>', req.files);
        // console.log('req sent len==>', Object.keys(req.files).length);
        if(Object.keys(req.files).length ==0)
        {
            res.status(400).send(JSON.stringify({'message':'No multiple File where uploaded'}));
        }
        else
        {
            if(err)
            {
                res.status(400).send(JSON.stringify({'message':'Multiple Files upload error'}));
            }else{
                res.status(200).send(JSON.stringify({'message':'Multiple Files uploaded succesfully'}));
            }
        }
    });
});

app.listen(3000,()=>{
    console.log('listening at :3000...');
});


// conditions while accepting files uploads

// const fileFilter = (req, file, cb) => {
//     // reject a file
//     console.log(file.mimetype);
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'application/octet-stream') {
//       cb(null, true);
//     } else {
//       cb(new Error('not the filetype'), false);
//     }
//   };

// const upload = multer({
//     storage: storageStrategy,
//     limits: {
//         fileSize: 1024 * 1024 * 2
//     },
//     fileFilter: fileFilter
// }).single('FileName');