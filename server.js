const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('knex')({
  client: 'pg',
  connection: {
  	connectionString: process.env.PG_CONNECTION_STRING,
    host : process.env.PG_HOST, //Localhost
    ssl: {rejectUnauthorized: false },
    port : process.env.PG_PORT,
    user : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    database : process.env.PG_DATABASE
  }
});

// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     // connectionString: process.env.PG_CONNECTION_STRING,
//     host : '127.0.0.1', //Localhost
//     // ssl: {rejectUnauthorized: false },
//     port : 5432,
//     user : 'afnan',
//     password : '',
//     database : 'ai-mind',
//   }
// });

// Grabbing our controllers:
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Testing db

// db.select('*').from('users').then(data=>console.log(data));

/* API Design

<TYPE> <ROUTE> => <Return Value>

GET / => Success!
POST /signin => Success/Failed
POST /register => new user
GET /profile/:id => user
PUT /image => updated user (for counting number of images sent)

NEW:
POST /clarifai => Sends data from Clarifai after taking in imageURL as an input
*/

const app = express();

// Middleware to let us process things
app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
	res.json('Success!');
})


app.post('/signin',(req,res) => signin.handleSignin(req,res,db,bcrypt))


app.post('/register',(req,res) => register.handleRegister(req,res,db,bcrypt)) // This is called dependency injection. We are providing the dependencies db and bcrypt so that the handler function can work.


app.get('/profile/:id',(req,res) => profile.handleGetProfile(req,res,db))

// A different and more clean way to inject dependencies.
app.put('/image',image.handleImage(db))

app.post('/clarifai',image.handleApiCall())


app.listen(3000,()=> {
	console.log('The AI-Mind-API server has started.')
})