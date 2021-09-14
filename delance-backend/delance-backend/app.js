require("dotenv").config({ path: "./config/.env" }) 
const express = require("express") 
const indexRoute = require("./src/routes/indexRoute") 
const httpErrors=require('http-errors')
const cors=require('cors')

const app = express() 
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// NEW UPLOAD
app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json()) 
app.use(express.urlencoded({
    extended: true,
  })
) 
app.options('*', cors())

app.get('/api',(req,res)=>{
  res.send("Hello DeLance")
})

app.use(indexRoute) 

app.use((req, res, next) => {
   return next(
    httpErrors(404, 'Page Not Found')) 
    next()
}) 

port = process.env.PORT || 8000


app.listen(port, () => {
  console.log(`Server is listen on port ${port}`) 
}) 
