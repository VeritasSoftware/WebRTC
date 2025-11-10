export interface IWebRTCService {
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
    toggleAudioAsync(): Promise<void>;
    toggleVideoAsync(): Promise<void>;
    sendChatMessageAsync(message: string): Promise<void>;
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    startRecording(): void;
    stopRecording(): void;
    endCallAsync(): Promise<void>;        
}
