const request = require("supertest")
const app = require('../src/app')
const Employee = require("../src/models/employee")
const Product = require("../src/models/product")

const { userOneId:employeeOneId,userOne:employeeOne,productOne,productOneId,setupdb} = require("./fixtures/db")

beforeEach(setupdb)

test("create product", async ()=> {
    const response = await request(app)
    .post("/products")
    .set('Authorization', `Bearer ${employeeOne.tokens[0].token}`)
    .send({
        pCount: 20,
        pAvailability: true,
        pPriceEst: 63,
        pCode: "R0008",
        pColor: "Ocean Blue",
        pDesc: "Predominantly bought by bedsheets textile weavers of south Salem, Karur and Chennimalai",
        pPictureCode:1,
        pQty:100
    })
    .expect(201)

    const foundProduct = await Product.findById(response.body._id)
    expect(foundProduct).not.toBeNull()
})


// test("list all products", async ()=>{
//     const response = await request(app)
//     .get("/products/summary")
//     .set("Authorization", `Bearer ${employeeOne.tokens[0].token}`)
//     .send()
//     .expect(200)
//     expect(response.body.length).toEqual(2)

//     // console.log(response.body)
// })

// test("employee updates valid field of a product", async ()=> {
//     const response = await request(app)
//     .patch(`/products/${productOne.pCode}`)
//     .set('Authorization', `Bearer ${employeeOne.tokens[0].token}`)
//     .send({ pCount: 20 })
//     .expect(200)

// })

// test("employee updates invalid field of a product", async ()=> {
//     const response = await request(app)
//     .patch(`/products/${productOne.pCode}`)
//     .set('Authorization', `Bearer ${employeeOne.tokens[0].token}`)
//     .send({ pColor: "new change"})
//     .expect(400)

// })

// test("delete product with product id", async () => {
//     const response = await request(app)
//     .delete(`/products/${productOne.pCode}`)
//     .set("Authorization",`Bearer ${employeeOne.tokens[0].token}`)
//     .send()
//     .expect(200)

//     expect(response.body).not.toBeNull()
// })