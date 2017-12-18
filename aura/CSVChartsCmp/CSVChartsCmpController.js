({
	readCSV: function(component, event, helper) {
    component.set("v.showSpinner", true);
      d3.select("#chart").select("svg").remove();
        var filename = event.getSource().get("v.files");
        console.log('CSV File name' + JSON.stringify(filename));
        var textdata;
        var reader = new FileReader();
        var infolst = [];
        reader.onload = function() {
            var text = reader.result; /*Get the data stored in file*/
            console.log(reader.result.substring(0, 200));
            console.log('Data from CSV file' + text);
            textdata = text;
            var rows = textdata.split('\n'); /*Spilt based on new line to get each row*/
            console.log('File header' + rows[0]);
            component.set("v.showSpinner", false);
            
            

            /* Ignore the first row and start from second*/
            for (var i = 1; i < rows.length; i = i + 1) {
                console.log('Length', +rows.length); //total number of rows in the file including header
                /*Spilt based on the comma*/
                var cells = rows[i].split(',');
                console.log('One row' + cells);
                console.log('Row length' + cells.length);
                     
                if(cells.length!=1){
                    var sports=cells[3].split('\r');
                var cellinfo = {
                    'StudentNo': cells[0],
                    'Name': cells[1],
                    'Date': cells[2],
                    'Sports': sports[0],
                };

                
                infolst.push(cellinfo);
                component.set("v.data",infolst);
                }

            }
            
            helper.generatechartdata(component);
        
          
          


        };
        if (filename[0] !== undefined && filename[0] !== null && filename[0] !== '') {
            reader.readAsText(filename[0]);
        }
        
    },
    
    onInit : function(component){
        alert('script loaded');
    }

        

})