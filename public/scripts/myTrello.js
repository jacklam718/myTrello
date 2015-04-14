MyTrello = Trello;

MyTrello.login = function(opts) {
  if (opts === undefined) {
    var opts = {type: "direct", scope: {read: true, write: true}}
  }

  this.authorize(opts);
}

MyTrello.logout = function() {
  this.deauthorize();
}

MyTrello.loadBoards = function() {
  $boardsContainer = $(".boards-container");

  // boards-container element must exist in DOM
  if ($boardsContainer.length === 0) {
    return false
  }

  if (! $boardsContainer.hasClass("row")) {
    $boardsContainer.addClass("row")
  }

  var boards = this.get("/members/me/boards", function(boards) {
    return boards.responseJSON
  })

  var appendBoardItemToContainer = function(board) {
    $boardsContainer.append(
      "<div class='col s4 m4 l4'>" +
        "<div class='card waves-effect waves-block'>" +
          "<a href='/boards/" + board.id + "'" + ">" +
            "<div class='card-content'>" +
              "<span class='card-title activator grey-text text-darken-4'>" + board.name + "</span>" +
            "</div>" +
          "</a>" +
        "</div>" +
      "</div>"
    )
  }

  boards.forEach(function(board) {
    appendBoardItemToContainer(board);
  })
}

MyTrello.loadBoardLists = function(boardId) {
  var path = "/board/" + boardId + "/lists";

  var $navbar = $(".side-nav")
  var $tabsContainer = $navbar.append("<ul class='tabs'></ul>").find("ul");

  var lists = this.get(path, function(lists) {
    return lists.responseJSON;
  })

  var appendListItemToContainer = function(card) {
    $tabsContainer.append(
      "<li> class='tab'>" +
        "<a class='waves-effect waves-light' href='#" + "'" + ">" + list.name + "</a>" +
      "</li>"
    )
  }

  lists.forEach(function(card) {
    appendCardItemToContainer(card);
  })
}

MyTrello.loadListCards = function(listId) {
  var path = "/lists/" + listId + "/cards";

  // var $cards = $("#cards");
  var $listContainer = document.createElement("div");
  var $ulContainer = document.createElement("ul");

  $listContainer.id = listId;
  $ulContainer.className = "collection";

  $listContainer.appendChild($ul);
  $(".content").append($list);


  var cards = this.get(path, function(cards) {
    return cards.responseJSON
  });

  var appendCardItemToContainer = function(card) {
    $($ulContainer).append(
      "<a class='collection-item' href='#'>" + card.name + "</a>"
    )
  }

  cars.forEach(function(card) {
    appendCardItemToContainer(card);
  })
}

MyTrello.markRead = function() {

}

MyTrello.markUnread = function() {

}

$(document).ready(function() {
  MyTrello.login();

  $("#boards-show-page").ready(function() {
      var pathname = window.location.pathname.split("/");
      var boardId = pathname[pathname.length-1]
      console.log(boardId);
      MyTrello.loadBoardLists(boardId);
  })
})
