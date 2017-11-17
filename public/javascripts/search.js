app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

$(document).ready(function(){
  $("form").on("submit", function(e){
    e.preventDefault();
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search").val()).replace(/%20/g,"+"),
      maxResults: 10,
      order: "viewCount"
    });
    request.execute(function(response){
      var results = response.result;
      console.log(results);
      $.each(results.items, function(index, item){
        $("#results").append("<h3>"+item.snippet.title+"<h3>");
        $("#results").append("<h1>www.youtube.com/watch?v="+item.id.videoId+"</h1>");
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