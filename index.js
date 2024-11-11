import express from "express"
import bodyParser from "body-parser"
import pg from "pg"

const db = new pg.Client({
    user:"postgres",
    password:"pawar@abc",
    host:"localhost",
    port:5432,
    database:"purchasing item"
})
db.connect()

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