class HomeIndex extends React.Component {
  constructor(props) {
    super(props);
    this.renderCreatePostPanel = this.renderCreatePostPanel.bind(this);
    this.renderCreatePostButton = this.renderCreatePostButton.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
  }

  renderCreatePostPanel() {
    if (this.props.currentUser) {
      return (
        <a href="/posts/new" title="Create a new post">New post</a>
      );
    }
    return (
      <a href="/sign_in" title="Create a new post">Log in to create new posts</a>
    );
  }

  renderCreatePostButton() {
    if (this.props.currentUser) {
      return (
        <a href="/posts/new" className="newPost" title="Create a new post">+</a>
      );
    }
  }

  renderPosts() {
    return this.props.posts.map((post) => {
      return (
        <PostEntry
          users={this.props.users}
          post={post} key={post.id}
          cardinality={this.props.cardinality}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <NavBar
          currentUser={this.props.currentUser}
          detail={this.props.detail}
          search={this.props.search}
        />
        <div className="dashboard">
          <span className="backgroundElement" />
          <div className="indexContent">
            <div className="controlPanel">
              {this.renderCreatePostPanel()}
            </div>
            <ul className="postEntryList">
              {this.renderPosts()}
            </ul>
          </div>
          {this.renderCreatePostButton()}
      </div>
    </div>
    );
  }
}

HomeIndex.propTypes = {
  currentUser: React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
  }),
  posts: React.PropTypes.arrayOf(React.PropTypes.shape({
    created_at: React.PropTypes.string,
    description: React.PropTypes.string,
    id: React.PropTypes.number,
    source_language: React.PropTypes.string,
    target_language: React.PropTypes.string,
    title: React.PropTypes.string,
    user: React.PropTypes.shape({
      created_at: React.PropTypes.string,
      email: React.PropTypes.string,
      favorite_posts: React.PropTypes.array,
      id: React.PropTypes.number,
      username: React.PropTypes.string,
    }),
  })),
  users: React.PropTypes.arrayOf(React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
  })),
  cardinality: React.PropTypes.string,
  detail: React.PropTypes.string,
  search: React.PropTypes.string,
};
