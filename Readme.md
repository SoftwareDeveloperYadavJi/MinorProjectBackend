# CROWDEASE Backend

This is the backend of CROWDEASE, a food ordering platform for Parul University students. It is built using Node.js, Express, Prisma, and TypeScript.

## Features

- Student registration and login
- Shopkeeper registration and login
- Food court management
- Shop management
- Order management
- Student verification and OTP generation (Email and Phone number)
- Real time crowd detection from various food courts


## Installation

1. Clone the repository:

```bash
git clone https://github.com/SoftwareDeveloperYadavJi/MinorProjectBackend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
MAIL_HOST="your-mail-host"
MAIL_PORT="your-mail-port"
MAIL_PASSWORD="your-mail-password"
MAIL_USERNAME="your-mail-username"
MAIL_FROM="your-mail-from"
RESEND_API_KEY="your-resend-api-key"
MAIL_FROM="your-mail-from"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"

```

4. Run the server:

```bash
npm run dev
```

## Usage

### Student Registration

To register a student, make a POST request to the `/api/v1/student/register` endpoint with the following body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password",
  "phoneNumber": "1234567890"
}
```

The response will contain a token that can be used to authenticate the student.

### Student Login

To login a student, make a POST request to the `/api/v1/student/login` endpoint with the following body:

```json
{
  "email": "john.doe@example.com",
  "password": "password"
}
```

The response will contain a token that can be used to authenticate the student.

### Shopkeeper Registration

To register a shopkeeper, make a POST request to the `/api/v1/shopkeeper/register` endpoint with the following body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password",
  "phoneNumber": "1234567890"
}
```

The response will contain a token that can be used to authenticate the shopkeeper.

### Shopkeeper Login

To login a shopkeeper, make a POST request to the `/api/v1/shopkeeper/login` endpoint with the following body:

```json
{
  "email": "john.doe@example.com",
  "password": "password"
}
```

The response will contain a token that can be used to authenticate the shopkeeper.

### Food Court Management

To add a food court, make a POST request to the `/api/v1/foodcourt/add` endpoint with the following body:

```json
{
  "name": "Food Court Name",
  "location": "Food Court Location"
}
```

The response will contain the added food court.

To get all food courts, make a GET request to the `/api/v1/foodcourt` endpoint.

To remove a food court, make a DELETE request to the `/api/v1/foodcourt/:id` endpoint, where `:id` is the ID of the food court to be removed.

To get a food court by ID, make a GET request to the `/api/v1/foodcourt/:id` endpoint, where `:id` is the ID of the food court to be retrieved.

### Shop Management

To add a shop, make a POST request to the `/api/v1/shop/add` endpoint with the following body:

```json
{
  "name": "Shop Name",
  "description": "Shop Description",
  "foodCourtId": "Food Court ID",
  "shopKeeperId": "Shopkeeper ID",
  "gstNumber": "GST Number",
  "license": "License",
  "contactEmail": "Contact Email",
  "contactPhone": "Contact Phone",
  "operatingHours": [
    {
      "dayOfWeek": 1,
      "openTime": "12:00:00",
      "closeTime": "17:00:00",
      "isOpen": true
    },
    {
      "dayOfWeek": 2,
      "openTime": "12:00:00",
      "closeTime": "17:00:00",
      "isOpen": true
    },
    {
      "dayOfWeek": 3,
      "openTime": "12:00:00",
      "closeTime": "17:00:00",
      "isOpen": true
    }
  ]
}
```

The response will contain the added shop.   

To add a menu item to a shop, make a POST request to the `/api/v1/shop/addmenu/:id` endpoint, where `:id` is the ID of the shop to which the menu item is to be added. The request body should contain the following fields:

```json
{
  "name": "Menu Item Name",
  "description": "Menu Item Description",
  "price": "Menu Item Price",
  "preparationTime": "Menu Item Preparation Time",
  "isAvailable": true,
  "image": "Menu Item Image",
  "categoryId": "Category ID"
}
```

The response will contain the added menu item.

To get all menus of a shop, make a GET request to the `/api/v1/shop/getmenus/:id` endpoint, where `:id` is the ID of the shop to which the menu items are to be retrieved.

To create a category for a shop, make a POST request to the `/api/v1/shop/createcategory/:id` endpoint, where `:id` is the ID of the shop to which the category is to be created. The request body should contain the following fields:

```json
{
  "name": "Category Name",
  "description": "Category Description"
}
```

