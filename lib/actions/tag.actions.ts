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
        const tags = await Tag.find({})

        return {tags}
    } catch (error) {
        console.log(error)
        throw Error;
    }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams){
    try {
        connectToDatabase();

        const {tagId, page = 1, pageSize = 10, searchQuery} = params

        const tagFilter: FilterQuery<ITag> = {_id: tagId}
              
        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery ? {title: {$regex: searchQuery, $options: 'i'}} : {},
            options: {
              sort: { createdAt: -1 },
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
            return {tagTitle: tag.name, questions}
    } catch (error) {
        console.log(error)
        throw error;
    }
}