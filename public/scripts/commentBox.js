
var App = React.createClass({
  getInitialState:function(){
    return {
      txt: 'the state txt'
    }
  },

  update: function(e){
    this.setState({txt: e.target.value});
  },
  render: function(){
    return (
      <div>
        <input type="text" onChange={this.update}/>
        <h1>{this.state.txt}</h1>
      </div>
    );
  }
})
ReactDOM.render(
  <App txt="this is the txt prop" />,
  document.getElementById('content')
);
