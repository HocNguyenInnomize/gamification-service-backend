import { Global, Module } from '@nestjs/common';

import { ConstantService } from './constant.service';
import { UtilsService } from './utils.service';

@Global()
@Module({
  providers: [ConstantService, UtilsService],
  exports: [ConstantService, UtilsService],
})
export class HelperModule {}
