const io = require('socket.io-client');
const wrtc = require('wrtc');
const Peer = require('simple-peer');
const WEBSOCKET_DELIMETER = ':|:';
const socket = io.connect('http://127.0.0.1:3000');

var peer = null;

socket.on('connect', function () {
    console.log('Successfully connect to the server');

    //Receive data from the web socket server
    socket.on('message', function (response) {
        //Parse the event and the data from response
        var msgArr = response.split(WEBSOCKET_DELIMETER);
        var event = msgArr[0];
        var data = msgArr[1];

        switch(event) {
            //case of receiving users list
            case 'list':
                var users = data;
                broadcastOffer(socket, users);
                break;

            //case of receiving sdp object
            case 'data':
                try{
                    var from = JSON.parse(data).from;
                    var data = JSON.parse(data).data;
                    sdpHandler(socket, from, data);


                } catch(e) {
                    logError(socket, 'bad JSON');
                }
            break;
            default:
                console.error(`Event ${event} is unknown`);
        }

    })
});

socket.on('disconnect', function () {
    console.log('Disconnect to server');
});

var broadcastOffer = (socket, users) => {
    //For each user on the list
    for(var i = 0; i<users.length;i++) {
        //create the offer
        peer = new Peer({ initiator: true, wrtc: wrtc, trickle: true});

        //Received the offer
        peer.on('signal', function (data) {
            //Construct the response object
            var responseTemplate = {'to': users[i], 'data': JSON.stringify(data)};
            //Send offer back to the server
            socket.emit('message', responseTemplate);
        });
    }
};

//handle redirecting offer or signaling answer
var sdpHandler = (socket, user, sdp) => {
    //create answer or activate the answer on the initiator side
    peer.signal(sdp);
    peer.on('signal', function (data) {
        //Construct the response object
        var responseTemplate = {'to': users[i], 'data': JSON.stringify(data)};

        //Send offer back to the server
        socket.emit('message', responseTemplate);
    });
    connectionHandler();
};

//listener for collecting data in the dataChannel
//TODO need to implement stdin for exchanging data between clients
var connectionHandler = () => {
    peer.on('connect', function () {
        peer.send('Ping');
    });

    peer.on('data', function (data) {
        console.log('Pong'+ data);
    });
};