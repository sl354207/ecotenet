import { createMovie } from '../../utils/mongodb';

export default async function handler(req, res) {
    const { firstName } = req.body;
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }
    try {
        const createdMovie = await createMovie(
            firstName
        );
        return res.status(200).json(createdMovie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Something went wrong.' });
    }
}