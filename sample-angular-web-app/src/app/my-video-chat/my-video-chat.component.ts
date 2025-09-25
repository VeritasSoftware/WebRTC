import { Component } from '@angular/core';
import { UserType, VideoChatComponent } from '../../video-chat/video-chat.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-video-chat',
  imports: [FormsModule, VideoChatComponent],
  templateUrl: './my-video-chat.component.html',
  styleUrl: './my-video-chat.component.css'
})
export class MyVideoChatComponent {
  public selectedOption: string = "-1";

  public get userType(): typeof UserType {
      return UserType; 
  }
}
