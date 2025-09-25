import { EventEmitter } from "@angular/core";

export interface IWebRTCService {
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    setSettings(userId: string, remoteUserId: string): void;
    inviteAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startCallAsync(): Promise<void>;
    remoteStartCallAsync(): Promise<void>;
    endCallAsync(): Promise<void>;
    startHubConnectionAsync(): Promise<void>;
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    // muteAudio(): void;
    // unmuteAudio(): void;
    // muteVideo(): void;
    // unmuteVideo(): void;
    // switchCamera(): Promise<void>;
    // onCallStarted(callback: () => void): void;
    // onCallEnded(callback: () => void): void;
    // onError(callback: (error: any) => void): void;
}
