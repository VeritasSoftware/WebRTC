import { EventEmitter, Injectable } from "@angular/core";
import { IWebRTCService } from "./IWebRTCService";
import { setVideos, setHubUrl, setSettings, invite, inviteAll, acceptInvite, 
            toggleVideo, startCall, endCall, startHubConnection, toggleAudio, setVideo, setAudio, 
            startLocalMedia, transferFile, setRoomId, startLocalScreenMedia, startScreenShare,
            switchVideoToScreenShare, switchScreenShareToVideo, startPeerConnection,
            sendMessage} from './client';
import { FileTransferResult } from "./models";

[Injectable({
  providedIn: null
})]
export class WebRTCService implements IWebRTCService {
    public onInvite = new EventEmitter<string>();
    public onInviteAccepted = new EventEmitter<void>();
    public onToggleAudio = new EventEmitter<boolean>();
    public onToggleVideo = new EventEmitter<boolean>(); 
    public onCallStarted = new EventEmitter<string>();
    public onCallEnded = new EventEmitter<string>();
    public onFileTransfer = new EventEmitter<FileTransferResult>();
    public onChatMessage = new EventEmitter<string>();

    constructor() {
        // Ensure the global functions are available for the client.js to call  
        (window as any).Invite = this.Invite.bind(this);
        (window as any).InviteAccepted = this.InviteAccepted.bind(this);
        (window as any).ToggleAudio = this.ToggleAudio.bind(this);
        (window as any).ToggleVideo = this.ToggleVideo.bind(this);
        (window as any).FileTransfer = this.FileTransfer.bind(this);
        (window as any).CallStarted = this.CallStarted.bind(this);
        (window as any).CallEnded = this.CallEnded.bind(this);
        (window as any).Chat = this.Chat.bind(this);
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

    setSettings(uniqueId: string, remoteUniqueId: string): void {
        console.log('Setting IDs. Local:', uniqueId, 'Remote:', remoteUniqueId);
        setSettings(uniqueId, remoteUniqueId); 
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
        this.onInvite?.emit(roomId);
    }
    
    InviteAccepted(): void {
        console.log('OnAcceptInvite fired.');
        this.onInviteAccepted?.emit();
    }

    ToggleAudio(isMute:boolean): void {
        console.log('ToggleAudio fired. isMute:', isMute);
        this.onToggleAudio?.emit(isMute);
    }

    ToggleVideo(isVideoStopped:boolean): void {
        console.log('ToggleVideo fired. isVideoStopped:', isVideoStopped);
        this.onToggleVideo?.emit(isVideoStopped);
    }

    FileTransfer(data:string, size:number, fileName:string, mimeType:string): void {
        console.log('FileTransfer fired. data:', data);
        console.log('FileTransfer fired. size:', size);
        console.log('FileTransfer fired. fileName:', fileName);
        console.log('FileTransfer fired. mimeType:', mimeType);
        this.onFileTransfer?.emit(<FileTransferResult>
            {
                data: data,
                size: size,
                name: fileName,
                type: mimeType
            }
        );
    }

    Chat(message:string): void {
        console.log('Chat fired. message:', message);

        this.onChatMessage?.emit(message);
    }

    CallStarted(roomId: string): void {
        console.log('CallStarted fired. Room id:', roomId);
        this.onCallStarted?.emit(roomId);
    }

    CallEnded(roomId: string): void {
        console.log('CallEnded fired. Room id:', roomId);
        this.onCallEnded?.emit(roomId);
    }

    async startLocalMediaAsync(): Promise<void> {
        await startLocalMedia();
    }

    async startLocalScreenMediaAsync(startAudio: boolean = false): Promise<void> {
        await startLocalScreenMedia(startAudio);
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

    async transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => transferFile(data, name, type));
            resolve();
          });        
    }

    async sendChatMessageAsync(message: string): Promise<void> {
        await new Promise<void>(async (resolve) => {
            await new Promise((res) => sendMessage(message));
            resolve();
          }); 
    }

    async startPeerConnectionAsync(iceServerUrl: string = 'stun:stun.l.google.com:19302'): Promise<void> {
        await startPeerConnection(iceServerUrl);
    }

    async startCallAsync(): Promise<void> {
        await startCall();
    }        

    async startScreenShareAsync(): Promise<void> {
        await startScreenShare();
    }

    async remoteStartCallAsync(): Promise<void> {
        await startCall(false);
    }

    async remoteStartScreenShareAsync(): Promise<void> {
        await startScreenShare(false);
    }

    async switchVideoToScreenShareAsync(): Promise<void> {
        await switchVideoToScreenShare();
    }

    async switchScreenShareToVideoAsync(): Promise<void> {
        await switchScreenShareToVideo();
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