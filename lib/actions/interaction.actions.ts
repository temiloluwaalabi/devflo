'use server'

import { ViewQuestionParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams){
    try {
        connectToDatabase();
        const {questionId, userId} = params;

        // update view count for each question

        await Question.findByIdAndUpdate(questionId, {
            $inc: {views: 1}
        })

        if(userId){
            const existingInteraction = await Interaction.findOne({user: userId,
            action: 'view',
            question: questionId
            })

            if(existingInteraction) return console.log('User has already viewed this question')

            await Interaction.create({
                user: userId,
                action: 'view',
                question: questionId
            })
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}