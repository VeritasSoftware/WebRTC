using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace WebRTC.Blazor.Client
{
    public class WebRTCService : IWebRTCService
    {
        private readonly IJSRuntime _js;
        private IJSObjectReference? _module;
        private readonly Lazy<Task<IJSObjectReference>> _moduleTask;

        public event Func<string, Task> OnInvite;
        public event Func<Task> OnInviteAccepted;
        public event Func<bool, Task> OnToggleAudio;
        public event Func<bool, Task> OnToggleVideo;

        public WebRTCService(IJSRuntime js)
        {
            _js = js;

            _moduleTask = new(() => js.InvokeAsync<IJSObjectReference>(
                "import", "./_content/WebRTC.Blazor.Client/client.js").AsTask());
        }

        [JSInvokable]
        public void Invite(string roomId)
        {
            this.OnInvite?.Invoke(roomId);
        }

        [JSInvokable]
        public void InviteAccepted()
        {
            this.OnInviteAccepted?.Invoke();
        }

        [JSInvokable]
        public void ToggleAudio(bool isMute)
        {
            this.OnToggleAudio?.Invoke(isMute);
        }

        [JSInvokable]
        public void ToggleVideo(bool isVideoStopped)
        {
            this.OnToggleVideo?.Invoke(isVideoStopped);
        }

        public async Task SetDotNetRefAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setDotNetRef", DotNetObjectReference.Create(this));
        }        

        public async Task StartHubConnectionAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startHubConnection");

            Thread.Sleep(200);
        }

        public async Task SetHubUrlAsync(string url)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setHubUrl", url);
        }

        public async Task InviteAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("invite");
        }

        public async Task InviteAllAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("inviteAll");
        }

        public async Task AcceptInviteAsync(string roomId)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("acceptInvite", roomId);
        }

        public async Task ToggleAudioAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("toggleAudio");
        }

        public async Task ToggleVideoAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("toggleVideo");
        }

        public async Task StartCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startCall");
        }

        public async Task RemoteStartCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startCall", false);
        }

        public async Task EndCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("endCall");
        }

        public async Task SetSettingsAsync(string userId, string myUserId)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setSettings", userId, myUserId);
        }

        public async Task SetVideosAsync(ElementReference local, ElementReference remote)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setVideos", local, remote);
        }
    }
}