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
        Task SetBackgroundImageAsync(string url);
        // Reaction - Accepts any valid CSS emoji character (e.g., "😀", "❤️", "👍", etc.).
        Task SetReactionAsync(string reaction, int x = 0, int y = 0, int duration = 5000);
        // Background color - Accepts any valid CSS color value (e.g., "red", "#FF0000", "rgb(255, 0, 0)", etc.).
        Task SetBackgroundColorAsync(string color);
        // Brightness - Minimum value is 0.0, maximum value is 2.0, default value is 1.0, step of 0.1.
        Task SetBrightnessAsync(decimal brightness = 1.0m);
        // Contrast - Minimum value is 0.0, maximum value is 2.0, default value is 1.0, step of 0.1.
        Task SetContrastAsync(decimal contrast = 1.0m);
        // Blur - Minimum value is 0, maximum value is 20, default value is 0, step is 1.
        Task SetBlurAsync(int blur = 0);
        // FPS - Minimum value is 1, maximum value is 30, default value is 24, step of 1.
        Task SetFPSAsync(int fps = 24);
        Task SetGrayScaleAsync(bool grayScale = false);
        Task ToggleAudioAsync();
        Task ToggleVideoAsync();
        Task SendChatMessageAsync(string message);
        Task TransferFileAsync(byte[] data, string fileName, string mimeType);
        Task StartRecordingAsync();
        Task StopRecordingAsync();
        Task EndCallAsync();               
    }
}