import React, { useEffect, useState } from 'react';
import { VideoChatProps, UserType } from './VideoChat.Models';
import './VideoChat.css';
import { FileTransferResult } from 'ts-webrtc-react-client'
import { StreamType, VideoSessionRecordingResult } from 'ts-webrtc-react-client/dist/models';

const VideoChat: React.FC<VideoChatProps> = ({ videoChatService, userType }) => {
    
  const [_inviteSent, setInviteSent] = useState<boolean>(false);
  const [_inviteAccepted, setInviteAccepted] = useState<boolean>(false);
  const [_roomId, setRoomId] = useState<string>("");

  const [_callStarted, setCallStarted] = useState<boolean>(false);
  const [_callEnded, setCallEnded] = useState<boolean>(false);
  const [_errorMessage, setErrorMessage] = useState<string>("");
  const [_showError, setShowError] = useState<boolean>(false);

  const [_disableStartCall, setDisableStartCall] = useState<boolean>(true);
  const [_isMute, setIsMute] = useState<boolean>(false);
  const [_isVideoStopped, setIsVideoStopped] = useState<boolean>(false);

  const [_isScreenShare, setIsScreenShare] = useState<boolean>(false);
  const [_isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false);

  const [_localChat, setLocalChat] = useState<string>("");
  const [_remoteChat, setRemoteChat] = useState<string>("");

  const  handleInviteAccepted = async () => {
        console.log("handleInviteAccepted: Invite accepted.");
        setInviteAccepted(true);
        setDisableStartCall(false);
        setShowError(false);
    };

  const handleInvite = async (e: any) => {
        if (!videoChatService) return;
        console.log("handleInvite: Received invite for roomId: ", e.detail);

        await videoChatService.remoteStartCallAsync();
        setCallStarted(true);

        await videoChatService.acceptInviteAsync(e.detail);
        setRoomId(e.detail);
        setInviteSent(true);
        setShowError(false);
    };

  const toggleAudio = async (e: any) => {
        console.log("toggleAudio: isMute: ", e.detail);
        setIsMute(e.detail);     
    };

  const toggleVideo = async (e: any) => {
        console.log("toggleVideo: isVideoStopped: ", e.detail);
        setIsVideoStopped(e.detail);     
    };

    const chatMessage = async (e: any) => {
        console.log("ChatMessage event received in component. e:", e);
        setRemoteChat(e.detail);
    }

    const fileTransfer = async (e: any) => {
        console.log("FileTransfer event received in component. result:", e);
        var file = e.detail as FileTransferResult;
        (window as any).downloadFileFromByteArray(file.name!, file.type!, base64ToUint8Array(file.data!));     
    };

    const videoSessionRecording = async (e: any) => {
        console.log("videoSessionRecording event received in component. result:", e);
        var result = e.detail as VideoSessionRecordingResult;
        var fileName = `VideoSessionRecording (${result.streamType?.toString()})_${new Date().toISOString()}`;
        (window as any).downloadFileFromByteArray(fileName, result.type!, base64ToUint8Array(result.data!));     
    };

    const handleChange = (e: any) => {
        e.stopPropagation();
        // Update the 'text' state with the new value from the textarea.
        setLocalChat(e.target.value);        

        var textarea = document.getElementById("localChat") as HTMLTextAreaElement;
        var cursorPosition = textarea.selectionStart;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
    };

    useEffect(() => {
        // Cleanup event listeners on unmount
        return () => {
            if (userType === UserType.Remote) { 
                window.removeEventListener("onInvite", handleInvite);
            }
            else {
                window.removeEventListener("onInviteAccepted", handleInviteAccepted);
            }
            window.removeEventListener("onToggleAudio", toggleAudio);
            window.removeEventListener("onToggleVideo", toggleVideo);
            window.removeEventListener("onChatMessage", chatMessage);
            window.removeEventListener("onFileTransfer", fileTransfer);
            window.removeEventListener("onVideoSessionRecording", videoSessionRecording);
        };
    }, [videoChatService]);

    useEffect(() => {
        const initializeVideoChat = async () => {
            if (videoChatService) {
                videoChatService.setHubUrl("https://localhost:7298/chathub");
                const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
                const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
                videoChatService.setVideos(localVideo, remoteVideo);
                
                await videoChatService.startHubConnectionAsync();

                if (userType === UserType.Remote) {
                    window.addEventListener("onInvite", handleInvite);
                }
                else {
                    window.addEventListener("onInviteAccepted", handleInviteAccepted);
                }

                window.addEventListener("onToggleAudio", toggleAudio);
                window.addEventListener("onToggleVideo", toggleVideo);
                window.addEventListener("onChatMessage", chatMessage);
                window.addEventListener("onFileTransfer", fileTransfer);
                window.addEventListener("onVideoSessionRecording", videoSessionRecording);
            }
        };        

        initializeVideoChat();
    }, [videoChatService]);

    const MyErrorMessage: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div className="row">
                <div className="col-12" style={{marginLeft: 5}}>
                    <span style={{backgroundColor: 'red', color: 'white'}}>Error: {_errorMessage}</span>
                </div>
            </div>
        );
    };

    const Chat: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div>
                <form>
                    <div className="row">
                        <div className="col-12" style={{marginLeft: 5}}>
                            <textarea id="localChat" rows={parseInt("5")} style={{width:400}} key="stableKey" onChange={handleChange} value={_localChat}>
                            </textarea>                        
                        </div>                           
                    </div>
                    <div className="row">
                        <div className="col-12" style={{marginLeft: 5}}>
                            <button type='button' style={{width: 400}} onClick={async () => await sendMessage()}>Send Message</button>
                        </div>                           
                    </div>
                </form>                
                <br />
                <div className="row">
                    <div className="col-12" style={{marginLeft: 5}}>
                        <textarea id="remoteChat" rows={parseInt("5")} style={{width:400}} value={_remoteChat} readOnly>
                        </textarea>
                    </div>
                </div>
                <br />
            </div>            
        );
    };

    const InviteAccepted: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div className="row">
                <div className="col-12" style={{marginLeft: 5}}>
                    <span style={{backgroundColor: 'green', color: 'white'}}>Invite accepted.</span>
                </div>
            </div>
        );
    };

    const FileTransferPanel: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div className="row">
                <div className="col-12" style={{ marginLeft: 5}}>
                    <input type="file" onChange={async (e) => await onFileSelected(e)} />
                </div>
            </div>
        );
    };    

    const LocalButtonPanel: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div style={{marginTop: 10, width: "100%"}}>
                <div className="row" style={{marginTop: 10, marginLeft: 5}}>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <button disabled={_inviteSent} style={{width: "90%"}} onClick={() => inviteAll()}>Invite</button>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <button disabled={_disableStartCall} style={{width: "90%"}} onClick={() => startCall()}>Start Call</button>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={() => switchMe()}>{_isScreenShare ? "To Video" : "To Screen"}</button>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={() => startStopRecording()}>{_isRecordingStarted ? "Stop Recording" : "Start Recording"}</button>
                    </div>                    
                </div>
                <div className="row" style={{marginTop: 10, marginLeft: 5}}>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={async () => await toggleAudioAsync()}>{!_isMute ? "Mute" : "Unmute"}</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted || _isScreenShare} style={{width: "90%"}} onClick={async () => await toggleVideoAsync()}>{!_isVideoStopped ? "Stop Video" : "Start Video"}</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={() => endCall()}>End Call</button>
                    </div>
                </div>
            </div>            
        );
    };

    const RemoteButtonPanel: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div style={{marginTop: 10, width: "100%"}}>
                <div className="row" style={{marginTop: 10, marginLeft: 5}}>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={async () => await toggleAudioAsync()}>{!_isMute ? "Mute" : "Unmute"}</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={async () => await toggleVideoAsync()}>{!_isVideoStopped ? "Stop Video" : "Start Video"}</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">                    
                        <button style={{width: "90%"}} onClick={() => endCall()}>End Call</button>
                    </div>
                </div>
            </div>            
        );
    };

    async function inviteAll() {
        if (videoChatService) {
            try {
                setShowError(false);
                await videoChatService.inviteAllAsync();
                setInviteSent(true);
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
                setInviteSent(false);
            }            
        }
    }

    async function startCall() {
        if (videoChatService) {
            try {
                setShowError(false);
                setCallStarted(false);
                setIsScreenShare(false);
                // Start local media (screen sharing)
                //await videoChatService.startLocalScreenMediaAsync();               
                await videoChatService.startCallAsync();
                setCallStarted(true);
                setDisableStartCall(true);
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
                setDisableStartCall(false);
                setCallStarted(false);
            }
        }
    }

    function startStopRecording() {
        if (videoChatService) {
            try {
                setShowError(false);
                console.log("startStopRecording: _isRecordingStarted:", _isRecordingStarted);
                if (!_isRecordingStarted) {
                    videoChatService.startRecording();
                    console.log("startStopRecording: Recording started.");
                    setIsRecordingStarted(true);
                }
                else {
                    videoChatService.stopRecording();
                    console.log("startStopRecording: Recording stopped.");
                    setIsRecordingStarted(false);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
            }
        }
    }

    async function sendMessage() {
        if (videoChatService) {
            try {
                setShowError(false);
                await videoChatService.sendChatMessageAsync(_localChat);
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
            }
        }
    }

    async function switchMe() {
        if (videoChatService) {
            try {
                setShowError(false);
                setCallStarted(false);
                if (_isScreenShare) {
                    await videoChatService.switchScreenShareToVideoAsync();                    
                    setIsScreenShare(false);

                } else {
                    await videoChatService.switchVideoToScreenShareAsync();
                    setIsScreenShare(true);
                }
                setCallStarted(true);
                setDisableStartCall(true);
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
                setDisableStartCall(false);
                setCallStarted(false);
            }
        }
    }

    async function toggleAudioAsync() {
        if (videoChatService) {
            try {
                setShowError(false);               
                videoChatService.toggleAudioAsync();
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
            }
        }
    }

    async function toggleVideoAsync() {
        if (videoChatService) {
            try {
                setShowError(false);               
                videoChatService.toggleVideoAsync();
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
            }
        }
    }

    async function endCall() {
        if (videoChatService) {
            try {
                await videoChatService.endCallAsync();
            } catch (error: any) {
                setErrorMessage(error.message);
                setShowError(true);
            }
            setCallEnded(true);
        }
    }

    async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        try {
            if (videoChatService) {
                setShowError(false);

                var input = e.target as HTMLInputElement;
            
                if (input.files && input.files.length > 0) {
                    for (let i=0; i<input.files.length; i++)
                    {
                        var file:File = input.files[i];
                        var b = new Blob([file], {type: file.type});
                        var arr = new Uint8Array(await b.arrayBuffer());
                        videoChatService.transferFileAsync(arr, file.name, file.type);
                    }
                }
            }                
        }
        catch (err:any) {
          console.error("Error in onFileSelected:", err);
          setErrorMessage(err?.message ?? "Error in onFileSelected.");
          setShowError(true);
        }    
      }

    function base64ToUint8Array(base64String: string): Uint8Array {
        try {
          // Decode the Base64 string into a raw string
          const rawString = atob(base64String);
      
          // Create a Uint8Array with the same length as the raw string
          const uint8Array = new Uint8Array(rawString.length);
      
          // Populate the Uint8Array with the character codes of the raw string
          for (let i = 0; i < rawString.length; i++) {
            uint8Array[i] = rawString.charCodeAt(i);
          }
      
          return uint8Array;
        } catch (error) {
          console.error('Error converting Base64 to Uint8Array:', error);
          throw new Error('Invalid Base64 string');
        }
    }

    return (
        <div style={{width: "100%", marginTop: 20}}>
            <div style={{marginTop: 10}}>        
                Video Chat Component ({userType === UserType.Local ? "Local" : "Remote"})
            </div>
            
            <MyErrorMessage show={_showError} />

            <div className="container">
                <div id="video-grid">
                    <video className="overlay" id="localVideo" autoPlay muted>
                    </video>
                    <video className="background" id="remoteVideo" autoPlay>
                    </video>
                </div>
            </div>

            <br />
                
            <FileTransferPanel show={_callStarted}/>

            <br />

            <Chat show={_callStarted} />

            <br />

            <InviteAccepted show={_inviteAccepted} />

            <br />

            <LocalButtonPanel show={userType === UserType.Local} />

            <RemoteButtonPanel show={userType === UserType.Remote} />
        </div>
    );
  };

export default VideoChat;