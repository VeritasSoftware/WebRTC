import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { WebRTCService } from '../../../../projects/ts-webrtc-angular-client/src/public-api';
import { FileTransferResult, StreamType, VideoSessionRecordingResult } from '../../../../projects/ts-webrtc-angular-client/src/lib/models';

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
  public _isVideoStopped: boolean = false;

  public _callStarted: boolean = false;
  public _callEnded: boolean = false;
  public _errorMessage: string = "";
  public _showError: boolean = false;

  public _disableStartCall: boolean = true;

  public _isScreenShare: boolean = false;

  public _isRecordingStarted: boolean = false;

  constructor(private videoChatService:WebRTCService, private cdr: ChangeDetectorRef) { }
  
  @Input() myUserType: UserType = UserType.Local;

  @ViewChild('localChat') localChat!: ElementRef;
  @ViewChild('remoteChat') remoteChat!: ElementRef;

  public get userType(): typeof UserType {
    return UserType; 
  }

  ngOnInit(): void {    
    if (this.myUserType == UserType.Remote) {
      this.videoChatService.onInvite.subscribe( async (roomId:string) => {
        console.log("Invite received in component. Room id:", roomId);
        this._roomId = roomId;

        console.log("Component: Starting call as remote user.");
        await this.videoChatService.remoteStartCallAsync();
        this._callStarted = true;
        this.cdr.detectChanges();

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
    this.videoChatService.onToggleAudio.subscribe( (isMute:boolean) => {
      console.log("ToggleMute event received in component. isMute:", isMute);
      this._isMute = isMute;
      this.cdr.detectChanges();
    });
    this.videoChatService.onToggleVideo.subscribe( (isVideoStopped:boolean) => {
      console.log("ToggleVideo event received in component. isVideoStopped:", isVideoStopped);
      this._isVideoStopped = isVideoStopped;
      this.cdr.detectChanges();
    });
    this.videoChatService.onChatMessage.subscribe( (message:string) => {
      console.log("ChatMessage event received in component. message:", message);
      this.remoteChat.nativeElement.textContent = message
      this.cdr.detectChanges();
    });
    this.videoChatService.onFileTransfer.subscribe( (result:FileTransferResult) => {
      console.log("FileTransfer event received in component. result.name:", result.name);
      (window as any).downloadFileFromByteArray(result.name!, result.type!, this.base64ToUint8Array(result.data!));
      this.cdr.detectChanges();
    });
    this.videoChatService.onVideoSessionRecording.subscribe( (result:VideoSessionRecordingResult) => {
      let name = "Video Session Recording";
      name += (result.streamType == StreamType.Local ? " (Local)" : " (Remote)");
      (window as any).downloadFileFromByteArray(name, result.type!, this.base64ToUint8Array(result.data!));
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
      // Start local media (screen sharing)
      //await this.videoChatService.startLocalScreenMediaAsync();      
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

  async sendMessage(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";   
      await this.videoChatService.sendChatMessageAsync(this.localChat.nativeElement.value);
    }
    catch (err:any) {
      console.error("Error in sendMessage:", err);
      this._errorMessage = err?.message ?? "Error in sendMessage.";
      this._showError = true;
    }
  }

  async switchMe(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      this._callStarted = false; 
      
      if (this._isScreenShare) {
        await this.videoChatService.switchScreenShareToVideoAsync();
        this._isScreenShare = false;
      }
      else {
        await this.videoChatService.switchVideoToScreenShareAsync();
        this._isScreenShare = true;
      }

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

  startStopRecording(): void {
    try {
      this._showError = false;
      this._errorMessage = ""; 
      
      console.log("Start/Stop recording clicked. _isRecordingStarted:", this._isRecordingStarted);

      if (this._isRecordingStarted) {
        this.videoChatService.stopRecording();
        console.log("Recording stopped.");
        this._isRecordingStarted = false;
      }
      else {
        this.videoChatService.startRecording();
        console.log("Recording started.");
        this._isRecordingStarted = true;
      }
      this.cdr.detectChanges();
    }
    catch (err:any) {
      console.error("Error in startStopRecording:", err);
      this._errorMessage = err?.message ?? "Error in startStopRecording.";
      this._showError = true;
    }
  }

  async toggleAudio(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      await this.videoChatService.toggleAudioAsync();
    }
    catch (err:any) {
      console.error("Error in toggleAudio:", err);
      this._errorMessage = err?.message ?? "Error in toggleAudio.";
      this._showError = true;
    }
  }

  async toggleVideo(): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";
      await this.videoChatService.toggleVideoAsync();
    }
    catch (err:any) {
      console.error("Error in toggleVideo:", err);
      this._errorMessage = err?.message ?? "Error in toggleVideo.";
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

  async onFileSelected(event: Event): Promise<void> {
    try {
      this._showError = false;
      this._errorMessage = "";

      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        for (let i=0; i<input.files.length; i++)
        {
          var file:File = input.files[i];
          var b = new Blob([file], {type: file.type});
          var arr = new Uint8Array(await b.arrayBuffer());
          await this.videoChatService.transferFileAsync(arr, file.name, file.type);
        }
      }      
    }
    catch (err:any) {
      console.error("Error in onFileSelected:", err);
      this._errorMessage = err?.message ?? "Error in onFileSelected.";
      this._showError = true;
    }    
  }
  
  base64ToUint8Array(base64String: string): Uint8Array {
    try {
      // Decode the Base64 string into a raw string
      const rawString = atob(base64String);
  
      // Create a Uint8Array with the same length as the raw string
      const uint8Array = new Uint8Array(rawString.length);
  
      // Populate the Uint8Array with the character codes of the raw string
      for (let i = 0; i < rawString.length; i++) {
        uint8Array[i] = rawString.charCodeAt(i);
      }
  
      return uint8Array;
    } catch (error) {
      console.error('Error converting Base64 to Uint8Array:', error);
      throw new Error('Invalid Base64 string');
    }
  }
}

export enum UserType
{
    Local,
    Remote
} 
