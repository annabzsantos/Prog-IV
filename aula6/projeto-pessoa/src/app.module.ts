import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PessoaModule } from './pessoa/pessoa.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PessoaModule],
})
export class AppModule {}
