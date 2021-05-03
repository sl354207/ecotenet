// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPosts, getDraftById } from '../../utils/mongodb'

// api endpoint to get all published posts or a single draft from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== 'GET') {
    return res.status(405);
  }
  // try get request, if successful return response, otherwise return error message
  try {
    const posts = await getPosts();

    // const draft = await getDraftById();
    // return res.status(200).json(posts);

    // console.log(draft);
    return res.status(200).json(posts);

  }
  catch (err) {
    console.log(err);
    
    res.status(500).json({ msg: 'something went wrong'});
  }
  
  
};
