import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantidModule } from './plantid/plantid.module';
import { InaturalistModule } from './inaturalist/inaturalist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlantidModule,
    InaturalistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
