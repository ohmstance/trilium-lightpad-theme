/* UI optimizations for mobile screens. 
Please add #run=mobileStartup attribute to this note.
*/

let theme = "Lightpad";

function runscript() {
    
// =================== Change icon for Apple devices ==================== //
    
    // iOS doesn't support icons with transparent background for apps added to home screen.
    if (!(document.querySelector("link[rel='apple-touch-icon']"))) {
        let el = document.createElement('link');
        el.rel = 'apple-touch-icon';
        el.sizes = '180x180';
        el.href = 'custom/themes/Lightpad/apple-touch-icon.png';
        document.head.appendChild(el);
    }
    
// ======================= Colour status bar area ======================= //
    
    document.querySelector("meta[name='theme-color']").content = "#f7f7f7";
    
// ==================== Allow notch overflow for iOS ==================== //
    
    document.querySelector("meta[name='viewport']").content = "viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no";
    
    var ss = document.createElement("style");
    ss.innerText = `
        @media (orientation:landscape) {
            /* Apply left and right inset notch safe area  */
            body.mobile #root-widget #launcher-pane {
                padding-left: calc(env(safe-area-inset-left) + var(--launcher-pane-pre-inset-padding, 0)) !important;
                /* Safari iOS adds proportional right padding for no reason. */
                padding-right: var(--launcher-pane-pre-inset-padding, 0) !important;
            }
            body.mobile #root-widget > .component {
                /* Just to be safe. */
                padding-left: 0px;
                padding-right: env(safe-area-inset-right);
            }
            body.mobile #root-widget .global-menu > .dropdown-menu,
            body.mobile #root-widget .bx-calendar + .dropdown-menu,
            body.mobile #context-menu-container {
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }
        }
    `;
    document.head.appendChild(ss);

// ===================== Long press to context menu ===================== //

// Safari iOS doesn't convert long presses to context menu event.
// Chrome Android does, but disabled for draggable elements like fancytree nodes.
// Firefox Android doesn't support drag and drop, but feature added in nightly Fx124.

    var findEventHandlers = function (eventType, jqSelector) {
        /* Helper function to find event handlers

        Usage:
            findEventHandlers("click", "#el")
            findEventHandlers("mouseover", "#el")

        See https://raw.githubusercontent.com/ruidfigueiredo/findHandlersJS/master/findEventHandlers.js
        */
        var results = [];
        var $ = jQuery;// to avoid conflict between others frameworks like Mootools

        var arrayIntersection = function (array1, array2) {
            return $(array1).filter(function (index, element) {
                return $.inArray(element, $(array2)) !== -1;
            });
        };

        var haveCommonElements = function (array1, array2) {
            return arrayIntersection(array1, array2).length !== 0;
        };


        var addEventHandlerInfo = function (element, event, $elementsCovered) {
            var extendedEvent = event;
            if ($elementsCovered !== void 0 && $elementsCovered !== null) {
                $.extend(extendedEvent, { targets: $elementsCovered.toArray() });
            }
            var eventInfo;
            var eventsInfo = $.grep(results, function (evInfo, index) {
                return element === evInfo.element;
            });

            if (eventsInfo.length === 0) {
                eventInfo = {
                    element: element,
                    events: [extendedEvent]
                };
                results.push(eventInfo);
            } else {
                eventInfo = eventsInfo[0];
                eventInfo.events.push(extendedEvent);
            }
        };


        var $elementsToWatch = $(jqSelector);
        if (jqSelector === "*")//* does not include document and we might be interested in handlers registered there
            $elementsToWatch = $elementsToWatch.add(document); 
        var $allElements = $("*").add(document);

        $.each($allElements, function (elementIndex, element) {
            var allElementEvents = $._data(element, "events");
            if (allElementEvents !== void 0 && allElementEvents[eventType] !== void 0) {
                var eventContainer = allElementEvents[eventType];
                $.each(eventContainer, function(eventIndex, event){
                    var isDelegateEvent = event.selector !== void 0 && event.selector !== null;
                    var $elementsCovered;
                    if (isDelegateEvent) {
                        $elementsCovered = $(event.selector, element); //only look at children of the element, since those are the only ones the handler covers
                    } else {
                        $elementsCovered = $(element); //just itself
                    }
                    if (haveCommonElements($elementsCovered, $elementsToWatch)) {
                        addEventHandlerInfo(element, event, $elementsCovered);
                    }
                });
            }
        });

        return results;
    };
    
    function onLongPress(element, callback) {
        /* Adds custom event listener to detect long presses.
        */

        var timer;

        element.addEventListener('touchstart', function(e) { 
            timer = setTimeout(function() {
                timer = null;
                callback(e);
            }, 1000);
        });

        function cancel() {
            clearTimeout(timer);
        }

        element.addEventListener('touchend', cancel);
        element.addEventListener('touchmove', cancel);
        element.addEventListener('drag', cancel);
    }

    /* Finds all elements with 'contextmenu' event handler and dispatch 'contextmenu' event upon detecting long presses.
    */
    var eventHandlers = findEventHandlers('contextmenu', '*');
    for (const eventHandle of eventHandlers) {
        let element = eventHandle.element;
        onLongPress(element, function(e) {
            var target = e.target;
            var custEvent = new CustomEvent("contextmenu", {
                bubbles: true,
                currentTarget: target
            });
            target.dispatchEvent(custEvent);
        })
    }
    
// ===================== ////////////////////////// ===================== //
    
    return 0;
}

function getOption(key) {
    return api.runOnBackend ( (params) => {
        return api.__private.becca.getOption(params.key)?.value
    }, [{key: key}])
}

getOption('theme').then(currentTheme => {
    if (theme == currentTheme) { return runscript(); }
})