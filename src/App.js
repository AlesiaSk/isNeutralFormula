import React, {Component} from 'react';
import './App.css';


//////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 1 по дисциплине ЛОИС
// Тема: решение логических задач на языке логики высказываний
// Выполнена студенткой группы 621702 БГУИР Скороход Алесей Антоновной
// Определение является ли высказывание логической формулой
//  14.02.2019
//
// http://learn.javascript.ru/courses/react/
// regexp101.com

class App extends Component {


    constructor() {
        super();
        this.state = {
            connections :{}
        };

    }

    isFormula() {
        const reg = /^([A-Z]|[10]|Sub[0-9]*)$/;
        const reg3 = /(\(([A-Z]|[01]|Sub[0-9]*)([&|~]|->)([A-Z]|[01]|Sub[0-9]*)\))|\(!([A-Z]|[10]|Sub[0-9]*)\)/g;
        const regSub = /Sub/;
        let formula = this.refs.textBox.value;
        let firstFormula = formula;
        let subsArray;
        let ind = 0;


        while (reg3.test(formula)) {
            subsArray = formula.match(reg3);
            for (var i = 0; i < subsArray.length; i++) {
                formula = formula.replace(subsArray[i], "Sub" + ind);
                ind++;
            }
        }

        if (regSub.test(firstFormula)) {
            alert('It is not a formula');
            return false;
        } else if (reg.test(formula)) {
            return true;
        } else {
            alert('It is not a formula');
            return false;
        }

    }

    isNetural(){
        const reg3 = /(\(([A-Z]|[01]|Sub[0-9]*)([&|~]|->)([A-Z]|[01]|Sub[0-9]*)\))|\(!([A-Z]|[10]|Sub[0-9]*)\)/g;
        const regForVariables = /Sub[0-9]*|[A-Z]|[01]/g;
        const regForOperations = /[&|~]|->|!/g;
        let ind = 0;
        let formula = this.refs.textBox.value;
        let subsArray;
        if(this.isFormula()){
            let setsArray = this.getSetsForCalculations();
            this.addConstants(setsArray);
            while (reg3.test(formula)) {
                subsArray = formula.match(reg3);
                let variables = subsArray[0].match(regForVariables);
                let operation = subsArray[0].match(regForOperations);
                if(variables.length > 1){
                    for(let l = 0; l < subsArray.length; l++){
                        let variables = subsArray[l].match(regForVariables);
                        let operation = subsArray[l].match(regForOperations);
                        for(let k = 0; k < variables.length; k++){
                            if((k + 1)!== variables.length){
                                for(let i = 0; i < setsArray.length; i++){
                                    let value1 = setsArray[i][this.state.connections[variables[k]]];
                                    let value2 = setsArray[i][this.state.connections[variables[k+1]]];
                                    if(operation[0] === '->'){
                                        setsArray[i].push(this.implication(value1,value2));
                                    }
                                    else if(operation[0] === '&'){
                                        setsArray[i].push(this.conjunction(value1,value2));
                                    }
                                    else if(operation[0] === '|'){
                                        setsArray[i].push(this.disjunction(value1,value2));
                                    }
                                    else if(operation[0] === '~'){
                                        setsArray[i].push(this.equivalent(value1,value2));
                                    }

                                }

                            }


                        }
                        this.setConnections("Sub" + ind, (setsArray[0].length - 1));
                        formula = formula.replace(subsArray[l], "Sub" + ind);
                        ind++ ;

                    }

                }

                if(variables.length === 1){
                    for(let i = 0; i < setsArray.length; i++){
                        let value1 = setsArray[i][this.state.connections[variables[0]]];
                        if(operation[0]){
                            setsArray[i].push(this.negation(value1));
                        }
                        else {
                            setsArray[i].push(value1);
                        }
                    }
                    this.setConnections("Sub" + ind, (setsArray[0].length - 1));
                    for(let j = 0; j < subsArray.length; j++){
                        formula = formula.replace(subsArray[j], "Sub" + ind);
                        ind++ ;
                    }


                }
            }
            for(let i = 0; i < setsArray.length; i++){
                if(i + 1 < setsArray.length){
                    if(setsArray[i][this.state.connections['Sub' + (ind -1)]] !== setsArray[i+1][this.state.connections['Sub' + (ind -1)]]){

                        alert('It is a netural formula');

                        return true;
                    }
                    else if(setsArray.length === 2){
                        if(setsArray[i][setsArray[i].length -1] !== setsArray[i+1][setsArray[i].length -1]){
                            alert('It is a netural formula');

                            return true;
                        }
                    }
                }
            }

            alert('It is not a netural formula');
            return false;

        }

    }

