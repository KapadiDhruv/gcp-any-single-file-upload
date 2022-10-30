const express = require('express');
const path = require('path');
const cors = require('cors');
const Multer = require('multer');
const bodyParser = require('body-parser');

const {Storage} = require('@google-cloud/storage');

// Creates a client
let projectId = "woven-backbone-361507"; // Get this from Google Cloud
let keyFilename = __dirname + "/woven-backbone-361507-5f6cc7df9ada.json"; // Get this from Google Cloud -> Credentials -> Service Accounts

const storage = new Storage({
    projectId,
    keyFilename,
  });
  
const bucket = storage.bucket('homies-buket')

const PATH = './public/';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 15 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
  });


app.get('/', function(req, res){
    res.json({
        json: "json"
    });
})

// You can also use multer.array('data', numberofFiles)
app.post('/', multer.any(), function(req, res) {

    try {
    if (req.files) {
      console.log("File found, trying to upload...");

      req.files.forEach((fil) => {
        const blob = bucket.file( "dhruv/" + fil.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', () => {
            res.json("Done")
            return
        })
        blobStream.end(req.files.buffer);
    });

    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }

    
});

app.post("/create-folder", (req,res) => {
    try {
        let projectId = "woven-backbone-361507"; // Get this from Google Cloud
        let keyFilename = __dirname + "/woven-backbone-361507-5f6cc7df9ada.json"; // Get this from Google Cloud -> Credentials -> Service Accounts

        const storage = new Storage({
            projectId,
            keyFilename,
        });
  
        const bucket = storage.bucket('homies-buket')
        const blob = bucket.file( "dhruv/" + req.body.name);
        blob.upload_from_string('')


    } catch (error) {
        res.json(error)
    }
})

app.get("/link", (req,res) => {
    let projectId = "woven-backbone-361507"; // Get this from Google Cloud
    let keyFilename = __dirname + "/woven-backbone-361507-5f6cc7df9ada.json"; // Get this from Google Cloud -> Credentials -> Service Accounts

    const storage = new Storage({
        projectId,
        keyFilename,
    });

var bucketName = 'dhruv/test'; 
var fileName = '7090824591.pdf';
  
// Create a reference to the file to generate link
var fileRef = storage.bucket(bucketName).file(fileName);
  
fileRef.exists().then(function(data) {
  console.log("File in database exists ");
});
  
const config = {
  action: 'read',
  
  // A timestamp when this link will expire
  expires: '01-01-2023',
};
  
// Get the link to that file
fileRef.getSignedUrl(config, function(err, url) {
  if (err) {
    console.error(err);
    return;
  }
    
  // The file is now available to
  // read from this URL
  console.log("Url is : " + url);
});

})

app.listen(3000, function () {
    console.log("Working on port 3000");
});


