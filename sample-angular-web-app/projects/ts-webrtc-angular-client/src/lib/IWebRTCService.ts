import { EventEmitter } from "@angular/core";
import { FileTransferResult, VideoSessionRecordingResult } from "./models";

export interface IWebRTCService {
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    onCallStarted: EventEmitter<string>;
    onToggleAudio: EventEmitter<boolean>;
    onToggleVideo: EventEmitter<boolean>;
    onChatMessage: EventEmitter<string>;
    onVideoSessionRecording: EventEmitter<VideoSessionRecordingResult>;
    onFileTransfer: EventEmitter<FileTransferResult>;    
    onCallEnded: EventEmitter<string>;    
    setRoomId(roomId:string) : void;
    setLocalUniqueId(localUniqueId: string): void;
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    startHubConnectionAsync(): Promise<void>;
    inviteAsync(remoteUniqueId: string): Promise<void>;
    inviteGroupAsync(remoteUniqueIds: string[]): Promise<void>;
    inviteAllAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startLocalMediaAsync(startVideo: boolean, startAudio: boolean): Promise<void>;
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
    setBackgroundImageAsync(url: string): Promise<void>;
    // Background color - Accepts any valid CSS color value (e.g., "red", "#FF0000", "rgb(255, 0, 0)", etc.).
    setBackgroundColorAsync(color: string): Promise<void>;
    // Brightness - Minimum value is 0.0, maximum value is 2.0, default value is 1.0, step of 0.1.
    setBrightnessAsync(value: number): Promise<void>;
    // Contrast - Minimum value is 0.0, maximum value is 2.0, default value is 1.0, step of 0.1.
    setContrastAsync(value: number): Promise<void>;
    // Blur - Minimum value is 0, maximum value is 20, default value is 0, step is 1.
    setBlurAsync(value: number): Promise<void>;
    // FPS - Minimum value is 1, maximum value is 30, default value is 24, step of 1.
    setFPSAsync(value: number): Promise<void>;
    setGrayScaleAsync(grayScale: boolean): Promise<void>
    // Reaction - Accepts any valid CSS emoji character (e.g., "😀", "❤️", "👍", etc.).
    setReactionAsync(emoji: string, x: number, y: number, duration: number): Promise<void>;
    toggleAudioAsync(): Promise<void>;
    toggleVideoAsync(): Promise<void>;
    sendChatMessageAsync(message: string): Promise<void>;
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    startRecording(): void;
    stopRecording(): void;
    endCallAsync(): Promise<void>;        
}
