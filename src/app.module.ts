import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ActionModule } from './action/action.module';
import { UseActionModule } from './use-action/use-action.module';

@Module({
    imports: [UserModule, ActionModule, UseActionModule],
})
export class AppModule {}
