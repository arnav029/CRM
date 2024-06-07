
const express = require('express')   
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases : [{
        input : "[1,2,3,4,5]",
        output : "5"
    }]
}]

const SUBMISSION = [{

}]

app.post('/signup', (req, res) => {
  res.send('Hello World!')
  //Add logic to decode body
  //body should have email and password


  //Store email and pwd in the USERS array above (only if the user with given email doesn't exist)
  //returb back 200 status code to client
})

app.post('/login', (req, res) => {
    res.send('Hello World from route 2!')
  //Add logic to decode body
  //body should have email and password

  //Check if the user with the given email address exists in the USERS aray
  //Also ensure that the password is the same

  //If the password is the same, return back 200 status code to the client
  //Also send back token(random string)
  //If the password is not same, return back 401 status code to the client


  })


  app.get('/questions', (req, res) => {
    //Return all the questions in the QUESTIONS array
    res.send('This is the list of questions')
  })

  app.get('/submissions', (req, res) => {
    //Return the user submissions for this problem
    res.send('Here are your submissions')
  })

  app.post('/submissions', (req, res) => {
    //Let the user submit a problem, randomly accept or reject the solution
    //Store the submission in the SUBMISSION array above
    res.send('Hello World from route 2!')
  })

  //Create a route that lets the admin add a new problem
  //Ensure only admins can do that
  
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
