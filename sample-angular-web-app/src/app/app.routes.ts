import { Routes } from '@angular/router';
import { MyVideoChatComponent } from './pages/my-video-chat/my-video-chat.component';

export const routes: Routes = [
    { path: '', redirectTo: '/video-chat', pathMatch: 'full' },
    { path: 'video-chat', component: MyVideoChatComponent },
];
