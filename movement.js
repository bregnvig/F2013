$(document).on('pageshow', '#movement', function() {
  var list = $('#movements');
  $('#movement-title').text('Saldo ' + F2013.user.account.balance + ' kr');
  F2013.user.account.entries.forEach(function(entry) {
    list.append($('<li>')
      .append($('<h2>').text(entry.message))
      .append($('<p>').text(moment(entry.date).format('lll')))
      .append($('<h2>').addClass('ui-li-aside').text(entry.amount + ' kr')));
  });
  list.listview('refresh');
});
