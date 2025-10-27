import { EventEmitter } from "@angular/core";
import { FileTransferResult } from "./models";

export interface IWebRTCService {
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    onCallStarted: EventEmitter<string>;
    onToggleAudio: EventEmitter<boolean>;
    onToggleVideo: EventEmitter<boolean>;
    onChatMessage: EventEmitter<string>;
    onFileTransfer: EventEmitter<FileTransferResult>;    
    onCallEnded: EventEmitter<string>;    
    setRoomId(roomId:string) : void;
    setSettings(uniqueId: string, remoteUniqueId: string): void;
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    startHubConnectionAsync(): Promise<void>;
    inviteAsync(): Promise<void>;
    inviteAllAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startLocalMediaAsync(): Promise<void>;
    startLocalScreenMediaAsync(startAudio: boolean): Promise<void>;
    startPeerConnectionAsync(iceServerUrl: string): Promise<void>;
    startCallAsync(): Promise<void>;
    startScreenShareAsync(): Promise<void>;
    remoteStartCallAsync(): Promise<void>;
    remoteStartScreenShareAsync(): Promise<void>;
    switchVideoToScreenShareAsync(): Promise<void>;
    switchScreenShareToVideoAsync(): Promise<void>;
    setAudioAsync(mute: boolean): Promise<void>;
    setVideoAsync(stopVideo: boolean): Promise<void>;
    toggleAudioAsync(): Promise<void>;
    toggleVideoAsync(): Promise<void>;
    sendChatMessageAsync(message: string): Promise<void>;
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    endCallAsync(): Promise<void>;        
}
