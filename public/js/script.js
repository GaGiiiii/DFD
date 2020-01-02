// let DateDiff = {

//   inDays: function(d1, d2) {
//       let t2 = d2.getTime();
//       let t1 = d1.getTime();

//       return parseInt((t2-t1)/(24*3600*1000));
//   },

//   inWeeks: function(d1, d2) {
//       let t2 = d2.getTime();
//       let t1 = d1.getTime();

//       return parseInt((t2-t1)/(24*3600*1000*7));
//   },

//   inMonths: function(d1, d2) {
//       let d1Y = d1.getFullYear();
//       let d2Y = d2.getFullYear();
//       let d1M = d1.getMonth();
//       let d2M = d2.getMonth();

//       return (d2M+12*d2Y)-(d1M+12*d1Y);
//   },

//   inYears: function(d1, d2) {
//       return d2.getFullYear()-d1.getFullYear();
//   }
// }

// let dateDIV = document.querySelector('#dateID');
// let dString = dateDIV.innerHTML;
// let d1 = new Date(dString);
// let d2 = new Date();
// let daysDiff = DateDiff.inDays(d1, d2);
// let text = "";

// if(daysDiff < 1){
//   text = "<strong>Created: </strong> Today.";
// }else{
//   text = "<strong>Created: </strong>" + daysDiff + " day(s) ago.";
// }

// dateDIV.innerHTML = text;