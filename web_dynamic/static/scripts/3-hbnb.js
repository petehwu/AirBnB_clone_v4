$(function () {
  let checked = {};
  let checkList = [];
  let outString = '';
  $('input:checkbox').change(function () {
    if ($(this).is(':checked')) {
      checked[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete checked[$(this).attr('data-id')];
    }
    checkList = [];
    outString = '';
    for (let index in checked) {
      checkList.push(checked[index]);
    }
    outString = checkList.join(', ');
    $('div.amenities').find('h4').text(outString);
  });

  const uri = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(uri, function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').removeClass('not_available').addClass('available');
      // $('DIV#api_status').toggleClass('available', 'not_available');
    } else {
      $('DIV#api_status').removeClass('available').addClass('not_available');
      // $('DIV#api_status').toggleClass('not_available', 'available');
    }
  })
    .fail(function () {
      $('DIV#api_status').removeClass('available').addClass('not_available');
      // $('DIV#api_status').toggleClass('not_available', 'available');
    });

  // populate places of the website
  const uriEndpoint = 'http://0.0.0.0:5001/api/v1/places_search/';

  $.ajax({
    type: 'POST',
    url: uriEndpoint,
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (results) {
      console.log('Number of results: ' + results.length); // debug message
      $.each(results, function (index, place) {
        const htmlStr = '<div class="title">' +
        '<h2>' + place.name + '</h2>' +
        '<div class="price_by_night">$' +
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
        '</div>';
        const article = document.createElement('article');
        article.innerHTML = htmlStr;
        $(article).insertAfter('h1.places_start');
      });
    }
  });
// end populate places of the website
//
});
