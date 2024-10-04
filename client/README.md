# Country API - Client

This part of the project uses Next.js to create a front-end interface that consumes the Country API and displays information to the user, including charts visualizing population data.

# Installation

Install the required dependencies:

```bash
npm install
Create a .env file in the root of the project with the following variable:
```

create a .env file that contain: 
```bash
API_URL=http://localhost:3001
```

# Start the development server:

```bash
npm run dev
```
## The client should be running on http://localhost:3000.

# Main Features

```bash
Displays a list of countries fetched from the API.

Provides detailed information about a selected country, including:

Borders with other countries

Population data displayed in a chart

Country flag and code

Technologies Used

Next.js

React

Axios (for fetching data from the API)

Chart.js (for visualizing population data)

Tailwind CSS (optional: for styling)
```

## Usage
After starting both the server and client, navigate to http://localhost:3000 to view the application.

## Browse the list of countries on the homepage.
Click on any country to view detailed information, including population charts and border countries.

Use the navigation to return to the country list or explore other countries.

## License

[MIT](https://choosealicense.com/licenses/mit/)