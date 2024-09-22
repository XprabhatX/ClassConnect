//-----------------------------This file registers the Service Worker.------------------------------------------------------
// if ('serviceWorker' in navigator) {                                                     
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js')
//         .then(registration => {
//             console.log('Service Worker registered ', registration.scope);  //the succussfu registration will return an object to be named as 'regisration' containing information about the service worker
//         })
//         .catch(error => {
//             console.error('Service Worker registration failed:', error);
//         });
//     });
// }

//------------------------------------------- For sending the student data to the websocket----------------------------------------------
let socket=null;

document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const studentData = {
        user: document.getElementById('user').value,
        name: document.getElementById('name').value,
        branch: document.getElementById('branch').value,
        division: document.getElementById('division').value,
        year: document.getElementById('year').value,
        t_id: document.getElementById('t_id').value
    };

    const dataToSend = {
        user: studentData.user,
        t_id: studentData.t_id.toUpperCase()
    };

    if (!socket || socket.readyState === WebSocket.CLOSED) {   //to avoid creating multiple connection if user clicks on submit multiple times
        socket = new WebSocket('ws://localhost:8080');

        socket.onopen = function(event) {
            alert('WebSocket connection Established');
            socket.send(JSON.stringify(dataToSend));
            alert('Data sent');
        };
        
        socket.onmessage = function(event) {
            const serverMessage = JSON.parse(event.data);
            if (serverMessage.message) {
                alert(serverMessage.message); // Display incoming message as alert
            }
            if(serverMessage.message=='Hello from your teacher')
            {
                const button = document.createElement('button');
                button.textContent = 'Authenticate';
                const container = document.getElementById('button-container');
                if (container) {
                    container.appendChild(button);
                }
            }
        };
        
        socket.onclose = function(event) {
            alert('WebSocket connection closed');                  //shows alert when connection is closed
        };
        
        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
    }

});

//-------------------------------------------------Disconnecting with websocket----------------------------------------------------------------------
function disconnectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    } else {
        alert('WebSocket is not open or already closed');
    }
}
document.getElementById('close').addEventListener('click', disconnectWebSocket);





















// const urlParams = new URLSearchParams(window.location.search);
// const teacherId = urlParams.get('teacherId');
// const ws = new WebSocket(`ws://localhost:8765?role=student&teacherId=${teacherId}`);

// ws.onopen = () => {
//     console.log('Connected as student');
// };

// ws.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     console.log(`Message from teacher: ${message.text}`);
// };




  
