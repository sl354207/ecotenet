// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getMovies } from '../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405);
  }
  try {
    const movies = await getMovies();
  return res.status(200).json(movies);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'something went wrong'});
  }
  
  
};
