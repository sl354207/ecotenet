import { updateDraft } from '../../utils/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }

    // body must be in same format as database query
    const {  
        firstName,
        lastName,
        email,
        gender,
        date,
        city, 
        phone, 
        _id,
        id, 
        version, 
        rows } = req.body;
    // console.log(req.body)

    try {
        const updated = await updateDraft(
            firstName,
            lastName,
            email,
            gender,
            date,
            city, 
            phone,
            _id,
            id,
            version,
            rows
        );
        return res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Something went wrong.' });
    }
}