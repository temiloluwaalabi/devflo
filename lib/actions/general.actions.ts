'use server'
import { SearchParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const searchableTypes = ["question", "answer", "user", "tag"]

export async function globalSearch(params: SearchParams){
    try {
        await connectToDatabase();

        const {query, type} = params

        const regexQuery = {$regex: query, $options: 'i'};
        let results = []
        
        const modelsAndTypes = [
            {model: Question, searchField: 'title', type: 'question'},
            {model: User, searchField: 'name', type: 'user'},
            {model: Answer, searchField: 'content', type: 'answer'},
            {model: Tag, searchField: 'name', type: 'tag'},
        ]
        const typeLower = type?.toLowerCase();
        if(!typeLower || !searchableTypes.includes(typeLower)){
            // do something
            for (const {model, searchField, type} of modelsAndTypes){
                const queryResult = await model
                    .find({ [searchField] : regexQuery})
                    .limit(2);
                    results.push(
                        ...queryResult.map((item) => (
                            {
                                title: type === 'answer' ? `Answers containing ${query}`: item[searchField],
                                type,
                                id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item._id
                            }
                        ))
                    )
            }
        }else{
            const modelInfo = modelsAndTypes.find((item) => item.type === type)

            if(!modelInfo){
                throw new Error("Invalid search type")
            }

            const queryResult = await modelInfo.model
                .find({[modelInfo.searchField]: regexQuery})
                .limit(8)

                results = queryResult.map((item) => ({
                    title: type === 'answer' ? `Answers containing ${query}`: item[modelInfo.searchField],
                    type,
                    id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item._id
                }))
        }

        return JSON.stringify(results)
    } catch (error) {
        console.log(`Error fetching global result, ${error}`);
        throw error
    }
}