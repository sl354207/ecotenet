import { createMovie } from '../../utils/mongodb';

export default async function handler(req, res) {
    const { id, version, rows } = req.body;
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }
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