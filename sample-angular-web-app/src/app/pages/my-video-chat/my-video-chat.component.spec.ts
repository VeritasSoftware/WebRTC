import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideoChatComponent } from './my-video-chat.component';

describe('MyVideoChatComponent', () => {
  let component: MyVideoChatComponent;
  let fixture: ComponentFixture<MyVideoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVideoChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
