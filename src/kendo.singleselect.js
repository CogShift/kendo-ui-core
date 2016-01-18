(function(f, define){
    define([ "./kendo.multiselect" ], f);
})(function(){

(function ($, undefined) {
		var kendo = window.kendo,
		    ui = kendo.ui,
		    Base = ui.Widget;

		var SingleSelect = Base.extend({
			init: function (element, options) {
				var that = this;

				options = options || {};

				if (options.value !== undefined && options.value !== null) {
					options.value = [options.value];
				}

				options = $.extend({}, SingleSelect.fn.options, options, {
					maxSelectedItems: 1,
					tagMode: "multiple"
				});

				that._multiSelect = $(element).kendoMultiSelect(options).data("kendoSingleSelect");
				$(element).data("kendoSingleSelect", that);

				that.options = options;

				// Copy references to all of the multiselect members across to the singleSelect widget, except for a few.

				var ignoredMembers = ["value", "dataItems", "select", "options"];

				for (var memberName in that._multiSelect) {
					if (ignoredMembers.indexOf(memberName) === -1) {
						that[memberName] = that._multiSelect[memberName];
					}
				}

				// Intercept the trigger and bind functions of the multiselect widget, ensuring that the instance of
				// "this" is the singleSelect widget and not the multiselect widget.
				var oldTrigger = that._multiSelect.trigger;

				that._multiSelect.trigger = function() {
					oldTrigger.apply(that, arguments);
				};

				var oldBind = that._multiSelect.bind;

				that._multiSelect.bind = function () {
					oldBind.apply(that, arguments);
				};

				var hasSelection;

				function toggleHasSelection() {
					var value = that.value();
					hasSelection = value !== "" && value !== null && value !== undefined;
					that._multiSelect.wrapper.toggleClass("k-singleselect-haselection", hasSelection);
				}

				toggleHasSelection();

				that._multiSelect.listView.bind("change", function() {
					toggleHasSelection();
				});

                that.bind("change", function() {
					toggleHasSelection();
				});

				that._multiSelect.input.off("keydown.kendoMultiSelect");

				var keydown = that._multiSelect._keydown;

				// Prevent the multiselect text input from accepting keystrokes when a values has been selected,
				// except for backspace, which should clear the selected value.
				that._multiSelect._keydown = function (e) {
					if (hasSelection && e.keyCode !== kendo.keys.BACKSPACE) {
						e.preventDefault();
						return;
					}

					keydown.apply(that._multiSelect, arguments);
				};

				that._multiSelect.input.on("keydown.kendoMultiSelect", $.proxy(that._multiSelect._keydown, that));

				that._multiSelect.wrapper.addClass("k-singleselect");
			},

			options: {
				name: "SingleSelect",
				enabled: true,
				autoBind: true,
				autoClose: true,
				highlightFirst: true,
				dataTextField: "",
				dataValueField: "",
				filter: "startswith",
				ignoreCase: true,
				minLength: 0,
				delay: 100,
				value: null,
				placeholder: "",
				height: 200,
				animation: {},
				itemTemplate: "",
				tagTemplate: "",
				groupTemplate: "#:data#",
				fixedGroupTemplate: "#:data#",
				allowCreate: false,
				createCallback: null,
				createTemplate: null
			},

			select: function (selected) {
				var that = this;

				if (selected !== undefined && selected !== null && !(selected instanceof Array)) {
					selected = [selected];
				}

				var result = that._multiSelect.select(selected);

				if (selected === undefined) {
					return result[0] === undefined ? null : result[0];
				}
			},

			value: function (value) {
				var that = this;

				if (value !== undefined && value !== null && !(value instanceof Array)) {
					value = [value];
				}

				var result = that._multiSelect.value(value);

				if (value === undefined) {
					return result[0] === undefined ? null : result[0];
				}
			},

			dataItem: function() {
				var items = this._multiSelect.dataItems();

				if (items && items.length) {
					return items[0] === undefined ? null : items[0];
				}

				return null;
			}
		});

		ui.plugin(SingleSelect);

	})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
