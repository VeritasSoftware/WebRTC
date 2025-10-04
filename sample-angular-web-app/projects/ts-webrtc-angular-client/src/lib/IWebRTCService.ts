import { EventEmitter } from "@angular/core";

export interface IWebRTCService {
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    setSettings(userId: string, remoteUserId: string): void;
    inviteAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startLocalMediaAsync(): Promise<void>;
    setAudio(mute: boolean): void;
    setVideo(stopVideo: boolean): void;
    toggleAudio(): void;
    toggleVideo(): void;
    startCallAsync(): Promise<void>;
    remoteStartCallAsync(): Promise<void>;
    endCallAsync(): Promise<void>;
    startHubConnectionAsync(): Promise<void>;
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    onToggleAudio: EventEmitter<boolean>;
    onToggleVideo: EventEmitter<boolean>;
    onCallStarted: EventEmitter<void>;
    onCallEnded: EventEmitter<void>;
    // Additional methods that could be added in the future:
    // muteAudio(): void;
    // unmuteAudio(): void;
    // muteVideo(): void;
    // unmuteVideo(): void;
    // switchCamera(): Promise<void>;
    // onCallStarted(callback: () => void): void;
    // onCallEnded(callback: () => void): void;
    // onError(callback: (error: any) => void): void;
}
