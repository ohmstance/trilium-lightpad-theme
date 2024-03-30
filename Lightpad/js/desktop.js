/* UX enhancements for desktop. 
Please add #run=frontendStartup attribute to this note.
*/

let theme = "Lightpad";

function runscript() {
    
// ====================== Scrollable launcher pane ====================== //

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
    
    /* Make launcher pane scrollable. I'm appending style in js as without changes to tooltip/dropdown boundary, they bug out. */
    
    var ss = document.createElement("style");
    ss.innerText = `
        /* Launcher pane: Make launcher pane column scrollable. */
        #root-widget #launcher-container {
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: none;
        }
        /* Hide scrollbar on launcher pane (pre-Chrome 121) */
        #root-widget #launcher-container::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(ss);
    
    /* Tooltips don't position correctly if tooltipped button is inside a scrolling container. Same with dropdowns. We'll have to change their config boundary. */
    /* As adding or removing bookmarks reinitializes tooltips/dropdown boundary, reset boundary to window again every time subtree changes. */

    const configBoundary = function (mutationList, observer) {
        /* Tooltip */
        var eventHandlers = findEventHandlers('mouseover', '#launcher-container *[data-toggle]').slice(1);
        for (const eventHandle of eventHandlers) {
            let tooltipData = $(eventHandle.element).data('bs.tooltip');
            if (typeof tooltipData.tip !== 'undefined' || tooltipData.tip !== null) {
                tooltipData.config.boundary = "window";
            }
        }
        /* Dropdown menu */
        var eventHandlers = findEventHandlers('click', '#launcher-container *[data-toggle="dropdown"]').slice(1);
        for (const eventHandle of eventHandlers) {
            try { $(eventHandle.element).dropdown(); } catch { continue; };
            let dropdownData = $(eventHandle.element).data('bs.dropdown');
            if (typeof dropdownData !== 'undefined' || dropdownData !== null) {
                dropdownData._config.boundary = "window";
            }
        }
    }
    
    const target = document.getElementById("launcher-container");
    const config = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(configBoundary);
    observer.observe(target, config);
    
    configBoundary();
    
// ====================== //////////////////////// ====================== //
    
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