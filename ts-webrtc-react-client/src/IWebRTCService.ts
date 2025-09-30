export interface IWebRTCService {
    setVideos(localVideoElement: HTMLVideoElement, remoteVideoElement: HTMLVideoElement): void;
    setHubUrl(hubUrl: string): void;
    setSettings(userId: string, remoteUserId: string): void;
    inviteAsync(): Promise<void>;
    inviteAllAsync(): Promise<void>;
    acceptInviteAsync(roomId: string): Promise<void>;
    startCallAsync(): Promise<void>;
    remoteStartCallAsync(): Promise<void>;
    endCallAsync(): Promise<void>;
    startHubConnectionAsync(): Promise<void>;
}
