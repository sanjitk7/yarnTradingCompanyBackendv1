require("./db/mongo")

const express = require("express")
const hbs = require("hbs")
const path = require("path")

const employeeRouter = require("./routes/employee.js")
const productsRouter = require("./routes/product.js")
const inquiryRouter = require("./routes/inquiry.js")

const app = express()
const port = process.env.PORT || 3000


// For templates - Testing
const publicPath = path.join(__dirname, "../public")
const viewPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

app.use(express.static(publicPath))
app.set("view engine", "hbs")
app.set("views", viewPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use("/employee",employeeRouter)
app.use("/products",productsRouter)
app.use("/inquiry",inquiryRouter)



app.listen(port, ()=>{
    console.log("Listening on "+port)
})