#  File Uploader App

## Overview 📖
This web application is built using a modern tech stack, including **Node.js** and **Express** for backend development, with **PostgreSQL** for database management. It follows the **MVC architecture** for organized code and uses **EJS** for dynamic page rendering. User authentication is secure, utilizing **BcryptJS** for password hashing, **Passport.js** for login, and Express-session for session management. The front-end is designed with **CSS** and **Bootstrap**, ensuring a *responsive* and smooth user experience across all devices. Input validation is handled by **Express Validator**, and the app is deployed on **Render** for easy access.


## Technologies 💻
| Field | Languages |
|------:|-----------|
|     Web Development | HTML|
|     Styling | CSS    |
|     Front-End | JavaScript    |
|     Templating Engine | EJS    |
|   UI Framework | Bootstrap    |
|   Back-End | Node JS   |
|   Back-End Framework | Express   |
|   Authentication | Passport   |
|   Session Management | Express-session   |
|   Security | BscryptJs  |
|   Configuration | Dotenv   |
|   Database | PostgreSQL   |
|   Database | Prisma ORM   |
|   Storage | Cloudinary   |

## Features 💡
- **Back-End**: Utilizes Node.js for server-side operations, with Express for simplifying routing and middleware management. Sensitive information and keys are securely stored using dotenv.
- **DataBase**: Integration with PostgreSQL ensures reliable and scalable data storage
- **Architecture**: Follows the MVC (Model-View-Controller) design pattern for a clean, maintainable, and modular code structure.
- **Templating Engine**:  EJS is used to dynamically render views, allowing efficient presentation of data on the front-end.
- **Database Framework**:  Prisma ORM management with PostgreSQL databse.

#### **Authentication**:
- **BcryptJS** is employed to hash and salt user passwords, ensuring secure storage.
- **Passport.js** provides seamless authentication, enabling users to log in and maintain session persistence.
- **Express-session** is used for managing sessions and ensuring users stay authenticated across pages.

  
#### **Frontend & Design**:
- The app is designed with **CSS** and **Bootstrap**, using components like forms, sidebar, and cards.
- Icons are sourced from **Bootstrap Icons** and images are sourced from [Unsplash](https://unsplash.com/), while product images are managed via [Cloudinary](https://cloudinary.com/?utm_campaign=1329&utm_content=instapagelogocta-selfservetest) for efficient loading and storage.
- User's uploaded files is saved on cloudinary as well on local server. Set up cloudinary config.
- The app is fully **responsive**, optimized for desktop, tablet, and mobile devices, ensuring a smooth and intuitive user experience on any screen size.
- **Validation**: Express Validator is utilized for input validation, ensuring clean, user-friendly forms with Bootstrap styling.
- **Frontend Dynamics**: JavaScript is employed to handle dynamic changes on the front-end, enhancing user interaction.
- **Deployment**: The app is hosted on [Render](https://render.com/), providing a reliable and easily accessible live version of the site.

  

## Installation ⚙
To run this app locally:
1. Clone the Repisotory:
```
git clone git@github.com:mimisha25/folder-management-top.git
```
2. Open the project folder
```
cd folder-management-top
```
3. Initialize npm:
```
npm init -y
```
4. Install packages via npm:
```
npm install bcryptjs dotenv ejs express express-session method-override passport passport-local uuid @prisma/client cloudinary
npm install --save-dev prisma
```
5. Set up your Database:
  - *Option 1*: Create PostgreSQL database locally in your machine. Update config the .env file with your database connection details:
  ```
  DB_HOST: "localhost", // or wherever the db is hosted
  DB_USER: "role_name",
  DB_DATABASE: "name",
  DB_PASSWORD: "role_password",
  DB_PORT: 5432 // The default port

  DBE_URL="postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_DATABASE"
``` 
  - *Option 2*: Create PostgreSQL database with any online database storing websites ([Railway](https://railway.com/), [Koyeb](https://www.koyeb.com/), [Aiven](https://aiven.io/) and etc. )
```
DB_URL=your_postgresql_connection_string
```
6. Setup openning the browser config in package.json
```
"scripts":{
.....,
"dev": "node --watch scr/app.js",
}
```
7. Initialize Prisma ORM:
```
npx prisma init 
```
8. Migrate models to database script:
```
npx prisma migrate dev   (name the project)
```
9. Generate prisma client:
```
npx prisma generate
```
10. Determine session with your information in .env file:
```
SESSION_SECRET='secret'
PORT=8080

CLOUDINARY_NAME='name'
CLOUDINARY_API_KEY='key'
CLOUDINARY_API_SECRET='secret'
```
11. Start the application:
- The application run on port 8080 by default. Please, specify your port in .env file DB_PORT=custom port:
- Then run the application:
```
npm run dev
```

## Deployment ✅
The application is deployed on Render. 
Please, visit the live website here: [Live Application](link)


## License ©
The project is licensed under MIT License.
