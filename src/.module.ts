import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { DessertModule } from './dessert/dessert.module';

@Module({
  imports: [GenreModule, FileModule, IngredientsModule, DessertModule]
})
export class Module {}
