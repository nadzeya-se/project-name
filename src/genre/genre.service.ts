import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
    constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>){}


    async bySlug(slug:string){
        const doc = await this.GenreModel.findOne({slug}).exec()
        if(!doc) throw new NotFoundException('Type not found')
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

                {
                   description: new RegExp(searchTerm, 'i')
                }
            ]
        }

        return this.GenreModel.find(options).select('-updatedAt -__v').sort({
            createdAt:'desc'
        }).exec()

    }

    async getCollections(){
        const genres = await this.getAll()
        const collections = genres
        //write something
        return collections
    }

    //*Admin place*/

    async byId(_id:string){
        const genre = await this.GenreModel.findById(_id)
        if(!genre) throw new NotFoundException ('Type not found')
        return genre
    }

    async update(_id:string, dto: CreateGenreDto){
        const updateDoc = this.GenreModel.findByIdAndUpdate(_id,dto, {
            new:true
        } ).exec()

        if(!updateDoc) throw new NotFoundException('Type not found!')
        return updateDoc
    }

    async create(){
       const defaultValue:CreateGenreDto =  {
        name:'',
        slug:'',
        description:'',
        icon:''
       }
       const genre = await this.GenreModel.create(defaultValue)
       return genre._id
    }

    async delete(id:string){
       const deleteDoc = this.GenreModel.findByIdAndDelete(id).exec()

       if(!deleteDoc) throw new NotFoundException('Type not found!')
       return deleteDoc
    }
}
