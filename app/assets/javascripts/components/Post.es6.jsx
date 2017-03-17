class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phrasePairs: this.props.initialPhrasePairs,
      isEditingPost: false,
      post: this.props.initialPost,
      isDescriptionTruncated: true,
      isFavoritePost: this.isFavoritePost(),
      errors: [],
      isNewPhrase: false,
      isDescriptionPlaying: false,
      isInputVideo: false,
      stream: '',
      isVideoRecording: false,
    };
    this.onSourcePhraseSubmit = this.onSourcePhraseSubmit.bind(this);
    this.onTargetPhraseSubmit = this.onTargetPhraseSubmit.bind(this);
    this.saveNewPhrasePair = this.saveNewPhrasePair.bind(this);
    this.onDeletePostClick = this.onDeletePostClick.bind(this);
    this.onSavePostClick = this.onSavePostClick.bind(this);
    this.onInvertLanguagesClick = this.onInvertLanguagesClick.bind(this);
    this.toggleEditingPostState = this.toggleEditingPostState.bind(this);
    this.cancelEditingPostState = this.cancelEditingPostState.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onClickFavoritePost = this.onClickFavoritePost.bind(this);
    this.destroyFavorite = this.destroyFavorite.bind(this);
    this.createFavorite = this.createFavorite.bind(this);
    this.toggleFavoritePost = this.toggleFavoritePost.bind(this);
    this.postIsOwnedByCurrentUser = this.postIsOwnedByCurrentUser.bind(this);
    this.renderPostMenu = this.renderPostMenu.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderAuthor = this.renderAuthor.bind(this);
    this.truncateText = this.truncateText.bind(this);
    this.renderTruncatedDescription = this.renderTruncatedDescription.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.renderSourceLanguage = this.renderSourceLanguage.bind(this);
    this.renderTargetLanguage = this.renderTargetLanguage.bind(this);
    this.favoriteImage = this.favoriteImage.bind(this);
    this.isFavoritePost = this.isFavoritePost.bind(this);
    this.renderFavoriteButton = this.renderFavoriteButton.bind(this);
    // video
    this.onToggleInputType = this.onToggleInputType.bind(this);
    this.onSaveStream = this.onSaveStream.bind(this);
    this.onStopStream = this.onStopStream.bind(this);
    this.onClearStream = this.onClearStream.bind(this);
    this.onStopRecordingClick = this.onStopRecordingClick.bind(this);
    this.onStartRecordingClick = this.onStartRecordingClick.bind(this);
    this.onRenderVideoInput = this.onRenderVideoInput.bind(this);
    this.playButton = this.playButton.bind(this);
    this.pauseButton = this.pauseButton.bind(this);
    this.onDeleteVideoDescription = this.onDeleteVideoDescription.bind(this);
    this.onCloseVideoComponent = this.onCloseVideoComponent.bind(this);
    this.onDescriptionVideoSubmit = this.onDescriptionVideoSubmit.bind(this)
  }

  onSourcePhraseSubmit(sourcePhrase, isNewPhrase) {
    if (isNewPhrase) {
      this.setState({ isNewPhrase: true });
    }
    const newPhrasePair = { source_phrase: sourcePhrase };
    const newPhrasePairs = this.state.phrasePairs;
    newPhrasePairs.push(newPhrasePair);
    this.setState({ phrasePairs: newPhrasePairs });
  }

  onTargetPhraseSubmit(targetPhrase) {
    const newPhrasePairs = this.state.phrasePairs;
    const newPhrasePair = newPhrasePairs[newPhrasePairs.length - 1];
    newPhrasePair.target_phrase = targetPhrase;
    this.setState({ phrasePairs: newPhrasePairs });
    this.saveNewPhrasePair(newPhrasePair);
  }

  saveNewPhrasePair(phrasePair) {
    $.ajax({
      url: '/phrase_pairs',
      type: 'POST',
      data: {
        post_id: this.state.post.id,
        phrase_pair: phrasePair,
      },
      success: function (phrasePair) {
        const newPhrasePairs = this.state.phrasePairs;
        newPhrasePairs.splice(this.state.phrasePairs.length - 1, 1, phrasePair.phrase_pair);
        this.setState({ phrasePairs: newPhrasePairs });
      }.bind(this),
      error() {
        console.log('Error: Save action failed');
      },
    });
  }

  onDeletePostClick() {
    const id = this.state.post.id;
    bootbox.confirm({
      message: 'Are you sure you want to delete this post?',
      closeButton: false,
      callback: (result) => {
        if (result === true) {
          $.ajax({
            url: '/posts/' + id,
            type: 'DELETE',
            success() {
              window.location.href = '/dashboard';
            },
          });
        }
      },
    });
  }

  onSavePostClick() {
    this.state.errors = [];
    this.state.post.source_language = this.state.post.source_language_draft;
    this.state.post.target_language = this.state.post.target_language_draft;
    this.state.post.title = this.state.post.title_draft;
    this.state.post.description = this.state.post.description_draft;
    if (this.state.post.title && this.state.post.source_language && this.state.post.target_language) {
      $.ajax({
        url: '/posts/' + this.state.post.id,
        type: 'PUT',
        data: { post: this.state.post },
        success: function () {
          this.cancelEditingPostState();
        }.bind(this),
        error() {
          bootbox.alert({
            message: 'Something went wrong',
            closeButton: false,
          });
        },
      });
    } else {
      if (!this.state.post.title) this.state.errors.push(' Title');
      if (!this.state.post.source_language) this.state.errors.push(" Source language");
      if (!this.state.post.target_language) this.state.errors.push(" Target language");
      bootbox.alert({
        message: 'Your post is missing the following required details:' + (this.state.errors),
        closeButton: false,
      });
    }
  }

  onInvertLanguagesClick() {
    const newPost = this.state.post;
    const newState = this.state;

    const sourceLanguage = this.state.post.source_language;
    const targetLanguage = this.state.post.target_language;

    newPost.source_language = targetLanguage;
    newPost.target_language = sourceLanguage;

    newState.post = newPost;
    this.setState(newState);
  }

  toggleEditingPostState() {
    const modPost = this.state.post;
    modPost.title_draft = modPost.title;
    modPost.description_draft = modPost.description;
    modPost.source_language_draft = modPost.source_language;
    modPost.target_language_draft = modPost.target_language;
    this.setState({
      isEditingPost: true,
      post: modPost
    });
  }

  cancelEditingPostState() {
    this.setState({ isEditingPost: false });
  }

  onInputChange(e) {
    const newPost = this.state.post;
    const newState = this.state;

    newPost[e.target.name] = e.target.value;
    newState.post = newPost;
    this.setState(newState);
  }

  onClickFavoritePost() {
    if (this.state.isFavoritePost) {
      this.destroyFavorite();
    } else {
      this.createFavorite();
    }
  }

  destroyFavorite() {
    $.ajax({
      url: '/favorites/' + this.state.post.id,
      type: 'DELETE',
      success: function () {
        this.toggleFavoritePost();
      }.bind(this),
      error() {
        console.log('something went wrong');
      },
    });
  }

  createFavorite() {
    $.ajax({
      url: '/favorites',
      type: 'POST',
      data: {
        post_id: this.state.post.id,
      },
      success: function () {
        this.toggleFavoritePost();
      }.bind(this),
      error() {
        console.log('something went wrong');
      },
    });
  }

  toggleFavoritePost() {
    this.setState({ isFavoritePost: !this.state.isFavoritePost });
  }

  postIsOwnedByCurrentUser() {
    if (this.props.currentUser) {
      return this.props.initialPost.user_id == this.props.currentUser.id;
    }
  }

  renderPostMenu() {
    if (this.postIsOwnedByCurrentUser()) {
      if (this.state.isEditingPost) {
        return (
          <div className="menu saving">
            <button title="Flip" onClick={this.onInvertLanguagesClick} className="icon">
              <img src={this.props.flipAlt} />
            </button>
            <button title="Save" onClick={this.onSavePostClick} className="icon">
              <img src={this.props.saveAlt} alt="Save" />
            </button>
            <button title="Cancel" onClick={this.cancelEditingPostState} className="close icon">
              <img src={this.props.closeAlt}/>
            </button>
          </div>
        );
      } else {
        return (
          <div className="menu">
            <button title="Menu" className="more icon">
              <img src={this.props.menuAlt}/>
            </button>
            <button title="Edit" onClick={this.toggleEditingPostState} className="icon" tabIndex="-1">
              <img src={this.props.editAlt}/>
            </button>
            <button title="Delete" onClick={this.onDeletePostClick} className="icon" tabIndex="-1">
              <img src={this.props.deleteAlt}/>
            </button>
          </div>
        );
      }
      return (
        <div className="menu">
          <button title="Menu" className="more icon">
            <img src={this.props.menuAlt} alt="Menu" />
          </button>
          <button
            title="Edit"
            onClick={this.toggleEditingPostState}
            className="icon"
            tabIndex="-1"
          >
            <img src={this.props.editAlt} alt="Edit" />
          </button>
          <button
            title="Delete"
            onClick={this.onDeletePostClick}
            className="icon"
            tabIndex="-1"
          >
            <img src={this.props.deleteAlt} alt="Delete" />
          </button>
        </div>
      );
    }
  }

  renderTitle() {
    if (this.state.isEditingPost) {
      return (
        <input
          name="title_draft"
          className="title new isEditing"
          dir="auto"
          onChange={this.onInputChange}
          value={this.state.post.title_draft}
        />
      );
    }
    return <h1 title={this.state.post.title}>{this.state.post.title}</h1>;
  }

  renderAuthor() {
    const users = this.props.users;
    let authorName = '';
    for (var i = users.length - 1; i >= 0; i--) {
      if (this.props.initialPost.user_id == users[i].id) {
        authorName = users[i].username;
      }
    }

    if (this.postIsOwnedByCurrentUser()) {
      if (this.state.isEditingPost) {
        return (
          <p className="author">{authorName}</p>
        );
      }
      return (
        <a href={"/dashboard"} className="author">{authorName}</a>
      );
    }
    return (
      <a href={'/users/' + this.state.post.user_id} className="author">{authorName}</a>
    );
  }

  truncateText() {
    this.setState({ isDescriptionTruncated: !this.state.isDescriptionTruncated });
  }

  renderTruncatedDescription() {
    if (this.state.post.description.length >= 132) {
      if (this.state.isDescriptionTruncated) {
        return (
          <p className="description">
            {this.state.post.description.substring(0, 132)}...
            <button onClick={this.truncateText}>More</button>
          </p>
        );
      }
      return (
        <p className="description">
          {this.state.post.description}
          <button onClick={this.truncateText}>Less</button>
        </p>
      );
    }
    return <p className="description">{this.state.post.description}</p>;
  }


  //  VIDEO

  renderVideoDescription() {
    if (this.state.isInputVideo == false) {
      if (this.state.post.video_description) {
        if (this.state.isEditingPost) {
          return (
            <div className="videoDescription">
              <div className="videoComponent">
                <video src={this.state.post.video_description} loop width="600"></video>
                <div className="videoControls">
                  {this.renderPlayButton()}
                  <button type="button" title="Remove video" onClick={this.onDeleteVideoDescription} className="text icon">
                    <img src={this.props.deleteAlt} alt="close" />
                  </button>
                </div>
              </div>
            </div>
          )
        } else {
          return <div className="videoDescription"><div className="videoComponent"><video src={this.state.post.video_description} loop width="600"></video><div className="videoControls">{this.renderPlayButton()}</div></div></div>
        }
      } else {
        if (this.state.isEditingPost) {
          return <button type="button" title="Add a video introduction" onClick={this.onToggleInputType} className="addVideoButton">Add a video introduction</button>
        }
      }
    } else {
      return(
        <div className="videoDescription" ref="video">
          <Video
            onRenderVideoInput={this.onRenderVideoInput}
            renderRecordButton={this.renderRecordButton}
            onCancelEditPhrase={this.onCancelEditPhrase}
            onCloseVideoComponent={this.onCloseVideoComponent}
            onStartRecordingClick={this.onStartRecordingClick}
            onStopRecordingClick={this.onStopRecordingClick}
            onSourceVideoSubmit={this.onDescriptionVideoSubmit}
            onTargetVideoSubmit={this.onTargetVideoSubmit}
            onToggleInputType={this.onToggleInputType}
            onClearStream={this.onClearStream}
            closeAlt={this.props.closeAlt}
            isVideoRecording={this.state.isVideoRecording}
            isInputVideo={this.state.isInputVideo}
            onSaveStream={this.onSaveStream}
            onStopStream={this.onStopStream}
            mediaConstraints={this.state.mediaConstraints}
            stream={this.state.stream}
            isTargetInputActive={this.state.isTargetInputActive}
            sourceLanguage={this.props.sourceLanguage}
            targetLanguage={this.props.targetLanguage}
            author={this.props.currentUser.username}
            width={600}
            videoPhrase={false}
          />
        </div>
      )
    }
  }

  renderPlayButton() {
    if(this.state.isDescriptionPlaying) {
      return (
        <button className="play descriptionVideoPause" type="button" onClick={this.pauseButton} title="Pause">
            <img src={this.props.pause}/>
        </button>
      )
    } else {
      return (
        <button type="button" onClick={this.playButton} title="Play" className="play">
          <img src={this.props.play}/>
        </button>
      )
    }
  }

  playButton() {
    this.setState({isDescriptionPlaying:!this.state.isDescriptionPlaying})
    $("video")[0].play()
  }

  pauseButton() {
    this.setState({isDescriptionPlaying:!this.state.isDescriptionPlaying})
    $("video")[0].pause()
  }

  onDeleteVideoDescription() {
    const newPost = this.state.post;
    const newState = this.state;

    newPost.video_description = "";
    newState.post = newPost;
    this.setState(newState);
  }

  onToggleInputType() {
    this.setState({ isInputVideo: !this.state.isInputVideo });
  }

  onRenderVideoInput() {
    if (this.state.isInputVideo) {
      const video = document.getElementById('camera-stream');
      video.muted = true;
      const self = this;

      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = (constraints) => {
          const getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia);

          if (!getUserMedia) {
            self.onCloseVideoComponent();
            alert('Sorry, your browser does not support the video recording.\n(In order to access the video recording, try again with one of these browsers: Chrome, Firefox, Edge, Opera.)');
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }
          return new Promise((resolve, reject) => {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        self.onSaveStream(stream);
        video.controls = false;
        video.src = window.URL.createObjectURL(stream);
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
      });
    }
  }

  onStartRecordingClick() {
    this.setState({ isVideoRecording: !this.state.isVideoRecording });
  }

  onStopRecordingClick() {
    this.setState({ isVideoRecording: !this.state.isVideoRecording, hasVideoDescription: true });
  }

  onSaveStream(stream) {
    this.setState({stream: stream});
  }

  onCloseVideoComponent() {
    this.setState({
      isVideoRecording: false,
      isInputVideo: false
    });
    if (this.state.stream !== '') {
      this.onStopStream();
    }
  }

  onStopStream() {
    const tracks = this.state.stream.getTracks();
    tracks[0].stop();
    tracks[1].stop();
    this.onClearStream();
  }

  onClearStream() {
    this.setState({stream: ''});
  }

  onDescriptionVideoSubmit(video) {
    const newPost = this.state.post;
    const newState = this.state;

    newPost.video_description = video;
    newState.post = newPost;
    this.setState(newState);
  }

  // END VIDEO

  renderDescription() {
    if (this.state.post.description) {
      if (this.state.isEditingPost) {
        return (
          <textarea
            rows="4"
            className="description new isEditing"
            name="description_draft"
            dir="auto"
            onChange={this.onInputChange}
            value={this.state.post.description_draft}
          />
        );
      } else {
        return <span>{this.renderTruncatedDescription()}</span>;
      }
    } else {
      if (this.state.isEditingPost) {
        return (
          <textarea
            rows="4"
            className="description new isEditing"
            name="description_draft"
            dir="auto"
            onChange={this.onInputChange}
            value={this.state.post.description_draft}
            placeholder="Describe the goods or services in your post"
          />
        );
      }
    }
  }

  renderSourceLanguage() {
    if (this.state.isEditingPost) {
      return (
        <input
          className="new isEditing"
          name="source_language_draft"
          onChange={this.onInputChange}
          value={this.state.post.source_language_draft}
        />
      );
    }
    return (
      <h1 className="language source" title={this.state.post.source_language}>
        {this.state.post.source_language}
      </h1>
    );
  }

  renderTargetLanguage() {
    if (this.state.isEditingPost) {
      return (
        <input
          className="new isEditing"
          name="target_language_draft"
          onChange={this.onInputChange}
          value={this.state.post.target_language_draft}
        />
      );
    }
    return (
      <h1 className="language target" title={this.state.post.target_language}>
        {this.state.post.target_language}
      </h1>
    );
  }

  favoriteImage() {
    return this.state.isFavoritePost
      ? this.props.star
      : this.props.unstar;
  }

  isFavoritePost() {
    if (this.props.currentUser) {
      return this.props.currentUser.favorite_posts.filter((favorite) => {
        return favorite.post_id == this.props.initialPost.id;
      }).length > 0;
    }
  }

  renderFavoriteButton() {
    if (this.props.currentUser) {
      return (
        <button title="Favorite" onClick={this.onClickFavoritePost} className="favorite icon">
          <img src={this.favoriteImage()} alt="Favorite" />
        </button>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <NavBar
          currentUser={this.props.currentUser}
          logo={this.props.logo}
          detail={this.props.detail}
          search={this.props.search}
        />
        <span className="backgroundElement" />
        <div className="post">
          <div className="tools">
            {this.renderFavoriteButton()}
            <div className="cardinality">
              <section>
                { this.renderSourceLanguage() }
                <img src={this.props.cardinality} alt="Cardinality" />
                { this.renderTargetLanguage() }
              </section>
            </div>
            { this.renderPostMenu() }
          </div>
          <div className="info">
            <div className="wrapper" dir="auto">
              { this.renderTitle() }
              { this.renderAuthor() }
              { this.renderVideoDescription() }
              { this.renderDescription() }
            </div>
          </div>
          {/* <ProgressBar /> */}
          <div className="NObannerWrapper"></div>

          <Dictionary
          isOwnedByCurrentUser={this.postIsOwnedByCurrentUser()}
          initialPhrasePairs={this.state.phrasePairs}
          onSourcePhraseSubmit={this.onSourcePhraseSubmit}
          onTargetPhraseSubmit={this.onTargetPhraseSubmit}
          isEditingPost={this.state.isEditingPost}
          menu={this.props.menu}
          flip={this.props.flip}
          save={this.props.save}
          delete={this.props.delete}
          edit={this.props.edit}
          text={this.props.text}
          textAlt={this.props.textAlt}
          video={this.props.video}
          videoAlt={this.props.videoAlt}
          close={this.props.close}
          closeAlt={this.props.closeAlt}
          sourceLanguage={this.state.post.source_language}
          targetLanguage={this.state.post.target_language}
          author={this.state.post.user_id}
          isNewPhrase={this.state.isNewPhrase}
          />
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  initialPhrasePairs: React.PropTypes.arrayOf(React.PropTypes.shape({
    post_id: React.PropTypes.number,
    created_at: React.PropTypes.string,
    id: React.PropTypes.number,
    source_phrase: React.PropTypes.string,
    target_phrase: React.PropTypes.string,
    updated_at: React.PropTypes.string,
  })),
  initialPost: React.PropTypes.shape({
    created_at: React.PropTypes.string,
    description: React.PropTypes.string,
    id: React.PropTypes.number,
    source_language: React.PropTypes.string,
    target_language: React.PropTypes.string,
    title: React.PropTypes.string,
    updated_at: React.PropTypes.string,
    user_id: React.PropTypes.number,
  }),
  currentUser: React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
  }),
  flipAlt: React.PropTypes.string,
  saveAlt: React.PropTypes.string,
  closeAlt: React.PropTypes.string,
  menuAlt: React.PropTypes.string,
  editAlt: React.PropTypes.string,
  deleteAlt: React.PropTypes.string,
  users: React.PropTypes.arrayOf(React.PropTypes.shape({
    created_at: React.PropTypes.string,
    email: React.PropTypes.string,
    favorite_posts: React.PropTypes.array,
    id: React.PropTypes.number,
    username: React.PropTypes.string,
  })),
  star: React.PropTypes.string,
  unstar: React.PropTypes.string,
  logo: React.PropTypes.string,
  detail: React.PropTypes.string,
  search: React.PropTypes.string,
  cardinality: React.PropTypes.string,
  menu: React.PropTypes.string,
  flip: React.PropTypes.string,
  save: React.PropTypes.string,
  delete: React.PropTypes.string,
  edit: React.PropTypes.string,
  close: React.PropTypes.string,
};