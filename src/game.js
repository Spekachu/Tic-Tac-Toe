// **************** FUNCTIONS FOR GAME LOGIC ************************
var usersTurn = true;
var userFirst = true;
var gameStarted = false;
var gameOver = false;
var userIsX = true;
var p2CanWin = false;
var userCanWin = false;
var player2IsComp = true;
var compTurn = 0;
var xSymbol = '&#x02A2F';
var isAndroid = /(android)/i.test(navigator.userAgent);
if (isAndroid) {
  xSymbol = 'x';
}
var slots = ('<div class="slot"> <p class="shadow x">'+ xSymbol +'</p> <p class="shadow o">O</p> </div> ').repeat(9);
var redX = '<p id="red-piece" class="red piece">'+ xSymbol +'</p>';
var greenO = '<p id="green-piece" class="green piece">O</p>';
var userPieces = [];
var p2Pieces = [];
var playedPieces = [];
var availSlots = [0,1,2,3,4,5,6,7,8];
var centerSlot = [4];
var edgeSlots = [1,3,5,7];
var cornerSlots = [0,2,6,8];
var yellowSlots = []; //winning slots to glow after
var winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var positions = ['TLC',' TE','TRC',' LE','C',' RE','BLC',' BE','BRC'];
var lastUserMove, firstUserMove, firstUserMoveCode;
var lastCompMove, lastCompMoveCode;
var firstCompMove, firstCompMoveCode, needToBlock, winningSlots;
var playArea = $('#play-area');
var slot = $('.slot');
var pieceO = 'green-piece';
var pieceX = 'red-piece';
var gamePrintOut = ' | | '+'\n'+' | | '+'\n'+' | | ';

