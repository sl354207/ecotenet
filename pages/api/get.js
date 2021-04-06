// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getMovies } from '../../utils/mongodb'

export default async (req, res) => {
  
  const movies = await getMovies();
  return res.json(movies);
  
};
