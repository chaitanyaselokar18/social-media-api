
# Social Media API 

A simple social media API built with NestJS, Prisma, and PostgreSQL. 
Supports JWT authentication, DTO validation, exception handling, pagination, user management, and posts with role-based access control.



## Setup Instructions


## 1. Clone the Repository
```bash
git clone https://github.com/chaitanyaselokar18/social-media-api.git
cd social-media-api
```

## 2. Install Dependencies
npm install


## 3. Configure Environment Variables
#### Create a .env file in the root of the project and add:
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/social_media_db?schema=public"
JWT_SECRET="your_jwt_secret_here"


## 4. Run Prisma Migrations
#### This will create the database schema:
npx prisma migrate dev --name init


## 5. Seed Superadmin
#### This will create the initial SUPERADMIN user:
npx ts-node prisma/seed.ts


## 6. Start the Server
npm run start:dev


## Postman Collection
Import the Postman collection from `docs/social-media-api.postman_collection.json` to test all endpoints.


    
    
## Features

-  Authentication (Register, Login with JWT)
-  User Management (get all users, delete user, promote/demote role)
-  Post Management (CRUD with ownership & SUPERADMIN access)
-  Role-based Authorization (USER, SUPERADMIN)
-  Input Validation (class-validator, DTOs)
-  Pagination Support (for Users & Posts)
-  Guards, Decorators, and Interceptors (Logging & Response Transformation)
-  API Testing via Postman




