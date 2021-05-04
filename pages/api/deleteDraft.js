import { deleteDraft } from '../../utils/mongodb'

// api endpoint to delete a draft from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== 'DELETE') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { _id } = req.body;
  // try get request, if successful return response, otherwise return error message
  try {
    const deleted = await deleteDraft(_id);

    return res.status(200).json(deleted);

  }
  catch (err) {
    console.log(err);
    
    res.status(500).json({ msg: 'something went wrong'});
  }
  
  
};