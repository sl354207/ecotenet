// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPublishedPosts, getDraft } from '../../utils/mongodb'

// api endpoint to get all published posts or a single draft from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== 'GET') {
    return res.status(405);
  }
  // try get request, if successful return response, otherwise return error message
  try {
    const publishedPosts = await getPublishedPosts();

    const draft = await getDraft();
    // return res.status(200).json(publishedPosts);

    // console.log(draft);
    return res.status(200).json(draft);

  }
  catch (err) {
    console.log(err);
    
    res.status(500).json({ msg: 'something went wrong'});
  }
  
  
};
