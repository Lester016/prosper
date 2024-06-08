import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use a custom port.
  const configService = app.get(ConfigService);
  const config = {
    host: configService.get<string>('host'),
    port: configService.get<number>('port'),
    origins: configService.get<string>('origin.allowed'),
  };

  await app.listen(configService.get<string>('port'), () => {
    console.log(`Server is running at http://${config.host}:${config.port}`);
  });
}
bootstrap();
