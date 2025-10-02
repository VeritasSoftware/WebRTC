import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { WebRTCService } from '../../../../projects/ts-webrtc-angular-client/src/public-api';

@Component({
  selector: 'app-video-chat',
  imports: [],
  templateUrl: './video-chat.component.html',
  styleUrl: './video-chat.component.css',
  standalone: true,
  providers: [WebRTCService]
})
export class VideoChatComponent {
  
  public _inviteSent: boolean = false;
  public _inviteAccepted: boolean = false;
  public _roomId: string = "";
  public _isMute: boolean = false;
  
  public _callStarted: boolean = false;
  public _callEnded: boolean = false;
  public _errorMessage: string = "";
  public _showError: boolean = false;

  public _disableStartCall: boolean = true;

  constructor(private videoChatService:WebRTCService, private cdr: ChangeDetectorRef) { }
  
  @Input() myUserType: UserType = UserType.Local;

  public get userType(): typeof UserType {
    return UserType; 
  }

  ngOnInit(): void {    
    if (this.myUserType == UserType.Remote) {
      this.videoChatService.onInvite.subscribe( async (roomId:string) => {
        console.log("Invite received in component. Room id:", roomId);
        this._roomId = roomId;
        await this.videoChatService.acceptInviteAsync(roomId);        
      });
    }
    if (this.myUserType == UserType.Local) {
      this.videoChatService.onInviteAccepted.subscribe( async () => {
        console.log("Invite accepted event received in component.");
        
        this._inviteAccepted = true;
        this._disableStartCall = false;

        this.cdr.detectChanges();
      });
    }
    this.videoChatService.onToggleMute.subscribe( (isMute:boolean) => {
      console.log("ToggleMute event received in component. isMute:", isMute);
      this._isMute = isMute;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    //this.videoChatService.setSettings("localUniqueUserId", "remoteUniqueUserId");
    this.videoChatService.setHubUrl("https://localhost:7298/chathub");
    const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
    const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
    this.videoChatService.setVideos(localVideo, remoteVideo);

    (async () => {
      console.log("Component: Starting hub connection.");
      await this.videoChatService.startHubConnectionAsync();
      if (this.myUserType == UserType.Remote) {
        console.log("Component: Starting call as remote user.");
        await this.videoChatService.remoteStartCallAsync();
        this._callStarted = true;
        this.cdr.detectChanges();
      }
    })(); 
  }

  async invite(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      this._inviteSent = false;
      await this.videoChatService.inviteAsync();
      this._inviteSent = true;
    }
    catch (err:any) {
      console.error("Error in invite:", err);
      this._errorMessage = err?.message ?? "Error in invite.";
      this._showError = true;
      this._inviteSent = false;
    }
  }

  async inviteAll(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      this._inviteSent = false;
      await this.videoChatService.inviteAllAsync();
      this._inviteSent = true;
    }
    catch (err:any) {
      console.error("Error in inviteAll:", err);
      this._errorMessage = err?.message ?? "Error in inviteAll.";
      this._showError = true;
      this._inviteSent = false;
    }
  }

  async startCall(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      this._callStarted = false;      
      await this.videoChatService.startCallAsync();
      this._callStarted = true;
      this._disableStartCall = true;
    }
    catch (err:any) {
      console.error("Error in startCall:", err);
      this._errorMessage = err?.message ?? "Error in startCall.";
      this._showError = true;
      this._callStarted = false;
    }
  }

  async toggleMute(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      await this.videoChatService.toggleMuteAsync();
    }
    catch (err:any) {
      console.error("Error in toggleMute:", err);
      this._errorMessage = err?.message ?? "Error in toggleMute.";
      this._showError = true;
    }
  }

  async endCall(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      await this.videoChatService.endCallAsync();
    }
    catch (err:any) {
      console.error("Error in endCall:", err);
      this._errorMessage = err?.message ?? "Error in endCall.";
      this._showError = true;
    }
  }
}

export enum UserType
{
    Local,
    Remote
} 
