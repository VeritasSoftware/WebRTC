using Microsoft.AspNetCore.Components;

namespace WebRTC.Blazor.Client
{
    public interface IWebRTCService
    {
        event Func<string, Task> OnInvite;
        event Func<Task> OnInviteAccepted;
        event Func<bool, Task> OnToggleAudio;
        event Func<bool, Task> OnToggleVideo;
        event Func<FileTransferResult, Task> OnFileTransfer;
        event Func<Task> OnCallStarted;
        event Func<Task> OnCallEnded;
        Task SetDotNetRefAsync();
        Task SetHubUrlAsync(string url);
        Task StartHubConnectionAsync();
        Task InviteAsync();
        Task InviteAllAsync();
        Task AcceptInviteAsync(string roomId);        
        Task StartLocalMediaAsync();
        Task SetAudioAsync(bool mute);
        Task SetVideoAsync(bool stopVideo);
        Task ToggleAudioAsync();
        Task ToggleVideoAsync();
        Task StartCallAsync();
        Task RemoteStartCallAsync();
        Task EndCallAsync();
        Task SetRoomIdAsync(string roomId);
        Task SetSettingsAsync(string userId, string myUserId);
        Task SetVideosAsync(ElementReference local, ElementReference remote);
        Task TransferFileAsync(byte[] data, string fileName, string mimeType);
    }
}