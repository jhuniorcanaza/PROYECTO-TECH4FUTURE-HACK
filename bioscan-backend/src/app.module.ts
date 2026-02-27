import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentificacionController } from './identificacion/identificacion.controller';
import { IdentificacionService } from './identificacion/identificacion.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { EspeciesController } from './especies/especies.controller';
import { EspeciesService } from './especies/especies.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
  ],
  controllers: [
    AppController,
    IdentificacionController,
    ChatController,
    EspeciesController,
  ],
  providers: [
    AppService,
    IdentificacionService,
    ChatService,
    EspeciesService,
  ],
})
export class AppModule {}
