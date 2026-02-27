import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantidModule } from './plantid/plantid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlantidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
