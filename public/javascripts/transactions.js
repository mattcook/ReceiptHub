/** @jsx React.DOM */

var Trans = React.createClass({
  render: function() {
    var createTransaction = function(item, index) {
      return (
              <tr key= { index } >
              <td>{ item.date }</td>
              <td>{ item.merchant }</td>
              <td>${ item.price }</td>
              </tr>
      );
    };
    return (
        <table className="table table-striped"><tbody>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Price</th>
          </tr>
          { this.props.items.map(createTransaction) }
          </tbody></table>);
  }
});

var UserTrans = React.createClass({
  getInitialState: function() {
    this.items = [];
    return {items: [], text: ""};
  },

  componentWillMount: function() {
    this.firebaseRef = new Firebase("https://receipthub.firebaseio.com/transactions/");
    this.firebaseRef.limitToLast(25).on("child_added", function(dataSnapshot) {
      // Only keep track of 25 items at a time
      if (this.items.length === 25) {
        this.items.splice(0, 1);
      }

      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  render: function() {
    return (
        <Trans items={ this.state.items } />
    );
  }
});

React.render(<UserTrans />, document.getElementById("Transactions"));
