import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

@Module({
  imports: [ProductosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
