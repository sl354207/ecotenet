import commentSchema from "@schema/comment.json";
import flagSchema from "@schema/flag.json";
import personSchema from "@schema/person.json";
import postSchema from "@schema/post.json";
import Ajv from "ajv";
import addFormats from "ajv-formats";

// remove allErrors and verbose in production?
export const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);
ajv.addSchema(commentSchema, "comment");
ajv.addSchema(personSchema, "person");
ajv.addSchema(postSchema, "post");
ajv.addSchema(flagSchema, "flag");
