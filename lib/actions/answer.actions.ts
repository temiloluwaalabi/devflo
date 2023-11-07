'use server'

import { CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams){
    try {
        connectToDatabase()
        const {content, author, question, path} = params
        const newAnswer = await Answer.create({content, author, question})

        // TODO: Add the answer to the question answer array

        await Question.findByIdAndUpdate(question, {
            $push: {answers: newAnswer._id}
        })

        // TODO: Add interaction
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getAnswers(params: GetAnswersParams){
    try {
        connectToDatabase()
        const {questionId, sortBy, page = 1, pageSize = 10} = params;

        const skipAmount = (page - 1) * pageSize;

        let sortOptions = {};

        switch (sortBy) {
            case 'highestUpvotes':
                sortOptions = {upVotes: -1}
                break;
            case 'lowestUpvotes':
                sortOptions = {upVotes: 1}
                break;
            case 'recent':
                sortOptions = {createdAt: -1} 
                break;
            case 'old':
                sortOptions = {createdAt: 1}
                break;
        
            default:
                break;
        }
        const answers = await Answer.find({question: questionId})
            .populate('author', "_id clerkId name picture")
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
        
            const totalAnswers = await Answer.countDocuments({
                question: questionId
            })

            const isNext = totalAnswers > skipAmount + answers.length
            return {answers, isNext}
    } catch (error) {
        console.log(error)
        throw error;
    }
}
export async function DeleteAnswer(params: DeleteAnswerParams){
    try {
        connectToDatabase();

        const {answerId, path} = params;
        const answer = await Answer.findById(answerId);

        if(!answer){
            throw new Error("Answer not found")
        }

        await Answer.deleteOne({_id: answerId})
        await Question.updateMany({_id: answer.question}, {
            $pull:{answers: answerId}
        })
        await Interaction.deleteMany({answer: answerId});

        revalidatePath(path);
    } catch (error) {
        console.log(error)
    }
}