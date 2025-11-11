# React client for .NET WebRTC

A .NET library for WebRTC, enabling real-time communication in your web applications.

## Features

- High-level API for simplified WebRTC operations
- Peer-to-peer audio+video chat
- Peer-to-peer text chat
- Peer-to-peer screen sharing
- Peer-to-peer file transfer
- Client available for `Blazor`, `Angular`, `React`
- Cross-platform support (Windows, macOS, Linux) for Server

## Server

The .NET WebRTC Server package.

|Packages|Downloads|
|---------------------------|:---:|
|*WebRTC.Server*|[![Downloads count](https://img.shields.io/nuget/dt/WebRTC.Server)](https://www.nuget.org/packages/WebRTC.Server)|

## Client

You can go through the [**Sample React Web App**](https://github.com/VeritasSoftware/WebRTC/tree/master/sample-react-web-app) to see how to use the Client. 

[**Browse client library**](https://github.com/VeritasSoftware/WebRTC/tree/master/ts-webrtc-react-client)

Below are the methods supported by the library.

```typescript
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
```

The events are:

```
onInvite
onInviteAccepted
onCallStarted
onToggleAudio
onToggleVideo
onChatMessage
onVideoSessionRecording
onFileTransfer
onCallEnded
```

## Documentation

https://github.com/VeritasSoftware/WebRTC