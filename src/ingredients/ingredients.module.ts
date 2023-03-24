import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { IngredientsModel } from './ingredients.model';

@Module({
  imports:[
    TypegooseModule.forFeature([
			{
				typegooseClass: IngredientsModel,
				schemaOptions: {
					collection: 'Ingredients',
				},
			},
		]),
  ],
  providers: [IngredientsService],
  controllers: [IngredientsController]
})
export class IngredientsModule {}