function isAvail(i) {
  return availSlots.indexOf(i) != -1;
}
function initVars() {
  playArea.html(slots);
  winningSlots = [];
  printGame();
}
function resetVars() { // called by reset button
  initVars();
  availSlots = [0,1,2,3,4,5,6,7,8];
  userPieces = [];
  p2Pieces = [];
  playedPieces = [];
  winningSlots = [];
  $('#restart').addClass('greyed');
  $('#start').removeClass('greyed');
  $('.switch-container .switch').removeClass('greyed');
  $('.slot').removeClass('winning-tile comp-winning-tile');
  gameStarted = userCanWin = p2CanWin = gameOver = false;
  usersTurn = userFirst;
  compTurn = 0;
  hideResult();
  console.log("NEW GAME");
}
function printData() {
  //console.log("*** PRINTING *****");
  //console.log("user pieces: " + userPieces);
  //console.log("p2 pieces: " + p2Pieces);
  //console.log("playedPieces: " + playedPieces);
  //console.log("availSlots: " + availSlots);
  //console.log("gameStarted: " + gameStarted);
  //console.log("gameOver: " + gameOver);
  //console.log("userIsX: " + userIsX);
  //console.log("player2IsComp: " + player2IsComp);
  //console.log("usersTurn: " + usersTurn);
  //console.log("userFirst: " + userFirst);
  //console.log("userCanWin: " + userCanWin);
  //console.log("p2CanWin: " + p2CanWin);
  //console.log("^^^ DONE ^^^^^");
  printGame();
}
function printGame() {
  gamePrintOut = '';
  var line = ['','','','','','','','',''];
  for (var i = 0; i < 9; i+=1) {
    var slot = i;
    if (userPieces.indexOf(slot) !=-1) {
      line[i] = (userIsX ? 'X' : 'O');
    } else if (p2Pieces.indexOf(slot) !=-1) {
      line[i] = (!userIsX ? 'X' : 'O');
    } else {
      line[i] = ' ';
    }
    if ([1,2,4,5,7,8].indexOf(i) != -1)
      gamePrintOut += "|";
    if ([3,6].indexOf(i) != -1)
      gamePrintOut += "\n";
    gamePrintOut += line[i];
  }
  console.log(gamePrintOut);
}
function handleSwitch(elem) {
  elem.toggleClass('switched');
  elem.parent().siblings('.frame').find('.curr-option').toggleClass('option2');
  if (elem.hasClass('piece-switch'))
    userIsX = !userIsX;
  else if (elem.hasClass('choice-switch'))
    player2IsComp = !player2IsComp;
  else if (elem.hasClass('order-switch'))
    usersTurn = userFirst = !userFirst;
}
function startGame() {
  $('#restart').removeClass('greyed');
  $('#start').addClass('greyed');
  $('.switch-container .switch').addClass('greyed');
  gameStarted = true;
  gameOver = false;
  if (!userFirst)
    computerGo();
  updateSizes();
}
function displayResult() {
  $('#result-ribbon').addClass('displayed');
  gameOver = true;
}
function hideResult() {
  $('#result-ribbon').removeClass('win lose tie displayed toPlayer2');
}
function userWins(set) {
  $('#result-ribbon').addClass('win displayed');
  lightUpWinners(set, 'winning-tile');
  displayResult();
  console.log("!!! YOU WIN !!!");
}
function player2Wins(set) {
  $('#result-ribbon').addClass('lose displayed');
  if (!player2IsComp)
    $('#result-ribbon').addClass('toPlayer2');
  var str;
  if (player2IsComp){
    str ='comp-winning-tile';
    console.log("!!! YOU LOSE !!!");
  }else{
    str ='winning-tile';
    console.log("!!! P2 WINS !!!");
  }
  lightUpWinners(set, str);
  displayResult();
}
function callTie() {
  $('#result-ribbon').addClass('tie displayed');
  gameOver = true;
}
function lightUpWinners(set, cssClass) {
  for (var i = 0; i < 3; i++) {
    var slot = set[i];
    playArea.children().eq(slot).addClass(cssClass);
  }
}
function checkPieces(pieces, isUser) {
  p2CanWin = false;
  winningSlots = [];
  var winningSlot;
  var blockSlot;
  for (var i = 0; i < winningCombos.length; i++) {
    var set = winningCombos[i];
    var hasSlots = 0;
    var availSlots = 0;
    for (var j = 0; j < set.length; j++) {
      var num = set[j];
      if (pieces.indexOf(num) != -1){
        hasSlots++;
      } else if (isAvail(num)) {
        availSlots++;
        winningSlot = blockSlot = num;
        //console.log("isAvail: blockSlot " + positions[blockSlot] +" = " + blockSlot);
      }
      if (hasSlots == 3) {
        if (isUser)
          userWins(set);
        else
          player2Wins(set);
      } else if (hasSlots == 2 && availSlots == 1) {
        console.log("almost");
        if (isUser) {
          userCanWin = true;
          //console.log("USER CAN WIN ******");
          needToBlock = blockSlot;
          //console.log("needToBlock " + positions[needToBlock] +" = " + needToBlock);
        } else {
          p2CanWin = true;
          winningSlots.push(winningSlot);
          //console.log("winningSlot " +winningSlot+' '+ positions[winningSlot]);
        }
      }
    }
  }
}
function checkIfOver() {
  //console.log('**********************************');
  //console.log('CHECKING USER PIECES');
  checkPieces(userPieces, true);
  //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  //console.log('CHECKING P2 PIECES');
  checkPieces(p2Pieces, false);

  if (playedPieces.length == 9 && !gameOver) {
    callTie();
  }
}
function switchLetters(letters, first, second) {
  var code = letters.split('');
  if (first) {
    (code[0] == 'T' ? code[0] = 'B' : code[0] = 'T');
  }
  if (second) {
    (code[1] == 'L' ? code[1] = 'R' : code[1] = 'L');
  }
  console.log('New code = ' + code.join(''));
  return code.join('');
}
function newEdge() {
  var lastEdge = lastCompMoveCode[1];
  var newEdge;
  if (lastEdge == "T" || lastEdge == "B") {
    newEdge = ["L", "R"][Math.floor(Math.random()*2)]; // or R
  } else {
    newEdge = ["T", "B"][Math.floor(Math.random()*2)]; // or B
  }
  return " "+newEdge+"E";
}
function oppoOf(letter) {
  switch (letter) {
    case 'L':
      return 'R';
    case 'R':
      return 'L';
    case 'T':
      return 'B';
    case 'B':
      return 'T';
  }
}
function computerGo() {
  if (!usersTurn && player2IsComp && gameStarted && !gameOver) {
    var moveIndex;
    var lastUserMoveCode = positions[lastUserMove];

    console.log("userCanWin curr value: " + userCanWin);
    console.log("p2CanWin curr value: " + p2CanWin);
    var firstMoves = cornerSlots.concat(centerSlot);
    var limit = firstMoves.length;
    if (userCanWin && !p2CanWin) { // blocking priority | can be overwritten if comp can win
      console.log("BLOCKING ******");
      moveIndex = needToBlock;
      userCanWin = false;
      console.log('moveIndex = needToBlock = ' + moveIndex);
    } else if (userFirst && !p2CanWin) { // choice branches: this one computer goes second
      // test for center, corners, or edge
      switch (compTurn) {
        case 0:
          if (lastUserMoveCode == 'C') { // center branch
            //pick a random corner
            moveIndex = cornerSlots[Math.floor((Math.random()*4))];
          } else if (lastUserMoveCode[2] == 'E') { 
            moveIndex = 4;
          } else if (lastUserMoveCode[2] == 'C') { // corners branch
            // take the center
            moveIndex = 4;
          }
          firstCompMove = moveIndex;
          firstCompMoveCode = positions[firstCompMove];
          break;
        case 1: // TODO take care of edge branch
          console.log("CASE 1 !!!!!!");
          // corner branch | if (user then selects opposite corner)
          var temp = firstUserMoveCode;
          if (lastUserMoveCode == switchLetters(temp, true, true)) {
            do {
                moveIndex = edgeSlots[Math.floor((Math.random()*4))];
            } while (!isAvail(moveIndex));
          } else { // this will take care of the two adjacent edge slots to that corner
            // no go slots: oppo edge, oppo corner of firstUserMove,
            //console.log("choosing EDGE");
            var temp = firstUserMoveCode;
            var opt1 = ' '+firstUserMoveCode[0]+'E';
            var oppo1 = ' '+switchLetters(temp, true, false)[0]+'E';
            var opt2 = ' '+firstUserMoveCode[1]+'E';
            var avail = isAvail(positions.indexOf(oppo1));
            moveIndex = (avail ? positions.indexOf(opt1) : positions.indexOf(opt2));
          }
          // center branch | if user goes to opposite corner, anything else will activate a block and skip case 1 | besides opp corner, only bordering edges of firstCompMove will not set comp up to win next turn
          if (lastUserMoveCode == switchLetters(lastCompMoveCode, true, true)) { // opposite corner branch
            do {
              moveIndex = cornerSlots[Math.floor((Math.random()*4))];
            } while (!isAvail(moveIndex));
          }
          //edge branch
          if (firstUserMoveCode[2] == 'E') {
            //comp can be in any corner or the center right now
            // the only user moves that will not activate a block are the two closest edges, and the two farthest corners
            console.log("EDGE BRANCH =========");
            console.log("firstCompMoveCode = " + firstCompMoveCode);
              // if user chooses opposite edge, then comp chooses any corner, leads to win
            if (lastUserMoveCode[2] == 'E') { // user chooses edge again
              if (lastUserMoveCode[1] == oppoOf(firstUserMoveCode[1])) {// user chose oppo edge
                // comp should choose any corner
                moveIndex = cornerSlots[Math.floor((Math.random()*4))];
              } else { // user choose either closer edge
                var options = [];
                if (lastUserMoveCode[1] == 'T' || lastUserMoveCode[1] == 'B') {
                  options.push(oppoOf(lastUserMoveCode[1])+firstUserMoveCode[1]+'C');
                  options.push(lastUserMoveCode[1]+oppoOf(firstUserMoveCode[1])+'C');
                } else if (lastUserMoveCode[1] == 'L' || lastUserMoveCode[1] == 'R') {
                  options.push(oppoOf(firstUserMoveCode[1])+lastUserMoveCode[1]+'C');
                  options.push(firstUserMoveCode[1]+oppoOf(lastUserMoveCode[1])+'C');
                }
                moveIndex = positions.indexOf(options[Math.floor(Math.random()*2)]);
              }
            } else { // user chooses corner (would be one of the farthest corners)
              console.log('countering far corner');
              var option;
              if (firstUserMoveCode[1] == 'T' || firstUserMoveCode[1] == 'B') {
                option=(firstUserMoveCode[1]+lastUserMoveCode[1]+'C');
              } else if (firstUserMoveCode[1] == 'L' || firstUserMoveCode[1] == 'R') {
                option=(lastUserMoveCode[0]+firstUserMoveCode[1]+'C');
              }
              console.log('option = ' + option);
              moveIndex = positions.indexOf(option);
            }
          //   do {
          //     moveIndex = cornerSlots[Math.floor((Math.random()*4))];
          //   } while (!isAvail(moveIndex) || lastUserMoveCode == switchLetters(positions[moveIndex], true, true));
          // } else if (lastUserMoveCode[1] == oppoOf(firstCompMoveCode[1]) || lastUserMoveCode[1] == oppoOf(firstCompMoveCode[0])) {
          //   var opt1 = firstCompMoveCode[0] + oppoOf(firstCompMoveCode[1]) + 'C';
          //   var opt2 = oppoOf(firstCompMoveCode[0]) + firstCompMoveCode[1] + 'C';
          //   moveIndex = [positions.indexOf(opt1),positions.indexOf(opt2)][Math.floor((Math.random()*2))];

          }
          break;
        case 2:
          //center branch | user has to block or lose | his block sets him up to win, activating a block from the computer, case 2 is skipped
          // if block is activated and then user picks the opposite corner of firstCompMoveCode
          // any other move would activate another block and skip case 2
          // only possible way for comp to win is to pick something on level of firstCompMoveCode
          console.log("CASE 2 @@@@@@");
          if (firstCompMoveCode[0] != "C") {
            var opt1 = " "+firstCompMoveCode[0]+"E";
            var opt2 = " "+firstCompMoveCode[1]+"E";
            moveIndex = (isAvail(opt1) ? positions.indexOf(opt1) : positions.indexOf(opt2));
          // users move to block comp will set him up, activating a block, skipping case 3, leaving one spot left for user, then tie.
          } else {
            // user just blocked comp, only two moves that can lead to a win; the two adjacent corners from firstUserMoveCode
            // first letter from top edge, rest of letters from firstUserMove
            var newIndex = "   ";
            if (lastUserMoveCode[1] == "T" || lastUserMoveCode[1] == "B") {
              newIndex = lastUserMoveCode[1] + firstUserMoveCode[1] + 'C';
            } else if (lastUserMoveCode[1] == "L" || lastUserMoveCode[1] == "R") {
              newIndex = firstUserMoveCode[0] + lastUserMoveCode[1] + 'C';
            }
            moveIndex = positions.indexOf(newIndex);
            // this sets comp up, so user blocks or loses, if blocks, the comp blocks back, then one spot left for user, then tie
          }
          //edge branch
          if (firstUserMoveCode[2] == 'E') {
            //comp can be in any corner or the center right now
            // the only user moves that will not activate a block are the two closest edges, and the two farthest corners
            console.log("EDGE BRANCH == Case 2");
            moveIndex = availSlots[Math.floor((Math.random()*(availSlots.length)))];
          }
          break;
        case 3:
          // center branch | only if user places in remaining corner, edges will activate a block
          // computer chooses random remaining edge
          console.log("case 3 #####");
          do { // bug: if comp can win, it still goes through this code
            moveIndex = positions.indexOf(newEdge());
          } while (!isAvail(moveIndex));// opposite corner branch closed
          // one slot left for user, results in tie, center branch CLOSED
          break;
        case 4:
          console.log("case 4 $$$$$$");
          moveIndex = availSlots[Math.floor((Math.random()*(availSlots.length)))];
          break;
      }
    } else { // computer going first | done
      switch (compTurn) {
        case 0:
          moveIndex = firstCompMove = firstMoves[Math.floor((Math.random()*limit))];
          // moveIndex = firstCompMove = 4; // testing against center branch
          firstCompMoveCode = positions[firstCompMove];
          break;
        case 1: // comps second move
          if (firstCompMove == 4) { // center slot // CENTER BRANCH
            if (lastUserMoveCode[2] == 'E') { // user placed on an edge, comp can use any corner
              console.log("PLACING ON RANDOM CORNER");
              moveIndex = cornerSlots[Math.floor((Math.random()*4))];
            } else if (lastUserMoveCode[2] == 'C') { // user placed on a corner
              moveIndex = positions.indexOf(switchLetters(lastUserMoveCode, true, true));
            }
          } else { // comp first placed on a corner slot
            if (lastUserMoveCode == 'C') { // BRANCH A
              moveIndex = positions.indexOf(switchLetters(firstCompMoveCode, true, true));
            } else if (lastUserMoveCode[1] == firstCompMoveCode[1]) { // BRANCH B
              moveIndex = positions.indexOf(switchLetters(firstCompMoveCode, false, true));
            } else { // BRANCH C
              moveIndex = positions.indexOf(switchLetters(firstCompMoveCode, true, false));
            }
          }
          break;
        case 2: // comps third move
          if (lastUserMoveCode[1] == firstCompMoveCode[0]) { // BRANCH B
            // user played edge to block
            console.log("B BBBB B BBBB B");
            var options = [positions.indexOf(switchLetters(firstCompMoveCode, true, true)),positions.indexOf(switchLetters(firstCompMoveCode, false, true)), positions.indexOf(' '+firstCompMove[0]+'E')];
            moveIndex = (isAvail(options[0]) && !isAvail(options[2]) ? options[0] : options[1]);
            // next move is a sure win
          } else if (lastUserMoveCode[1] == firstCompMoveCode[1]){ // BRANCH C
            console.log("C CCCC C CCCC C");
            var options = [positions.indexOf(switchLetters(firstCompMoveCode, true, true)),positions.indexOf(switchLetters(firstCompMoveCode, false, true)), positions.indexOf(' '+switchLetters(firstCompMoveCode, true, false)[0]+'E')];
            console.log('option[2]: ' + ' '+switchLetters(firstCompMoveCode, true, false)[0]+'E');
            moveIndex = (isAvail(options[0]) && isAvail(options[2]) ? options[0] : options[1]);
            console.log("moveIndex: " + positions[moveIndex]);
            // next move is a sure win
          } else { // BRANCH A
            // user will have either gone on an edge, in which case, its blocking till a tie | or a corner, in which case comp takes the opposite corner, and then its over
            console.log("lastUserMoveCode = " + lastUserMoveCode);
            moveIndex = positions.indexOf(switchLetters(lastUserMoveCode, true, true));
            // next move is a sure win
          }
          console.log('firstComMoveCode = ' + firstCompMoveCode);
          if (firstCompMoveCode == "C") {
            //console.log("trying to TRAP +++++");
            var opt1 = positions.indexOf(switchLetters(positions[lastCompMove], true, false));
            var opt2 = positions.indexOf(switchLetters(positions[lastCompMove], false, true));
            var bool = isAvail(positions.indexOf(" "+lastCompMoveCode[1] + "E"));
            //console.log("isAvail(positions.indexOf("+lastCompMoveCode[1] + 'E'+")) = " + bool);
            moveIndex = (bool ? opt1 : opt2);
          }
          //comp wins after this with blocking/trapping/finishing
          break;
        case (3):
          //console.log("CASE 3 ######");
          moveIndex = positions.indexOf(newEdge());
          break;
        case (4):
          //console.log("CASE 4 $$$$$$$");
          // only one spot left
          moveIndex = availSlots[0];
          break;
      }
    }
    if (p2CanWin) { //winning is priority
      //console.log('trying to WIN !!!');
      for (var i = 0; i < winningSlots.length; i++) {
        var slot = winningSlots[i];
        if (isAvail(slot))
          moveIndex = slot;
      }
    }
    console.log('computer move: ' + positions[moveIndex]);
    pushData(p2Pieces, moveIndex, playArea.children().eq(moveIndex), greenO, redX);
    lastCompMove = moveIndex;
    lastCompMoveCode = positions[lastCompMove];
    compTurn++;
    usersTurn = !usersTurn;
  }
}
function pushData(pieces, index, elem, opt1, opt2) {
  pieces.push(parseInt(availSlots.splice(availSlots.indexOf(index), 1)));
  playedPieces.push(index);
  elem.append(userIsX ? opt1 : opt2);
}
function handleTurn(elem, index, pieces, opt1, opt2) {
  if (!gameStarted) {
    startGame();
    //firstUserMove = index;
    //firstUserMoveCode = positions[firstUserMove];
  }
  if (playedPieces.indexOf(index) == -1) {
    usersTurn = !usersTurn;
    pushData(pieces, index, elem, opt1, opt2);
  }
}
function handleClick(elem, index) {
  if (usersTurn) {
    if (userPieces.length == 0) {
      firstUserMove = index;
      firstUserMoveCode = positions[firstUserMove];
    }
    lastUserMove = index;
    handleTurn(elem, index, userPieces, redX, greenO);
  } else if (!player2IsComp) { //player 2 is human in this case
    lastCompMove = index;
    handleTurn(elem, index, p2Pieces, greenO, redX);
  }
}
// JQUERY READY FUNCTION *******
$(function() { //game logic starts when ready! this is startup code
  resetVars();
  updateSizes();
  playArea.on('click','.slot',function(){
     // handle player input here | after player goes, call function for computer to go
    if (!gameOver) {
      handleClick($(this), $(this).index());
      checkIfOver();
      computerGo();
      checkIfOver();
      updateSizes(); // need to fit the x and o to board (em and margins)
      printData();
    }
  });
  $('#start').on('click',function(){
    if (!gameStarted)
      startGame();
  });
  $('#restart').on('click',function(){
    if (gameStarted) {
      resetVars();
      updateSizes();
    }
  });
  $('.switch-container .switch').on('click',function(){
    if (!gameStarted)
      handleSwitch($(this));
    printData();
  });
});

