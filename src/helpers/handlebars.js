const timeago = require('timeago.js');
const timeagoInstance = timeago();
const hbshelper = {};


//--------- FIRST PAGE--------------
  hbshelper.fp = function (page) {

    
    if(page ==1){
    let  val='<li class="page-item disabled"><a href="" class="page-link">Primera Pagina</a></li>'
      return val
    }else{
    let  val='<li class="page-item"> <a href="/users/1" class="page-link">Primera Pagina</a></li>'

      return val
    }
  }


  //----------------PAGINAS/PAGINATION
hbshelper.ap = function(page,paginas){
  var list=[]
    var i = (Number(page) > 5 ? Number(page) - 4 : 1 )
      for(; i<=(Number(page) + 2) && i <= paginas; i++){//for por cada pagina
        if( i== page){
          var li1='<li class="page-item"><a href="'+i+'" class="page-link">'+i+'</a></li>';
          list.push(li1)
        }else{
          var li1='<li class="page-item"><a href="/users/'+i+'" class="page-link">'+i+'</a></li>'
          list.push(li1)
        }
      }//cierre del for
     var lista = list.join("")
    return lista
}//cierre de la funcio



//-----------------ULTIMA PAGINA
  
    hbshelper.lp = function(page,paginas){
  if(page==paginas){
    let  val='<li class="page-item disabled"><a href="" class="page-link">Ultima Pagina</a></li>'
    return val
  }else{
    let  val='<li class="page-item "><a href="/users/'+paginas+'" class="page-link">Ultima Pagina</a></li>'
    return val
  }
}





hbshelper.timeago = (savedTimestamp) => {
    return timeagoInstance.format(savedTimestamp);
};




module.exports = hbshelper;