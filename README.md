# School Management API

A comprehensive Node.js REST API for managing school data with geolocation features, built with Express.js and MySQL. This API allows you to add schools with their location coordinates and retrieve them sorted by proximity to any given location.

## 🚀 Features

- **Add Schools**: Register new schools with complete location data
- **Proximity Search**: List schools sorted by distance from user's location
- **Geolocation Support**: Built-in distance calculation using Haversine formula
- **Input Validation**: Comprehensive request validation and error handling
- **RESTful Design**: Clean and intuitive API endpoints
- **Environment Configuration**: Secure configuration management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MySQL** (v5.7 or higher)
- **Git** (for cloning the repository)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/piyusdev2006/school-management-api.git
```

```bash
cd school-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a MySQL database and table:

```sql
CREATE DATABASE school_management;

USE school_management;

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=school_management

# Server Configuration
PORT=3000
```

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```


### 🏫 Add School

Add a new school to the database with location coordinates.

- **Endpoint**: `POST /addSchool`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "name": "Springfield Elementary School",
  "address": "123 Education Street, Springfield, IL 62701",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```

#### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | School name (max 255 characters) |
| `address` | string | Yes | Complete school address |
| `latitude` | number | Yes | Latitude coordinate (-90 to 90) |
| `longitude` | number | Yes | Longitude coordinate (-180 to 180) |

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "schoolId": 1,
    "name": "Springfield Elementary School",
    "address": "123 Education Street, Springfield, IL 62701",
    "latitude": 39.7817,
    "longitude": -89.6501,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid input data
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "latitude",
      "message": "Latitude must be between -90 and 90"
    }
  ]
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to add school"
}
```

---

### 📍 List Schools by Proximity

Retrieve all schools sorted by distance from the specified location.

- **Endpoint**: `GET /listSchools`

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `latitude` | number | Yes | User's latitude coordinate (-90 to 90) |
| `longitude` | number | Yes | User's longitude coordinate (-180 to 180) |
| `limit` | number | No | Maximum number of schools to return (default: 50) |
| `radius` | number | No | Maximum distance in kilometers (default: unlimited) |

#### Example Request

```
GET /listSchools?latitude=39.7817&longitude=-89.6501&limit=10&radius=50
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "userLocation": {
      "latitude": 39.7817,
      "longitude": -89.6501
    },
    "totalSchools": 3,
    "schools": [
      {
        "id": 1,
        "name": "Springfield Elementary School",
        "address": "123 Education Street, Springfield, IL 62701",
        "latitude": 39.7817,
        "longitude": -89.6501,
        "distance": 0.0,
        "distanceUnit": "km"
      },
      {
        "id": 2,
        "name": "Lincoln Middle School",
        "address": "456 Learning Ave, Springfield, IL 62702",
        "latitude": 39.7901,
        "longitude": -89.6440,
        "distance": 1.2,
        "distanceUnit": "km"
      },
      {
        "id": 3,
        "name": "Washington High School",
        "address": "789 Knowledge Blvd, Springfield, IL 62703",
        "latitude": 39.7750,
        "longitude": -89.6580,
        "distance": 2.1,
        "distanceUnit": "km"
      }
    ]
  }
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid parameters
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Latitude and longitude are required"
}
```

**404 Not Found** - No schools found
```json
{
  "success": false,
  "error": "No schools found",
  "message": "No schools found within the specified criteria"
}
```


```



#### List Schools
```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

## 📁 Project Structure

```
school-management-api/
├── src/
│   ├── controllers/
│   │   └── schoolController.js
│   ├── models/
│   │   └── schoolModel.js
│   ├── routes/
│   │   └── schoolRoutes.js
│   ├── middleware/
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   └── utils/
│       └── distanceCalculator.js
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_USER` | MySQL username | - | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | school_management | Yes |
| `PORT` | Server port | 3000 | No |

### Database Configuration

The application uses MySQL with connection pooling for optimal performance. Connection settings can be adjusted in `src/config/database.js`.


## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

3. **Invalid Coordinates**
   - Latitude must be between -90 and 90
   - Longitude must be between -180 and 180


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 👥 Authors

- **Naveen Singh** - *Initial work* - [piyusdev2006](https://github.com/piyusdev2006)






