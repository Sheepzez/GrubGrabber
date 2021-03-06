var map;
var geocoder;
var service;
var infowindow;
var searchLocation;
var searchResults;
var placeName;
var directionsDisplay;

function initialize(searchLatLng, PLACE_ID) {
    searchLocation = searchLatLng.match(/[-,\d,.]+/g);
    searchLocation[0] = parseFloat(searchLocation[0]);
    searchLocation[1] = parseFloat(searchLocation[1]);
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapProp = {
        zoom:18,
        mapTypeId:google.maps.MapTypeId.HYBRID
    };

    map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    directionsDisplay.setMap(map);

    var request = {
        placeId: PLACE_ID,
    };

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
}

function callback(result, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(result);
        setResult(result);
        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin: new google.maps.LatLng(searchLocation[0], searchLocation[1]),
            destination: result["geometry"]["location"],
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                //console.log(response);
                directionsDisplay.setDirections(response);
            }
        });
    }
}

function setResult(result) {
    map.setCenter(result["geometry"]["location"]);
    $("#placeName").append(result["name"]);
    $("#placeLocation").append(result["formatted_address"]);
    $("#typeIcon").attr("src",result["icon"]);
    $("#placeRating").html(result["rating"] != undefined ? result["rating"] : "No Ratings");
    $("#placeWebsite").append(result["website"] != undefined ? result["website"] : "No Website Listed");
    $("#placeWebsite").attr("href", result["website"]);
    $("#placeName").attr("data-place", result["place_id"]);
    if (result["reviews"] != undefined) {
        result["reviews"].forEach(function(review) {
            var html = "<div class='review'><strong>";
            html += review["author_name"];
            html += "</strong> rated <strong>" + review["rating"] + "</strong>.";
            html += "<br>";
            html += review["text"];
            html += "</div>";
            $("#placeReviews").append(html);
        });
    } else {
        $("#placeReviews").html("There are no reviews to show.");
    }
    $('.placeReviews').slick({
        infinite: true,
        appendArrows: $("#placeReviewsButtons"),
        prevArrow: "<a class='slick-prev button small'>Previous</a>",
        nextArrow: "<a class='slick-next button small'>Next</a>",
    });
    for (var i=0;i<result["types"].length; i++) {
        $("#placeTypes").append(result["types"][i]);
        if (i < result["types"].length -1) {
            $("#placeTypes").append(", ");
        }
    }
    if (result["photos"] != undefined) {
        $("#placePhoto").attr("src",result["photos"][0].getUrl({'maxHeight': 150}));
    } else {
        $("#placePhoto").attr("src","http://placehold.it/329x150&text=No Place Image");
    }
}

$("#blacklist").click(function() {
    var place = $("#placeName").attr("data-place");
    var name = $("#placeName").html();
    $.ajax({
        type:"POST",
        url:"/add_blacklist/",
        data:{"place":place, "name":name},
        success:function(data) {
            if (data == "Added") {
                $("#blacklist").addClass("info");
                $("#blacklistIcon").html("<i class='fi-x'></i> ")
            } else if (data == "Removed") {
                $("#blacklist").removeClass("info");
                $("#blacklistIcon").html("")
            } else {
                alert(data);
            }
        },
        error: function(result) {
            console.log(result["responseText"]);
        },
    });
});

$("#favourite").click(function() {
    var place = $("#placeName").attr("data-place");
    var name = $("#placeName").html();
    $.ajax({
        type:"POST",
        url:"/add_favourite/",
        data:{place:place, name:name},
        success: function(data) {
            if (data == "Added") {
                $("#favourite").addClass("info");
                $("#favouriteIcon").html("<i class='fi-x'></i> ")
            } else if (data == "Removed") {
                $("#favourite").removeClass("info");
                $("#favouriteIcon").html("")
            } else {
                alert(data);
            }
        },
        error: function(result) {
            console.log(result["responseText"]);
        },
    });
});
