import { IsString } from "class-validator"

export class IngredientsDto{
    @IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	photo: string
}