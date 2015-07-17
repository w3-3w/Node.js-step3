function startChat(nick, room) {

  var socket = io();
  var $chatItems = $('#chat-items');

  socket.emit('join', {room: room, name: nick});

  socket.on('chat', function(chat) {
    var $newChat = $('<div />');
    $newChat.addClass('chat-item chat');
    var $temp1 = $('<span />');
    $temp1.addClass('username');
    if (chat.name === nick) {
      $temp1.addClass('self');
    }
    $temp1.text(chat.name);
    $newChat.append($temp1);

    var $temp2 = $('<span />');
    $temp2.addClass('msg');
    $temp2.text(chat.message);
    $newChat.append($temp2);

    $chatItems.append($newChat);
    $('body').animate({scrollTop: $chatItems.children().last().offset().top}, 'fast');
  });

  socket.on('join', function(data) {
    var $newChat = $('<div />');
    $newChat.addClass('chat-item system-msg');
    if (typeof data.self === 'undefined') {
      var $temp1 = $('<span />');
      $temp1.addClass('username');
      $temp1.text(data.name);
      $newChat.append($temp1);
    }

    var $temp2 = $('<span />');
    $temp2.addClass('msg');
    if (data.self) {
      $temp2.text('除你之外还有 ' + data.count + ' 人在该房间内');
    }
    else if (data.join) {
      $temp2.text('加入了房间');
    }
    else {
      $temp2.text('离开了房间');
    }
    $newChat.append($temp2);

    $chatItems.append($newChat);
    $('body').animate({scrollTop: $chatItems.children().last().offset().top}, 'fast');
  });

  $('#chat-form').submit(function() {
    var message = $('#chat-input').val();
    socket.emit('chat', {
      message: message
    });

    $('#chat-input').val('');

    return false;
  });

}

function init() {
  var $nickname = $('#nickname');
  var $roomCode = $('#chat-room');
  var nickname = $nickname.val();
  var roomCode = $roomCode.val();

  if (nickname.length === 0 || nickname.length > 12) {
    $nickname.parent().addClass('has-error');
  }
  else {
    $nickname.parent().removeClass('has-error');
    if (roomCode.length === 0 || roomCode.length > 6) {
      $roomCode.parent().addClass('has-error');
    }
    else {
      $roomCode.parent().removeClass('has-error');
      $('#prompt-out').modal('hide');
      $('#room-display').text('房间：' + roomCode);
      $('#prompt-out').on('hidden.bs.modal', function() {
        $nickname.val('');
        $roomCode.val('');
        startChat(nickname, roomCode);
      });
    }
  }
  return false;
}

$(function() {
  $('#prompt-out').modal({
    backdrop: 'static',
    keyboard: false
  });
  $('#prompt-form').submit(init);
  $('#prompt-confirm').click(init);
});
