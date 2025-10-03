import { IWebRTCService } from "./IWebRTCService";
import { setVideos, setHubUrl, setSettings, invite, inviteAll, acceptInvite, startCall, endCall, startHubConnection, toggleAudio, toggleVideo } from './client';

export class WebRTCService implements IWebRTCService {  
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

        const onInviteEvent = new CustomEvent<string>("onInvite", { detail: roomId });
      
        window.dispatchEvent(onInviteEvent);
    }
    
    InviteAccepted(): void {
        console.log('OnAcceptInvite fired.');

        const onInviteAcceptedEvent = new CustomEvent("onInviteAccepted");
      
        window.dispatchEvent(onInviteAcceptedEvent);
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

    async toggleAudioAsync(): Promise<void> {
        await toggleAudio();
    }

    async toggleVideoAsync(): Promise<void> {
        await toggleVideo();
    }
    
    async startCallAsync(): Promise<void> {
        await startCall(true);

        const onCallStarted = new CustomEvent("onCallStarted");
      
        window.dispatchEvent(onCallStarted);
    }

    async remoteStartCallAsync(): Promise<void> {
        await startCall(false);

        const onCallStarted = new CustomEvent("onCallStarted");
      
        window.dispatchEvent(onCallStarted);
    }

    async endCallAsync(): Promise<void> {
        await endCall();

        const onCallEnded = new CustomEvent("onCallEnded");
      
        window.dispatchEvent(onCallEnded);
    }

    async startHubConnectionAsync(): Promise<void> {
        console.log('Starting hub connection...');
        await startHubConnection();
        console.log('Hub connection started.');
    }
}