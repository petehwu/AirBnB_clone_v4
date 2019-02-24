$(function () {
  let checked = {}; 
  let check_list = []; 
  let out_string = ''; 
  $('input:checkbox').change(function () {
    if ($(this).is(':checked')) {
      checked[$( this ).attr('data-id')] = $( this ).attr('data-name');
    } else {
      delete checked[$( this ).attr('data-id')];
    }   
    check_list = []; 
    out_string = ''; 
    for (let index in checked) {
      check_list.push(checked[index]);
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
});
