export class FileTransferResult {
    data?: string;
    name?: string;
    type?: string;
    size?: number;
}

export class VideoSessionRecordingResult {
    data?: string;
    type?: string;
    streamType?: StreamType;
}

export enum StreamType {
    Local = "Local",
    Remote = "Remote"
}