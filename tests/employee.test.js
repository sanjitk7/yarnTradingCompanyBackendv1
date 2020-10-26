const request = require("supertest")
const app = require('../src/app')
const Employee = require("../src/models/employee")

const { userOneId:employeeOneId,userOne:employeeOne,userTwo:employeeTwo,setupdb} = require("./fixtures/db")

beforeEach(setupdb)

// console.log(employeeTwo)

test("create employee account", async ()=>{
    const response = await request(app).post("/employee/create-employee").send({
        name:"Test User",
        email:"Test1@example.com",
        age: 20,
        password:"Hello12344",

    }).expect(201)

    // Assert DB Update
    const foundEmployee = await Employee.findById(response.body.newUser._id)
    expect(foundEmployee).not.toBeNull()

    // Assert object values
    expect(response.body).toMatchObject({
        newUser: {
            name:"Test User",
            email:"test1@example.com"
    },
    token: foundEmployee.tokens[0].token
})
    expect(foundEmployee.password).not.toBe(employeeOne.password)
})


test("login employee", async ()=>{
    const response = await request(app).post("/employee/login").send({
        email: employeeOne.email,
        password:employeeOne.password
    }).expect(200)

    const foundEmployee = await Employee.findById(employeeOneId)
    expect(response.body.token).toBe(foundEmployee.tokens[1].token)
})

test("login employee fail with non-existent employee", async ()=>{
    await request(app).post("/employee/login").send({
        email: "emaildoesntexist@doestexistland.com",
        password:"randomstring"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app)
        .get('/employee/me')
        .set('Authorization', `Bearer ${employeeOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile for invalid token", async () => {
    const invalidToken = "hbraehbfahsbg"
    await request(app)
        .get('/employee/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send()
        .expect(401)
})

test("Should delete employee only by admin", async () => {
    await request(app)
        .delete(`/employee/${employeeOneId}`)
        .set('Authorization', `Bearer ${employeeTwo.tokens[0].token}`)
        .send()
        .expect(200)
    const foundEmployee = await Employee.findById(employeeOneId)
    expect(foundEmployee).toBeNull()
})

test("Should not delete user for invalid auth", async () => {
    const invalidToken = "hbraehbfahsbg"
    await request(app)
        .delete(`/employee/${employeeOneId}`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send()
        .expect(401)
})

