(function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
      $('#login').hide();
      $('#loggedin').show();
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        if( data.error ){
          console.log('Error ' + data.error);
        }else {
          access_token = data.access_token;
          refresh_token = data.refresh_token;
          oauthPlaceholder.innerHTML = oauthTemplate({
            access_token: access_token,
            refresh_token: refresh_token
          });
        }
      });
    }, false);

  }
})();
