let localStream;
let localScreenStream;
let isMuted = false;
let isVideoStopped = false;
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
let fileTransferDataChannel;

export function setHubUrl(hUrl) {
    console.log("Setting Hub url: ", hUrl);
    hubUrl = hUrl;
}

export function setVideos(lv, rv) {
    localVideo = lv;
    remoteVideo = rv;
}

export function setRoomId(rmId) {
    roomId = rmId;
}

export function setSettings(uid, myid) {
    remoteUniqueUserId = uid;
    localUniqueUserId = myid;
}

export async function invite() {
    if (!roomId)
        roomId = generateUUID();
    console.log("Generated room ID: ", roomId);

    await connection.invoke("invite", roomId, remoteUniqueUserId);
}

export async function inviteAll() {
    if (!roomId)
        roomId = generateUUID();
    console.log("Generated room ID: ", roomId);

    await connection.invoke("invite-all", roomId);
}

export async function acceptInvite(rmId) {
    console.log("Accepting invite room ID: ", rmId);

    roomId = rmId;

    await connection.invoke("accept-invite", rmId);
}

export function setAudio(mute) {
    var audioTrack = getAudioTrack();

    if (!audioTrack) {
        console.warn('No audio track available to set.');
        return;
    }

    // Toggle the enabled property of the audio track
    audioTrack.enabled = !mute;

    console.log(`Microphone is now ${mute ? 'muted' : 'unmuted'}.`);
}

// Toggle mute/unmute
export function toggleAudio() {
    var audioTrack = getAudioTrack();

    if (!audioTrack) {
        console.warn('No audio track available to toggle.');
        return;
    }

    // Toggle the enabled property of the audio track
    isMuted = !isMuted;
    audioTrack.enabled = !isMuted;

    window.ToggleAudio(isMuted);

    console.log(`Microphone is now ${isMuted ? 'muted' : 'unmuted'}.`);
}

