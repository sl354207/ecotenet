import commentSchema from "@schema/comment.json";
import Ajv from "ajv";

// remove allErrors in production?
export const ajv = new Ajv({ allErrors: true });
ajv.addSchema(commentSchema, "comment");
