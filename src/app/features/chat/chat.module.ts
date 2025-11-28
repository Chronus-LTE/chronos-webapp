import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { chatReducer } from './store/chat/chat.reducer';
import { ChatEffects } from './store/chat/chat.effects';

@NgModule({
    declarations: [
        ChatComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ChatRoutingModule,
        StoreModule.forFeature('chat', chatReducer),
        EffectsModule.forFeature([ChatEffects])
    ]
})
export class ChatModule { }
