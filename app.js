const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const post=require(__dirname+"/post.js");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html")
});

app.post("/", function(req, res){
  const firstName=req.body.first;
  const lastName=req.body.last;
  const email=req.body.email;

  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }


const jsonData=JSON.stringify(data);
const request=https.request(post.getUrl(), post.getOptions(), function(response){
  // post.js has an options object which has method=POST and auth=Username:API key and url which has list_id and last 3 digits of API key
  response.on("data", function(data){
    console.log(JSON.parse(data));
    if(response.statusCode===200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
  });
});
request.write(jsonData);
request.end();
});
app.post("/failure", function(req, res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