// ^^^^^^^^^^^^^^^^ FUNCTIONS FOR GAME LOGIC ^^^^^^^^^^^^^^^^^^^^^^^^

// ------------------------------------------------------------------

// ************* FUNCTIONS FOR RESIZING ELEMENTS ********************
function positionPiece(elem, ratio, scale, top, bot,left, right) {
  var size = ratio*scale;
  var marginTop = ratio*(top);
  var marginLeft = ratio*(left);
  var marginRight = ratio*(right);
  var marginBot = ratio*(bot);
  elem.css('font-size', size+"em");
  elem.css('margin-top', marginTop+"px");
  elem.css('margin-bottom', marginBot+"px");
  elem.css('margin-left', marginLeft+"px");
}
function updateText() {
  var width = playArea.width();
  var ratio = (width/420);
  // sizing for different browsers/devices
  // DONE: chrome pc, chrome and safari mac, chrome and safari ipad mini

  // chrome on pc, chrome and safari on ipad mini
  positionPiece($(".slot .x"), ratio, 8, -5,0,1);
  positionPiece($(".red"), ratio, 8, -5,0,1);
  positionPiece($(".slot .o"), ratio, 7, 10,0,1);
  positionPiece($(".green"), ratio, 6.5, 14,0,1);
  var isiOS = navigator.platform.match(/(iPhone|iPod|iPad)/i)?true:false;
  var isMac = navigator.platform.match(/(Mac)/i)?true:false;
  //console.log("isMac = " + isMac);

  // chrome on mac
  if (isMac) {
    positionPiece($(".slot .x"), ratio, 9, -35,0,0);
    positionPiece($(".red"), ratio, 9, -35,0,0);
  }
  var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

  // safari on mac
  if (isSafari && !isiOS) {
    positionPiece($(".slot .x"), ratio, 9, -35,0,0);
    positionPiece($(".red"), ratio, 9, -37,0,0);
  }

  // chrome on android
  if (isAndroid) {
    positionPiece($(".slot .x"), ratio, 7.25, -4,0,2);
    positionPiece($(".red"), ratio, 8, -12,0,2);
  }
  positionPiece($('#name-plate'), ratio, 3.25, 35, 30);

}
function updateThisElementsHeight(str, whichHeight, scale) {
  var div = $(str);
  var width = div.width();
  div.css(whichHeight, width*scale);
}
function updateSizes() {
  updateThisElementsHeight("#game-board", "min-height", 1.4);
  updateThisElementsHeight("#play-wrapper", "min-height", 1);
  updateThisElementsHeight("#play-area", "height", 1);
  updateText(); //title and x's and o's
}
$(window).ready(updateSizes);
$(window).resize(updateSizes);
// ^^^^^^^^^^^^^^^^ FUNCTIONS FOR RESIZING ELEMENTS ^^^^^^^^^^^^^^^^^
