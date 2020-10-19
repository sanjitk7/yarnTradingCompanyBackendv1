## Backend For a Yarn Trading Company Web App

An Inventory Management and Business Intelligence Web Application for a typical Small scale trading company in the textile industry.

*Node Express MongoDB Backend*

### DataModel/ER Diagram

![er](./public/img/backend-er-v2.png)

### Backend API

![api-flow](./public/img/backend-api.png)

### API Documentation

### Status Codes

1. 201 - Creation
2. 200 - Success
3. 400 - Bad Request
4. 401 - Unauthorized
5. 404 - Not Found

#### Employee Routes

1. Create Employee Account - POST */employee/create-employee*
   1. Request Body: JSON with name,email,password, isAdmin, token, age
   2. On Success: 201, {created newUser,token}
   3. On failure: 400

2. Login Employee/Admin - POST */employee/login*
   1. Request Body: JSON with email, password.
   2. On Success: 200, {userFound,token}
   3. On failure: 400

3. Read Profile - GET */employee/me*
    1. On success - 200, UserObject of user logged in
    2. On failure - 404

4. Logout One Device - POST */employee/logout*
   1.  On Success - 200
   2.  On failure - 500

5. Logout all devices - POST */employee/logout-all*
   1.  On Success - 200
   2.  On failure - 500

6. Delete User - DELETE */employee/:id*
   1. Note: - AdminAuth Required
   2. On Success - 200, deletedUser

### Products Routes

1. Create Product - POST */products*
   1. Payload/request body JSON example -
    ```{
        "pCount": 30,
        "pAvailability": true,
        "pCode": "R0004",
        "pColor": "Lemon Yellow",
        "pPriceEst": 91,
        "pQty": 100,
        "pDesc": "Purchased from Saraswathi Mills and Stock Updated on 12.12.12",
        "pPicture": *picture file*
    }
    ```
    1. pInquiries is a optional field that gets populated from the backend
    2. On Success - 200, product with pPictureURL attribute which contains corresponding picture get url
    3. On Failure - 400

2. Get All Products - GET */products/summary*, GET */products?availability=true*, GET */products?limit=2&skip=2*, GET */products?sortBy=createdAt:asc*
   1. Optional queries
      1. availability=true - returns only products with availability attribute as true
      2. limit - limits returned products to given number
      3. skip - skips given number of top results
      4. sortBy:createdAt:asc/desc - sorts returned value by ascending or descending
      5. Success - 200, list of product objects

3. View product with product code - GET */products/:code*
    1. Request Params: Product code
    2. On Success: 200, product
    3. On Failure: 500

4. Update product by code - PATCH */products/:code*

   1. Request Param: Product Code
   2. Request Body: JSON with key value pairs to be updated (Only pCount, pAvailability, pPriceEst, pDesc are updatable)
   3. On Success:200, updated product
   4. On patch failure: 500
   5. On invalid Code: 404

5. Delete Product Code - DELETE */products/:code*
   1. Request Param: Product Code
   2. On Success:200, deleted product
   3. On patch failure: 500
   4. On invalid Code: 404

6. Get picture of product - GET */products/picture/:code*
   1. Request Param: Product Code
   2. On Success:200, picture
   3. On patch failure: 400
   4. On invalid Code: 404

### Inquiries Routes

1. Inquiry Creation (Public) - POST */inquiry*
   1. Sample Payload/ req body - 
      
   ```{
    "inquirerName":"diff",
    "email":"sanjit@thepc.com",
    "phoneNumber":"9842314733",
    "organisation":"Sun Yarns and Weavers",
    "organisationAddr": {
        "lineOne":"Sample Address line 1",
        "lineTwo":"Sample Address line 2",
        "city":"Erode",
        "state":"Tamil Nadu",
        "pincode":638051
    },
    "estPurchaseSize":300,
    "productInqCode":"G0001",
    "remark":"Sample Text Lorem Ipsum Doleorem..."
}
   2. productInqId will get auto-populated based on the productInqCode
    2. Success - 201, inquiry
    3. Failure - 400

2. List all Inquiries (Admin) - GET */inquiry*
   1. Success - 200, allInquiries
   2. Failure - 500

3. Delete Inquiry (Admin) - GET */inquiry/:id*
   1. Success - 200, deletedInquiry
   2. Failure - 500

4. Product linked to given inquiry ID - GET */inquiry/:id/list-product*
   1. req.params.id - inquiry id
   2. Success - 200, product object
   3. Failure - 500

5. All Products with inquiries object - GET */inquiry/:id/list-inquires*
   1. req.params.id - inquiry id
   2. Success - 200, return list of inquiries associated with the given product ID
   3. Failure - 500

### Visualisations

1. Get number of inquiries received for each products - GET */visualisations/product-to-inquiry-count*
   1. success - 200, list of objects with product id, pCode and inquiry count. Sample res
   ```
   [{
        "x": "G0001",
        "y": 2
    },
    {
        "x": "B0002",
        "y": 3
    },
    {
        "x": "L0006",
        "y": 0
    }]
   ```
   2. failure - 500

   2. Get number of inquiries received from different regions - GET */visualisations/state-to-inquiries-bar*
      1. success - 200, list of objects with region, inquiry count. Sample res
      ```
      [{
        "x": "Tamil Nadu",
        "y": 2
         },
      {
        "x": "Karnataka",
        "y": 1
      },
      { 
        "x": "Kerala",
        "y": 1
      },
      {
        "x": "West Bengal",
        "y": 1
      }]
      ```
      2. failure - 500
   
   3. Get number of inquiries received from different regions - GET */visualisations/state-to-inquiries-pie*
      1. success - 200, list of objects with region, inquiry count. Sample res
      ```
      [{
        "label": "Tamil Nadu",
        "angle": 2
         },
      {
        "label": "Karnataka",
        "angle": 1
      },
      { 
        "label": "Kerala",
        "angle": 1
      },
      {
        "label": "West Bengal",
        "angle": 1
      }]
      ```
      2. failure - 500

   4. Get average purchase size - GET */visualisations/avg-pdt-purchase-size*
      1. success - 200, list of objects with pCode, inquiry count. Sample res
      ```
      [{
        "y": "G0001",
        "x": 200
      },
      {
        "y": "B0002",
        "x": 100
      },
      {
        "y": "L0006",
        "x": 0
      }]
      ```
      2. failure - 500

      5. Get Number of inquiries per Yarn Count Variety - GET */visualisations/count-to-inquiries*
      1. success - 200, list of objects with pCount (yarnCount i.e thickness), inquiry count. Sample res
      ```
      [{
        "x": "10",
        "y": 3
      },
      {
        "x": "18",
         "y": 2
      },
      {
        "x": "30",
        "y": 2
      }]
      ```
      2. failure - 500
      

### Deployment

Backend Server Deployed in a [Heroku Server](https://sanjit-yarn-trading-backend.herokuapp.com) and Mongo Atlas Cluster.
Find front end repository [here](https://github.com/sanjitk7/yarnTradingCompanyFrontendv1)