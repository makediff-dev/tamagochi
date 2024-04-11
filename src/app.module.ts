import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ActionModule } from './action/action.module';

@Module({
    imports: [UserModule, ActionModule],
})
export class AppModule {}
