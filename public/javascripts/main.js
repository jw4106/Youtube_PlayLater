app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

$(document).ready(function(){
  $("#searchquery").on("submit", function(e){
    e.preventDefault();
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search").val()).replace(/%20/g,"+"),
      maxResults: 5
    });

    request.execute(function(response){
      var results = response.result;
      $("#results").empty();
      $.each(results.items, function(index, item){

        let url = "https://www.youtube.com/embed/"+item.id.videoId;

        $("#results").append("<h3>"+item.snippet.title+"<h3>");
        $("#results").append("<text area rows=\"2\" cols=\"50\">"+url+"</textarea></br></br>");
        $('<iframe>', {
          src: url,
          frameborder: 0,
          width: 420,
          height: 315
        }).appendTo("#results");
      });   
    });
  });
  });

  function init(){
  gapi.client.setApiKey("AIzaSyDnh-tCepIFtV-C7qwY5r9wZXCItU4sEbw");
  gapi.client.load("youtube", "v3", function(){
    //yt api ready
  }); 
}