The response will contain the created category. To get all categories of a shop, make a GET request to the `/api/v1/shop/getcategories/:id` endpoint, where `:id` is the ID of the shop to which the categories are to be retrieved.

### Student Verification

To verify a student, make a POST request to the `/api/v1/student/verfify` endpoint with the following body:

```json
{
  "id": "Student ID",
  "otp": "OTP"
}
```

The response will contain a message indicating whether the verification was successful or not.

### Student OTP Generation

To generate an OTP for a student, make a POST request to the `/api/v1/student/dectectDensity` endpoint with the following body:

```json
{
  "id": "Student ID"
}
```

The response will contain an OTP.

### Email Verification

To verify an email address, make a POST request to the `/api/v1/student/verfify` endpoint with the following body:

```json
{
  "id": "Email Address",
  "otp": "OTP"
}
```

The response will contain a message indicating whether the verification was successful or not.

### Email OTP Generation

To generate an OTP for an email address, make a POST request to the `/api/v1/student/dectectDensity` endpoint with the following body:

```json
{
  "id": "Email Address"
}
```

The response will contain an OTP.

### Email Verification

To verify a phone number, make a POST request to the `/api/v1/student/verfify` endpoint with the following body:

```json
{
  "id": "Phone Number",
  "otp": "OTP"
}
```

The response will contain a message indicating whether the verification was successful or not.


### Create Order

To create an order, make a POST request to the `/api/v1/student/placeorder` endpoint with the following body:

```json
{
  "studentId": "Student ID",
  "shopId": "Shop ID",
  "totalAmount": "Total Amount",
  "paymentMethod": "Payment Method",
  "items": [
    {
      "menuItemId": "Menu Item ID",
      "quantity": "Quantity",
      "price": "Price"
    }
  ]
}
```

The response will contain the created order.

### Get All Pending Orders For A Shop

To get all pending orders, make a GET request to the `/api/v1/shop/getallpendingorders/:id` endpoint, where `:id` is the ID of the shop to which the orders are to be retrieved.

The response will contain the list of pending orders.

```json
{
  "data": [
    {
      "id": "Order ID",
      "shopId": "Shop ID",
      "orderNumber": "Order Number",
      "studentId": "Student ID",
      "status": "Status",
      "totalAmount": "Total Amount",
      "paymentStatus": "Payment Status",
      "paymentMethod": "Payment Method",
      "preparationTime": "Preparation Time",
      "createdAt": "Created At",
      "updatedAt": "Updated At",
      "feedback": "Feedback",
      "shop": "Shop",
      "student": "Student",
      "items": [
        {
          "id": "Item ID",
          "orderId": "Order ID",
          "menuItemId": "Menu Item ID",
          "quantity": "Quantity",
          "price": "Price",
          "notes": "Notes",
          "menuItem": "Menu Item",
          "order": "Order"
        }
      ]
    }
  ]
}
```


### Get All Pending Orders For A Food Court

To get all pending orders for a food court, make a GET request to the `/api/v1/foodcourt/pendingorders/:id` endpoint, where `:id` is the ID of the food court to which the orders are to be retrieved.

The response will contain the list of pending orders.

```json
{
  "pendingOrders": 0
}
```


### Update Order Status

To update the status of an order, make a PUT request to the `/api/v1/shop/updateorderstatus/:id` endpoint, where `:id` is the ID of the order to be updated.

The request body should contain the following fields:

```json
{
  "status": "Current Status"
}

//This are the enum values for status
// PENDING
// CONFIRMED
// PREPARING
// READY
// COMPLETED
// CANCELLED
```

The response will contain the updated order.

```json
{
  "message": "Order status updated successfully",
  "data": {
    "id": "Order ID",
    "shopId": "Shop ID",
    "orderNumber": "Order Number",
    "studentId": "Student ID",
    "status": "Status",
    "totalAmount": "Total Amount",
    "paymentStatus": "Payment Status",
    "paymentMethod": "Payment Method",
    "preparationTime": "Preparation Time",
    "createdAt": "Created At",
    "updatedAt": "Updated At",
    "feedback": "Feedback",
    "shop": "Shop",
    "student": "Student",
    "items": [
      {
        "id": "Item ID",
        "orderId": "Order ID",
        "menuItemId": "Menu Item ID",
        "quantity": "Quantity",
        "price": "Price",
        "notes": "Notes",
        "menuItem": "Menu Item",
        "order": "Order"
      }
    ]
  }
}
```




