;(function ($,window,document,undefined ) {
    "use strict";

    /**
     * Short description
     * The plugin extends the search and adds keyboard arrow support and show/hide effects.
     *
     * long description
     * The search input field is displayed with a slide animation when the button element is clicked.
     * The search results based on the input inside the search input field are generated by the jquery.lunr.search plugin.
     * The navigateResults function allows the user to navigate through the search results by using the up & down arrow keys.
     *
     * @example Initialize the plugin
     *    $('.test').expandSearch();
     *
     * @example dom structure
     *
     *    <div id="searchBox">
     *       <form>
     *          <input id="search-query">
     *       </form>
     *    </div>
     *
     *    <div id="search-results">
     *       <div class="entries">
     *          <a class="entry">
     *              //content
     *          </a>
     *       </div>
     *    </div>
     *
     *    <span class="searchButton"></span>
     */

    /** @string plugin name */
    var pluginName = 'expandSearch',

        /** @object default options */
        opts = {

            /** @string Search box selector */
            search: '#searchBox',

            /** @string Search input field (id selector) */
            inputForm: 'search-query',

            /** @string Search action button selector */
            actionBtn: '#search-action',

            /** @int search show effect animation speed */
            animationSpeed: 200,

            /** @string search result div */
            results: '#search-results',

            /** @string search result entries div */
            entries: '.entries',

            /** @string* search result entry active class */
            activeClass: 'active'
        };

    /**
     * @param {Node} el
     * @param {Object} options
     * @constructor
     */
    function Plugin(el, options) {
        var me = this;

        me.opts = $.extend({}, opts, options);

        me.$el = $(el);
        me.$body = $('body');
        me.$search = me.$el;
        me.$result = $(me.opts.results);
        me.$entries = $(me.opts.entries);
        me.$input = $('#' + me.opts.inputForm);
        me.$action = $(me.opts.actionBtn);

        this.init();
    }

    /**
     * plugin init function
     */
    Plugin.prototype.init = function () {
        var me = this;

        me.$body.on('keydown.' + pluginName, $.proxy(me.navigateResults, me));
        me.$input.on('displayResults', $.proxy(me.onDisplayResults, me));
        me.$input.on('search', $.proxy(me.onSearch, me));
        me.$action.on('click', $.proxy(me.onActionButton, me))
    };

    Plugin.prototype.onDisplayResults = function () {
        var me = this;

        me.$search.addClass(me.opts.activeClass);
    };

    Plugin.prototype.onSearch = function (event, query) {
        var me = this;

        if (query.length <= 0) {
            me.closeSearch();
        }
    };

    Plugin.prototype.onActionButton = function (event) {
        var me = this;

        event.preventDefault();

        if (me.$search.hasClass(me.opts.activeClass)) {
            me.closeSearch();
        }
    };

    Plugin.prototype.closeSearch = function () {
        var me = this;

        me.$result.hide();
        me.$input.val("");
        me.$search.removeClass(me.opts.activeClass);
    };

    /**
     * Enables keyboard arrow (up / down) support to navigate though the search results and enter to go to the link location with the enter key.
     * @event keyDown
     * @param {Event} event
     */
    Plugin.prototype.navigateResults = function (event) {
        var me = this,
            key = event.keyCode || event.which,
            activeElement,
            entry;

        if (me.$entries.children().length) {
            activeElement = $(me.opts.entries).find('.' + me.opts.activeClass);

            if (activeElement.length === 1) {
                if (key === 40 || key == 9) { // down OR tab
                    event.preventDefault();

                    if (!activeElement.next().length) {
                        entry = me.$entries.children().first();
                        entry.addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    } else {
                        activeElement.next().addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    }
                } else if (key === 38) { // up
                    event.preventDefault();
                    if (!activeElement.prev().length) {
                        entry = me.$entries.children().last();
                        entry.addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    } else {
                        activeElement.prev().addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    }
                }
            } else {
                if (key === 40 || key == 9) { // down OR tab
                    event.preventDefault();
                    entry = $(me.opts.entries).children().first();
                    entry.addClass(me.opts.activeClass);
                } else if (key === 38) { // up

                    entry = $(me.opts.entries).children().last();
                    entry.addClass(me.opts.activeClass);
                }
            }
        }

        if(key === 13) { // enter
            event.preventDefault();

            entry = $(me.opts.entries).find('.' + me.opts.activeClass);
            if(entry.length) {
                window.location.href = entry.attr('href');
            }
        }
    };

    $.fn.expandSearch = function (options) {
        return this.each(function() {
            new Plugin(this, options);
        });
    };

    /**
     * initial function call on DOM element
     */
    $(function() {
        $('#searchBox').expandSearch();
    });

}) (jQuery, window, document);
