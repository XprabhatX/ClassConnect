// const http = require('http');
// const https = require('https');  // Use 'https' for Azure App Service
// const { URL } = require('url');

// const servers = [  // Array to hold your Flask server instances (use port 443 for HTTPS)
//     { host: 'flask-servers-gqazghgmg7hnbsgv.centralindia-01.azurewebsites.net', port: 443 },
//     // Add future server instances here
// ];

// let currentIndex = 0;  // To track the current server index

// // The Load balancer code
// const loadBalancer = http.createServer((req, res) => {
//     const targetServer = servers[currentIndex];
//     currentIndex = (currentIndex + 1) % servers.length;

//         // Log incoming request details
//     console.log(`Incoming request: ${req.method} ${req.url}`);
//     console.log(`Forwarding request to: ${targetServer.host}:${targetServer.port}`);

//     const options = {
//         hostname: targetServer.host,
//         port: targetServer.port,  // Port 443 for HTTPS
//         path: req.url,
//         method: req.method,
//         headers: req.headers,
//     };

//     // Use 'https.request' for HTTPS connections
//     const proxy = https.request(options, (response) => {
//         console.log(`Response received from ${targetServer.host}:`, response.statusCode, response.headers);
//         res.writeHead(response.statusCode, response.headers);
//         response.pipe(res, { end: true });
//     });

//     // req.pipe(proxy, { end: true });

//     proxy.on('error', (err) => {
//         console.error('Error:', err);
//         res.writeHead(500);
//         res.end('Server error');
//     });

//     req.pipe(proxy, { end: true }).on('error', (err) => {
//         console.error('Request pipe error:', err.message);
//         res.writeHead(500);
//         res.end('Server error');
//     });
// });

// // Start the load balancer
// const PORT = 100;  // This is the port your load balancer will listen on
// loadBalancer.listen(PORT, () => {
//     console.log(`Load balancer is running on port ${PORT}`);
// });


const https = require('https');

const url = 'https://flask-servers-gqazghgmg7hnbsgv.centralindia-01.azurewebsites.net/student_data';

// Example data you might want to send in the POST request
const postData = JSON.stringify({
    "students": [
        {
            "UID": "21-COMPB4-25",
            "roll_no": 123,
            "name": "John Doe"
        },
        {
            "UID": "21-COMPB6-25",
            "roll_no": 124,
            "name": "Jane Doe"
        }
    ]
});

// Define the options for the HTTPS request
const options = {
    hostname: 'flask-servers-gqazghgmg7hnbsgv.centralindia-01.azurewebsites.net',
    port: 443,
    path: '/student_data',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

// Send the POST request
const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Raw Response:', data);
        try {
            const jsonData = JSON.parse(data);
            console.log('Parsed JSON Response:', jsonData);
        } catch (err) {
            console.error('Error parsing JSON:', err.message);
        }
    });
});

req.on('error', (err) => {
    console.error('Error:', err.message);
});

// Write data to request body
req.write(postData);
req.end();
