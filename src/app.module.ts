import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { loggerMiddleware } from './logger.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      // store: redisStore,
      // host: 'localhost',
      // port: 6379,
      // ttl: 600,
      // max: 1000, // Maximum number of items in the cache
      // password: "sample-pw"
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Necessary so we won't have to import ConfigModule in other modules.
      envFilePath: [
        `config/env.${process.env.NODE_ENV}`,
        'config/.env',
        '.env',
      ],
      load: [configuration],
    }),
    // We use async because we need to inject ConfigService.
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule], No need for this because we have set isGlobal to true.
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.mysql.host'),
        port: configService.get<number>('database.mysql.port'),
        database: configService.get<string>('database.mysql.name'),
        username: configService.get<string>('database.mysql.user'),
        password: configService.get<string>('database.mysql.password'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsTableName: 'migration',
        migrations: ['database/migration/*.{js,ts}'],
      }),
    }),
    // Rate-limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get<string>('THROTTLE_TTL', '60')), // Default to 60 seconds if not set
          limit: parseInt(configService.get<string>('THROTTLE_LIMIT', '10')), // Default to 10 requests if not set
        },
      ],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
