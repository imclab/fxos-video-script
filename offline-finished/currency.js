(function(){

  var rate;
  var result = document.querySelector('#result span');
  var input = document.querySelector('#nok');
  var refresh = document.querySelector('#refresh');

  function getExchangeRate() {
    var x = new XMLHttpRequest();

    x.onload = function() {
      if (x.status === 200) {
        rate = Number(JSON.parse(x.responseText).query.results.rate.Rate);
        localStorage.setItem('rate', rate);
      }
      else {
        rate = Number(localStorage.getItem('rate'));
      }
    };

    x.onerror = function(e) {
      rate = Number(localStorage.getItem('rate'));
    };

    x.open('GET', 'http://query.yahooapis.com/v1'+
           '/public/yql?q=select%20*%20from%20yahoo.'+
           'finance.xchange%20where%20pair%20in%20%28%'+
           '22NOKEUR%22%29&env=store://datatables.'+
           'org/alltableswithkeys&format=json');

    x.send();
  }

  // On page load, get the exchange rate
  getExchangeRate();

  // Clicking refresh should also get exchange rate
  refresh.addEventListener('click', function() {
    getExchangeRate();
  });

  // When you type we'll update the Amount in EUR
  input.addEventListener('keyup', function() {

    // No rate available? Then cancel out.
    if (!rate) {
      result.textContent = 'No rate available';
      return;
    }

    // Grab the value from the user, and if it's a number show result
    var value = Number(input.value);
    if (!isNaN(value)) {
      result.textContent = '€ ' + (value * rate).toFixed(2);
    }
  });

})();

window.applicationCache.addEventListener('updateready', function(e) {
  // Browser downloaded a new app cache.
  if (confirm('A new version of this site is available. Load it?')) {
    window.location.reload();
  }
});
