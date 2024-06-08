import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Necessary so we won't have to import ConfigModule in other modules.
      envFilePath: [
        `config/env.${process.env.NODE_ENV}`,
        'config/.env',
        '.env',
      ],
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
