import React, { useEffect, useState } from 'react';
import { VideoChatProps, UserType } from './VideoChat.Models';
import './VideoChat.css';

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

  const  handleInviteAccepted = async () => {
        console.log("handleInviteAccepted: Invite accepted.");
        setInviteAccepted(true);
        setDisableStartCall(false);
        setShowError(false);
    };

  const handleInvite = async (e: any) => {
        if (!videoChatService) return;
        console.log("handleInvite: Received invite for roomId: ", e.detail);
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

    useEffect(() => {
        const initializeVideoChat = async () => {
            if (videoChatService) {
                videoChatService.setHubUrl("https://localhost:7298/chathub");
                const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
                const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
                videoChatService.setVideos(localVideo, remoteVideo);
                
                await videoChatService.startHubConnectionAsync();

                if (userType === UserType.Remote) {
                    await videoChatService.remoteStartCallAsync();

                    setCallStarted(true);
                    
                    window.addEventListener("onInvite", handleInvite);
                }
                else {
                    window.addEventListener("onInviteAccepted", handleInviteAccepted);
                }

                window.addEventListener("onToggleAudio", toggleAudio);
                window.addEventListener("onToggleVideo", toggleVideo);
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

    const LocalButtonPanel: React.FC<{ show: boolean }> = ({ show }) => {
        if (!show) return null;
        return (
            <div style={{marginTop: 10, width: "100%"}}>
                <div className="row" style={{marginTop: 10, marginLeft: 5}}>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={_inviteSent} style={{width: "90%"}} onClick={() => inviteAll()}>Invite</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={_disableStartCall} style={{width: "90%"}} onClick={() => startCall()}>Start Call</button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={async () => await toggleAudioAsync()}>{!_isMute ? "Mute" : "Unmute"}</button>
                    </div>
                </div>
                <div className="row" style={{marginTop: 10, marginLeft: 5}}>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <button disabled={!_callStarted} style={{width: "90%"}} onClick={async () => await toggleVideoAsync()}>{!_isVideoStopped ? "Stop Video" : "Start Video"}</button>
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

    async function toggleAudioAsync() {
        if (videoChatService) {
            try {
                setShowError(false);               
                videoChatService.toggleAudio();
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
                videoChatService.toggleVideo();
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
                
            <InviteAccepted show={_inviteAccepted} />

            <br />

            <LocalButtonPanel show={userType === UserType.Local} />

            <RemoteButtonPanel show={userType === UserType.Remote} />
        </div>
    );
  };

export default VideoChat;