class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postProgress: '',
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const scrollTop = event.srcElement.body.scrollTop;
    const viewHeight = $(window).height();
    const pageHeight = $('body').height();
    const postProgress = 100 / (pageHeight - viewHeight) * scrollTop;
    window.addEventListener('scroll', this.handleScroll);
    this.setState({ postProgress });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScroll);
  }

  handleScroll() {
    const scrollTop = event.srcElement.body.scrollTop;
    const viewHeight = $(window).height();
    const pageHeight = $('body').height();
    const postProgress = 100 / (pageHeight - viewHeight) * scrollTop;
    this.setState({ postProgress });
  }

  render() {
    return (
      <span className="progressBar">
        {this.state.pageHeight}
        <span className="bar" style={{ width: this.state.postProgress + '%' }} />
      </span>
    );
  }
}
