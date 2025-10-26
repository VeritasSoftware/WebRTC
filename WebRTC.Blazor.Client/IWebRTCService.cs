using Microsoft.AspNetCore.Components;

namespace WebRTC.Blazor.Client
{
    public interface IWebRTCService
    {
        event Func<string, Task> OnInvite;
        event Func<Task> OnInviteAccepted;
        event Func<string, Task> OnCallStarted;
        event Func<bool, Task> OnToggleAudio;
        event Func<bool, Task> OnToggleVideo;
        event Func<string, Task> OnChatMessage;
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
        Task EndCallAsync();               
    }
}