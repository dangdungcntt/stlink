/*
  Add a button click handler to post our request.
*/
var btn = document.querySelector('#btn-create');

function eventHandlers() {
  
  if(!btn){ return;}
  btn.addEventListener('click', function (event) {
    event.preventDefault();
    btn.classList.add('btn-disabled');
    btn.disabled = true;
    submitURL();
  }, false);
}


/*
  Post our URL to a Lambda function.
  The Lambda function will return a shortcode URL which it will also set
  as a new redirect rule in the global CDN.
*/
function submitURL() {
  var url = document.querySelector('#destination').value;
  fetch('/.netlify/functions/generate-route?to=' + url)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      btn.classList.remove('btn-disabled');
      btn.disabled = false;
      document.querySelector("#message").innerHTML = `<a href="${data.url}">${data.url}</a>`;
      return;
    });
  
}


/*
  if a shortcode URL brought us here, then the deployment of that redirect is still
  underway. So let's query the data store directly and send the user to the right
  place with a client side redirect.
*/
function redirectIfRequired() {
  var path = document.location.pathname;
  if(path !== "/") {
    document.querySelector('#message').innerHTML = "The redirect rules for that short URL is still being created... sending you directly!";
    fetch('/.netlify/functions/get-route?code='+path.replace("/",""))
    .then(function(response) { return response.json(); })
    .then(function(data) {
      document.location.href = data.url;
    });
  }
}


eventHandlers();
redirectIfRequired();
