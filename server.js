const express = require('express');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 4000;

// Create DynamoDB client using AWS SDK v3
const ddbClient = new DynamoDBClient({
    region: 'us-east-1', // e.g., 'us-east-1'
    credentials: {
        accessKeyId: 'access key id', // Replace with your AWS access key
        secretAccessKey: 'secret access key' // Replace with your AWS secret key
    }
});

const tableName = 'employee_data'; // Replace with your DynamoDB table name

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log(req.body); // Log the received data

    const newEmployeeData = {
        empId: { S: req.body.empId },
        firstName: { S: req.body.firstName },
        lastName: { S: req.body.lastName },
        dob: { S: req.body.dob }, // Date format as string
        gender: { S: req.body.gender },
        aadhar: { S: req.body.aadhar },
        mail: { S: req.body.mail },
        designation: { S: req.body.designation },
        dateJoin: { S: req.body.dateJoin }, // Date format as string
        department: { S: req.body.department },
        qualification: { S: req.body.qualification }
    };

    const params = {
        TableName: tableName,
        Item: newEmployeeData
    };

    try {
        // Use PutItemCommand to insert data into DynamoDB
        const command = new PutItemCommand(params);
        const result = await ddbClient.send(command);
        console.log('Data saved to DynamoDB:', result);
        res.send('Data saved successfully!');
    } catch (err) {
        console.error('Error saving data to DynamoDB:', err);
        res.status(400).send('Error saving data: ' + err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
