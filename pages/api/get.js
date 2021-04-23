// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getMovies, getMovie } from '../../utils/mongodb'

// api endpoint to get all movies or a single movie from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== 'GET') {
    return res.status(405);
  }
  // try get request, if successful return response, otherwise return error message
  try {
    const movies = await getMovies();

    const movie = await getMovie();
    // return res.status(200).json(movies);

    // console.log(movie);
    return res.status(200).json(movie);

  }
  catch (err) {
    console.log(err);
    
    res.status(500).json({ msg: 'something went wrong'});
  }
  
  
};
