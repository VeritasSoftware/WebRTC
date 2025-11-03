namespace WebRTC.Blazor.Client
{
    public class VideoSessionRecordingResult
    {
        public string? Data { get; set; }

        public string? Type { get; set; }

        public StreamType StreamType { get; set; }
    }

    public enum StreamType
    {
        Local,
        Remote
    }
}
