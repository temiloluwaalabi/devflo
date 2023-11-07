'use server'

import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag, {ITag} from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams){
    try {
        connectToDatabase()

        const {userId} = params;

        const user = await User.findById(userId);
        if(!user) throw new Error("User not found!")

        // TODO: find interactions for the user and group by tags...
        // TODO: new model in database called interaction
        
        return [
            {
                _id: '1',
                name: 'tagOne'
            },
            {
                _id: '2',
                name: 'tagTwo'
            },
            {
                _id: '3',
                name: 'tagThree'
            },
        ];
    } catch (error) {
        console.log(error)
        throw Error;
    }
}

export async function getAllTags(params: GetAllTagsParams){
    try {
        connectToDatabase()
        const {searchQuery, filter, page = 1, pageSize = 20} = params;

        const skipAmount = (page - 1 ) * pageSize
        const query: FilterQuery<typeof Tag> = {};
       
        let sortOptions = {};

        switch (filter) {
            case 'popular':
                sortOptions = {questions: -1}
                break;
            case 'recent':
                sortOptions = {createdOn: -1}
                break;
            case 'name':
                sortOptions = {name: 1}
                break;
            case 'old':
                sortOptions = {createdOn: 1}
                break;
        
            default:
                break;
        }
        if(searchQuery){
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, 'i')}}
            ]
        }
        const tags = await Tag.find(query)
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)

        const totalTags = await Tag.countDocuments(query)
        const isNext = totalTags > skipAmount + tags.length
        return {tags, isNext}
    } catch (error) {
        console.log(error)
        throw Error;
    }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams){
    try {
        connectToDatabase();

        const {tagId, page = 1, pageSize = 10, searchQuery} = params
        const skipAmount = (page - 1) * pageSize

        const tagFilter: FilterQuery<ITag> = {_id: tagId}
              
        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery ? {title: {$regex: searchQuery, $options: 'i'}} : {},
            options: {
              sort: { createdAt: -1 },
              skip: skipAmount,
              limit: pageSize + 1
            },
            populate: [
                { path: 'tags', model: Tag, select: '_id name' },
                { path: 'author', model: User, select: '_id clerkId name picture' },
              ]
          });
            if(!tag){
                throw new Error('Tag not found')
            }

            const questions = tag.questions;

            const isNext = tag.questions.length > pageSize
            return {tagTitle: tag.name, questions, isNext}
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getTopPopularTags(){
    try {
        connectToDatabase()

        const popularTags = await Tag.aggregate([
            {$project: {name: 1, numberOfQuestions: {$size: "$questions"}}},
            {$sort: {numberOfQuestions: -1}},
            {$limit: 5}
        ])

        return popularTags;
    } catch (error) {
        console.log(error)
        throw error
    }
}