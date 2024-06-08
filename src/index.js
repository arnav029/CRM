
const express = require('express')   
const app = express()
const port = 3000


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USERS = [{
  email: "arnav@gmail.com",
  password: "password",
  username: "",
  
}];




app.get('/', (req, res) => {
  res.send('Hey there handsome !')
})


app.post('/signup', (req, res) => {

  //Add logic to decode body
  //body should have email and password

  const {email, password} = req.body

  if(!email || !password) {
    return res.status(400).send("Email and password are missing")

  }

  const userExists = USERS.find(user => user.email  == email);

  if(userExists){
    return res.status(409).send("User already exists")
  }


  USERS.push({email, password});

  res.status(200).send("Successfull signup");




  // return res.send(email);


  //Store email and pwd in the USERS array above (only if the user with given email doesn't exist)
  //returb back 200 status code to client
})

app.post('/login', (req, res) => {
    // res.send('Hello World from route 2!')
  //Add logic to decode body
  //body should have email and password
  const {email, password} = req.body


  const user = USERS.find(user => user.email == email &&  user.password == password);



  //Check if the user with the given email address exists in the USERS aray
  //Also ensure that the password is the same

  if(!user) {
    return res.status(401).send("Invalid email or password")

  }

  const token = "dummy-token"
  //If the password is the same, return back 200 status code to the client
  res.status(200).json({message: "Login successfull", token});

  //Also send back token(random string)
  //If the password is not same, return back 401 status code to the client

  })




  
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
