import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

@NgModule({
    declarations: [
        ChatComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ChatRoutingModule
    ]
})
export class ChatModule { }
