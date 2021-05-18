import DashboardPost from './DashboardPost'

// pass down posts from database through dashboard to DashboardPosts as a prop
const DashboardPosts = ({posts}) => {
    return (
        <div>
            {/* for each post in posts data create a new DashboardPost component */}
            {/* pass in each post as a prop to DashboardPost */}
            {posts.map((post) => 
            (<DashboardPost post={post}/>
            ))}
        </div>
    )
}

export default DashboardPosts