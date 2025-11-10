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
        public event Func<string, Task> OnChatMessage;
        public event Func<FileTransferResult, Task> OnFileTransfer;
        public event Func<VideoSessionRecordingResult, Task> OnVideoSessionRecording;
        public event Func<string, Task> OnCallStarted;
        public event Func<string, Task> OnCallEnded;        

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

        [JSInvokable]
        public void FileTransfer(string data, int size, string fileName, string mimeType)
        {
            this.OnFileTransfer?.Invoke(new FileTransferResult
            {
                Data = data,
                Size = size,
                Name = fileName,
                Type = mimeType
            });
        }

        [JSInvokable]
        public void Recording(string base64String, string mimeType, bool isLocal)
        {
            this.OnVideoSessionRecording?.Invoke(new VideoSessionRecordingResult
            {
                Data = base64String,
                Type = mimeType,
                StreamType = isLocal ? StreamType.Local : StreamType.Remote
            });
        }

        [JSInvokable]
        public void Chat(string data)
        {
            this.OnChatMessage?.Invoke(data);
        }

        [JSInvokable]
        public void CallStarted(string roomId)
        {
            Console.WriteLine($"CallStarted fired. Room id: {roomId}");
            this.OnCallStarted?.Invoke(roomId);
        }

        [JSInvokable]
        public void CallEnded(string roomId)
        {
            Console.WriteLine($"CallEnded fired. Room id: {roomId}");
            this.OnCallEnded?.Invoke(roomId);
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

        public async Task InviteAsync(string remoteUniqueId)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("invite", remoteUniqueId);
        }

        public async Task InviteGroupAsync(string[] remoteUniqueIds)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("inviteGroup", remoteUniqueIds);
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

        public async Task StartLocalMediaAsync(bool startVideo = true, bool startAudio = true)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startLocalMedia", startVideo, startAudio);
        }

        public async Task StartLocalScreenMediaAsync(bool startAudio = false)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startLocalScreenMedia", startAudio);
        }

        public async Task SetAudioAsync(bool mute)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setAudio", mute);
        }

        public async Task SetVideoAsync(bool stopVideo)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setVideo", stopVideo);
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

        public async Task StartPeerConnectionAsync(string iceServerUrl = "stun:stun.l.google.com:19302")
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startPeerConnection", iceServerUrl);
        }

        public async Task StartCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startCall");
        }

        public async Task StartScreenShareAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startScreenShare");
        }

        public async Task RemoteStartCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startCall", false);
        }

        public async Task RemoteStartScreenShareAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startScreenShare", false);
        }

        public async Task SwitchVideoToScreenShareAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("switchVideoToScreenShare", false);
        }

        public async Task SwitchScreenShareToVideoAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("switchScreenShareToVideo", false);
        }

        public async Task EndCallAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("endCall");
        }

        public async Task SetRoomIdAsync(string roomId)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setRoomId", roomId);
        }

        public async Task SetLocalUniqueIdAsync(string localUniqueId)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setLocalUniqueId", localUniqueId);
        }

        public async Task SetVideosAsync(ElementReference local, ElementReference remote)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("setVideos", local, remote);
        }

        public async Task TransferFileAsync(byte[] data, string fileName, string mimeType)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("transferFile", data, fileName, mimeType);
        }

        public async Task StartRecordingAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("startRecording");
        }

        public async Task StopRecordingAsync()
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("stopRecording");
        }

        public async Task SendChatMessageAsync(string message)
        {
            _module = await _moduleTask.Value;

            await _module.InvokeVoidAsync("sendMessage", message);
        }
    }
}