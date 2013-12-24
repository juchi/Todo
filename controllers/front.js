/**
 * This is the front controller of the application,
 * it registers all controllers available
 */

var controllers = [
    'task',
    'user',
    'default'
];

function init(app) {
    for (i in controllers) {
        require('./' + controllers[i]).init(app);
    }
}

exports.init = init;
