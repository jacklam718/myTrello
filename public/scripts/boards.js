Trello.setToken("55eccf2c471da1da2abf7018b5f5add57506ad897b335e929fb11ca104d24979")

// boards.html
// get all own boards
function loadBoards() {
  Trello.get("/members/me/boards", function(boards) {
    var $boards = $("#boards");

    boards.forEach(function(board) {
      $boards.append(
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
    })
  })
}

$("#boards").load(loadBoards());
