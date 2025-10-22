import { IWebRTCService } from "./IWebRTCService";
import { setVideos, setHubUrl, setSettings, invite, inviteAll, acceptInvite, 
    startCall, endCall, startHubConnection, toggleAudio, toggleVideo, startLocalMedia, 
    setAudio, setVideo, transferFile,
    setRoomId} from './client';
import { FileTransferResult } from "./models";

export class WebRTCService implements IWebRTCService {  
    constructor() {
        // Ensure the global functions are available for the client.js to call  
        (window as any).Invite = this.Invite.bind(this);
        (window as any).InviteAccepted = this.InviteAccepted.bind(this);
        (window as any).ToggleAudio = this.ToggleAudio.bind(this);
        (window as any).ToggleVideo = this.ToggleVideo.bind(this);
        (window as any).FileTransfer = this.FileTransfer.bind(this);
        (window as any).CallStarted = this.CallStarted.bind(this);
        (window as any).CallEnded = this.CallEnded.bind(this);
    }

    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void {
        setVideos(localVideoElement, remoteVideoElement);
    }

    setHubUrl(hubUrl: string): void {
        console.log('Setting hub URL to:', hubUrl);
        setHubUrl(hubUrl);
    }

    setRoomId(roomId:string) : void {
        console.log('Setting Room Id to:', roomId);
        setRoomId(roomId);
    }

    setSettings(userId: string, remoteUserId: string): void {
        console.log('Setting user IDs. Local:', userId, 'Remote:', remoteUserId);
        setSettings(userId, remoteUserId); 
    }

    async inviteAsync(): Promise<void> {
        await invite();
    }

    async inviteAllAsync(): Promise<void> {
        await inviteAll();
    }

    async acceptInviteAsync(roomId: string): Promise<void> {
        await acceptInvite(roomId);
    }

    Invite(roomId:string): void {
        console.log('OnInvite fired. room id:', roomId);

        const onInviteEvent = new CustomEvent<string>("onInvite", { detail: roomId });
      
        window.dispatchEvent(onInviteEvent);
    }
    
    InviteAccepted(): void {
        console.log('OnAcceptInvite fired.');

        const onInviteAcceptedEvent = new CustomEvent("onInviteAccepted");
      
        window.dispatchEvent(onInviteAcceptedEvent);
    }

    CallStarted(roomId: string): void {
        console.log('CallStarted fired. RoomId:', roomId);
        
        const onCallStarted = new CustomEvent<string>("onCallStarted", { detail: roomId });
      
        window.dispatchEvent(onCallStarted);
    }

    CallEnded(roomId: string): void {
        console.log('CallEnded fired. RoomId:', roomId);
        
        const onCallEnded = new CustomEvent<string>("onCallEnded", { detail: roomId });
      
        window.dispatchEvent(onCallEnded);
    }

    ToggleAudio(isMute:boolean): void {
        console.log('ToggleAudio fired. isMute:', isMute);

        const onToggleAudio = new CustomEvent<boolean>("onToggleAudio", { detail: isMute });
      
        window.dispatchEvent(onToggleAudio);
    }

    ToggleVideo(isVideoStopped:boolean): void {
        console.log('ToggleVideo fired. isVideoStopped:', isVideoStopped);

        const onToggleVideo = new CustomEvent<boolean>("onToggleVideo", { detail: isVideoStopped });
      
        window.dispatchEvent(onToggleVideo);
    }

    async transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => transferFile(data, name, type));
            resolve();
          }); 
    }

    FileTransfer(data:string, size:number, fileName:string, mimeType:string): void {
        console.log('FileTransfer fired. data:', data);
        console.log('FileTransfer fired. size:', size);
        console.log('FileTransfer fired. fileName:', fileName);
        console.log('FileTransfer fired. mimeType:', mimeType);
        const onFileTransfer = new CustomEvent<FileTransferResult>("onFileTransfer", 
            { 
                detail: <FileTransferResult>
                {
                    data: data,
                    size: size,
                    name: fileName,
                    type: mimeType
                }}
            );
      
        window.dispatchEvent(onFileTransfer);
    }

    async startLocalMediaAsync(): Promise<void> {
        await startLocalMedia();
    }

    async setAudioAsync(mute: boolean): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => setAudio(mute));
            resolve();
          });
    }

    async setVideoAsync(stopVideo: boolean): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => setVideo(stopVideo));
            resolve();
          });
    }

    async toggleAudioAsync(): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => toggleAudio());
            resolve();
          });
    }

    async toggleVideoAsync(): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => toggleVideo());
            resolve();
          });
    }
    
    async startCallAsync(): Promise<void> {
        await startCall(true);
    }

    async remoteStartCallAsync(): Promise<void> {
        await startCall(false);
    }

    async endCallAsync(): Promise<void> {
        await endCall();
    }

    async startHubConnectionAsync(): Promise<void> {
        console.log('Starting hub connection...');
        await startHubConnection();
        console.log('Hub connection started.');
    }
}