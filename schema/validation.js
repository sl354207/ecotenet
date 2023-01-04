import commentSchema from "@schema/comment.json";
import personSchema from "@schema/person.json";
import Ajv from "ajv";
import addFormats from "ajv-formats";

// remove allErrors in production?
export const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajv.addSchema(commentSchema, "comment");
ajv.addSchema(personSchema, "person");
