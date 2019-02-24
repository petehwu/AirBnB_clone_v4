$(function () {
  let checked = {}; 
  let check_list = []; 
  let check_key = [];
  let out_string = ''; 
  $('input:checkbox').change(function () {
    if ($(this).is(':checked')) {
      checked[$( this ).attr('data-id')] = $( this ).attr('data-name');
    } else {
      delete checked[$( this ).attr('data-id')];
    }   
    check_list = []; 
    out_string = '';
    check_key = []; 
    for (let index in checked) {
      check_list.push(checked[index]);
      check_key.push(index); 
    }   
    out_string = check_list.join(', ');
    $('div.amenities').find('h4').text(out_string);
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
    let payload= {amenities: check_key};
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
