# Fetosense Backend

## Overview
Fetosense is a fetal monitoring system that collects, processes, and analyzes fetal health data. This backend system serves as the core processing unit, handling data storage, device management, analytics, and integrations with external systems. All data is managed and viewed exclusively by the **Admin**.

## Features
- Device Data Processing
- MIS (Management Information System) Reports
- Test Data Storage & Aggregation
- Secure API Authentication
- MongoDB Database Integration
- Logging & Error Handling
- RESTful API Architecture
- QR Code Generation for Device Registration
- Role-Based Access Control (Admin Only)

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** API Key-based access
- **Logging:** Winston Logger
- **Cloud Services:** Firebase, Azure CosmosDB

## Installation
### Prerequisites
- Node.js (v14 or later)
- MongoDB (Cloud or Local)
- NPM or Yarn

### Setup Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourrepo/fetosense-backend.git
   cd fetosense-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up MongoDB and update **config.js**:
   ```json
   {
      "mongoUrl": "your_mongodb_url",
      "mongodbName": "fetosense-v2",
      "apiUrl": "https://backend.carenx.com:3006/api"
   }
   ```
4. Start the backend server:
   ```sh
   npm run start:server
   ```

## API Endpoints
### General Routes
- `POST /api/general/mongoInsert` - Insert data into MongoDB
- `POST /api/general/mongoFind` - Query data from MongoDB
- `POST /api/general/mongoUpdate` - Update documents
- `POST /api/general/mongoDelete` - Delete documents
- `POST /api/general/mongoAggregate` - Perform aggregation queries

### MIS Reports
- `POST /api/mis/getDevices` - Fetch device details
- `POST /api/mis/getOrganizations` - Fetch organization details
- `POST /api/mis/getDoctors` - Fetch doctor records (Data entity only)
- `POST /api/mis/getMothers` - Fetch mother records (Data entity only)
- `POST /api/mis/getTests` - Fetch test data

### Analytics
- `POST /api/analytics/admin_dashboard` - Admin dashboard analytics
- `POST /api/analytics/doctor_dashboard` - Doctor-related analytics (Viewed by Admin)

### Aggregation
- `POST /api/aggregations/aggregate_data` - Aggregate MIS data

### Search
- `POST /api/search/searchMother` - Search for mothers in the system (Data entity only)

### Registration & Device Management
- `POST /api/registration/organization` - Register a new organization
- `POST /api/registration/device` - Register a new device
- `POST /api/registration/generateQR` - Generate a QR code for device kits

### Graph Data
- `POST /api/graph/get_graph` - Retrieve graph visualization data

## Database Schema
The system uses MongoDB with flexible schemas for different data types:
- **Users (users.js)**: Stores records of Doctors, Mothers, and Admins (Admin is the only actual user)
- **Devices (devices.js)**: Registered monitoring devices
- **Tests (tests.js)**: Test records with fetal health parameters
- **Organizations (organization.js)**: Healthcare institutions using the system
- **Valid Tests (valid_tests.js)**: Pre-validated test records

## Environment Variables
Ensure the following variables are set up:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3006
JWT_SECRET=your_jwt_secret
```

## Logging
This project uses **Winston Logger** for structured logging:
- Logs are stored in the `logs/` directory.
- Separate logs for errors and debugging information.

## Security Considerations
- **API Key Authentication**: Enforced for all endpoints (`apiKeys.json`)
- **CORS Protection**: Restricted access to allowed domains
- **SSL Certificates**: Configured for HTTPS connections
- **MongoDB Security**: Uses **SCRAM-SHA-256 authentication**
- **Role-Based Access Control**: **Only Admin** has access to system data and features

## Deployment
For production deployment:
1. Set up MongoDB Atlas or Azure CosmosDB.
2. Deploy the backend to a cloud provider (AWS, GCP, Azure).
3. Use **PM2** to keep the server running:
   ```sh
   pm2 start server.js --name fetosense-backend
   ```

## Resources
- [Fetosense Database Documentation](https://drive.google.com/file/d/1G6ylZKdpmR0vgcVoCyHIzaH20zCNILW7/view?usp=drive_link)
- [Fetosense Dataflow Diagram](https://drive.google.com/file/d/1rOul_R0XncggCWzSvadeiuLMv96IOrPs/view?usp=sharing)

## Contributing
- Fork the repository.
- Create a new branch (`feature-xyz`).
- Submit a pull request for review.

## License
This project is private and does not currently use an open-source license.

## Contact
For inquiries or support, contact **sales@carenx.com**.
