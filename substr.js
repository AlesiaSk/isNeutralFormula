 var str = "dfgel";
    var substr = "el";
    for(var i=0; i<str.length; i++){
        if(str[i] === substr[0]){
          var tempj = 0;
          for (var temp = i; temp < (substr.length + i); temp++){
            if(str[temp] === substr[tempj]){
              tempj++;
              
              if (tempj===(substr.length -1)){
                console.log("Contains");
                return;
              }
            }
           
          }
        }
        else{
          if(i === str.length){
            console.log("Doesn't contain");
            return;
          }
        }
    }