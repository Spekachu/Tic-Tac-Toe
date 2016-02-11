describe('Tic Tac Toe', function () {
  jasmine.getFixtures().fixturesPath = '/';
  var spyClickEvent; // will detect all button clicks and game board clicks
  beforeEach(function () {
    loadFixtures('index.html');
    //setFixtures('index.html');
  });
  describe("Game Board", function () {
    it('should have id "game-board"', function () {
      expect($('#game-board')).toExist();
    });
    describe('children', function () {
      it('there should be 5 children', function () {
        expect($('#game-board').children().length).toEqual(5);
      });
      describe('Tic-Tac-Toe title', function () {
        it('exists', function () {
          expect($('#name-plate')).toExist();
        });
      });
      describe('Results Ribbon', function () {
        it('exists', function () {
          expect($('#result-ribbon')).toExist();
        });
      });
      describe('Play Section', function () {
        it('exists', function () {
          expect($('#play-wrapper')).toExist();
        });
        //**************************************************
        // This is where the pieces get played
        describe('has #play-area, where the pieces get played', function () {
          it("exists", function () {
            expect($('#play-area')).toExist();
          });
          describe('slots', function () {
            it('should have 9 slots', function () {
              $('#play-area').html('');
              initVars();
              expect($('#play-area').children().length).toEqual(9);
            });
            it('each slot has an X and O background inset', function () {
              $('#play-area').children().each(function (slot, val) {
                expect(val).toContainElement('p.shadow.o');
                expect(val).toContainElement('p.shadow.x');
              });
            });
            it('should have no played pieces at start', function () {
              expect(gamePrintOut).toEqual(" | | \n | | \n | | ");
              expect(playedPieces.length).toEqual(0);
              expect(availSlots.length).toEqual(9);
            });
          });
          describe('GAME PLAY', function(){
            describe('When Player goes first', function () {
              it('should allow player to select first move, regardless of whether he pressed start. The start button will click itself if he goes without clicking it first', function () {
                var rand = Math.floor(Math.random()*9);
                var randomSlot = $('#play-area').children().eq(rand);
                expect(userPieces.length).toEqual(0);
                randomSlot.click();
                expect(userPieces.length).toEqual(1);
              });
              it('should be followed by the computers move', function(){
                var rand = Math.floor(Math.random()*9);
                var randomSlot = $('#play-area').children().eq(rand);
                expect(userPieces.length).toEqual(0);
                expect(availSlots.length).toEqual(9);
                randomSlot.click();
                expect(userPieces.length).toEqual(1);
                expect(availSlots.length).toEqual(7);
                expect(p2Pieces.length).toEqual(1);
              });
            });
            it('should allow the player to select any available slot', function(){
              userPieces = [0,7];
              p2Pieces = [3,6];
              availSlots = [1,2,4,5,8];
              playedPieces = userPieces.concat(p2Pieces);
              var rand = availSlots[Math.floor(Math.random()*(availSlots.length))];
              var randomSlot = $('#play-area').children().eq(rand);
              expect(availSlots.indexOf(rand)).not.toEqual(-1);

              expect(userPieces).toEqual([0,7]);
              expect(p2Pieces).toEqual([3,6]);
              expect(availSlots).toEqual([1,2,4,5,8]);
              expect(playedPieces).toEqual(userPieces.concat(p2Pieces));
              expect(playedPieces.length).toEqual(4);

              randomSlot.click();
              //handleClick(randomSlot, randomSlot.index());
              expect(userPieces).toEqual([0,7, lastUserMove]);
              expect(p2Pieces).toEqual([3,6, lastCompMove]);
              expect(availSlots.length).toEqual(3);
              expect(playedPieces.length).toEqual(6);
            });
            it('nothing happens if user clicks on a filled slot', function(){
              userPieces = [0,7];
              p2Pieces = [3,6];
              availSlots = [1,2,4,5,8];
              playedPieces = userPieces.concat(p2Pieces);
              // random slot is chosen from the already played slots
              var rand = playedPieces[Math.floor(Math.random()*(playedPieces.length))];
              var randomSlot = $('#play-area').children().eq(rand);
              expect(playedPieces.indexOf(rand)).not.toEqual(-1);

              expect(userPieces).toEqual([0,7]);
              expect(p2Pieces).toEqual([3,6]);
              expect(availSlots).toEqual([1,2,4,5,8]);
              expect(playedPieces).toEqual(userPieces.concat(p2Pieces));
              expect(playedPieces.length).toEqual(4);

              randomSlot.click();
              //handleClick(randomSlot, randomSlot.index());
              expect(userPieces).toEqual([0,7]);
              expect(p2Pieces).toEqual([3,6]);
              expect(availSlots).toEqual([1,2,4,5,8]);
              expect(playedPieces).toEqual(userPieces.concat(p2Pieces));
            });
            it('should declare the correct winner when there is three in a row', function(){
              //expect($('#result-ribbon')).not.toHaveClass('displayed');
              userPieces = [0,1];
              p2Pieces = [3,6];
            });
            describe('Computer Behavior', function(){
              describe('When Computer goes first', function () {
                it('waits for user to press Start, then goes', function () {

                });
              });
              it('blocks user from winning', function(){

              });
              it('always goes for the win over blocking the user', function(){

              });
              it('only selects from available slots', function(){

              });
            });
          });
        });
        //**************************************************
      });
      //*** THIS IS EVERYTHING BELOW THE PLAY AREA ***************
      describe('Options section', function () {
        it('exists', function () {
          expect($('#options-wrapper')).toExist();
        });

        describe('Start up defaults', function () {
          it('Restart should be greyed out while the rest are red and clickable', function () {
            expect($('#restart')).toHaveClass('greyed');
            expect($('#start')).not.toHaveClass('greyed');
            expect($('.piece-switch')).not.toHaveClass('greyed');
            expect($('.choice-switch')).not.toHaveClass('greyed');
            expect($('.order-switch')).not.toHaveClass('greyed');
          });
          it('player should be x, and be going first', function () {
            expect(userIsX).toBe(true);
            expect(userFirst).toBe(true);
            expect(usersTurn).toBe(true);
          });
          it('player 2 should be Computer', function () {
            expect(player2IsComp).toBe(true);
          });
          it('gameStarted and gameOver should be false', function () {
            expect(gameStarted).toBe(false);
            expect(gameOver).toBe(false);
          });
        });
        describe('Player presses start', function () {
          it('should grey out options and itself and make Restart red and clickable', function () {
            spyClickEvent = spyOnEvent('#start', 'click');
            $('#start').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#start');
            expect(spyClickEvent).toHaveBeenTriggered();

            startGame();
            expect($('#restart')).not.toHaveClass('greyed');
            expect($('#start')).toHaveClass('greyed');
            expect($('.piece-switch')).toHaveClass('greyed');
            expect($('.choice-switch')).toHaveClass('greyed');
            expect($('.order-switch')).toHaveClass('greyed');
            expect(gameStarted).toBe(true);
          });
          describe('When Computer goes first', function () {
            beforeEach(function () {
              handleSwitch($('.order-switch'));
            });
            it('should be computers turn (userFirst and usersTurn are both false)', function () {
              expect(userFirst).toBe(false);
              expect(usersTurn).toBe(false);
            });
            it('should place the computers move, so theres one piece on the board', function () {
              startGame();
              expect(p2Pieces.length).toEqual(1);
              expect(userPieces.length).toEqual(0);
              expect(availSlots.length).toEqual(8);
            });
            it('should be the users turn now', function () {
              startGame();
              expect(userFirst).toBe(false); //stays false because comp went first
              expect(usersTurn).toBe(true); //this var keeps track of current turn
            });
          });
          it('nothing should change if he presses start multiple times', function () {
            spyClickEvent = spyOnEvent('#start', 'click');
            $('#start').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#start');
            expect(spyClickEvent).toHaveBeenTriggered();
            startGame();
            $('#start').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#start');
            expect(spyClickEvent).toHaveBeenTriggered();
            startGame();
            expect($('#restart')).not.toHaveClass('greyed');
            expect($('#start')).toHaveClass('greyed');
            expect($('.piece-switch')).toHaveClass('greyed');
            expect($('.choice-switch')).toHaveClass('greyed');
            expect($('.order-switch')).toHaveClass('greyed');
            expect(gameStarted).toBe(true);
          });

        });
        describe('Player presses Restart', function () {
          it('changes nothing if game hasnt started', function () {
            spyClickEvent = spyOnEvent('#restart', 'click');
            $('#restart').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#restart');
            expect(spyClickEvent).toHaveBeenTriggered();
            if (gameStarted)
              resetVars();
            expect($('#restart')).toHaveClass('greyed');
            expect($('#start')).not.toHaveClass('greyed');
            expect($('.piece-switch')).not.toHaveClass('greyed');
            expect($('.choice-switch')).not.toHaveClass('greyed');
            expect($('.order-switch')).not.toHaveClass('greyed');
            expect(gameStarted).toBe(false);
          });
          it('should grey itself out and make the others red and clickable', function () {
            spyClickEvent = spyOnEvent('#start', 'click');
            $('#start').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#start');
            expect(spyClickEvent).toHaveBeenTriggered();

            startGame();
            expect($('#restart')).not.toHaveClass('greyed');
            expect($('#start')).toHaveClass('greyed');
            expect($('.piece-switch')).toHaveClass('greyed');
            expect($('.choice-switch')).toHaveClass('greyed');
            expect($('.order-switch')).toHaveClass('greyed');
            expect(gameStarted).toBe(true);

            spyClickEvent = spyOnEvent('#restart', 'click');
            $('#restart').trigger("click");
            expect('click').toHaveBeenTriggeredOn('#restart');
            expect(spyClickEvent).toHaveBeenTriggered();
            if (gameStarted)
              resetVars();
            expect($('#restart')).toHaveClass('greyed');
            expect($('#start')).not.toHaveClass('greyed');
            expect($('.piece-switch')).not.toHaveClass('greyed');
            expect($('.choice-switch')).not.toHaveClass('greyed');
            expect($('.order-switch')).not.toHaveClass('greyed');
          });
          it('should clear the game board, gameStarted and gameOver are false', function () {
            spyClickEvent = spyOnEvent('#start', 'click');
            $('#start').trigger("click");

            startGame();

            availSlots = [];
            userPieces = [0, 2, 4, 5, 6];
            p2Pieces = [1, 3, 7, 8];
            playedPieces = userPieces.concat(p2Pieces);

            spyClickEvent = spyOnEvent('#restart', 'click');
            $('#restart').trigger("click");
            if (gameStarted)
              resetVars();
            expect(availSlots).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
            expect(userPieces).toEqual([]);
            expect(p2Pieces).toEqual([]);
            expect(playedPieces).toEqual([]);
            expect(gameStarted).toBe(false);
            expect(gameOver).toBe(false);
          });
        });
        describe('Player clicks switch to change pieces', function () {
          it('allows player to switch back and forth between X and O', function () {
            expect(userIsX).toBe(true);

            // $('.piece-switch').trigger("click");
            handleSwitch($('.piece-switch'));
            // $('.piece-switch').click();
            expect(userIsX).toBe(false);

            handleSwitch($('.piece-switch'));
            expect(userIsX).toBe(true);
          });
        });
        describe('Player clicks switch to change player 2', function () {
          it('allows player to switch player2 between Computer and Human', function () {
            expect(player2IsComp).toBe(true);

            $('.choice-switch').trigger("click");
            expect(player2IsComp).toBe(false);

            $('.choice-switch').trigger("click");
            expect(player2IsComp).toBe(true);
          });
        });
        describe('Player clicks switch to change order', function () {
          it('allows player to switch back and forth between going first or second', function () {
            expect(userFirst).toBe(true);

            $('.order-switch').trigger("click");
            expect(userFirst).toBe(false);

            $('.order-switch').trigger("click");
            expect(userFirst).toBe(true);
          });
        });
      });
      describe('#made-by', function () {
        it('exists', function () {
          expect($('#made-by')).toExist();
        });
      });
    });
  });
});
