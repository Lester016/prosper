import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { loggerMiddleware } from './logger.middleware';
import { UserModule } from './user/user.module';

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
