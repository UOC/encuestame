/*
 * Copyright 2013 encuestame
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/***
 *  @author juanpicado19D0Tgm@ilDOTcom
 *  @version 1.146
 *  @module Poll
 *  @namespace Widget
 *  @class Poll
 */
define([
         "dojo/_base/declare",
         "dojo/dom-attr",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dijit/registry",
         "dijit/form/Button",
         "me/core/main_widgets/EnmeMainLayoutWidget",
         "me/web/widget/folder/FolderSelect",
         "me/web/widget/questions/Question",
         "me/web/widget/questions/patterns/SingleResponse",
         "me/web/widget/options/RepeatedVotes",
         "me/web/widget/options/LimitVotes",
         "me/web/widget/options/DateToClose",
         "me/web/widget/dialog/Dialog",
         "me/web/widget/publish/PublishSupport",
         "me/web/widget/support/ActionDialogHandler",
         "me/web/widget/options/CommentsOptions",
         "me/web/widget/support/DnD",
         "me/web/widget/options/CheckSingleOption",
         "me/web/widget/options/ResultsOptions",
         "me/core/enme",
         "dojo/text!me/web/widget/poll/templates/poll.html" ],
        function(
                declare,
                domAttr,
                _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin,
                registry,
                Button,
                main_widget,
                FolderSelect,
                Question,
                SingleResponse,
                RepeatedVotes,
                LimitVotes,
                DateToClose,
                Dialog,
                PublishSupport,
                ActionDialogHandler,
                CommentsOptions,
                DnD,
                CheckSingleOption,
                ResultsOptions,
                _ENME,
                 template) {
            return declare([ _WidgetBase,
                             _TemplatedMixin,
                             main_widget,
                             ActionDialogHandler,
                             DnD,
                             _WidgetsInTemplateMixin], {

          /*
           * template string.
           */
           templateString : template,

           /*
           *
           */
          _folderWidget : null,

          /*
           * i18n message for this widget.
           */
          i18nMessage : {
            poll_create_question_title : _ENME.getMessage("poll_create_question_title"),
            poll_create_build_answers : _ENME.getMessage("poll_create_build_answers"),
            poll_create_add_new_answer : _ENME.getMessage("poll_create_add_new_answer"),
            poll_create_allow_multiple_selection : _ENME.getMessage("poll_create_allow_multiple_selection"),
            poll_create_allow_new_responses : _ENME.getMessage("poll_create_allow_new_responses"),
            poll_create_limits : _ENME.getMessage("poll_create_limits"),
            poll_create_poll_options : _ENME.getMessage("poll_create_poll_options"),
            poll_create_comments : _ENME.getMessage("poll_create_comments"),
            poll_create_results : _ENME.getMessage("poll_create_results"),
            poll_create_button_create : _ENME.getMessage("poll_create_button_create"),
            commons_cancel : _ENME.getMessage("commons_cancel")
          },

          /*
           *
           */
          context : "poll",

          /*
           *
           */
          _dialogPublish : null,

          /*
           * question widget.
           */
          _questionWidget : null,

          /*
           *
           */
          _default_answers : 4,

          /*
           *
           */
          _min_answer_allowed : 2,

          /*
           *
           */
          _answer_widget_array : [],

          /*
           *
           */
          postCreate : function() {
              var parent = this;
              this._folderWidget = new FolderSelect({folderContext : "poll"});
              this._questionWidget = new Question(
                      {
                          maxSize : 200,
                          maxLength : 900
                      }
                      );
              this._question.appendChild(this._questionWidget.domNode);
              if (this._folder) {
                  this._folder.appendChild(this._folderWidget.domNode);
              }
              //add default answers.
              var dnd_sources = [];
              for (var i= 0; i <= this._default_answers; i++) {
                   var li = this._newAnswer({ dndEnabled : false});
                   this.addItem(li);
                   if (parent.isDnD) {
                       dnd_sources.push(li);
                   }
              }

              if (parent.isDnD) {
                  var dragSrcEl = null;
                  this.enableDnDSupport(dnd_sources,
                    {
                      dragstart : function (e) {
                        var node = this;
                        //this.style.opacity = '0.4';
                        dojo.addClass(this, "me_opa");
                        dragSrcEl = this;
                        console.log("iniciando drag", dragSrcEl);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('poll-answer', domAttr.get(node, 'd-id'));
                      },
                      dragenter : function (e) {
                        // this / e.target is the current hover target.
                        var node = this;
                        //console.log('drag dragenter', node, e.target);
                        this.classList.add('over');
                      },
                      dragover : function (e) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }
                        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                        return false;
                      },
                      dragleave : function (e) {
                        var node = this;
                        //console.log('drag dragleave', node, e.target);
                       this.classList.remove('over');  // this / e.target is previous target element.
                      },
                      drop : function (e) {
                        var node = this;
                        //dragSrcEl = this.innerHTML;
                        var origin_id  = e.dataTransfer.getData('poll-answer');
                        var target_id = domAttr.get(node, 'd-id');
                        var _w = registry.byId(origin_id);
                        var _w_t = registry.byId(target_id);
                        //var idelt = ev.dataTransfer.getData("poll-answer");
                        console.log('DROPEDDD', _w.domNode, _w_t.domNode);
                        console.log("this target node", node);
                        console.log("this source node", dragSrcEl);
                        node.appendChild(_w.domNode);
                        domAttr.set(node, 'd-id', _w.id);
                        dragSrcEl.appendChild(_w_t.domNode);
                        domAttr.set(dragSrcEl, 'd-id', _w_t.id);
                        //ev.target.appendChild(document.getElementById(idelt));
                        // return false so the event will not be propagated to the browser
                        // this / e.target is current target element.
                        if (e.stopPropagation) {
                          e.stopPropagation(); // stops the browser from redirecting.
                        }
                        e.dataTransfer.clearData("poll-answer");
                        // See the section on the DataTransfer object.
                        return false;
                      },
                      dragend : function (e) {
                        var node = this;
                        //this.style.opacity = '1';
                        console.log('DROP ENDDDD', node);
                         [].forEach.call(dnd_sources, function (col) {
                            //console.info("---> col ",col);
                            //col.classList.remove('over');
                            dojo.removeClass(col, "me_opa");
                            //this.style.opacity = '1';
                         });

                      }
                    });
              } else {
                //TODO: remove icons to drag
              }


              // trigger the validate poll or publish and create
              dojo.connect(this._publish, "onClick", dojo.hitch(this, this._validatePoll));
              // trigger the add new answer
              dojo.connect(this._addNew, "onclick", dojo.hitch(this, this._addAnswer));
              // cancel button
              var parent = this;
              dojo.connect(this._cancel, "onclick", dojo.hitch(this, function() {
                window.location.href = _ENME.config('contextPath') + "/user/poll/list";
              }));
          },

          /**
           *
           * @method
           */
          addItem : function (node) {
            this._source.appendChild(node);
          },

          /**
           *
           * @param event
           */
          _addAnswer : function(event) {
              dojo.stopEvent(event);
              var li = this._newAnswer({ dndEnabled : true});
              this.addItem(li);
          },


          /**
           *
           * @returns {encuestame.org.core.commons.questions.patterns.SingleResponse}
           */
          _newAnswer : function(params){
              params = params == null ? {} : params;
              var answer = new SingleResponse(params);
              var li = dojo.create("li");
              //dojo.addClass(li, "dojoDndItem");
              //draggable="true"
              domAttr.set(li, 'draggable', true);
              domAttr.set(li, 'd-id', answer.id);
              this._answer_widget_array.push(answer);
              li.appendChild(answer.domNode);
              //console.info("_newAnswer", li);
              return li;
          },


          /*
           *
           */
          _createPoll : function(params) {
             var load = dojo.hitch(this, function(data) {
                 //console.info("create poll", data);
                 if ("success" in data) {
                 var pollBean = data.success.pollBean;
                 //console.info("create poll pollBean ", pollBean);
                     if (pollBean != null) {
                         this._createDialogSupport();
                         this._openSuccessMessage(pollBean);
                     }
                 }
             });
             var error = dojo.hitch(this, function(error) {
                 this._openFailureMessage(error);
             });
             encuestame.service.xhrPostParam(
                 this.getURLService().service('encuestame.service.list.poll.create'), params, load, error);
          },

          /*
           *
           */
          createPoll : function(params){
              this._createPoll(params);
          },

          /*
           *
           */
          _validatePoll : function(event) {
              dojo.stopEvent(event);
              var valid = { status : false , message : null};
              /*
               * options : {
                          multiples : true,
                          allow_add_response : true,
                          repeated_votes : {
                              allow : true,
                              number : 123
                          },
                          limit : {
                              limit : true,
                              number : 231
                          },
                          close : {
                              close : true,
                              time : "",
                              date : ""
                                  },
                          comments : "allow",
                          results : "all",
                          folder : 1,
                      }
               */
              var params = {
                              questionName : "",
                              listAnswers : []
                           };

              if (this._questionWidget.getQuestion() != "" &&
                  this._questionWidget.getQuestion() != null) {
                  valid.status = true;
                  dojo.mixin(params, { questionName : this._questionWidget.getQuestion()});
              } else {
                  valid.status = false;
              }

              var c = 0;
              dojo.forEach(this._answer_widget_array,
                      dojo.hitch(this,function(item) {
                      if (item != null) {
                           //console.debug("_answer_widget_item", item);
                          var response = item.getResponse();
                          //console.debug("_answer_widget_array params", response);
                          if (response != null && response != "") {
                              var newArray = params.listAnswers;
                              newArray.push(response.trim());
                              dojo.mixin(params, { listAnswers : newArray});
                              c++;
                          }
                      }
              }));

              if (c < this._min_answer_allowed) {
                  valid.status = false;
                  valid.message = _ENME.getMessage("m_025");
                  //console.info("error", valid);
                  this.infoMesage(valid.message);
                  c = 0;
              } else {
                  valid.status = true;
              }

              var repeated_votes = registry.byId("repeated");
              //console.info("repeated_votes params", repeated_votes.getOptions().checked);
              if (repeated_votes.getOptions().checked){
                  dojo.mixin(params, {repeated_votes : repeated_votes.getOptions().items});
              }

              var limit_votes = registry.byId("limit");
              //console.info("limit_votes params", limit_votes.getOptions().checked);
              if (limit_votes.getOptions().checked) {
                  dojo.mixin(params, {limit_votes : limit_votes.getOptions().items});
              }

              var close = registry.byId("close");
              //console.info("limit_votes params", limit_votes.getOptions().checked);
              if (close.getOptions().checked){
                  dojo.mixin(params, {close_time : close.getOptions().time});
                  dojo.mixin(params, {close_date : close.getOptions().date});
              }

              var comments = registry.byId("comments");
              if (comments.getResponse() != null) {
                  dojo.mixin(params, {comments : comments.getResponse()});
              }

              var results = registry.byId("results");
              if (results.getResponse() != null) {
                  dojo.mixin(params, {results : results.getResponse()});
              }

              dojo.mixin(params, {multiple : registry.byId('multiple').getValue().checked});
              dojo.mixin(params, {allow_add : registry.byId('allow-add').getValue().checked});
              dojo.mixin(params, {folder_name : this._folderWidget.getSelected()});

              if (valid.status) {
                  this.createPoll(params);
              }
          },

          _addHashTags : function(){},
          _publishPoll : function(){},


          /*
           *
           */
          _openSuccessMessage : function(pollBean) {
              //social widget.
              var publishWidget = new PublishSupport(
                      {
                          context: this.context,
                          item : {
                              id: pollBean.id,
                              name : pollBean.question.question_name ,
                              url : pollBean.shortUrl
                          },
                          dialogContext : this._dialogPublish
                      });
              this._dialogPublish.containerNode.appendChild(publishWidget.domNode);
              this._dialogPublish.show();
          },

          /*
           *
           */
          _openFailureMessage : function(errorMessage) {
               this.infoMesage(errorMessage);
          },

          /*
           *
           */
          _createDialogSupport : function() {
              this._dialogPublish = new Dialog(
                      {
                          style :"width: 850px; heigth:400px;"
                      });
          }

    });
});

