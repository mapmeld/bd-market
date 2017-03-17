class PostEntry extends React.Component {
  render() {
    const createdDate = new Date(this.props.post.created_at);
    const createdYear = createdDate.getUTCFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const createdMonth = months[createdDate.getMonth()];
    const createdDay = createdDate.getDate();

    return (
       <li className="postEntry">
        <a href={'/posts/'+this.props.post.id}>
          <section className="info">
            {/* <span className="banner"><img src=""/></span> */}
            <section className="clear">
                <h2 className="title"title={this.props.post.title}>{this.props.post.title}</h2>
              <section className="details">
                <p className="count" title={this.props.post.phrase_pairs.length+" Phrases"}>{this.props.post.phrase_pairs.length}</p>
                <p className="source language" title={this.props.post.source_language}>
                  {this.props.post.source_language}
                </p>
                <img className="postEntry icon cardinality" src={this.props.cardinality} alt="" />
                <p className="target language" title={this.props.post.target_language}>
                  {this.props.post.target_language}
                </p>
              </section>
            </section>
            <section className="meta">
              <p className="date">{createdDay} {createdMonth} {createdYear}</p>
              <p className="author">{this.props.post.user.username}</p>
            </section>
          </section>
         </a>
       </li>
    );
  }
}

PostEntry.propTypes = {

};
