$(function () {
  let stateDict = {};
  let cityDict = {};
  let amenityDict = {};
  let dispList = [];
  let amenityList = [];
  let cityKey = [];
  let amenityKey = [];
  let stateKey = [];

  // amenities checkbox
  $('input.checkbox').change(function () {
    const aType = $(this).attr('id');
    if ($(this).is(':checked')) {
      if (aType === 'state') {
        $('[state-id=' + $(this).attr('data-id') + ']').prop('checked', true); // check the checkbox for each city within this state
        stateDict[$(this).attr('data-id')] = $(this).attr('data-name');
        $('[state-id=' + $(this).attr('data-id') + ']').each(function (index) { // loop through each city and add to dictionary
          cityDict[$(this).attr('data-id')] = $(this).attr('data-name');
        });
      } else if (aType === 'city') {
        cityDict[$(this).attr('data-id')] = $(this).attr('data-name'); // add city to dictionary
        // if statement below checks to see if all cities within state is checked. if so, check the state checkbox too
        if ($('[state-id=' + $(this).attr('state-id') + ']:checked').length === $('[state-id=' + $(this).attr('state-id') + ']').length) {
          $('[data-id=' + $(this).attr('state-id') + ']').prop('checked', true);
          stateDict[$(this).attr('state-id')] = $(this).attr('state-name');
        }
      } else {
        amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }
    } else {
      if (aType === 'state') {
        delete stateDict[$(this).attr('data-id')];
        $('[state-id=' + $(this).attr('data-id') + ']').prop('checked', false);
        $('[state-id=' + $(this).attr('data-id') + ']').each(function (index) {
          delete cityDict[$(this).attr('data-id')];
        });
      } else if (aType === 'city') {
        delete cityDict[$(this).attr('data-id')];
        delete stateDict[$(this).attr('state-id')];
        $('[data-id=' + $(this).attr('state-id') + ']').prop('checked', false);
      } else {
        delete amenityDict[$(this).attr('data-id')];
      }
    }
    amenityList = [];
    amenityKey = [];
    dispList = [];
    cityKey = [];
    stateKey = [];
    for (let index in amenityDict) {
      amenityList.push(amenityDict[index]);
      amenityKey.push(index);
    }
    for (let index in stateDict) {
      dispList.push(stateDict[index]);
      stateKey.push(index);
    }
    for (let index in cityDict) {
      dispList.push(cityDict[index]);
      cityKey.push(index);
    }
    if (amenityList.length === 0) {
      $('div.amenities').find('h4').html('&#160;');
    } else {
      $('div.amenities').find('h4').text(amenityList.join(', '));
    }
    if (dispList.length === 0) {
      $('div.locations').find('h4').html(' &nbsp;');
    } else {
      $('div.locations').find('h4').text(dispList.join(', '));
    }
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
      console.log('results returned: ' + results.length); // debug message
      $.each(results, function (index, place) {
        const htmlStr = '<div class="title">' +
        // '<h2>' + index + '</h2><br />'  + // for testing only
        '<h2>' + place.name + '</h2>' +
        '<div class="price_by_night"> $' +
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

  $('button').click(function () {
    let payload = { amenities: amenityKey, states: stateKey, cities: cityKey };
    console.log(JSON.stringify(payload)); // for testing only
    $.ajax({
      type: 'POST',
      url: uriEndpoint,
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json',
      success: function (results) {
        console.log('results returned: ' + results.length); // debug message
        $('section.places').empty();
        $('<h1 class="places_start">Places</h1>').appendTo('section.places');
        $.each(results, function (index, place) {
          const htmlStr = '<div class="title">' +
          // '<h2>' + index + '</h2><br />'  + //for testing only
          '<h2>' + place.name + '</h2>' +
          '<div class="price_by_night"> $' +
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
        }); // for each
      } // success
    }); // ajax
  }); // button_click
});
