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
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { Types } from 'mongoose'
import { DessertService } from './dessert.service'
import { CreateDessertDto } from './create-dessert.dto'

@Controller('dessert')
export class DessertController {
    constructor(private readonly dessertService: DessertService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.dessertService.bySlug(slug)
	}

	@Get('by-dessert/:dessertId')
	async byDessert(@Param('dessertId', IdValidationPipe) dessertId: Types.ObjectId) {
		return this.dessertService.byDessert(dessertId)
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body('genreIds')
		genreIds: Types.ObjectId[]
	) {
		return this.dessertService.byGenres(genreIds)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.dessertService.getAll(searchTerm)
	}

	@Get('/most-popular')
	async getMostPopular() {
		return this.dessertService.getMostPopular()
	}

	@Post('/update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.dessertService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.dessertService.byId(id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.dessertService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateDessertDto
	) {
		const updateDessert = await this.dessertService.update(id, dto)
		if (!updateDessert) throw new NotFoundException('Dessert not found')
		return updateDessert
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.dessertService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Dessert not found')
	}

}
