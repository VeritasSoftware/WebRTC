import { EventEmitter, Injectable } from "@angular/core";
import { IWebRTCService } from "./IWebRTCService";
import { setVideos, setHubUrl, setSettings, invite, inviteAll, acceptInvite, startCall, endCall, startHubConnection } from './client';

[Injectable({
  providedIn: null
})]
export class WebRTCService implements IWebRTCService {
    public onInvite = new EventEmitter<string>();
    public onInviteAccepted = new EventEmitter<void>(); 
    public onCallStarted = new EventEmitter<void>();
    public onCallEnded = new EventEmitter<void>();

    constructor() {
        // Ensure the global functions are available for the client.js to call  
        (window as any).Invite = this.Invite.bind(this);
        (window as any).InviteAccepted = this.InviteAccepted.bind(this);
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
        this.onInvite.emit(roomId);
    }
    
    InviteAccepted(): void {
        console.log('OnAcceptInvite fired.');
        this.onInviteAccepted.emit();
    }
    
    async startCallAsync(): Promise<void> {
        await startCall();
        this.onCallStarted.emit();
    }

    async remoteStartCallAsync(): Promise<void> {
        await startCall(false);
        this.onCallStarted.emit();
    }

    async endCallAsync(): Promise<void> {
        await endCall();
        this.onCallEnded.emit();
    }

    async startHubConnectionAsync(): Promise<void> {
        console.log('Starting hub connection...');
        await startHubConnection();
        console.log('Hub connection started.');
    }
}