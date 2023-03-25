import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateDessertDto } from './create-dessert.dto';
import { DessertModel } from './dessert.model';

@Injectable()
export class DessertService {
    constructor(
		@InjectModel(DessertModel) private readonly dessertModel: ModelType<DessertModel>
	) {}

    async bySlug(slug: string){
        const doc = await this.dessertModel.findOne({slug}).populate('genres desserts').exec()
		if(!doc) throw new NotFoundException('Dessert not found')
        return doc
	}

	async getAll(searchTerm?: string){
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
            
				],
			}
		}

		return this.dessertModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('genres desserts')
			.exec()
	}

	async byDessert(dessertId: Types.ObjectId) {
		const docs = await this.dessertModel.find({desserts: dessertId}).populate('genres desserts').exec()
		if(!docs) throw new NotFoundException('Desserts not found')
        return docs
	}

	async byGenres(genreIds: Types.ObjectId[]){
		const docs = await this.dessertModel.find({ genres: { $in: genreIds } }).exec()
		if(!docs) throw new NotFoundException('Desserts not found')
        return docs
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.dessertModel.findOneAndUpdate(
			{ slug }, { $inc: { countOpened: 1 } })
			.exec()
		if(!updateDoc) throw new NotFoundException('Desserts not found')
        return updateDoc
	}

	/* Admin area */

	async byId(id: string) {
		const doc = await this.dessertModel.findById(id)
		if(!doc) throw new NotFoundException('Dessert not found')
        return doc
	}

	async create() {
		const defaultValue: CreateDessertDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const dessert = await this.dessertModel.create(defaultValue)
		return dessert._id
	}

	async update(_id: string,dto: CreateDessertDto){
		const updateDoc = await  this.dessertModel.findByIdAndUpdate(_id, dto, { new: true }).exec()
		if(!updateDoc) throw new NotFoundException('Dessert not found')
        return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.dessertModel.findByIdAndDelete(id).exec()
		if(!deleteDoc) throw new NotFoundException('Dessert not found')
        return deleteDoc
	}

	async getMostPopular() {
		return this.dessertModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateRating(id: string, newRating: number) {
		return this.dessertModel
			.findByIdAndUpdate(id, { rating: newRating }, { new: true })
			.exec()
	}

}
