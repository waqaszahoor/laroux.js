(function(laroux) {
    "use strict";

    // css
    laroux.css = {
        hasClass: function(element, className) {
            return element.classList.contains(className);
        },

        addClass: function(element, className) {
            element.classList.add(className);
        },

        removeClass: function(element, className) {
            element.classList.remove(className);
        },

        toggleClass: function(element, className) {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            } else {
                element.classList.add(className);
            }
        },

        getProperty: function(element, styleName) {
            var style = getComputedStyle(element);
            styleName = laroux.helpers.antiCamelCase(styleName);
            console.log(styleName);

            return style.getPropertyValue(styleName);
        },

        setProperty: function(element, properties, value) {
            var elements = laroux.helpers.getAsArray(element);

            if (typeof properties == 'string') {
                var oldProperties = properties;
                properties = {};
                properties[oldProperties] = value;
            }

            for (var styleName in properties) {
                if (!properties.hasOwnProperty(styleName)) {
                    continue;
                }

                var newStyleName = laroux.helpers.camelCase(styleName);

                for (var i = elements.length - 1;i >= 0; i--) {
                    elements[i].style[newStyleName] = properties[styleName];
                }
            }
        },

        setTransitionSingle: function(element, transitions) {
            for (var styleName in transitions) {
                if (!transitions.hasOwnProperty(styleName)) {
                    continue;
                }

                var newStyleName = laroux.helpers.camelCase(styleName);

                var style = getComputedStyle(element);
                var currentTransitions = style.getPropertyValue('transition');

                if (currentTransitions !== null) {
                    var currentTransitionsArray = currentTransitions.split(',');
                    for (var j = 0; j < currentTransitionsArray.length; j++) {
                        if (currentTransitionsArray[j].trim().localeCompare(styleName) === 0) {
                            currentTransitionsArray.splice(j, 1);
                        }
                    }

                    currentTransitionsArray.push(styleName + ' ' + transitions[styleName]);
                    element.style.transition = currentTransitionsArray.join(', ');
                } else {
                    element.style.transition = styleName + ' ' + transitions[styleName];
                }
            }
        },

        setTransition: function(element, transitions) {
            var elements = laroux.helpers.getAsArray(element);

            for (var i = elements.length - 1;i >= 0; i--) {
                laroux.css.setTransitionSingle(element, transitions);
            }
        },

        defaultTransition: '2s ease',
        transition: function(element, transitions, callback) {
            var elements = laroux.helpers.getAsArray(element);

            var newTransitions = {};
            var newValues = {};
            for (var styleName in transitions) {
                if (!transitions.hasOwnProperty(styleName)) {
                    continue;
                }

                if (transitions[styleName] instanceof Array) {
                    newValues[styleName] = transitions[styleName][0];

                    if (typeof transitions[styleName][1] != 'undefined') {
                        newTransitions[styleName] = transitions[styleName][1];
                    } else {
                        newTransitions[styleName] = laroux.css.defaultTransition;
                    }
                } else {
                    newValues[styleName] = transitions[styleName];
                    newTransitions[styleName] = laroux.css.defaultTransition;
                }
            }

            for (var i = elements.length - 1;i >= 0; i--) {
                laroux.css.setTransitionSingle(elements[i], newTransitions);
                laroux.css.setProperty(elements[i], newValues);

                laroux.dom.unsetEvent(elements[i], 'transitionend');
                if (typeof callback != 'undefined') {
                    laroux.dom.setEvent(elements[i], 'transitionend', callback);
                }
            }
        }
    };

})(this.laroux);
