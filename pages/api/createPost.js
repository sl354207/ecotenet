import { createPost } from '../../utils/mongodb';

// api endpoint to post a post to the database
export default async function handler(req, res) {
     // body must be in same format as database query
    const { title,
        author,
        description,
        category, 
        tags,
        id, 
        version, 
        rows } = req.body;

    // only allow post method
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }
    // try post request, if successful return response, otherwise return error message.
    try {
        const createdPost = await createPost(
            title,
            author,
            description,
            category, 
            tags,
            id, 
            version, 
            rows
        );

        return res.status(200).json(createdPost);
    } catch (err) {
        console.error(err);
        
        res.status(500).json({ msg: 'Something went wrong.' });
    }
}