using Microsoft.AspNetCore.Components;

namespace WebRTC.Blazor.Client
{
    public interface IWebRTCService
    {
        event Func<string, Task> OnInvite;
        event Func<Task> OnInviteAccepted;
        Task SetDotNetRefAsync();
        Task SetHubUrlAsync(string url);
        Task StartHubConnectionAsync();
        Task InviteAsync();
        Task InviteAllAsync();
        Task AcceptInviteAsync(string roomId);
        Task StartCallAsync();
        Task RemoteStartCallAsync();
        Task EndCallAsync();
        Task SetSettingsAsync(string userId, string myUserId);
        Task SetVideosAsync(ElementReference local, ElementReference remote);
    }
}