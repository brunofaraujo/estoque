import { Module } from '@nestjs/common';
import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MovesController],
  providers: [MovesService],
  imports: [PrismaModule],
})
export class MovesModule {}