export function setVideo(stopVideo) {    
    var videoTrack = getVideoTrack();

    if (videoTrack) {
        // Toggle the enabled property of the video track
        videoTrack.enabled = !stopVideo;

        // Log the current state
        console.log(`Video is now ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
    } else {
        console.warn('No video track available to toggle.');
    }
}

// Function to toggle video mute/unmute
export function toggleVideo() {
    var videoTrack = getVideoTrack();

    if (videoTrack) {
        // Toggle the enabled property of the audio track
        isVideoStopped = !isVideoStopped;

        // Toggle the enabled property of the video track
        videoTrack.enabled = !isVideoStopped;

        window.ToggleVideo(isVideoStopped);

        // Log the current state
        console.log(`Video is now ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
    } else {
        console.warn('No video track available to toggle.');
    }
}

export async function startLocalMedia() {
    try {
        console.log("Requesting local media...");
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (ex) {
        console.error('Error accessing media devices.', ex);
        return;
    }    
}

export async function startLocalScreenMedia(startAudio = false) {
    try {
        console.log("Requesting local screen media...");
        const displayMediaOptions = {
            video: {
                cursor: 'always' // or 'motion', 'never'
            },
            audio: startAudio // Set to true if you want to include system audio
        };
        localScreenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        localVideo.srcObject = localScreenStream;
    } catch (ex) {
        console.error('Error accessing screen media devices.', ex);
        return;
    }
}

export async function switchVideoToScreenShare() {
    try {
        var videoSender = peerConnection.getSenders().find(sender => sender.track && sender.track.kind === 'video');

        if (!localScreenStream) {
            await startLocalScreenMedia();
            await startConnection(false, true);
        }
        else {
            await startLocalScreenMedia();
        }

        if (videoSender) {
            // Replace the video track with the screen share track
            await videoSender.replaceTrack(localScreenStream.getVideoTracks()[0]);
            console.log("Replaced video track with screen share track.");
        }
    } catch (ex) {
        console.error('Error switching to screen share.', ex);
        return;
    }
}

export async function switchScreenShareToVideo() {
    try {
        var videoSender = peerConnection.getSenders().find(sender => sender.track && sender.track.kind === 'video');

        if (!localStream) {
            await startLocalMedia();
            await startConnection(false, false);
        }
        else {
            await startLocalMedia();
        }        

        if (videoSender) {
            // Replace the video track with the screen share track
            await videoSender.replaceTrack(localStream.getVideoTracks()[0]);
            console.log("Replaced screen share track with video track.");
        }
    } catch (ex) {
        console.error('Error switching to video.', ex);
        return;
    }
}

export function transferFile(data, fileName, mimeType) {
    try {
        console.log("transferFile: file of length: ", data.length);
        console.log("transferFile: fileName: ", fileName);
        console.log("transferFile: mimeType: ", mimeType);

        var dataBlob = new Blob([data], { type: mimeType });

        const chunkSize = 64 * 1024; // 64KiB
        let offset = 0;

        function readChunk() {
            const reader = new FileReader();
            const slice = dataBlob.slice(offset, offset + chunkSize);
            reader.onload = (event) => {
                console.log("Sending file chunk.", event);
                fileTransferDataChannel.send(event.target.result);
                offset += chunkSize;
                if (offset < dataBlob.size) {
                    readChunk();
                } else {
                    fileTransferDataChannel.send("EOF" + ":" + fileName + ":" + mimeType);
                    console.log("File transfer complete");
                }
            };
            reader.readAsArrayBuffer(slice);
        }

        readChunk();        
    } catch (ex) {
        console.error('Error transfering file.', ex);
        return;
    }    
}

export async function startCall(sendOffer = true) {
    await startConnection(sendOffer, false);
}

export async function startScreenShare(sendOffer = true) {
    await startConnection(sendOffer, true);
}

async function startConnection(sendOffer = true, startScreenShare= false) {
    try { 
        if (!connection && !isHubConnectionStarted)
            startHubConnection();

        while (!isHubConnectionStarted) {
            console.log("waiting for Hub connection to start...");
            await sleep(50);
        }

        if (!peerConnection)
            await startPeerConnection();

        if (!startScreenShare) {
            if(!localStream)
                await startLocalMedia();

            console.log("Adding local tracks to peer connection...");
            localStream.getTracks().forEach(track =>  { 
                peerConnection.addTrack(track, localStream);
            });
        }
        else if (startScreenShare) {
            if(!localScreenStream)
                await startLocalScreenMedia();

            console.log("Adding local screen tracks to peer connection...");
            localScreenStream.getTracks().forEach(track =>  { 
                peerConnection.addTrack(track, localScreenStream);
            });
        } 

        if (!fileTransferDataChannel)
            createFileTransferDataChannel();
        
        subscribeFileTransferDataChannel();

        if (sendOffer) {
            await sendOfferAsync();
        }        

        console.log("call started. send offer: " + sendOffer);
    } catch (error) {
        console.error('Error starting call:', error);
    }
}

async function sendOfferAsync() {
    console.log("Creating offer...");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Sending offer to signaling server...");
    await connection.invoke("offer", offer, roomId);
    console.log("Offer sent.");
}

export async function startPeerConnection(iceServerUrl = 'stun:stun.l.google.com:19302') {
    try {         
        console.log("Starting call...");               

        console.log("Establishing peer connection...");
        peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: iceServerUrl }] // STUN server for NAT traversal
        });

        peerConnection.addEventListener('signalingstatechange', async () => {
            console.log("Signaling state changed to:", peerConnection.signalingState);
        });                       

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
            console.log("Received remote track", e);            
            remoteVideo.srcObject = e.streams[0];
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', peerConnection.iceConnectionState);
        };
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
        if (localScreenStream) {
            localScreenStream.getTracks().forEach(track => track.stop());
            localScreenStream = null;
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

                    window.CallStarted(roomId);
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
                window.CallEnded(roomId);
            });

            isHubConnectionStarted = true;
        })
        .catch(err => console.error("Error while starting connection:", err));
}

