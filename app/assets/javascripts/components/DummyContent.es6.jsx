class DummyContent extends React.Component {
  // randomString: function() {
  //   let charLength = Math.floor(Math.random() * (36 - 2)) + 2;
  //   return Math.round((Math.pow(36, charLength + 1) - Math.random() * Math.pow(36, charLength))).toString(36).slice(1);
  // },

  render() {
    return (
      <ul className="dummy content">

        <li className="entry">
          <ul>
            <li className="source">
              <p>Vendi</p>
            </li>
            <li className="target">
              <p>Maidens</p>
            </li>
          </ul>
        </li>
        <li className="entry">
          <ul>
            <li className="source">
              <p>Minë lië nu minë aran.</p>
            </li>
            <li className="target">
              <p>One people under one king</p>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
