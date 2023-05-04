const app = require('./index');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://zaid:${process.env.PASSWORD}@cluster0.hsxp0pp.mongodb.net/tasker`, {useNewUrlParser: true})
.then(()=>console.log('Connected to Atlas 🍃'));


const uri = "http://localhost:"
const port = process.env.PORT
app.listen(port, () =>{
    console.log('Server running on:', uri+port);
})