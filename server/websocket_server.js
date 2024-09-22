const WebSocket = require('ws');                                           // Importing the WebSocket library

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server(PORT, () => {                   // Creating a WebSocket server on port 8080
    console.log('WebSocket server started on ws://localhost:8080');
});

const students = new Map();                                                //Map to store the student mapping with teachers


wss.on('connection', (ws) => {                                             // Listening for incoming connections
    console.log('Client connected');

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.user === 'student') {                             // If user is studnet
            const t_id = parsedMessage.t_id;
            if (!students.has(t_id)) {
                students.set(t_id, new Set());                              //using set to avoid adjusting(shifting) the elements in array after removal
            }
            students.get(t_id).add(ws);                                     // Adding the WebSocket connection to the t_id set
            ws.t_id = t_id;                                                 //associating t_id so we dont have to iterate to all the connections stored in student() map to find the t_id
            ws.user='student'
            console.log(`Student stored with t_id: ${t_id}`);
            console.log(students);
        } else if (parsedMessage.user === 'teacher') {
            ws.user='teacher';
            const t_id = parsedMessage.t_id;
            if (students.has(t_id)) {                                       // If there are students connected to this t_id, send a "Hello" message to each student
                const connections = students.get(t_id);
                connections.forEach(studentWs => {
                    if (studentWs.readyState === WebSocket.OPEN) {
                        studentWs.send(JSON.stringify({ message: 'Hello from your teacher' }));
                    }
                });
                console.log(`Hello message sent to all students of t_id: ${t_id}`);
            } else {
                console.log(`No students connected for t_id: ${t_id}`);
            }
        }

        ws.send(JSON.stringify({ status: 'success', message: 'Data received and processed' }));
    });

    ws.on('close', () => {                                                 
        console.log('Client disconnected');
        if(ws.user=='student')
        {
            const t_id = ws.t_id;                                              // Accessing the t_id directly from the WebSocket
            if (t_id && students.has(t_id)) {
                const connections = students.get(t_id);
                connections.delete(ws);                                        // Removing the connection from the Set
                console.log(`Removed WebSocket connection for student with t_id ${t_id}`);
                if (connections.size === 0) {                                                   // If there are no more connections for this t_id, delete the entry
                    students.delete(t_id);
                    console.log(`All connections removed for t_id ${t_id}. Entry deleted.`);
                }
            }
        }
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});























































// //importing the libraries to create the http and ws server
// const WebSocket = require('ws'); 
// const http = require('http');

// //creatin http server and connecting it ws server
// const server = http.createServer();
// const wss = new WebSocket.Server({ server });

// const teacherToStudents = {};                                      //mappings of

// wss.on('connection', (ws, req) => {
//     const urlParams = new URLSearchParams(req.url.slice(1));
//     const role = urlParams.get('role');
//     const teacherId = urlParams.get('teacherId');

//     if (role === 'teacher') {
//         handleTeacher(ws, teacherId);
//     } else if (role === 'student') {
//         handleStudent(ws, teacherId);
//     }
// });

// function handleTeacher(ws, teacherId) {
//     ws.on('message', (message) => {
//         const data = JSON.parse(message);
//         if (data.type === 'sendMessage') {
//             const text = data.text || 'Hello';
//             if (teacherToStudents[teacherId]) {
//                 teacherToStudents[teacherId].forEach(studentWs => {
//                     studentWs.send(JSON.stringify({ text }));
//                 });
//             }
//         }
//     });
// }

// function handleStudent(ws, teacherId) {
//     if (!teacherToStudents[teacherId]) {
//         teacherToStudents[teacherId] = [];
//     }
//     teacherToStudents[teacherId].push(ws);

//     ws.on('close', () => {
//         teacherToStudents[teacherId] = teacherToStudents[teacherId].filter(studentWs => studentWs !== ws);
//         if (teacherToStudents[teacherId].length === 0) {
//             delete teacherToStudents[teacherId];
//         }
//     });
// }

// server.listen(8765, () => {
//     console.log('WebSocket server is running on ws://localhost:8765');
// });
