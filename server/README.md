# Country API - Server
This project is a RESTful API that provides information about countries, including borders, flags, and population data. It uses Node.js, Express, and Sequelize as an ORM to manage the database.

## Install the required dependencies:

```bash
npm install
```

Create a .env file in the root of the project with the following variables:

.env:
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
API_URL=http://localhost:3001

Set up the database: Ensure you have a configured database and run the migrations and seeders with Sequelize:


npx sequelize db:migrate
npx sequelize db:seed:all

Start the server:

```bash
npm start
```
The server should be running on http://localhost:3001.


# Main Routes
 
 ## Countries

```bash
GET /countries
Returns a list of all countries.

GET /countries/:id
Returns details about a specific country (borders, flag, population).

```

## Technologies Used

Node.js
Express.js
Sequelize (ORM)
MySQL / PostgreSQL / SQLite (depending on configuration)
Axios (for handling HTTP requests)


## Additional Considerations

This project is compatible with multiple database management systems. 
Be sure to update the config/config.json file in Sequelize with your database details.

## License

[MIT](https://choosealicense.com/licenses/mit/)