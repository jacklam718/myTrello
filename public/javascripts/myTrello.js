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
      "<li class='collection-item'>" +
        "<a href='#' " + "data-card-id=" + "'" + card.id + "'" + ">" +
          card.name +
        "</a>" +

        "<a class='btn waves-effect waves-light mark-read-button' href='#' data-action='mark-read'" + "data-card-id=" + "'"+ card.id + "'" + ">" +
          "Mark Read" +
        "</a>" +
      "</li>"
    )
  }

  this.get(path, function(cards) {
    cards.forEach(function(card) {
      appendCardItemToContainer(card);
    })
  });
}

// MyTrello.loadCardContentToModal = function(cardId) {
//   var path = "/cards/" + cardId;
//
//   var createCardModal = function(card) {
//     var $modal = document.createElement("div");
//     modal.className = "modal"
//
//     var $modalContent = document.createElement("div");
//     $modalContent.className = "modal-content";
//
//     var $markReadButton = document.createElement("a");
//     $markReadButton.className = "btn waves-effect waves-light";
//     $markReadButton.text = "Mark Read";
//
//     var $title = document.createElement("h4");
//     $title.text = card.name;
//
//     $ul = document.createElement("ul");
//     $ul.className = "collection";
//
//     $modal.appendChild($modalContent);
//     $modalContent.appendChild($title);
//     $modalContent.appendChild($markReadButton);
//
//     cards.labels.forEach(function(label) {
//
//     });
//   }
//
//   this.get(path, function(card) {
//     createCardModal(card)
//   })
// }

MyTrello.markRead = function(cardId, boardId) {
  var path = "/cards/" + cardId + "/labels";
  var self = this;

  var params = {
    color: "blue",
    idBoard: boardId,
    name: "Read"
  }
  console.log(cardId);
  // post comment
  this.members.get("me", function(user) {
    self.postComment(cardId, user.username + " has readed.");
  })

  this.post(path, params);
}

MyTrello.markUnread = function(cardId) {
  var path = "/cards/" + cardId + "/labels";
  var self = this;

  this.get(path, function(labels) {
    labels.forEach(function(label) {
      if (label.name === "Read") {
        path = "/labels/" + label.id + "/";
        self.delete(path, {id: label.id});
      }
    })
  })
}

MyTrello.postComment = function(cardId, comment) {
  var path = "/cards/" + cardId + "/actions/comments";

  this.post(path, {text: comment});
}

function markRead(event) {
  console.log("markread");
  var cardId = event.target.dataset.cardId;
  var pathname = window.location.pathname.split("/");
  var boardId = pathname[pathname.length-1];

  MyTrello.markRead(cardId, boardId);
}

MyTrello.login();
