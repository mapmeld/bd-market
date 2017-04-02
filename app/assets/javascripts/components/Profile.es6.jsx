class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showingFavorites: false,
      showingPosts: true,
    };
    this.renderAllPosts = this.renderAllPosts.bind(this);
    this.renderAllUsers = this.renderAllUsers.bind(this);
    this.renderAuthoredPosts = this.renderAuthoredPosts.bind(this);
    this.renderFavoritePosts = this.renderFavoritePosts.bind(this);
    this.currentUserProfile = this.currentUserProfile.bind(this);
    this.toggleShowFavorites = this.toggleShowFavorites.bind(this);
    this.toggleShowPosts = this.toggleShowPosts.bind(this);
    this.toggleShowAll = this.toggleShowAll.bind(this);
    this.renderCreatePostButton = this.renderCreatePostButton.bind(this);
    this.renderDashboardList = this.renderDashboardList.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);
    this.renderUserContent = this.renderUserContent.bind(this);
  }

  renderAllPosts() {
    return this.props.posts.map((post) => {
      return (
        <PostEntry
          // users={this.props.userData}
          post={post}
          key={post.id}
          cardinality={this.props.cardinality}
          phrase={this.props.phrase}
        />
      );
    });
  }
  
  renderAllUsers() {
    return this.props.users.map((user) => {
      return (
        <span>{user}</span>
      );
    });
  }

  renderAuthoredPosts() {
    if (this.props.authoredPosts.length > 0) {
      return this.props.authoredPosts.map((post) => {
        return (
          <PostEntry
            post={post}
            key={post.id}
            cardinality={this.props.cardinality}
            phrase={this.props.phrase}
          />
        );
      });
    } else {
      if (!this.currentUserProfile()) {
        if (this.props.currentUser) {
          return (
            <li className="emptyList">
              <p>You haven't created any posts yet. <a href="/posts/new">Create your first post</a></p>
            </li>
          );
        } else {
          return (
            <li className="emptyList">
              <p>{this.props.userData.username} does not have any posts.</p>
            </li>
          );
        }
      } else {
        return (
          <li className="emptyList">
            <p>{this.props.userData.username} does not have any posts.</p>
          </li>
        );
      }
    }
  }

  renderFavoritePosts() {
    if (this.props.favorites.length > 0) {
      return this.props.favorites.map((post) => {
        return (
          <PostEntry
            users={this.props.userData}
            post={post}
            key={post.id}
            cardinality={this.props.cardinality}
            phrase={this.props.phrase}
          />
        );
      });
    }
    return (
      <li className="emptyList">
        <h2>No favorites</h2>
      </li>
    );
  }

  currentUserProfile() {
    if (this.props.currentUser) {
      return this.props.userData.id != this.props.currentUser.id;
    }
  }

  toggleShowFavorites() {
    this.setState({
      showingAll: false,
      showingFavorites: true,
      showingPosts: false,
    });
  }

  toggleShowPosts() {
    this.setState({
      showingAll: false,
      showingFavorites: false,
      showingPosts: true,
    });
  }

  toggleShowAll() {
    this.setState({
      showingAll: true,
      showingFavorites: false,
      showingPosts: false,
    });
  }

  renderCreatePostButton() {
    if (!this.currentUserProfile()) {
      if (this.props.currentUser) {
        return (
          <a href="/posts/new" className="newPost" title="Create a new post">+</a>
        );
      }
    }
  }

  renderDashboardList() {
    if (this.props.currentUser) {
      if (this.currentUserProfile()) {
        return (
          <div className="controlPanel">
            <button id="posts" onClick={this.toggleShowPosts}>
              Posts <span className="postCount">{this.props.authoredPosts.length}</span>
            </button>
            <button id="favorites" onClick={this.toggleShowFavorites}>
              Favorites <span className="postCount">{this.props.favorites.length}</span>
            </button>
          </div>
        );
      }
      return (
        <div className="controlPanel">
          <button id="posts" onClick={this.toggleShowPosts}>
            My Posts <span className="postCount">{this.props.authoredPosts.length}</span>
          </button>
          <button id="favorites" onClick={this.toggleShowFavorites}>
            Favorites <span className="postCount">{this.props.favorites.length}</span>
          </button>
          <a href="/posts/new" title="Create a new post">+</a>
        </div>
      );
    }
    return (
      <div className="controlPanel">
        <button id="posts" onClick={this.toggleShowPosts}>
          Posts <span className="postCount">{this.props.authoredPosts.length}</span>
        </button>
        <button id="favorites" onClick={this.toggleShowFavorites}>
          Favorites <span className="postCount">{this.props.favorites.length}</span>
        </button>
      </div>
    );
  }

  renderEditButton() {
    if (this.props.currentUser) {
      if (this.props.currentUser.id == this.props.userData.id) {
        return (
          <a className="editButton" href="account/edit">Edit</a>
        );
      }
    }
  }

  renderUserContent() {
    if (this.state.showingFavorites) {
      return (
        <div className="indexContent favorites">
         {this.renderDashboardList()}
          <ul className="postEntryList">
            {this.renderFavoritePosts()}
          </ul>
        </div>
      );
    }
    if (this.state.showingPosts) {
      return (
        <div className="indexContent posts">
          {this.renderDashboardList()}
          <ul className="postEntryList">
            {this.renderAuthoredPosts()}
          </ul>
        </div>
      );
    }
  }

  render() {
    const createdDate = new Date(this.props.userData.created_at);
    const createdYear = createdDate.getUTCFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const createdMonth = months[createdDate.getMonth()];

    return (
      <div className="container">
        <NavBar
          currentUser={this.props.currentUser}
          menu={this.props.menu}
          logo={this.props.logo}
          detail={this.props.detail}
          search={this.props.search}
        />
        <span className="backgroundElement" />
        <div id="profile">
          <div className="userInformation">
            <div className="wrapper">
              <img src={`https://www.gravatar.com/avatar/${this.props.hashedEmail}?s=200`} width="200px" height="200px"/>
              <span className="tooltip">?</span>
              <span className="details">
                <h2>{this.props.userData.username}</h2>
                <p>Role: {this.props.userData.role}</p>
                <p>Joined {createdMonth} {createdYear}</p>
                {this.renderEditButton()}
              </span>
            </div>
            <div className="dashboard side">
              {this.renderUserContent()}
            </div>
          </div>
          <div className="dashboard">
            <div className="friends">
              <ul className="postEntryList">
                {this.renderAllUsers()}
              </ul>
            </div>
            <div className="indexContent">
              <div className="controlPanel">
                <p>Recent posts</p>
              </div>
              <ul className="postEntryList">
                {this.renderAllPosts()}
              </ul>
            </div>
            {this.renderCreatePostButton()}
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
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
      role: React.PropTypes.string
    }),
  })),
  users: React.PropTypes.arrayOf(React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
    role: React.PropTypes.string
  })),
  userData: React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
    role: React.PropTypes.string
  }),
  cardinality: React.PropTypes.string,
  authoredPosts: React.PropTypes.arrayOf(React.PropTypes.shape({
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
  favorites: React.PropTypes.arrayOf(React.PropTypes.shape({
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
  currentUser: React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
    role: React.PropTypes.string
  }),
  menu: React.PropTypes.string,
  logo: React.PropTypes.string,
  detail: React.PropTypes.string,
  search: React.PropTypes.string,
  hashedEmail: React.PropTypes.string,
};
