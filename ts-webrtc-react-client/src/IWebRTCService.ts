export interface IWebRTCService {
    setRoomId(roomId:string) : void;
    setSettings(userId: string, remoteUserId: string): void;
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    startHubConnectionAsync(): Promise<void>;
    inviteAsync(): Promise<void>;
    inviteAllAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startLocalMediaAsync(): Promise<void>;
    startCallAsync(): Promise<void>;
    remoteStartCallAsync(): Promise<void>;
    setAudio(mute: boolean): void;
    setVideo(stopVideo: boolean): void;
    toggleAudio(): void;
    toggleVideo(): void;
    transferFile(data:Uint8Array, name:string, type:string): void;
    endCallAsync(): Promise<void>;        
}
