import { WebRTCService } from "ts-webrtc-react-client";

export enum UserType
{
    Local,
    Remote
}

export class VideoChatProps {
    hubUrl?: string = "https://localhost:7298/chathub";
    videoChatService?: WebRTCService;
    userType?: UserType = UserType.Local;
}