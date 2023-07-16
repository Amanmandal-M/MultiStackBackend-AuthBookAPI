const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");

const app = express();
dotenv.config();

// Connection URI for MongoDB
const dbConnection = require("./configs/db");
const { userRouter } = require("./routes/user_route");
const { bookRouter } = require("./routes/book_route");
const { cartRouter } = require("./routes/cart_route");
const authMiddleware = require("./middlewares/authentication_middleware");


const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get('/',(req,res)=>{
    return res.send(`<h1 style="color:blue";text-align:center>Welcome in Books NodeJs Backend Api</h1>`).status(200)
})

app.use('/user',userRouter);
app.use(authMiddleware);
app.use('/book',bookRouter);
app.use('/cart',cartRouter);


app.listen(PORT,async()=>{
    try {
        console.log(colors.blue(`Server is Running at Port ${PORT}`));
        await dbConnection();
        console.log(colors.blue(`Connected Successfully to Database`));
    } catch (error) {
        console.error(colors.red(error.message));
    }
})