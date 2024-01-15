import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { VolumesController } from './volumes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VolumesController],
  providers: [VolumesService],
})
export class VolumesModule {}
