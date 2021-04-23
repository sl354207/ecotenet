import { createMovie } from '../../utils/mongodb';

// api endpoint to post a movie to the database
export default async function handler(req, res) {
     // body must be in same format as database query
    const { id, version, rows } = req.body;

    // only allow post method
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }
    // try post request, if successful return response, otherwise return error message.
    try {
        const createdMovie = await createMovie(
            id,
            version,
            rows
        );

        return res.status(200).json(createdMovie);
    } catch (err) {
        console.error(err);
        
        res.status(500).json({ msg: 'Something went wrong.' });
    }
}

// export default async function handler(req, res) {
//     const { value } = req.body;
//     if (req.method !== 'POST') {
//         return res.status(405).json({ msg: 'Method not allowed' });
//     }
//     try {
//         const createdMovie = await createMovie(
//             value
//         );
//         return res.status(200).json(createdMovie);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Something went wrong.' });
//     }
// }