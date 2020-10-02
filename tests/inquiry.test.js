const request = require("supertest")
const app = require('../src/app')
const Employee = require("../src/models/employee")
const Inquiry = require("../src/models/inquiry")

const { userOneId:employeeOneId,userOne:employeeOne,inquiryOne,setupdb} = require("./fixtures/db")

beforeEach(setupdb)

test("create inquiry", async ()=> {
    const response = await request(app)
    .post("/inquiry")
    .send({
        inquirerName:"Sanjit",
        email:"sanjit@thepc.com",
        phoneNumber:"9842314733",
        organisation:"Sun Yarns and Weavers",
        organisationAddr: "sample address",
        estPuchaseSize:300,
        remark:"Sample Text Lorem Ipsum Doleorem..."
    })
    .expect(201)

    const foundInquiry = await Inquiry.findById(response.body._id)
    expect(foundInquiry).not.toBeNull()
})