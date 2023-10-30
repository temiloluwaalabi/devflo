import {Document, Schema, models, model} from "mongoose"
export interface IInteraction extends Document{
    user: Schema.Types.ObjectId;
    action: string;
    questions: Schema.Types.ObjectId;
    answers: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    createdAt: Date;
}

const InteractionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Replace 'User' with the actual model name for users
        required: true
      },
      action: {
        type: String,
        required: true
      },
      questions: {
        type: Schema.Types.ObjectId,
        ref: 'Question' // Replace 'Question' with the actual model name for questions
      },
      answers: {
        type: Schema.Types.ObjectId,
        ref: 'Answer' // Replace 'Answer' with the actual model name for answers
      },
      tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag' // Replace 'Tag' with the actual model name for tags
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const Interaction = models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;