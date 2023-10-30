import { model, models, Schema, Document } from "mongoose";

export interface IAnswer extends Document{
    author: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    content: string;
    upVotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    createdAt: Date
}

const AnswerSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Replace 'User' with the actual model name for authors
        required: true
      },
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question', // Replace 'Question' with the actual model name for questions
        required: true
      },
      content: {
        type: String,
        required: true
      },
      upVotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Replace 'User' with the actual model name for users who upvoted
      }],
      downVotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Replace 'User' with the actual model name for users who downvoted
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const Answer = models.Answer || model('Answer', AnswerSchema) 

export default Answer;