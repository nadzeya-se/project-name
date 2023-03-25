import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { DessertController } from './dessert.controller';
import { DessertModel } from './dessert.model';
import { DessertService } from './dessert.service';

@Module({
  imports:[
    TypegooseModule.forFeature([
			{
				typegooseClass: DessertModel,
				schemaOptions: {
					collection: 'Dessert',
				},
			},
		]),
		DessertModel,

  ],
  controllers: [DessertController],
  providers: [DessertService]
})
export class DessertModule {}