///*
// ************************************************************************************
// * Copyright (C) 2001-2011 encuestame: open source social survey Copyright (C) 2009
// * encuestame Development Team.
// * Licensed under the Apache Software License version 2.0
// * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// * Unless required by applicable law or agreed to  in writing,  software  distributed
// * under the License is distributed  on  an  "AS IS"  BASIS,  WITHOUT  WARRANTIES  OR
// * CONDITIONS OF ANY KIND, either  express  or  implied.  See  the  License  for  the
// * specific language governing permissions and limitations under the License.
// ************************************************************************************
// */
//dojo.provide("encuestame.org.core.commons.poll.Poll");
//
//dojo.require("dijit._Templated");
//dojo.require("dijit._Widget");
//dojo.require('dijit.form.Button');
//dojo.require("dijit.form.CheckBox");
//dojo.require('dijit.form.TimeTextBox');
//dojo.require('dijit.form.DateTextBox');
//dojo.require('encuestame.org.core.commons');
//dojo.require('encuestame.org.main.EnmeMainLayoutWidget');
//dojo.require('encuestame.org.core.shared.utils.FolderSelect');
//dojo.require("encuestame.org.core.commons.social.SocialAccountPicker");
//dojo.require("encuestame.org.core.commons.dialog.Dialog");
//dojo.require('encuestame.org.core.commons.questions.patterns.SingleResponse');
//dojo.require('encuestame.org.core.commons.questions.Question');
//dojo.require('encuestame.org.core.commons.support.DnD');
//dojo.require('encuestame.org.core.shared.options.RepeatedVotes');
//dojo.require('encuestame.org.core.shared.options.LimitVotes');
//dojo.require('encuestame.org.core.shared.publish.PublishSupport');
//dojo.require('encuestame.org.core.shared.options.CommentsOptions');
//dojo.require('encuestame.org.core.shared.options.DateToClose');
//dojo.require('encuestame.org.core.shared.options.ResultsOptions');
//dojo.require('encuestame.org.core.shared.options.CheckSingleOption');
//dojo.require('encuestame.org.core.commons.support.ActionDialogHandler');
//
//
///**
// *
// */
//dojo.declare(
//    "encuestame.org.core.commons.poll.Poll",
//    [encuestame.org.main.EnmeMainLayoutWidget,
//        encuestame.org.core.commons.support.DnD,
//        encuestame.org.core.commons.support.ActionDialogHandler],{
//        templatePath: dojo.moduleUrl("encuestame.org.core.commons.poll", "templates/poll.html"),
//

//});