# Blazor client for .NET WebRTC

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

You can go through the [**Sample Blazor Web App**](https://github.com/VeritasSoftware/WebRTC/tree/master/SampleBlazorWebApp) to see how to use the Client. 

Client supports .NET 8.0 & 9.0.

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
        event Func<string, Task> OnChatMessage;
        event Func<VideoSessionRecordingResult, Task> OnVideoSessionRecording;
        event Func<FileTransferResult, Task> OnFileTransfer;        
        event Func<string, Task> OnCallEnded;
        Task SetDotNetRefAsync();        
        Task SetRoomIdAsync(string roomId);
        Task SetLocalUniqueIdAsync(string localUniqueId);
        Task SetVideosAsync(ElementReference local, ElementReference remote);
        Task SetHubUrlAsync(string url);
        Task StartHubConnectionAsync();
        Task InviteAsync(string remoteUniqueId);
        Task InviteGroupAsync(string[] remoteUniqueIds);
        Task InviteAllAsync();
        Task AcceptInviteAsync(string roomId);
        Task StartLocalMediaAsync(bool startVideo = true, bool startAudio = true);
        Task StartLocalScreenMediaAsync(bool startAudio = false);
        Task StartPeerConnectionAsync(string iceServerUrl = "stun:stun.l.google.com:19302");
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
        Task SendChatMessageAsync(string message);
        Task TransferFileAsync(byte[] data, string fileName, string mimeType);
        Task StartRecordingAsync();
        Task StopRecordingAsync();
        Task EndCallAsync();               
    }
```

## Documentation

https://github.com/VeritasSoftware/WebRTC