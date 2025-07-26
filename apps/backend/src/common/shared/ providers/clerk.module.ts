import { Module } from '@nestjs/common';
import { EnvConfigModule } from 'src/common/config/env/env-config.module';
import { ClerkClientProvider } from './clerk-client.provider';

@Module({
  imports: [EnvConfigModule],
  providers: [ClerkClientProvider],
  exports: ['ClerkClient'],
})
export class ClerkModule {}
