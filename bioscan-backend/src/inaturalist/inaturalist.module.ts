import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InaturalistController } from './inaturalist.controller';
import { InaturalistService } from './inaturalist.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 segundos de timeout
    }),
  ],
  controllers: [InaturalistController],
  providers: [InaturalistService],
  exports: [InaturalistService],
})
export class InaturalistModule {}

