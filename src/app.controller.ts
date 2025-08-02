import { Controller, All ,NotFoundException} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')  // ловит все запросы, которые не подходят под существующие маршруты
  handleAll() {
    throw new NotFoundException('Ресурс не найден');
  }
}
