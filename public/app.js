"use strict";

var learnjs = {};

learnjs.problemView = function () {
    return $('<div class="problem-view">').text('Coming soon!');
};
learnjs.problems = [
    {
        description: "Whats the truth?",
        code: "function problem(){ return _ ;}"
    },
    {
        description: "Simple Math?",
        code: "function problem(){ return 42== 6 * _ ;}"
    }

];
learnjs.helloView = function () {
    return $('<div class="hello-view">').text("Hello");
};
learnjs.triggerEvent = function(name,args){
    $('.view-container>*').trigger(name,args)
};
learnjs.showView = function (hash) {
    var routes = {
        '#problem': learnjs.problemView,
        '':learnjs.landingView,
        '#':learnjs.landingView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    learnjs.triggerEvent('removingView',[]);
    if (viewFn) {
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }

};

// learnjs.problemView = function(problemNumber) {
// var view = $('.templates .problem-view').clone(); view.find('.title').text('Problem #' + problemNumber);
// learnjs.applyObject(learnjs.problems[problemNumber - 1], view);
//  return view;
// }


learnjs.flashElement = function (elem, content) {
    elem.fadeOut('fast', function () {
        elem.html(content);
        elem.fadeIn();
    });
};

// var correctFlash = learnjs.template('correct-flash');
//correctFlash.find('a').attr('href', '#problem-' + (problemNumber + 1));

learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    }
    else {
        link.attr('href', '');
        link.text("You're Finished!");
    }
    return false;
};


learnjs.problemView = function (data) {
    var problemNumber = parseInt(data, 10);
    var view = $('.templates .problem-view').clone();
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        console.log(answer);
        var test = problemData.code.replace('_', answer) + '; problem();';
        console.log(test);
        return eval(test)
    }


    function checkAnswerClick() {
        console.log("HERE");
        if (checkAnswer()) {
            // learnjs.flashElement(resultFlash,'Correct');
            // learnjs.flashElement(learnjs.buildCorrectFlash(data),'Next');
            var correctFlash = learnjs.template('correct-flash');
            correctFlash.find('a').attr('href', '#problem-' + (problemNumber + 1));
            learnjs.flashElement(resultFlash, correctFlash);
        } else {
            learnjs.flashElement(resultFlash, 'Incorrect!');
        }

        if (problemNumber < learnjs.problems.length) {
            var buttonItem = learnjs.template('skip-btn'); buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1)); $('.nav-list').append(buttonItem);
            view.bind('removingView', function() {
                buttonItem.remove();
            });
        }
        
        return false;
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;

};

learnjs.template = function (name) {
    return $('.templates .' + name).clone();
};


learnjs.landingView = function () {
    return learnjs.template('landing-view');
};


learnjs.applyObject = function (obj, elem) {
    for (var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};
learnjs.appOnReady = function () {
    window.onhashchange = function () {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
};
