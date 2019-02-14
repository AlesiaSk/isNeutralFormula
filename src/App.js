import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      text:"Hello"
    };
  }

  isFormula(){
    var reg = /^(([A-Z]|[10]|Sub[0-9]*)|(\(([A-Z]|[01]|Sub[0-9]*)([&\|~]|->)([A-Z]|[01]|Sub[0-9]*)\))|\(!([A-Z]|[10]|Sub[0-9]*)\))$/;
    var reg3 = /(\(([A-Z]|[01]|Sub[0-9]*)([&\|~]|->)([A-Z]|[01]|Sub[0-9]*)\))|\(!([A-Z]|[10]|Sub[0-9]*)\)/;
    console.log(reg.test(this.refs.textBox.value));
    var formula = this.refs.textBox.value;
    var subsArray;
    var ind = 0;
      while(reg3.test(formula)){
        subsArray = formula.match(/(\(([A-Z]|[01]|Sub[0-9]*)([&\|~]|->)([A-Z]|[01]|Sub[0-9]*)\))|\(!([A-Z]|[10]|Sub[0-9]*)\)/g);
        console.log(subsArray);
        for(var i=0; i<subsArray.length; i++){
         formula = formula.replace(subsArray[i], "Sub"+ind);
         ind++;
        }
        
        console.log(formula);
    }
    
    if(reg.test(formula)){
      alert("It's a formula");
    }

    else{
      alert("It's not a formula");
    }
    
  } 

  render() {
    return (
      <div className="app">
        <h1>Enter a logic formula</h1>
         <input ref="textBox" type="text"/>
         <button onClick={ (e) => {this.isFormula();}}>Submit</button>
      </div>
    );
  }
  
}


export default App;
