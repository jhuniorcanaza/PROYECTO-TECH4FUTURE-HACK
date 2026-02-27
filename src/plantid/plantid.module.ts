import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlantidController } from './plantid.controller';
import { PlantidService } from './plantid.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 segundos de timeout para las peticiones a Plant.id
    }),
  ],
  controllers: [PlantidController],
  providers: [PlantidService],
  exports: [PlantidService],
})
export class PlantidModule {}
