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
    setAudioAsync(mute: boolean): Promise<void>;
    setVideoAsync(stopVideo: boolean): Promise<void>;
    toggleAudioAsync(): Promise<void>;
    toggleVideoAsync(): Promise<void>;
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    endCallAsync(): Promise<void>;        
}
