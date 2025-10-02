let localStream;
let isMuted = false;
let peerConnection;
let connection;
let hubUrl;
let isHubConnectionStarted;
let roomId;
let remoteUniqueUserId;
let localUniqueUserId;
var localVideo;
var remoteVideo;
let iceCandidates = [];
let isRemoteSet = false;
let isTrickleIceSent = false;

export function setHubUrl(hUrl) {
    console.log("Setting Hub url: ", hUrl);
    hubUrl = hUrl;
}

export function setVideos(lv, rv) {
    localVideo = lv;
    remoteVideo = rv;
}

export function setSettings(uid, myid) {
    remoteUniqueUserId = uid;
    localUniqueUserId = myid;
}

export async function invite() {
    roomId = generateUUID();
    console.log("Generated room ID: ", roomId);

    await connection.invoke("invite", roomId, remoteUniqueUserId);
}

export async function inviteAll() {
    roomId = generateUUID();
    console.log("Generated room ID: ", roomId);

    await connection.invoke("invite-all", roomId);
}

export async function acceptInvite(rmId) {
    console.log("Accepting invite room ID: ", rmId);

    roomId = rmId;

    await connection.invoke("accept-invite", rmId);
}

// Toggle mute/unmute
export function toggleMute() {
    if (!localStream) {
        console.error('No media stream available.');
        return;
    }

    // Get the audio tracks from the local stream
    const audioTracks = localStream.getAudioTracks();

    if (audioTracks.length === 0) {
        console.error('No audio tracks found in the media stream.');
        return;
    }

    // Toggle the enabled property of the audio track
    isMuted = !isMuted;
    audioTracks[0].enabled = !isMuted;

    window.ToggleMute(isMuted);

    console.log(`Microphone is now ${isMuted ? 'muted' : 'unmuted'}.`);
}

export async function startCall(sendOffer = true) {
    try { 
        if (!connection && !isHubConnectionStarted)
            startHubConnection();

        while (!isHubConnectionStarted) {
            console.log("waiting for Hub connection to start...");
            await sleep(50);
        }

        console.log("Starting call...");               

        console.log("Establishing peer connection...");
        peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN server for NAT traversal
        });

        peerConnection.addEventListener('signalingstatechange', async () => {
            console.log("Signaling state changed to:", peerConnection.signalingState);
        });

        console.log("Requesting local media...");
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        console.log("Adding local tracks to peer connection...");
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = async e => {
            if (e.candidate && isRemoteSet && !isTrickleIceSent) {
                    if (iceCandidates.length > 0) {
                        console.log("Sending trickle ice.");
                        for (var i = 0; i < iceCandidates.length; i++) {
                            await connection.invoke("ice-candidate", iceCandidates[i], roomId);
                        }
                        iceCandidates = [];
                        isTrickleIceSent = true;
                        console.log("Sent trickle ice.");
                    }

                await connection.invoke("ice-candidate", e.candidate, roomId);
            }
            else if (isTrickleIceSent) {
                await connection.invoke("ice-candidate", e.candidate, roomId);
            }
            else {
                iceCandidates.push(e.candidate);
            }
            console.log("iceCandidates: " + iceCandidates.length);
        };

        peerConnection.ontrack = e => {
            console.log("Received remote track");
            remoteVideo.srcObject = e.streams[0];
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', peerConnection.iceConnectionState);
        };

        if (sendOffer) {
            console.log("Creating offer...");
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log("Sending offer to signaling server...");
            await connection.invoke("offer", offer, roomId);
            console.log("Offer sent.");
        }        

        console.log("call started. send offer: " + sendOffer);
    } catch (error) {
        console.error('Error starting call:', error);
    }
}

export async function endCall() {
    try {
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        remoteVideo.srcObject = null;
        if (connection) {
            await connection.invoke("end-call", roomId);
            connection.stop()
                .then(() => {
                    console.log("Connection stopped");
                    connection = null;
                    isHubConnectionStarted = false;
                })
                .catch(err => console.error("Error while stopping connection:", err));                        
        }
    } catch (error) {
        console.error('Error ending call:', error);
    }

    //Re-direct to home page
    //window.location.href = '/';
}

export function startHubConnection() {
    console.log("Starting SignalR Hub connection to ", hubUrl);
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(() => {
            console.log("Connection started");            

            if (localUniqueUserId) {
                console.log("Starting listener on: " + localUniqueUserId);
                connection.on(localUniqueUserId, function (roomId) {
                    try {
                        console.log("Invite received from server:", roomId);
                        window.Invite(roomId);
                    }
                    catch (ex) {
                        console.log("Invite Error: " + ex.message);
                    } 
                });
            } 

            connection.on("invite-all", function (roomId) {
                try {
                    console.log("Invite received from server:", roomId);
                    window.Invite(roomId);                   
                }
                catch (ex) {
                    console.log("Invite All Error: " + ex.message);
                } 
            });

            connection.on("invite-accepted", async rmId => {
                try {
                    console.log("invite-accepted event received for Room id: " + rmId);
                    roomId = rmId;                
                    window.InviteAccepted();                    
                }
                catch (ex) {
                    console.log("Invite Accepted Error: " + ex.message);
                }
            });

            // Signaling server event listeners
            connection.on('offer', async (offer) => {

                console.log("Offer: peerConnection.signalingState: " + peerConnection.signalingState);

                try {
                    if (peerConnection.signalingState === 'stable') {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                        await connection.invoke("offer", offer, roomId);

                        console.log("sent remote offer.");
                    }

                    if (peerConnection.signalingState === 'have-remote-offer') {                        
                        var answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);

                        await connection.invoke("answer", answer, roomId);

                        console.log("answer sent.");
                    }
                }
                catch (ex) {
                    console.log("Offer Error: " + ex.message);
                }
            });

            connection.on('answer', async (answer) => {
                try {

                    console.log("Answer: peerConnection.signalingState: " + peerConnection.signalingState);

                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

                    isRemoteSet = true;
                }
                catch (ex) {
                    console.log("Answer Error: " + ex.message);
                }
            });

            connection.on('ice-candidate', async (candidate) => {
                try {
                    console.log("Processing ICE candidate.");

                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
                catch (ex) {
                    console.log("Ice Candidate Error: " + ex.message);
                }                
            });

            connection.on('end-call', () => {
                endCall();
            });

            isHubConnectionStarted = true;
        })
        .catch(err => console.error("Error while starting connection:", err));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateUUID() {
    let d = new Date().getTime(); //Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) { //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else { //Use microseconds since page-load if available
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}