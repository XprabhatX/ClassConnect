const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });

    // When data collection is complete
    req.on('end', () => {
        try {
            const jsonBody = JSON.parse(body); // Parse the JSON
            const postData = JSON.stringify(jsonBody); // Send the same data received

            // Define options for the HTTPS request
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

            // Send the POST request to external server
            const forwardReq = https.request(options, (forwardRes) => {
                let data = '';

                forwardRes.on('data', (chunk) => {
                    data += chunk;
                });

                forwardRes.on('end', () => {
                    console.log('Response from external server:', data);

                    try {
                        const jsonData = JSON.parse(data);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "Data forwarded and response received", response: jsonData }));
                    } catch (err) {
                        console.error('Error parsing JSON from external server:', err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to parse external server response' }));
                    }
                });
            });

            forwardReq.on('error', (err) => {
                console.error('Error forwarding request:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to forward data to external server' }));
            });

            // Write data to forward request body
            forwardReq.write(postData);
            forwardReq.end();

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});




