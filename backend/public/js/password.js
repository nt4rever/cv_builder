$(function () {
  let token = getUrlVars()['token'];
  const overlay = $('.overlay');
  if (token) {
    overlay.addClass('hide');
  }

  $('#change-password').on('click', function (e) {
    e.preventDefault();
    const newPassword = $('input[name="newPassword"]').val();
    if (!token || !validatePassword(newPassword)) return;
    overlay.toggleClass('hide');

    $.ajax({
      url: '/auth/reset-password-handle',
      type: 'POST',
      dataType: 'json',
      data: {
        token,
        newPassword,
      },
      success: function (data) {
        window.location.href = `${data.url}`;
        overlay.toggleClass('hide');
      },
      error: function () {
        overlay.toggleClass('hide');
        window.location.href = 'reset-password-error';
      },
    });
  });
});

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function validatePassword(pwd) {
  $('input[name="newPassword"]').removeClass('invalid');
  if (!pwd) {
    $('input[name="newPassword"]').addClass('invalid');
    return false;
  }
  if (pwd.length < 6 || pwd.length > 16) {
    $('input[name="newPassword"]').addClass('invalid');
    return false;
  }
  return true;
}
