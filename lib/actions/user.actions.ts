'use server'

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "@/types/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params:any){
    try {
        connectToDatabase()

        const {userId} = params;

        const user = await User.findOne({
            clerkId: userId
        })

        return user
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createUser(userData: CreateUserParams){
    try {
        connectToDatabase()
        const newUser = await User.create(userData)
        return newUser
    } catch (error) {
        console.log(error)
        throw error;
    }
}
export async function updateUser(params: UpdateUserParams){
    try {
        connectToDatabase()
        const {clerkId, updateData, path} = params
        await User.findOneAndUpdate({clerkId}, updateData, {
            new:true
        })
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function deleteUser(params: DeleteUserParams){
    try {
        connectToDatabase()
        const {clerkId} = params

        const user = await User.findOne({clerkId});
        if(!user){
            throw new Error('user not found');
        }

        // delete everything the user has ever done

        // get user question Ids
        // const userQuestionIds = await Question.find({author: user._id}).distinct('_id');
        // delete user questions
        await Question.deleteMany({author: user._id})

        // TODO: Delete User answers andcomments

        const deletedUser = await User.findByIdAndDelete(user._id)
        return deletedUser;
    } catch (error) {
        console.log(error)
        throw error;
    }
}