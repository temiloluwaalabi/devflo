'use server'

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model";
import { AnswerVoteParams, CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "@/types/shared";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";


export async function getQuestions(params: GetQuestionsParams){
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({
                path: 'tags', model: Tag
            })
            .populate({
                path: 'author', model: User
            })
            .sort({
                createdAt: -1
            })
            
            return {questions};
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getQuestionById(params: GetQuestionByIdParams){
    try {
        connectToDatabase()
        const {questionId} = params
        const question = await Question.findById(questionId)
            .populate({path: 'tags', model: Tag, select: '_id name'})
            .populate({path: 'author', model: User, select: '_id clerkId name picture'})

        return question;
    } catch (error) {
        console.log(error)
        throw Error;
    }
}

export async function createQuestion(params:CreateQuestionParams){
    try {
        // connect to DB
        connectToDatabase();
        // TODO: Accept parameters
        const {title, content, tags, author, path} = params;

        // TODO: create the question
        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocuments = [];

        // TODO: create tags or get them if they already exists 
        for(const tag of tags){
            const existingTag = await Tag.findOneAndUpdate({
                name: {
                    $regex: new RegExp(`^${tag}$`, "i")
                }
            }, 
            {
                $setOnInsert: {name: tag}, $push:{
                    questions: question._id
                }
            },
            {
                upsert: true, new: true
            }
            )

            tagDocuments.push(existingTag._id)
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: {tags: {$each: tagDocuments}}
        })

        revalidatePath(path)
    } catch (error) {
        
    }
}


export async function upvoteQuestion(params:QuestionVoteParams) {
    try {
        connectToDatabase()

        const {questionId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQuery = {};

        if(hasupVoted){
            updateQuery = { $pull: {upvotes: userId}}
        }else if(hasdownVoted){
            updateQuery = {
                $pull: {downvotes: userId},
                $push: {upvotes: userId}
            }
        }else{
            updateQuery = {$addToSet: {upvotes: userId}}
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new: true})

        if(!question){
            throw new Error("Question not found")
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}
export async function downVoteQuestion(params:QuestionVoteParams) {
    try {
        connectToDatabase()

        const {questionId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQuery = {};

        if(hasdownVoted){
            updateQuery = { $pull: {downvotes: userId}}
        }else if(hasupVoted){
            updateQuery = {
                $pull: {upvotes: userId},
                $push: {downvotes: userId}
            }
        }else{
            updateQuery = {$addToSet: {downvotes: userId}}
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new: true})

        if(!question){
            throw new Error("Question not found")
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}
export async function downvoteAnswer(params:AnswerVoteParams) {
    try {
        connectToDatabase()

        const {answerId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQuery = {};

        if(hasdownVoted){
            updateQuery = { $pull: {downVotes: userId}}
        }else if(hasupVoted){
            updateQuery = {
                $pull: {upVotes: userId},
                $push: {downVotes: userId}
            }
        }else{
            updateQuery = {$addToSet: {downVotes: userId}}
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {new: true})

        if(!answer){
            throw new Error("Answer not found")
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}
export async function upvoteAnswer(params:AnswerVoteParams) {
    try {
        connectToDatabase()

        const {answerId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQuery = {};

        if(hasupVoted){
            updateQuery = { $pull: {upVotes: userId}}
        }else if(hasdownVoted){
            updateQuery = {
                $pull: {downVotes: userId},
                $push: {upVotes: userId}
            }
        }else{
            updateQuery = {$addToSet: {upVotes: userId}}
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {new: true})

        if(!answer){
            throw new Error("Answer not found")
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}

