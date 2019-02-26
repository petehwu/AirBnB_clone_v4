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
});
