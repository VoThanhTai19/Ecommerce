const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = 4000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dotenv.config();

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const blogCatRouter = require('./routes/blogCatRoutes')
const brandRouter = require('./routes/brandRoutes')
const couponRouter = require('./routes/couponRoutes')
const colorRouter = require('./routes/colorRoutes')
const enqRouter = require('./routes/enqRoutes')

const { notFound, errorHandler } = require('./middleware/errorHandle');

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog-category', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRouter)
app.use('/api/enquiry', enqRouter)

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
