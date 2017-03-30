var usernames = [
  "tj",
  "addyosmani",
  "paulirish",
  "sindresorhus",
  "gaearon",
  "defunkt",
  "daimajia",
  "kvz",
  "omgmog",
  "yyx990803",
  "kennethreitz",
  "Trinea",
  "JacksonTian",
  "substack",
  "stormzhang",
  "muan",
  "onevcat",
  "clowwindy",
  "getify",
  "csu",
  "matiasinsaurralde",
  "ibireme",
  "phodal",
  "ryanb",
  "isaacs",
  "justjavac",
  "ChenYilong",
  "cusspvz",
  "feross",
  "m1guelpf"
]

var emoji = new EmojiConvertor();
var reqNo = Math.floor(Math.random() * 3) + 1;
var repoNo = 1;
var perPage = 5;

if (window.localStorage) {
  if (!localStorage.getItem('accessToken')) {
    swal({
      title: "Submit Github Token",
      html: "Curiosity uses Github Token to access Github API. Your token will be saved in LocalStorage. So don't worry. Get new token <a target='_blank' href='https://github.com/settings/tokens/new'>here</a>.",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: false,
      preConfirm: function (token) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            if (token == '') {
              reject("Enter Valid Token")
            } else {
              localStorage.setItem("accessToken", token);
              resolve()
            }
          }, 1000);
        })
      },
      allowOutsideClick: false
    }).then(function(token) {
      getData(token);
      swal({
        type: "success",
        title: "Thank You"
      })
    })
  }
} else {
  alert("Sorry! LocalStorage is not available");
}

accessToken = localStorage.getItem('accessToken');

if(localStorage.getItem('accessToken')) {
  getData(localStorage.getItem('accessToken'));
}

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  reqNo += 1;
}

function getData(token) {
  for (i = 0; i < usernames.length; i++) {
    url = "https://api.github.com/users/" + usernames[i] + "/starred?per_page=" + perPage + "&access_token=" + token + "&page=" + reqNo + 1;
    httpGetAsync(url, dataCollector);
  }
}
var content = document.getElementById("content");
var dataStorage = [];

function dataCollector(response) {
  //dataStorage.push(response);
  for (i = 0; i < perPage; i++) {
    var innerContent = "<li><span class='link'><a href='" + JSON.parse(response)[i].html_url + "' target='_blank'>" + JSON.parse(response)[i].name + "<span> - " + String(JSON.parse(response)[i].description) + "</span>" + "<br/></a></span></li>";
    innerContent = emoji.replace_unified(innerContent);
    content.innerHTML += emoji.replace_colons(innerContent);
    emoji.img_sets.apple.path = 'http://mubaris.com/img-apple-64/emojis/';
    repoNo += 1;
  }
}

var options = {
  distance: 1,
  callback: function(done) {
    getData(localStorage.getItem('accessToken'));
    done();
  }
}

infiniteScroll(options);
