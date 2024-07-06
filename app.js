const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const usermodel = require("./models/usersschema");
const usermodel2 = require("./models/imgschema")
require("./db/conn");

const multer = require("multer");

// Store file in Disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      return cb(null, file.fieldname + "-" + Date.now()); // appending date with file name
    },
  });

  const upload = multer({storage:storage}).single("img");

// Define the path for static files
/*const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
// above line is not important
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.set("view engine", "ejs");

// Define the path for views
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req, res) => {
  res.render("homepage");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/imgstore", (req, res) => {
  res.render("imgstore");
});

app.get("/read", async(req, res) => {
    let users = await usermodel.find();
  res.render("viewusers" , {users : users});
});

app.get("/readimg", async(req, res) => {
    let users = await usermodel2.find();
  res.render("viewuserimgname" , {users});
});

app.get("/delete/:id", async(req, res) => {
    let user = await usermodel.findOneAndDelete({_id : req.params.id});
    res.redirect("/viewusers");

});

app.get("/update/:id", async(req, res) => { 
    let user = await usermodel.findOne({_id : req.params.id});
    res.render("update",{user});
    
});

app.post("/update/:id", async(req, res) => {
    let user = await usermodel.findOneAndUpdate({_id : req.params.id}, req.body);
    res.redirect("/viewusers");
});

app.post("/create", async (req, res) => {

  let { name, email, imgurl } = req.body;
  try {
    let usercreate = await usermodel.create({
      name,
      email,
      imgurl,
    });
    // res.send(usercreate);
    res.redirect("/");

  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/viewusers", async (req, res) => {
  try {
    const users = await usermodel.find({});
    res.render("viewusers", { users });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/viewuserimgname", async (req, res) => {
  try {
    const users = await usermodel2.find({});
    res.render("viewuserimgname", { users });
  } catch (error) {
    res.status(500).send(error);
  }
});
// Serve static files (e.g., images)
app.use('/uploads', express.static('path/to/images'));


app.post("/imgstore/upload", (req ,res)=>{
    upload(req,res,(err)=>{
        if(err)
        {
            console.log(err);
            res.render("imgstore");
        }
        else{
            const newdata = new usermodel2({
                name : req.body.name,
                img :
                { 
                    data: req.file.filename,
                    contentType : req.file.mimetype
                }
            })
             newdata.save().then(()=> {
                res.send("image uploaded successfully");
            }).catch((err) => {
                console.log(err);
            });
        }
        })

})
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});