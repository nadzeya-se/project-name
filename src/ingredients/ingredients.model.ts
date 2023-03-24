import { prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export interface IngredientsModel extends Base {}

export class IngredientsModel extends TimeStamps {
	@prop()
	name: string

	@prop()
	photo: string

	@prop({ unique: true })
	slug: string
}
