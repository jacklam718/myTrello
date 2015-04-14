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

  this.get("/members/me/boards", function(boards) {
    boards.forEach(function(board) {
      appendBoardItemToContainer(board);
    })
  })
}

MyTrello.loadBoardLists = function(boardId) {
  var self = this;
  var path = "/board/" + boardId + "/lists";

  var $navbar = $(".side-nav")
  var $tabsContainer = $navbar.append("<ul class='tabs'></ul>").find("ul");

  var appendListItemToContainer = function(list) {
    $tabsContainer.append(
      "<li class='tab'>" +
        "<a class='waves-effect waves-light' href='#" + list.id + "'" + ">" + list.name + "</a>" +
      "</li>"
    )
  }

  this.get(path, function(lists) {
    lists.forEach(function(list) {
      appendListItemToContainer(list);
      self.loadListCards(list.id);
    })
  })
}

MyTrello.loadListCards = function(listId) {
  var path = "/lists/" + listId + "/cards";

  // var $cards = $("#cards");
  var $listContainer = document.createElement("div");
  var $ulContainer = document.createElement("ul");

  $listContainer.id = listId;
  $ulContainer.className = "collection";

  $listContainer.appendChild($ulContainer);
  $(".content").append($listContainer);

  var appendCardItemToContainer = function(card) {
    $($ulContainer).append(
      "<a class='collection-item' href='#'>" + card.name + "</a>"
    )
  }

  this.get(path, function(cards) {
    cards.forEach(function(card) {
      appendCardItemToContainer(card);
    })
  });
}

MyTrello.markRead = function() {

}

MyTrello.markUnread = function() {

}

MyTrello.login();
