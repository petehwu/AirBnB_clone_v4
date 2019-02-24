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
});
