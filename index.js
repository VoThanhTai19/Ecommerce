const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dotenv.config();

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute')
const { notFound, errorHandler } = require('./middleware/errorHandle');

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.use(notFound);
app.use(errorHandler) 

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to DB!!!!!!!');
})
.catch((e) => {
    console.log("Something went wrong", e)
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})
