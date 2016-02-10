describe('Tic Tac Toe', function(){
  jasmine.getFixtures().fixturesPath = '/';
  var spyClickEvent; // will detect all button clicks and game board clicks
  beforeEach(function(){
    loadFixtures('index.html');
  });
  describe("Game Board", function(){
    it ('should have id "game-board"', function(){
      expect( $('#game-board') ).toExist();
    });
    describe ('children', function(){
      it ('there should be 5 children', function(){
        expect( $('#game-board').children().length ).toEqual(5);
      });
      describe ('#name-plate', function(){
        it ('exists', function(){
          expect( $('#name-plate') ).toExist();
        });
      });
      describe ('#result-ribbon', function(){
        it ('exists', function(){
          expect( $('#result-ribbon') ).toExist();
        });
      });
      describe ('#play-wrapper', function(){
        it ('exists', function(){
          expect( $('#play-wrapper') ).toExist();
        });
//**************************************************
        // This is where the pieces get played
        describe ('has #play-area, where the pieces get played', function(){
          it("exists", function(){
            expect( $('#play-area') ).toExist();
          });
          describe('slots', function(){
            it('should have 9 slots', function(){
              $('#play-area').html('');
              initVars();
              expect($('#play-area').children().length).toEqual(9);
            });
            it('each slot has an X and O background inset', function(){
              $('#play-area').children().each(function(slot, val){
                expect(val).toContainElement('p.shadow.o'); expect(val).toContainElement('p.shadow.x');
              });
            });
            it('should have no played pieces at start', function(){
              expect(gamePrintOut).toEqual(" | | \n | | \n | | ");
              expect(playedPieces.length).toEqual(0);
              expect(availSlots.length).toEqual(9);
            });
            // GAME PLAY
          });
        });
//**************************************************
      });
//*** EVERYTHING BELOW THE PLAY AREA ***************
      describe ('#options-wrapper', function(){
        it ('exists', function(){
          expect( $('#options-wrapper') ).toExist();
        });

        describe('Start up defaults', function(){
          it('Restart should be greyed out while the rest are red and clickable', function(){
            expect($('#restart')).toHaveClass('greyed');
            expect($('#start')).not.toHaveClass('greyed');
            expect($('.piece-switch')).not.toHaveClass('greyed');
            expect($('.choice-switch')).not.toHaveClass('greyed');
            expect($('.order-switch')).not.toHaveClass('greyed');
          });
          it('player should be x, and be going first', function(){
            expect(userIsX).toBe(true);
            expect(userFirst).toBe(true);
            expect(usersTurn).toBe(true);
          });
          it('player 2 should be Computer', function(){
            expect(player2IsComp).toBe(true);
          });
          it('gameStarted and gameOver should be false', function(){
            expect(gameStarted).toBe(false);
            expect(gameOver).toBe(false);
          });
        });

        describe ('Player presses start', function(){
          it ('should grey out options and itself and make Restart red and clickable', function(){
            spyClickEvent = spyOnEvent('#start', 'click');
            $('#start').trigger( "click" );
            expect('click').toHaveBeenTriggeredOn('#start');
            expect(spyClickEvent).toHaveBeenTriggered();

            expect($('#restart')).not.toHaveClass('greyed');
            expect($('#start')).toHaveClass('greyed');
            expect($('.piece-switch')).toHaveClass('greyed');
            expect($('.choice-switch')).toHaveClass('greyed');
            expect($('.order-switch')).toHaveClass('greyed');
          });

          describe ('When Computer goes first', function(){
            it ('should place the computers move', function(){

            });
            it ('should be the users turn now', function(){

            });
          });
        });
      });
      describe ('#made-by', function(){
        it ('exists', function(){
          expect( $('#made-by') ).toExist();
        });
      });
    });
  });
});

















