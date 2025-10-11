namespace SampleBlazorWebApp.Models
{
    public class FileResult
    {
        public byte[] Data { get; set; } = new byte[0];
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class FilesResult
    {
        public ICollection<FileResult> Files { get; set;} = new List<FileResult>();
    }
}
