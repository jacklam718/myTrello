function loadLists(boardId) {
  var path = "/board/" + boardId + "/lists";

  var $navbar = $(".side-nav")
  var $tabs = document.createElement("ul")
  $tabs.className = "tabs";

  $($navbar).append($tabs)

  Trello.get(path, function(lists) {
    lists.forEach(function(list) {
      $($tabs).append(
        "<li class='tab'>" +
          "<a class='waves-effect waves-light' href='#" + list.id + "'" + ">" + list.name + "</a>" +
        "</li>"
      )

      loadCards(list.id);
    })
  });
}

function loadCards(listId) {
  var path = "/lists/" + listId + "/cards";

  var $cards = $("#cards");
  var $list = document.createElement("div");
  var $ul = document.createElement("ul");

  $list.id = listId;
  $ul.className = "collection";

  $list.appendChild($ul);

  $(".content").append($list);

  console.log($ul);
  Trello.get(path, function(cards) {
    cards.forEach(function(card) {
      $($ul).append(
        "<a class='collection-item' href='#'>" + card.name + "</a>"
      )
    })
  });
}

var pathname = window.location.pathname.split("/");
var boardId = pathname[pathname.length-1]

loadLists(boardId);

window.setTimeout(function() {
  $(".tabs").tabs();
}, 500)
