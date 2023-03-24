import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [GenreModule, FileModule]
})
export class Module {}
