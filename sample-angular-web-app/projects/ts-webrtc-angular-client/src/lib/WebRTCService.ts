import { EventEmitter, Injectable } from "@angular/core";
import { IWebRTCService } from "./IWebRTCService";
import { setVideos, setHubUrl, setSettings, invite, inviteAll, acceptInvite, 
            toggleVideo, startCall, endCall, startHubConnection, toggleAudio, setVideo, setAudio, 
            startLocalMedia} from './client';

[Injectable({
  providedIn: null
})]
export class WebRTCService implements IWebRTCService {
    public onInvite = new EventEmitter<string>();
    public onInviteAccepted = new EventEmitter<void>();
    public onToggleAudio = new EventEmitter<boolean>();
    public onToggleVideo = new EventEmitter<boolean>(); 
    public onCallStarted = new EventEmitter<void>();
    public onCallEnded = new EventEmitter<void>();

    constructor() {
        // Ensure the global functions are available for the client.js to call  
        (window as any).Invite = this.Invite.bind(this);
        (window as any).InviteAccepted = this.InviteAccepted.bind(this);
        (window as any).ToggleAudio = this.ToggleAudio.bind(this);
        (window as any).ToggleVideo = this.ToggleVideo.bind(this);
    }

    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void {
        setVideos(localVideoElement, remoteVideoElement);
    }

    setHubUrl(hubUrl: string): void {
        console.log('Setting hub URL to:', hubUrl);
        setHubUrl(hubUrl);
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

    async startLocalMediaAsync(): Promise<void> {
        await startLocalMedia();
    }

    async setAudio(mute: boolean): Promise<void> {
        setAudio(mute);
    }

    async setVideo(stopVideo: boolean): Promise<void> {
        setVideo(stopVideo);
    }

    async toggleAudio(): Promise<void> {
        toggleAudio();
    }

    async toggleVideo(): Promise<void> {
        toggleVideo();
    }
    
    async startCallAsync(): Promise<void> {
        await startCall();
        this.onCallStarted?.emit();
    }

    async remoteStartCallAsync(): Promise<void> {
        await startCall(false);
        this.onCallStarted?.emit();
    }

    async endCallAsync(): Promise<void> {
        await endCall();
        this.onCallEnded?.emit();
    }

    async startHubConnectionAsync(): Promise<void> {
        console.log('Starting hub connection...');
        await startHubConnection();
        console.log('Hub connection started.');
    }
}