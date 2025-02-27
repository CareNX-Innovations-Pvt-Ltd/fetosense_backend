Fetosense Backend
Overview
Fetosense is a fetal monitoring system that collects, processes, and analyzes fetal health data. This backend system serves as the core processing unit, handling user data, device management, analytics, and integrations with external systems.
Features
•	User Management (Doctors, Mothers, Organizations)
•	Device Data Processing
•	MIS (Management Information System) Reports
•	Test Data Storage & Aggregation
•	Secure API Authentication
•	MongoDB Database Integration
•	Logging & Error Handling
•	RESTful API Architecture
•	QR Code Generation for Device Registration
•	Role-Based Access Control
Tech Stack
•	Backend: Node.js, Express.js
•	Database: MongoDB (Mongoose ODM)
•	Authentication: API Key-based access
•	Logging: Winston Logger
•	Cloud Services: Firebase, Azure CosmosDB
Installation
Prerequisites
•	Node.js (v14 or later)
•	MongoDB (Cloud or Local)
•	NPM or Yarn
Setup Steps
1.	Clone the repository: 
2.	git clone https://github.com/yourrepo/fetosense-backend.git
3.	cd fetosense-backend
4.	Install dependencies: 
5.	npm install
6.	Set up MongoDB and update config.js: 
7.	{
8.	   "mongoUrl": "your_mongodb_url",
9.	   "mongodbName": "fetosense-v2",
10.	   "apiUrl": "https://backend.carenx.com:3006/api"
11.	}
12.	Start the backend server: 
13.	npm run start:server
API Endpoints
General Routes
•	POST /api/general/mongoInsert - Insert data into MongoDB
•	POST /api/general/mongoFind - Query data from MongoDB
•	POST /api/general/mongoUpdate - Update documents
•	POST /api/general/mongoDelete - Delete documents
MIS Reports
•	POST /api/mis/getDevices - Fetch device details
•	POST /api/mis/getOrganizations - Fetch organization details
•	POST /api/mis/getDoctors - Fetch doctor records
•	POST /api/mis/getMothers - Fetch mother records
•	POST /api/mis/getTests - Fetch test data
Analytics
•	POST /api/analytics/admin_dashboard - Admin dashboard analytics
•	POST /api/analytics/doctor_dashboard - Doctor dashboard analytics
Aggregation
•	POST /api/aggregations/aggregate_data - Aggregate MIS data
Search
•	POST /api/search/searchMother - Search for mothers in the system
Registration & Device Management
•	POST /api/registration/organization - Register a new organization
•	POST /api/registration/device - Register a new device
•	POST /api/registration/generateQR - Generate a QR code for device kits
Graph & Data Visualization
•	POST /api/graph/get_graph - Fetch graph data for analytics
Reports
•	POST /api/reports/generate - Generate detailed system reports
Operations
•	POST /api/operations/syncData - Synchronize data across connected devices
•	POST /api/operations/checkStatus - Monitor device and server health
Database Schema
The system uses MongoDB with flexible schemas for different data types:
•	Users (users.js): Doctors, Mothers, and Admins
•	Devices (devices.js): Registered monitoring devices
•	Tests (tests.js): Test records with fetal health parameters
•	Organizations (organization.js): Healthcare institutions using the system
•	Valid Tests (valid_tests.js): Pre-validated test records
•	Notifications (notifications.js): Stores alerts & notifications
•	Audio (audio.js): Stores audio recordings associated with fetal tests
Environment Variables
Ensure the following variables are set up:
MONGO_URI=your_mongodb_connection_string
PORT=3006
JWT_SECRET=your_jwt_secret
Logging
This project uses Winston Logger for structured logging:
•	Logs are stored in the logs/ directory.
•	Separate logs for errors and debugging information.
Security Considerations
•	API Key Authentication: Enforced for all endpoints (apiKeys.json)
•	CORS Protection: Restricted access to allowed domains
•	SSL Certificates: Configured for HTTPS connections
•	MongoDB Security: Uses SCRAM-SHA-256 authentication
•	Role-Based Access Control: Ensures different user roles (Admin, Doctor, etc.) have appropriate permissions
Deployment
For production deployment:
1.	Set up MongoDB Atlas or Azure CosmosDB.
2.	Deploy the backend to a cloud provider (AWS, GCP, Azure).
3.	Use PM2 to keep the server running: 
4.	pm2 start server.js --name fetosense-backend
Contributing
•	Fork the repository.
•	Create a new branch (feature-xyz).
•	Submit a pull request for review.
License
This project is licensed under the MIT License.
Contact
For inquiries or support, contact support@fetosense.com.

