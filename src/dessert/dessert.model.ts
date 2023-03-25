import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { GenreModel } from 'src/genre/genre.model'
import { IngredientsModel } from 'src/ingredients/ingredients.model'

export interface DessertModel extends Base {}

export class Parameters {
	@prop()
	weight: number

	@prop()
	count: number

	@prop()
	country: string
}

export class DessertModel extends TimeStamps {
	@prop()
	poster: string

	@prop()
	bigPoster: string

	@prop({ unique: true })
	title: string

	@prop()
	parameters: Parameters

	@prop({ default: 4.0 })
	rating?: number

	@prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[]

	@prop({ default: 0 })
	countOpened?: number

	@prop({ unique: true })
	videoUrl: string

	@prop({ ref: () => IngredientsModel })
	ingredients: Ref<IngredientsModel>[]

	@prop({ unique: true })
	slug: string

	@prop({ default: false })
	isSendTelegram?: boolean
}
