import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { IngredientsDto } from './ingredients.dto'
import { IngredientsService } from './ingredients.service'


@Controller('ingredients')
export class IngredientsController {

    constructor(private readonly ingredientsService: IngredientsService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.ingredientsService.getAll(searchTerm)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.ingredientsService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.ingredientsService.create()
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.ingredientsService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: IngredientsDto
	) {
		const updateActor = await this.ingredientsService.update(id, dto)
		if (!updateActor) throw new NotFoundException('Actor not found')
		return updateActor
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.ingredientsService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Actor not found')
	}

}
