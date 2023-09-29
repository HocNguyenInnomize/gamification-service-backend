import { Global, Module } from '@nestjs/common';
import { ConstantService } from './constant.service';
import { DaprRequestParserService } from './daprRequestParser.service';

@Global()
@Module({
  providers: [ConstantService, DaprRequestParserService],
  exports: [ConstantService],
})
export class CommonModule {}