    implication(value1, value2){
        if (!(value1 === 1 && value2 === 0)){
            return 1;
        }
        return 0;
    }

    equivalent(value1, value2){
        if (value1 === value2){
            return 1;
        }
        else{
            return 0;
        }
    }

    negation(value){
        if (!value){
            return 1;
        }
        else{
            return 0;
        }
    }

    conjunction(value1, value2){
        if(value1 && value2){
            return 1;
        }
        else{
            return 0;
        }

    }

    disjunction(value1, value2){
        if (value1|| value2){
            return 1;
        }
        else{
            return 0;
        }
    }

    getSetsForCalculations(){
        let formula = this.refs.textBox.value;
        const regexForLogicVariablesSearch = /[A-Z]/g;
        formula = formula.split('')
            .filter((item, pos, self) => {
                return self.indexOf(item) === pos;
            })
            .join('');

        const  matchedArray = formula.match(regexForLogicVariablesSearch);
        let setsArray = new Array(0);
        if(matchedArray){
            const numOfVariables = formula.match(regexForLogicVariablesSearch).length;
            let currentNum = parseInt('1'.repeat(numOfVariables), 2);
            for(let i = currentNum; i > -1; i--){
                setsArray[i] = currentNum.toString(2);
                if(setsArray[i].length < numOfVariables){
                    let numOfNulls = numOfVariables - setsArray[i].length;
                    setsArray[i] = '0'.repeat(numOfNulls) + setsArray[i];
                }
                setsArray[i] = setsArray[i].split('');
                setsArray[i] = setsArray[i].map((element) =>{

                    return parseInt(element, 10);
                });
                currentNum--;

            }
            for(let i = 0; i < setsArray[0].length; i++){
                this.setConnections(matchedArray[i], i);
            }
        }

        return setsArray;
    }

    setConnections(key, value){
       this.state.connections[key] = value;
    }

    addConstants(setsArray){
        let formula = this.refs.textBox.value;
        const regexForLogicVariablesSearch = /[0-1]/g;
        formula = formula.split('')
            .filter((item, pos, self) => {
                return self.indexOf(item) === pos;
            })
            .join('');
        const constArray = formula.match(regexForLogicVariablesSearch);
        if(constArray && constArray.length !== 0 && setsArray && setsArray.length !== 0){
            for(let e = 0; e < constArray.length; e++){
                for(let i = 0; i < setsArray.length; i++){
                    setsArray[i].push(parseInt(constArray[e]));
                }
                this.setConnections(constArray[e], (setsArray[0].length - 1));
            }

        }

        if(setsArray.length === 0){
            for(let e = 0; e < constArray.length; e++){
                if(e === 0){
                    setsArray[0] = [parseInt(constArray[e])];
                }
                 setsArray[0][e] = parseInt(constArray[e]);
                this.setConnections(constArray[e], (setsArray[0].length - 1));
            }
        }


    }


    render() {
        return (
            <div className="app">
                <h1>Enter a logic formula</h1>
                <input ref="textBox" type="text"/>
                <button onClick={(e) => {
                    this.isNetural();
                }}>Submit
                </button>
            </div>
        );
    }



}


export default App;
