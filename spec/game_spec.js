describe('Tic Tac Toe', function(){
  jasmine.getFixtures().fixturesPath = '/';
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
        describe ('has #play-area', function(){
          it("exists", function(){
            expect( $('#play-area') ).toExist();
          });
          describe('slots', function(){
            it('should have 9 slots', function(){
              $('#play-area').html('');
              initVars();
              expect($('#play-area').children().length).toEqual(9);
            });
          });
        });
        
      });
      describe ('#options-wrapper', function(){
        it ('exists', function(){
          expect( $('#options-wrapper') ).toExist();
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