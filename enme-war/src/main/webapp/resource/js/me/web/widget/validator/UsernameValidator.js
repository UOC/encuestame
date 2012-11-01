define([
         "dojo/_base/declare",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "me/core/main_widgets/EnmeMainLayoutWidget",
         "me/web/widget/validator/AbstractValidatorWidget",
         "me/core/enme",
         "dojo/text!me/web/widget/validator/templates/usernameValidator.html" ],
        function(
                declare,
                _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin,
                main_widget,
                abstractValidatorWidget,
                _ENME,
                 template) {
            return declare([ _WidgetBase, _TemplatedMixin, main_widget, abstractValidatorWidget, _WidgetsInTemplateMixin], {

          // template string.
           templateString : template,

           placeholder : "Write your username",

            postCreate : function() {
                this.inherited(arguments);
            },

            /*
             *
             */
            _validate : function(event){
                this.inputTextValue = this._input.value;
                    this._loadService(
                    this.getServiceUrl(), {
                    context : this.enviroment,
                    username :  this._input.value
                }, this.error);
            },

            getServiceUrl : function(){
                return 'encuestame.service.publicService.validate.username';
            },

            /**
             * Add suggestions
             * @param data
             */
            _additionalErrorHandler : function(data){
                if (data.suggestions) {
                    if (data.suggestions.length > 0) {
                        dojo.style(this._block, "display", "block");
                        dojo.empty(this._suggest);
                        //<li><a href="#" data-sugg-sources="username,full_name" -->
                        //<!--                 data-sugg-technik="make_pairs">Jota148Jota</a></li>
                        dojo.style(this._suggest, "opacity", "0");
                        var fadeArgs = {
                                node: this._suggest,
                                duration: 500
                            };
                        dojo.fadeIn(fadeArgs).play();
                        dojo.forEach(data.suggestions,
                                dojo.hitch(this,function(item) {
                                    var li = dojo.doc.createElement("li");
                                    li.innerHTML = item;
                                    dojo.connect(li, "onclick", dojo.hitch(this, function(event) {
                                        this._replaceUsername(item);
                                    }));
                                    this._suggest.appendChild(li);
                        }));
                    } else {
                        dojo.style(this._block, "display", "none");
                    }
                }
            },

            _additionalSuccessHandler : function(data){
                var fadeArgs = {
                        node: this._suggest,
                        duration: 500
                    };
                    dojo.fadeOut(fadeArgs).play();
                    dojo.empty(this._suggest);
            },

            _replaceUsername : function(item){
                console.debug("replace", item);
                dojo.style(this._block, "display", "none");
                this._input.value = item;
                this._loadService(
                        encuestame.service.publicService.validate.username, {
                            context : this.enviroment,
                            username :  item
                        }, this.error);
            },


             error : function(error) {
                console.debug("error", error);
             }


    });
});