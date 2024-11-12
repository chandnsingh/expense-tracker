import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import dotenv from 'dotenv';
dotenv.config()

// Import the Pool class from pg
import pkg from 'pg';
const { Pool } = pkg;

// Configure the connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Necessary for some cloud-hosted Postgres services
    },
  });

// configuring the db 
const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});
db.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch(err => console.error("Connection error", err.stack));

const app=express()
const port=3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


app.get("/", async (req , res) => {
    let price=[]
    let sum = 0;
    const result = await db.query("select * from purchasing")
    console.log(result.rows)
    result.rows.forEach(element => {
        price.push(element.price)
    });
    let actualprice = price.map(Number)
    actualprice.forEach(no =>{
        sum = sum + no
    })
    res.render("index.ejs" , { result : result.rows , price : sum})

})

app.post("/add", async (req , res)=>{
    const item = req.body.item;
    const price = req.body.price
    const result = await db.query("insert into purchasing (Items , price) values ($1 , $2)",[item , price])
    console.log(result.rows)
    res.redirect("/")
})
app.post("/clear",async (req ,res)=>{
    const clear = req.body.clear
    await db.query("truncate table purchasing")
    res.redirect("/")
})
app.post("/delete",async (req,res)=>{
    const id = req.body.id
    await db.query("delete from purchasing where id = $1",[id])
    res.redirect("/")
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})