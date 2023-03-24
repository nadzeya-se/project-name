import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { IngredientsDto } from './ingredients.dto';
import { IngredientsModel } from './ingredients.model';

@Injectable()
export class IngredientsService {
    constructor(
		@InjectModel(IngredientsModel)
		private readonly IngredientsModel: ModelType<IngredientsModel>
	) {}
async bySlug(slug:string){
        const doc = await this.IngredientsModel.findOne({slug}).exec()
        if(!doc) throw new NotFoundException('Ingredient not found')
        return doc
    }

    async getAll(searchTerm?:string){
        let options={}

        if(searchTerm)
        options={
            $or:[
                {
                    name: new RegExp(searchTerm, 'i')
                },

                {
                    slug: new RegExp(searchTerm, 'i')
                },
            ]
        }
        //aggregation
        return this.IngredientsModel.find(options).select('-updatedAt -__v').sort({
            createdAt:'desc'
        }).exec()

    }

   

    //*Admin place*/

    async byId(_id:string){
        const ingredients = await this.IngredientsModel.findById(_id)
        if(!ingredients) throw new NotFoundException ('Ingredient not found')
        return ingredients
    }

    async update(_id:string, dto: IngredientsDto){
        const updateDoc = this.IngredientsModel.findByIdAndUpdate(_id,dto, {
            new:true
        } ).exec()

        if(!updateDoc) throw new NotFoundException('Ingredient not found!')
        return updateDoc
    }

    async create(){
       const defaultValue:IngredientsDto =  {
        name:'',
        slug:'',
        photo:''
       }
       const ingredient = await this.IngredientsModel.create(defaultValue)
       return ingredient._id
    }

    async delete(id:string){
       const deleteDoc = this.IngredientsModel.findByIdAndDelete(id).exec()

       if(!deleteDoc) throw new NotFoundException('Ingredient not found!')
       return deleteDoc
    }
}
