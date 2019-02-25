$(function () {
  let city_dict =  {};
  let amenity_dict = {};
  let city_list = [];
  let amenity_list = [];
  let city_key = [];
  let amenity_key = [];
  // amenities checkbox 
  $('input.checkbox').change(function () {
    const a_type = $( this ).attr('id');
    if ($(this).is(':checked')) {
      if (a_type === 'state'){
        $("[state-id=" + $( this ).attr('data-id') +"]").prop('checked', true);     //check the checkbox for each city within this state
        $("[state-id=" + $( this ).attr('data-id') +"]").each ( function (index) {  //loop through each city and add to dictionary
          city_dict[$( this ).attr('data-id')] = $( this ).attr('data-name');
        });
      } else if (a_type === 'city') {
        city_dict[$( this ).attr('data-id')] = $( this ).attr('data-name'); //add city to dictionary
        //if statement below checks to see if all cities within state is checked. if so, check the state checkbox too
        if ($("[state-id=" + $( this ).attr('state-id') +"]:checked").length === $("[state-id=" +$( this ).attr('state-id') +"]").length) {
          $("[data-id=" + $( this ).attr('state-id') +"]").prop('checked', true);
        }
      } else {
        amenity_dict[$( this ).attr('data-id')] = $( this ).attr('data-name');
      }
    } else {
      if (a_type === 'state') {
        $("[state-id=" + $( this ).attr('data-id') + "]").prop('checked', false);
        $("[state-id=" + $( this ).attr('data-id') + "]").each ( function (index) {
          delete city_dict[$( this ).attr('data-id')];
        });
      } else if (a_type === 'city') {
        delete city_dict[$( this ).attr('data-id')];
        $("[data-id=" + $( this ).attr('state-id') + "]").prop('checked', false);
      } else {
        delete amenity_dict[$( this ).attr('data-id')];
      }
    }   
    amenity_list = []; 
    amenity_key = []; 
    city_list = [];
    city_key = [];
    for (let index in amenity_dict) {
      amenity_list.push(amenity_dict[index]);
      amenity_key.push(index);
    }
    for (let index in city_dict) {
      city_list.push(city_dict[index]);
      city_key.push(index); 
    }  
    $('div.amenities').find('h4').text(amenity_list.join(', '));
    $('div.locations').find('h4').text(city_list.join(', '));
  }); 

  const uri = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(uri, function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').removeClass('not_available').addClass('available');
        //$('DIV#api_status').toggleClass('available', 'not_available');
      } else {
        $('DIV#api_status').removeClass('available').addClass('not_available');
        //$('DIV#api_status').toggleClass('not_available', 'available');
      }
  })
  .fail(function () {
    $('DIV#api_status').removeClass('available').addClass('not_available');
    //$('DIV#api_status').toggleClass('not_available', 'available');
  });

// populate places of the website
const uri_endpoint = 'http://0.0.0.0:5001/api/v1/places_search/';

  $.ajax({
    type: 'POST',
    url: uri_endpoint,
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (results) {
      $.each(results, function (index, place) {
        const html_str = '<div class="title">' + 
        '<h2>' + index + '</h2><br />'  + //for testing only
        '<h2>' + place.name + '</h2>'  +
        '<div class="price_by_night">' +
        place.price_by_night +
        '</div>' +
        '</div>' +
        '<div class="information">' +
        '<div class="max_guest">' +
        '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
        '<br />' +
        place.max_guest + ' Guests' +
        '</div>' +
        '<div class="number_rooms">' +
        '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
        '<br />' +
        place.number_rooms + ' Bedrooms' +
        '</div>' +
        '<div class="number_bathrooms">' +
        '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
        '<br />' +
        place.number_bathrooms + ' Bathroom' +
        '</div>' +
        '</div>' +
        '<br />' +
        '<div class="description">' +
        place.description + 
        '</div>' ;
        const article = document.createElement('article');
        article.innerHTML = html_str;
        $(article).insertAfter('h1.places_start');
      });
    }
  });
  // end populate places of the website

  $('button').click( function () {
    let payload= {amenities: amenity_key, cities: city_key};
    console.log(JSON.stringify(payload)); //for testing only
    $.ajax({
      type: 'POST',
      url: uri_endpoint,
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json',
      success: function (results) {
        $('section.places').empty();
        $( '<h1 class="places_start">Places</h1>' ).appendTo('section.places');
        $.each(results, function (index, place) {
          const html_str = '<div class="title">' + 
          '<h2>' + index + '</h2><br />'  + //for testing only
          '<h2>' + place.name + '</h2>'  +
          '<div class="price_by_night">' +
          place.price_by_night +
          '</div>' +
          '</div>' +
          '<div class="information">' +
          '<div class="max_guest">' +
          '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
          '<br />' +
          place.max_guest + ' Guests' +
          '</div>' +
          '<div class="number_rooms">' +
          '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
          '<br />' +
          place.number_rooms + ' Bedrooms' +
          '</div>' +
          '<div class="number_bathrooms">' +
          '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
          '<br />' +
          place.number_bathrooms + ' Bathroom' +
          '</div>' +
          '</div>' +
          '<br />' +
          '<div class="description">' +
          place.description + 
          '</div>' ;
          const article = document.createElement('article');
          article.innerHTML = html_str;
          $(article).insertAfter('h1.places_start');
        }); //for each
      } //success
    }); //ajax
  }); //button_click
});