function createFileTransferDataChannel() {
    try {
        console.log("createFileTransferDataChannel called.");

        if (!peerConnection) {
            console.log("Peer connection not available. Please start call first.")
            return;
        }

        // Create a DataChannel for file transfer
        console.log("Creating file transfer data channel.")
        fileTransferDataChannel = peerConnection.createDataChannel("fileTransfer");
        fileTransferDataChannel.binaryType = "arraybuffer";

        console.log("Attaching file transer data channel events.")
        // Handle DataChannel events
        fileTransferDataChannel.onopen = () => {
            console.log("DataChannel is open");
        };

        let receivedBuffer = [];
        let receivedSize = 0;

        fileTransferDataChannel.onmessage = (event) => {
            console.log("local: file received.");

            if (event.data.toString().startsWith("EOF")) {
                var fileName = event.data.split(':')[1];
                var mimeType = event.data.split(':')[2];
                const base64String = btoa(String.fromCharCode(...receivedBuffer));
                console.log("subscriber: onmessage: receivedBuffer: ", base64String);

                window.FileTransfer(base64String,
                    receivedSize, fileName, mimeType);
            }
            else {
                console.log("subscriber: event.data: ", event.data);
                const view = new Uint8Array(event.data);
                receivedBuffer.push(...view);
                receivedSize += event.data.byteLength;
            }
        };
    } catch (ex) {
        console.error('Error create file transfer data channel.', ex);
        return;
    }
}

function subscribeFileTransferDataChannel() {
    try {
        console.log("subscribeFileTransferDataChannel called.");

        if (!peerConnection) {
            console.log("Peer connection not available. Please start call first.")
            return;
        }

        peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;

            let receivedBuffer = [];
            let receivedSize = 0;

            dataChannel.onmessage = (event) => {
                console.log("subscriber: file received.");

                if (event.data.toString().startsWith("EOF")) {
                    var fileName = event.data.split(':')[1];
                    var mimeType = event.data.split(':')[2];
                    const base64String = btoa(String.fromCharCode(...receivedBuffer));
                    console.log("subscriber: onmessage: receivedBuffer: ", base64String);

                    window.FileTransfer(base64String,
                        receivedSize, fileName, mimeType);
                }
                else {
                    console.log("subscriber: file data: ", event.data);
                    const view = new Uint8Array(event.data);
                    receivedBuffer.push(...view);
                    receivedSize += event.data.byteLength;
                }
            };

            dataChannel.onopen = () => {
                console.log("DataChannel is open!");
            };

            dataChannel.onclose = () => {
                console.log("DataChannel is closed!");
            };
        };
    } catch (ex) {
        console.error('Error subscribe file transfer data channel.', ex);
        return;
    }
}

function getAudioTrack() {
    if (!localStream && !localScreenStream) {
        console.error('No media stream available.');
        return null;
    }

    // Get the audio track from the stream
    var audioTracks;
    var audioTracks1;

    if (localStream)
        audioTracks = localStream.getAudioTracks();

    if (localScreenStream)
        audioTracks1 = localScreenStream.getAudioTracks();

    var all = [];

    if (audioTracks && audioTracks.length > 0) {
        all = [...audioTracks];
    }
    if (audioTracks1 && audioTracks1.length > 0) {
        all = [...all, ...audioTracks1];
    }

    if (all.length === 0) {
        console.error('No audio tracks found in the media stream.');
        return null;
    }

    return all[0];
}

function getVideoTrack() {
    if (!localStream && !localScreenStream) {
        console.error('No media stream available.');
        return null;
    }
    // Get the video track from the stream
    var videoTracks;
    var videoTracks1;

    if (localStream)
        videoTracks = localStream.getVideoTracks();

    if (localScreenStream)
        videoTracks1 = localScreenStream.getVideoTracks();

    var all = [];

    if (videoTracks && videoTracks.length > 0) {
        all = [...videoTracks];
    }
    if (videoTracks1 && videoTracks1.length > 0) {
        all = [...all, ...videoTracks1];
    }

    if (all.length === 0) {
        console.error('No video tracks found in the media stream.');
        return null;
    }

    return all[0];
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