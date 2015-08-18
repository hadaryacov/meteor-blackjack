if (Meteor.isClient) {

    var packCards = [];
    var userCards = [];
    var compCards = [];

    var numbers = [
        {
            number      : "A",
            signs       : ['middle_center'] 
        },
        {
            number      : "2",
            signs       : ["top_center","bottom_center"]
        },
        {
            number      : "3",
            signs       : ["top_center","middle_center","bottom_center"]
        },
        {
            number      : "4",
            signs       : ["top_left","top_right","bottom_left","bottom_right"]
        },
        {
            number      : "5",
            signs       : ["top_left","top_right","middle_center","bottom_left","bottom_right"]
        },
        {
            number      : "6",
            signs       : ["top_left","top_right","middle_left","middle_right","bottom_left","bottom_right"]
        },
        {
            number      : "7",
            signs       : ["top_left","top_right","middle_left","middle_top","middle_right","bottom_left","bottom_right"]
        },
        {
            number      : "8",
            signs       : ["top_left","top_right","middle_left","middle_top","middle_right","middle_bottom","bottom_left","bottom_right"]
        },
        {
            number      : "9",
            signs       : ["top_left","top_right","middle_top_left","middle_center","middle_top_right","bottom_left","bottom_right","middle_bottom_left","middle_bottom_right"]
        },
        {
            number      : "10",
            signs       : ["top_left","top_right","middle_top_left","middle_top_center","middle_top_right","bottom_left","bottom_right","middle_bottom_center","middle_bottom_left","middle_bottom_right"]
        }
    ];

    var types = [
        {
            name : "club",
            sign : "♣"
        },
        {
            name : "diamond",
            sign : "♦"
        },
        {
            name : "spade",
            sign : "♠"
        },
        {
            name : "heart",
            sign : "♥"
        }
    ];


    //cards
    Template.cards.helpers({

        cards: function () {
            return Session.get('packCards');
        },

        computerCards : function() {
            return Session.get('computerCards');
        }
    });

    Template.cards.onCreated(function(){
        var cards = [];
        var count = 1;
        _.each(numbers, function(num){
            _.each(types, function(type){
                var card = {
                    id      : count,
                    number  : num.number,
                    type    : type,
                    signs   : num.signs
                }
                cards.push(card);
                count += 1;
            });
        });
        Session.set('packCards', _.shuffle(cards));
        packCards = Session.get('packCards');
    });

    Template.cards.onRendered(function(){

        var degree = 90 / $('.pack .card').length;

        setTimeout(function(){
            _.each($('.pack .card'), function(card, i){
                $(card).addClass('flipped');
                var rotateDegree = (i * degree) - 45;
                $(card).css({
                    transform       : 'rotate(' + rotateDegree + 'deg)',
                    transformOrigin : 'bottom center'
                });
            });
        }, 400);       
    });

    Template.cards.events({
        'click .deal': function () {
            setTimeout(function(){
                addToUser($('.pack .card').last());
            },0);
            setTimeout(function(){
                addToUser($('.pack .card').last());
            },500);
            setTimeout(function(){
                addToComputer($('.pack .card').last());
            },1000);
            setTimeout(function(){
                addToComputer($('.pack .card').last());
            },1500);
        }
    });

    Template.user.helpers({
        //test
        score: function () {
            var score = 0;
            _.each(Session.get('userCards'), function(card){
                score += parseInt(card.number);
            });
            return score;
        }
    });

    Template.computer.helpers({
        score: function () {
            var score = 0;
            _.each(Session.get('compCards'), function(card){
                score += parseInt(card.number);
            });
            return score;
        }
    });

    //userCards
    Template.userCards.helpers({
        userCards : function() {
            return Session.get('userCards');
        },
    });

    //compCards
    Template.compCards.helpers({
        compCards : function(){
            return Session.get('compCards');
        }
    })

    //card
    Template.card.onRendered(function(){
        $(this.firstNode).removeClass('hide').addClass('animated zoomIn');
    });

    Template.card.events({
        'click .card' : function(e){
            if($(e.currentTarget).hasClass('flipped')){
                $(e.currentTarget).removeClass('flipped');    
            }else{
                $(e.currentTarget).addClass('flipped');
            }
            
        }
    });

    function addToUser($card){
        var cardId = parseInt($card.attr('data-id'));
        var currentCard = _.findWhere(packCards, {id: cardId});
        packCards = _.without(packCards, currentCard);
        Session.set('packCards',packCards);
        userCards.push(currentCard);
        Session.set('userCards', userCards);
    }

    function addToComputer($card){
        var cardId = parseInt($card.attr('data-id'));
        var currentCard = _.findWhere(packCards, {id: cardId});
        packCards = _.without(packCards, currentCard);
        Session.set('packCards',packCards);

        compCards.push(currentCard);
        Session.set('compCards', compCards); 
    }
}
