import { EventEmitter } from "@angular/core";
import { FileTransferResult } from "./models";

export interface IWebRTCService {
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    setRoomId(roomId:string) : void;
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
    transferFile(data:Uint8Array, name:string, type:string): Promise<void>;
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    onToggleAudio: EventEmitter<boolean>;
    onToggleVideo: EventEmitter<boolean>;
    onCallStarted: EventEmitter<void>;
    onCallEnded: EventEmitter<void>;
    onFileTransfer: EventEmitter<FileTransferResult>;
}
