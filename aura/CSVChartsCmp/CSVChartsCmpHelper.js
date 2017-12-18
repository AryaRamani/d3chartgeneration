({
	displaydata : function(component, data) {
	console.log(data);
    d3.select("#chart").select("svg").remove();
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var x0 = d3.scaleBand().rangeRound([0, width]);

var x1 =d3.scaleBand();

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var xAxis = d3.axisBottom(x0).tickSize(0);

var yAxis = d3.axisLeft(y);

var color = d3.scaleOrdinal()
    .range(["#CD853F","#6A5ACD","#2F4F4F","#6B8E23"]);


var svg = d3.select('#chart').append("svg")
    .attr("width", width + margin.left + margin.right )
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
 
  var categoriesNames = data.map(function(d) { return d.type; });
  var rateNames = data[0].values.map(function(d) { return d.agerange; });
  console.log(categoriesNames);

  x0.domain(categoriesNames);
  x1.domain(rateNames).range([0, x0.bandwidth()]);
 
  y.domain([0, d3.max(data, function(categorie) {  return d3.max(categorie.values, function(d) { return d.count; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');
 
  var slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d,i) {
      console.log(i); 
      console.log(x0(d.type));
      var s= x0(d.type)+15*i;
       return "translate(" + s + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function(d) {   return x1(d.agerange); })
      .style("fill", function(d) { return color(d.agerange) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.agerange)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.agerange));
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });

  //Legend
  var legend = svg.selectAll(".legend")
      .data(data[0].values.map(function(d) {return d.agerange; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) {
      var h= (i * 20)-20;
       return "translate(20," + h + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 10)//18
      .attr("width", 10)//18
      .attr("height", 10)//18
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 10)//18
      .attr("y", 5)// 9
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

  component.set("v.showSpinner", false);

	
	},
	
	
	generatechartdata: function(component, event, helper){
	var infolst=component.get("v.data");
	var aMap = {};

            function addValueToKey(key, value) {
                aMap[key] = aMap[key] || [];
                var tempArr = aMap[key];
                tempArr.push(value);
                aMap[key] = tempArr;
                aMap[key] = _.sortBy(aMap[key], function(x) {
                    return x.StudentNo;
                });
            }
            for (var i = 0; i < infolst.length; i = i + 1) {
                addValueToKey(infolst[i].StudentNo, infolst[i]);
            }
            console.log('Map' + JSON.stringify(aMap));
            var studentlist = [];
            var key = Object.keys(aMap);
            console.log('Keys' + key);
            var today_date = new Date();
            var today_year = today_date.getFullYear();
            //console.log(today_date);
            for (var i = 0; i < key.length; i = i + 1) {
                var itemlist = aMap[key[i]];
                var age;
                var agerange;
               
                var Sportslist = [];
                _.forEach(itemlist, function(o) {
                    Sportslist.push(o.Sports);

                });
                
				var sports;
                for (var j = 0; j < itemlist.length; j = j + 1) {
                    var type;
                    console.log('Fields' + itemlist[j].Date);
                    if(itemlist[j].Date!==undefined){
                    var dob = itemlist[j].Date.split('/');
                    }
                    // var newdate=new Date(dob[2], dob[1] * 1 , dob[0]);
                   

                    
                        age = today_year - dob[2];
                        console.log('Age' + age);
                        
                        if (age >= 0 && age <= 5) {
                            agerange = '0-5';
                        } else if (age > 5 && age <= 10) {
                            agerange = '6-10';
                        } else if (age > 10 && age <= 15) {
                            agerange = '11-15';
                        }
                        else if (age > 15 && age <= 18) {
                            agerange = '15-18';
                        }
                         

                    sports=itemlist[j].Sports;


                }
               

               

                var Student = {
                    'StudentNo': key[i],
                    'ageRange': agerange,
                    'sports': sports,


                };



                

                studentlist.push(Student);

            }
            
            var rangelist=['0-5','6-10','11-15','15-18'];
            var typelist=['Cricket','Football','Basketball','Hockey'];
            var count=[];
          var countdata=[];
               var data=[];
          
          var objdatalist=[];
        var pielist=[];
      
            for(var m=0;m<typelist.length;m=m+1){
            
            var objlist=[];
                
               for(var n=0;n<rangelist.length;n=n+1){
               
                 // count[m]=[];
              count[n]= _.filter(studentlist,function(o){
                                return(o.ageRange==rangelist[n]&&o.sports==typelist[m]);
                                  
                                
                           }).length;
               
            
               data.push(count[n]);
               var Values={
               'agerange':rangelist[n],
               'count':count[n],
               };
               
               objlist.push(Values);
                    
               }
            
               
               var objdata={
                  'type': typelist[m],
                   'values':objlist
               };
                
                
               
               objdatalist.push(objdata);
                
                countdata[m]=_.filter(studentlist,function(o){
                                return(o.sports==typelist[m]);
                                  
                                
                           }).length;
                var piedata={
                  'type': typelist[m],
                   'count':countdata[m]
               };
              pielist.push(piedata);
               
              
            }
            console.log('Data'+JSON.stringify(objdatalist));
            

      
            this.displaydata(component,objdatalist);
            this.displaypiechart(component,pielist);
	},
    
    
    displaypiechart : function(component,dataset){
	console.log(JSON.stringify(dataset));
var pie=d3.pie()
    .value(function(d) { return d.count; })
    (dataset);
        
        
  console.log('pie'+JSON.stringify(pie));    
 
var w=300,h=300;
 
var outerRadius=w/2;
var innerRadius=100;
 
var color = d3.scaleOrdinal()
	.range(["#CD853F","#6A5ACD","#2F4F4F","#6B8E23"]);
 
var arc=d3.arc()
  .outerRadius(outerRadius)
  .innerRadius(innerRadius);


 var svg = d3.select('#piechart').append("svg")
    .attr("width", w )
    .attr("height", h)
  .append("g")
    
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")");
   
     
var path=svg.selectAll('path')
  .data(pie)
  .enter()
  .append('path')
  .attr("d",arc)
 .attr(
      "fill" , function(d,i){
          return color(d.data.type);
      }
  );
    
       
 
path.transition()
  .duration(1000)
  .attrTween('d', function(d) {
      var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
      return function(t) {
          return arc(interpolate(t));
      };
  });
 

var restOfTheData=function(){

    var text=svg.selectAll('text')
        .data(pie)
        .enter()
        .append("text")
        .transition()
        .duration(200)
        .attr("transform", function (d,i) {
          
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".4em")
        .attr("text-anchor", "middle")
        .text(function(d){
         
            return d.data.count;
        })
        .style(
            "fill",'#fff',
            "font-size",'10px'
        );
    
 var legendRectSize=20;
    var legendSpacing=7;
    var legendHeight=legendRectSize+legendSpacing;
 

     
    var legend=svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr(
           
            "transform",function(d,i){
                //Just a calculation for x & y position
              
                return 'translate(-35,' + ((i*legendHeight)-65) + ')';
            }
        )
    .attr( "class",'legend');

    legend.append('rect')
        .attr(
            "width",legendRectSize
                   ).
    attr( "height",legendRectSize
           
)
    .attr( "rx","20"
            )
    .attr("ry","20")
        .style(
            "fill",function(d) { return color(d); }
           
        );
 
    legend.append('text')
        .attr(
            "x","30"
           
        )
        .attr( "y","15")
        .text(function(d){
            return d;
        }).style(
            "fill",'#929DAF',
            "font-size",'14px'
        );
};
 


setTimeout(restOfTheData,1000);
}
})