# .NET WebRTC

A .NET library for WebRTC, enabling real-time communication in your web applications.

## Features

- Peer-to-peer audio and video communication
- Peer-to-peer screen sharing
- Peer-to-peer file transfer
- Data channels for real-time data transfer
- High-level API for simplified WebRTC operations
- Client available for Blazor, Angular, React
- Cross-platform support (Windows, macOS, Linux) for Server

## Server

You can use any ASP.NET Core web application to host the Server.

You can even use just a Console app as a Server.

Just create one with Web Sdk (project file):

```
<Project Sdk="Microsoft.NET.Sdk.Web">
```

I have used a Web API (SampleApi).

```csharp
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(origin => true)
                                                    .WithOrigins("https://localhost:7086/"));
});
```

```csharp
app.UseCors("MyPolicy");
.
.
app.MapHub<VideoChatHub>("/chathub");
```

## Blazor Client

You can go through my SampleBlazorWebApp to see how to use the Client.

[**Browse client library**](https://github.com/VeritasSoftware/WebRTC/tree/master/WebRTC.Blazor.Client)

Below are the methods and events supported by the library.

```csharp
    public interface IWebRTCService
    {
        event Func<string, Task> OnInvite;
        event Func<Task> OnInviteAccepted;
        event Func<string, Task> OnCallStarted;
        event Func<bool, Task> OnToggleAudio;
        event Func<bool, Task> OnToggleVideo;
        event Func<FileTransferResult, Task> OnFileTransfer;        
        event Func<string, Task> OnCallEnded;
        Task SetDotNetRefAsync();        
        Task SetRoomIdAsync(string roomId);
        Task SetSettingsAsync(string userId, string myUserId);
        Task SetVideosAsync(ElementReference local, ElementReference remote);
        Task SetHubUrlAsync(string url);
        Task StartHubConnectionAsync();
        Task InviteAsync();
        Task InviteAllAsync();
        Task AcceptInviteAsync(string roomId);
        Task StartLocalMediaAsync();
        Task StartLocalScreenMediaAsync(bool startAudio = false);
        Task StartCallAsync();
        Task StartScreenShareAsync();
        Task RemoteStartCallAsync();
        Task RemoteStartScreenShareAsync();
        Task SwitchVideoToScreenShareAsync();
        Task SwitchScreenShareToVideoAsync();
        Task SetAudioAsync(bool mute);
        Task SetVideoAsync(bool stopVideo);
        Task ToggleAudioAsync();
        Task ToggleVideoAsync();
        Task TransferFileAsync(byte[] data, string fileName, string mimeType);
        Task EndCallAsync();               
    }
```

## Angular Client

You can go through sample-angular-web-app to see how to use the Client.

[**Browse client library**](https://github.com/VeritasSoftware/WebRTC/tree/master/sample-angular-web-app/projects/ts-webrtc-angular-client/src/lib)

Below are the methods and events supported by the library.

```typescript
export interface IWebRTCService {
    onInvite: EventEmitter<string>;
    onInviteAccepted: EventEmitter<void>;
    onCallStarted: EventEmitter<string>;
    onToggleAudio: EventEmitter<boolean>;
    onToggleVideo: EventEmitter<boolean>;
    onFileTransfer: EventEmitter<FileTransferResult>;    
    onCallEnded: EventEmitter<string>;    
    setRoomId(roomId:string) : void;
    setSettings(userId: string, remoteUserId: string): void;
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
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    endCallAsync(): Promise<void>;        
}
```

## React Client

You can go through sample-react-web-app to see how to use the Client.

[**Browse client library**](https://github.com/VeritasSoftware/WebRTC/tree/master/ts-webrtc-react-client/src)

Below are the methods supported by the library.

```typescript
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
    transferFileAsync(data:Uint8Array, name:string, type:string): Promise<void>;
    endCallAsync(): Promise<void>;        
}
```

The events are:

```typescript
onInvite
onInviteAccepted
onCallStarted
onToggleAudio
onToggleVideo
onFileTransfer
onCallEnded
```

## Steps to run the demo

Run the SampleApi first, then run the SampleBlazorWebApp or sample-angular-web-app or sample-react-web-app.

Open multiple browsers (eg. Edge & Chrome), each with their own camera & microphone, to see the WebRTC communication in action. 

On the video chat page, select "Local" in the dropdown in one browser first.

Then, "Remote" in the other browser.

Make sure to allow camera & microphone access when prompted by the browser.

In the Local browser, click "Invite" to invite the Remote browser.

Then, the Remote browser, automatically accepts the Invite in the demo but you can defer it too.

In the Local browser, "Invite accepted." is shown.

Then, in the Local browser, click "Start Call" to start the WebRTC communication.

When done, click "End Call" in either browser to end the call.

## WebRTC communication supported by the system

![WebRTC Communication](Docs/VideoChatSequenceDiagram.png)