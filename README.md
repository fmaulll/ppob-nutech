# Assignment API Programmer 

This API deployed on [render.com](https://choosealicense.com/licenses/mit/). It may takes awhile for the first request to come up, because the free plan on render.com makes the instance to go to sleep mode after 15 minutes of idle.

## Project URL

[https://ppob-nutech.onrender.com](https://ppob-nutech.onrender.com)

##  Database Design (DDL)

[/db/schema.sql](https://github.com/fmaulll/ppob-nutech/blob/main/db/schema.sql)

## API Documentation

### 🔑 Authentication
```
🟢 Register

POST /registration

🟢 Login

POST /login
```

### 👤 Profile
```
🟢 Get Profile

GET /profile

🟢 Update Profile

PUT /profile/update

🟢 Upload Profile Image

PUT /profile/image
```

### 🏙️ Banners
```
🟢 Get Banners

GET /banner
```

### 💼 Services
```
🟢 Get Services

GET /services
```

### 💰 Balance
```
🟢 Get Balance

GET /balance
```

### 💳 Top Up
```
🟢 Top Up Balance

POST /topup
```

### 🧾 Transactions
```
🟢 Create Payment Transaction

POST /transaction

🟢 Get Transaction History

GET /transaction/history?limit=5&offset=0
```
## Postman Collection JSON
You can copy everything below and save it as
Nutech_PPOB_API.postman_collection.json,
then import it into Postman ```(File → Import → File)```.
```
{
  "info": {
    "name": "Nutech PPOB API (Local)",
    "description": "Postman collection for testing all endpoints of the Nutech PPOB assignment API (local Express + PostgreSQL backend).",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_postman_id": "f47bda41-91f0-4d20-8f9c-bc63ab5823cb"
  },
  "item": [
    {
      "name": "1️⃣ Registration",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@nutech-integrasi.com\",\n  \"first_name\": \"User\",\n  \"last_name\": \"Nutech\",\n  \"password\": \"abcdef1234\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/registration",
          "host": ["{{base_url}}"],
          "path": ["registration"]
        }
      },
      "response": []
    },
    {
      "name": "2️⃣ Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "const json = pm.response.json();",
              "if (json.data && json.data.token) {",
              "  pm.environment.set('token', json.data.token);",
              "  console.log('✅ JWT token saved to environment.');",
              "} else {",
              "  console.log('❌ No token found in response.');",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@nutech-integrasi.com\",\n  \"password\": \"abcdef1234\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/login",
          "host": ["{{base_url}}"],
          "path": ["login"]
        }
      },
      "response": []
    },
    {
      "name": "3️⃣ Get Profile",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": {
          "raw": "{{base_url}}/profile",
          "host": ["{{base_url}}"],
          "path": ["profile"]
        }
      },
      "response": []
    },
    {
      "name": "4️⃣ Update Profile",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"first_name\": \"User Edited\",\n  \"last_name\": \"Nutech Edited\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/profile/update",
          "host": ["{{base_url}}"],
          "path": ["profile", "update"]
        }
      },
      "response": []
    },
    {
      "name": "5️⃣ Upload Profile Image",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "file", "type": "file", "src": "" }
          ]
        },
        "url": {
          "raw": "{{base_url}}/profile/image",
          "host": ["{{base_url}}"],
          "path": ["profile", "image"]
        }
      },
      "response": []
    },
    {
      "name": "6️⃣ Get Banners",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/banner",
          "host": ["{{base_url}}"],
          "path": ["banner"]
        }
      },
      "response": []
    },
    {
      "name": "7️⃣ Get Services",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": {
          "raw": "{{base_url}}/services",
          "host": ["{{base_url}}"],
          "path": ["services"]
        }
      },
      "response": []
    },
    {
      "name": "8️⃣ Get Balance",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": {
          "raw": "{{base_url}}/balance",
          "host": ["{{base_url}}"],
          "path": ["balance"]
        }
      },
      "response": []
    },
    {
      "name": "9️⃣ Top Up",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"top_up_amount\": 100000\n}"
        },
        "url": {
          "raw": "{{base_url}}/topup",
          "host": ["{{base_url}}"],
          "path": ["topup"]
        }
      },
      "response": []
    },
    {
      "name": "🔟 Transaction (Payment)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"service_code\": \"PULSA\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/transaction",
          "host": ["{{base_url}}"],
          "path": ["transaction"]
        }
      },
      "response": []
    },
    {
      "name": "1️⃣1️⃣ Transaction History",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": {
          "raw": "{{base_url}}/transaction/history?limit=5&offset=0",
          "host": ["{{base_url}}"],
          "path": ["transaction", "history"],
          "query": [
            { "key": "limit", "value": "5" },
            { "key": "offset", "value": "0" }
          ]
        }
      },
      "response": []
    }
  ],
  "variable": [
    { "key": "base_url", "value": "http://localhost:5000" },
    { "key": "token", "value": "" }
  ]
}

```
