var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data:newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
   },
  handleCommentDelete: function(comment) {
    // var comments = this.state.data;
    // var deletedComments = comments.pop([comment]);
    // this.setState({data:newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'DELETE',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
   },
  getInitialState: function(){
    return {data:[]};
  },
  componentDidMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentDelete onCommentDelete={this.handleCommentDelete}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>

    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
   e.preventDefault();
   var author = this.refs.author.value.trim();
   var text = this.refs.text.value.trim();
   if (!text || !author) {
     return;
   }
   this.props.onCommentSubmit({author: author, text: text});
   this.refs.author.value = '';
   this.refs.text.value = '';
   return;
 },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentDelete = React.createClass({
  handleDelete: function(e) {
   e.preventDefault();
   this.props.onCommentDelete(this);
   return;
 },
 render: function(){
   return (
     <button type="sumbit" value="Delete" onSubmit={this.handleDelete}></button>
   );
 }
});

var Comment = React.createClass({

  render: function(){
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
          <CommentDelete className="commentDelete"/>
        </h2>
        {this.props.children}
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
