import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const Moralis = require('moralis/node')

async function bootstrap() {
  await Moralis.start({ serverUrl: 'https://dcjkf8lvfeyy.usemoralis.com:2053/server', appId: 'Qfv8KnuqR2Nh265j7lNLvomqQ1FkPZVfRtgJYVSy' });
  // await Moralis.enableWeb3();

  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
