
$(document).ready(function(){
    var firstName = $('#fn').text();
    var secondName = $('#sn').text();
    var intials = firstName.charAt(0) ;
    var intials2 = secondName.charAt(0) ;
    var logo = $('#log').text(intials);
    var logo2 = $('#log2').text(intials2);
  });

    $(document).ready(function(){
    var fn = $('#firstName').text();
    var lastName = $('#lastName').text();
    var intials = fn.charAt(0) + lastName.charAt(0);
    var logo = $('#logo').text(intials);
  });
