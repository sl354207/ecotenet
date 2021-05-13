import DashboardDraft from './DashboardDraft'

// pass down posts from dashboard as a prop
const DashboardDrafts = ({posts}) => {
    return (
        <div>
            {/* for each post in posts data create a new DashboardDraft component */}
            {/* pass in each post as a prop to DashboardDraft */}
            {posts.map((post) => 
            (<DashboardDraft post={post}/>
            ))}
        </div>
    )
}

export default DashboardDrafts