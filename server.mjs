import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import fs from 'fs'
import admin from "firebase-admin";

const port = process.env.PORT || 5000;


const app = express();
app.use(express.json()); // parsing body


app.use(cors());

import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })


var serviceAccount = { //ye hum apna laye h storagebucket k siide pe project seting me service account generate krk

    "type": "service_account",
    "project_id": "product-and-storage-bucket",
    "private_key_id": "6d8875de1874ce6f9777d16ae3844dc16f369d15",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCULkHNWaJH5fZ+\nZa9YnqZBaq19s7ihxP2MFqUfH7bPBoY3KOdGt06i4GUPTClZxj8ATNT4JQ5mwSpr\n08NKcSfv27sYSyBTshuVvLA88V3k5fC4hr8qH1l6lMIrOoVjAP4yx7FRO+16Lq80\nf4K8lBJUitwjFYSN2GvP1WmTrOOKhkjDHMoMiOrgdU1RzL/gOuL9ah8h5PgAbIME\ng4N0Lc0q/m/n3Hqz0VomVE490nRzhQ05z+q3OQ3acOKe+BIrXmPW8Cgfx39PgW6g\n11smdyaScmyu0CpqrWHTS/1XVptehSlQY25q0sm/JgeG+graixK+AYxHQeaAy+3n\n80LeFuKlAgMBAAECggEAA9p1Fxo43F5IS+6ogek0QRi9VLq+9yP4hPNUzWuldRpC\nFL6hTwc2ygkET8LHA4DihAc7dY1/I6Br0jyCRFYPeA8SfTX86/hCe+EZgygyrSBm\no2HLqFSC3utt5jJiJBozQg5L1+UzTn1WzIpxU6aVGHI4+ceWOBsT6KZv1amGDETa\nCosG4Vhsdt6F5elAVFO+sMWRC9Y9sh5AhHme/TO3vCQLm4bBQtw8lQw3LurMes5Q\nxDV6CYFHDBQakO0yCw+teppUrM+yB3e5yVQzvddMYUSEFEA15TGodNCGinu1qn2p\nVU4rJKilV/glri3HOXS9JJTQDkLd0ID6DMMGc3MNIQKBgQDPmY89Cggvy8ij4rj3\nN8bvUXVICxT6hKl/u/n6zOrd5taCSS8I923cg6/mxkL1osY3OzOv19edlHgsJWTI\nipBKScoizJOX/4R00z+X+ZJuM3T1FT/G1DR0gQmAtKDGnjmEcPZ7lZyUQMXpwANG\nn5zZutVzYEWmFhBBbWL6cmsNBQKBgQC2uk9pbbWFhgMIE+nNAJ3byQ8eAQappfq4\nqysrBbbVTPn2ny+16kdo3P4fHqMmsy8vJGPJw+HJmK2yhvrmv+dKvc735a35sGLu\nmqKHkm5k/jswqM396HsB55Lo8Ag85L98BRdVxhwItoTSIjlwHQsy6xHdVPPnSQEQ\nXzavxU9xIQKBgGtiV0GPquRuWP7NDDh01aZ9UFlPwi5D6Rl1tr0QunzGJzeFe5r7\nwgxK4fZRn9lHtZhkOzw+Pf35CqBrR1KkujZzLOgLQl1hgrabf02xfxkZ7OnJcA/9\nPJT3Gl9FD9UtizsC47zRiwj06GsdM5SYg53skvT3W4+p4ga1+njqLo2xAoGAa5bv\nwyfxxZjOmCcBds9yI0MTP5tjDOjJ44oFdON8b8NPOsMoGHjFax0UE8a6UcMXeS54\nAwjvHQBk5cVMXimISh3Qi24VLfuJhOxP3nt9vMFkoJYEFAiaxNhRTA5pC1G03ZUx\n1DM9tnOhaQj1wOmY+nYmoqeupPP7SGSHkp8e04ECgYEAxECL36DLV/KL3DRpe3L/\nWl+GSonDNWpFnRQ08T8Owg9oMev9qytA4LmbbTQusvTNooBgDwMLhiwQtvKXzd37\nogxYsZ1GeyRRyeP2Huw/PVOgzwnsUS+jkBmexSOpxIm0yp5PahpL+SfURrX2P4pj\nRDcY4L+iQDWsmjq7bcgb7T0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-e640v@product-and-storage-bucket.iam.gserviceaccount.com",
    "client_id": "117383167136429052039",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e640v%40product-and-storage-bucket.iam.gserviceaccount.com"
}



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://product-and-storage-bucket.firebaseio.com" //apni project ki id lgo
});
const bucket = admin.storage().bucket("gs://product-and-storage-bucket.appspot.com");



let productSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    productimage: { type: String, required: true }
})

let productModel = mongoose.model("product", productSchema)





app.post('/product', upload.any(), async(req, res) => {
    console.log("product received", req.body)

    console.log("files", req.files[0])


  

    bucket.upload(
        req.files[0].path,
        {
            destination: `productPhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse ) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(async (urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        let newProduct = new productModel({
                            name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                           productimage : urlData[0]
                          })
                          try {
                            let response = await newProduct.save()
                            console.log("product added", response)
                            console.log(urlData[0])
                            res.send({
                              message: "product added",
                              data: {
                                name: req.body.name,
                                description: req.body.description,
                                price : req.body.price,
                                productimage: urlData[0]
                            }
                            })
                        
                          }
                        
                          catch (error) {
                            console.log("failed to add product" , error)
                            res.status(500).send({
                              message: "failed to add product"
                            })
                          }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });

    })


    app.get("/products", (req, res) => {
        productModel.find({}, (err, result) => {
            if (err) {
                res.send({
                    message: "error in getting all products"
                })
                console.log(err, "error in db")
                return;
            } else {
                res.send({
                    message: "got all products",
                    data: result
                })
            }
        }
    
    
    
    
    
        )
    })
    
    





    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })



    let dbURI = process.env.dbURI || 'mongodb+srv://tasmiyah:web@cluster0.cj82tmo.mongodb.net/productstorage?retryWrites=true&w=majority';
    mongoose.connect(dbURI);

    ////////////////mongodb connected disconnected events///////////////////////////////////////////////
    mongoose.connection.on('connected', function () {//connected
        console.log("Mongoose is connected");
    });

    mongoose.connection.on('disconnected', function () {//disconnected
        console.log("Mongoose is disconnected");
        process.exit(1);
    });

    mongoose.connection.on('error', function (err) {//any error
        console.log('Mongoose connection error: ', err);
        process.exit(1);
    });

    process.on('SIGINT', function () {/////this function will run jst before app is closing
        console.log("app is terminating");
        mongoose.connection.close(function () {
            console.log('Mongoose default connection closed');
            process.exit(0);
        });
    });