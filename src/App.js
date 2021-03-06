import React, { Component } from 'react';
import Header from './Component/Header';
import Sidebar from './Component/Sidebar';
import Content from './Component/Content';
import LeftContent from './Component/LeftContent';
import MessageModal from './Component/MessageModal';
import ContextMenu from './Component/ContextMenu';
import { Button, Row, Col, Label } from 'reactstrap';
import LinkedListNode from './Classes/LinkedListNode';
import Mousetrap from 'mousetrap';
import './App.css';
const { $, electron } = window;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftbar: true,
      rightbar: false,
      app: {
        monitor: {},
        Arduino: null,
        project: {
          filename: null,
          imports: ["Servo.h"],
          defaults: [
            { block: 'execute', command: 'Servo SERVO1' },
            { block: 'execute', command: 'Servo SERVO2' }
          ],
          setup: [
            { block: 'execute', command: 'Serial.begin(9600)' },
            { block: 'execute', command: 'Serial.write(";;;;;;;;")' },
            { block: 'execute', command: 'pinMode(4, OUTPUT)' },
            { block: 'execute', command: 'pinMode(5, OUTPUT)' },
            { block: 'execute', command: 'pinMode(6, OUTPUT)' },
            { block: 'execute', command: 'pinMode(13, OUTPUT)' },
            { block: 'execute', command: 'SERVO1.attach(12)' },
            { block: 'execute', command: 'SERVO2.attach(11)' }
          ],
          loop: [],
          variables: {},
          savedState: "<ul class=\"sortable ui-sortable\" id=\"workspace\"></ul>",
          currentState: new LinkedListNode("<ul class=\"sortable ui-sortable\" id=\"workspace\"></ul>")
        },
        isMaximized: false,
        ports: [],
        currentPort: "",
        set: function (state, callback) {
          const { set, electron, ...app } = this.state.app;
          this.setState(
            {
              app: { ...app, ...state, set, electron }
            },
            callback
          )
        }.bind(this),
        electron,
        isAllowed: function (placeholder, placeholderParent, currentItem) {
          if (placeholderParent) {
            if (placeholderParent.hasClass('locked')) {
              return false;
            } else {
              if (currentItem.attr('data-block') === "else") {
                if (placeholder.prev().attr('data-block') !== "if") {
                  return false;
                } else {
                  if (placeholder.next().attr('data-block') === "else") {
                    return false;
                  } else {
                    return true;
                  }
                }
              } else {
                if (placeholder.next().attr('data-block') === "else") {
                  return false;
                } else {
                  return true;
                }
              }
            }
          } else {
            if (currentItem.attr('data-block') === "else") {
              if (placeholder.prev().attr('data-block') !== "if") {
                return false;
              } else {
                if (placeholder.next().attr('data-block') === "else") {
                  return false;
                } else {
                  return true;
                }
              }
            } else {
              if (placeholder.next().attr('data-block') === "else") {
                return false;
              } else {
                return true;
              }
            }
          }
        },
        stop: function (e, ui) {
          const $lc = $('.LeftContent')
          if ($lc.parent().is('.is-open')) {
            const pos = {
              top: $lc.offset().top,
              left: $lc.offset().left,
              right: $lc.offset().left + $lc.width(),
              bottom: $lc.offset().top + $lc.height()
            }
            const { originalPosition } = ui;
            const position = {
              left: e.pageX,
              top: e.pageY
            }
            var isOverLeft = false
            if (pos.left <= position.left && position.left <= pos.right) {
              if (pos.top <= position.top && position.top <= pos.bottom) {
                isOverLeft = true
              }
            }
            var didOverLeft = false
            if (pos.left <= originalPosition.left && originalPosition.left <= pos.right) {
              if (pos.top <= originalPosition.top && originalPosition.top <= pos.bottom) {
                didOverLeft = true
              }
            }
            console.log({ isOverLeft, didOverLeft })
            if (isOverLeft && !didOverLeft) {
              if (ui.item) {
                ui.item.detach()
              } else if (ui.helper) {
                if (ui.helper.is('.ui-draggable')) {
                  ui.helper.parent().html("<input class=\"form-control input-sm\"/>")
                  ui.helper.detach()
                }
              }
            }
          }
          if (ui.item) {
            ui.item.removeAttr('style')
            if (ui.item.hasClass('multidrag')) {
              ui.item.after(ui.item.children('ul').children().removeAttr('style')).detach();
              ui.item.data('next').detach();
            }
          }
          const outer = $($('#workspace')[0].outerHTML);
          outer.find('.ui-sortable-helper').removeAttr('style').removeClass('ui-sortable-helper')
          outer.find('.ui-sortable-placeholder').remove()
          outer.find('ul:empty').remove()
          const currentStateData = outer[0].outerHTML;
          if (this.state.app.project.currentState.data !== currentStateData) {
            const nextState = new LinkedListNode(currentStateData);
            nextState.prev = this.state.app.project.currentState;
            nextState.prev.next = nextState;
            const { project } = this.state.app;
            project.currentState = nextState;
            this.state.app.set({ project });
          }
          $('input').trigger('input');
        }.bind(this),
        drop: function (event, ui) {
          const helper = ui.helper.clone().removeAttr('style').removeClass('ui-draggable-dragging');
          if (ui.draggable.parent().hasClass('value-slot')) {
            ui.draggable.parent().html("<input class=\"form-control input-sm\"/>")
          }
          ui.helper.remove();
          $(event.target).html(helper);
          $(event.target).find('.ui-draggable').draggable(
            {
              helper: 'original',
              scroll: false,
              revert: 'invalid',
              revertDuration: 0,
              zIndex: 100,
              stop: this.state.app.stop
            }
          );
          $(event.target).find('.ui-droppable').droppable(
            {
              accept: "[data-block='operator'], [data-block='value']",
              drop: this.state.app.drop,
              greedy: true,
              tolerance: 'pointer'
            }
          );
          const outer = $($('#workspace')[0].outerHTML);
          outer.find('.ui-sortable-helper').removeAttr('style').removeClass('ui-sortable-helper')
          outer.find('.ui-sortable-placeholder').remove()
          outer.find('ul:empty').remove()
          const currentStateData = outer[0].outerHTML;
          if (this.state.app.project.currentState.data !== currentStateData) {
            const nextState = new LinkedListNode(currentStateData);
            nextState.prev = this.state.app.project.currentState;
            nextState.prev.next = nextState;
            const { project } = this.state.app;
            project.currentState = nextState;
            this.state.app.set({ project });
          }
          $('input').trigger('input')
        }.bind(this),
        MessageModal: {
          isOpen: false,
          title: "",
          message: "",
          done: false
        },
        toggleLeft: this.toggleLeft.bind(this),
        toggleRight: this.toggleRight.bind(this),
        start: function (event, ui) {
          if (ui.item.attr('data-block') === 'if') {
            if (ui.placeholder.next()) {
              if (ui.placeholder.next().attr('data-block') === 'else') {
                const item = ui.item.clone().removeAttr('style')
                const next = ui.placeholder.next().clone().removeAttr('style');
                item.find('.ui-draggable').draggable(
                  {
                    helper: 'original',
                    scroll: false,
                    revert: 'invalid',
                    revertDuration: 0,
                    zIndex: 100,
                    stop: this.state.app.stop
                  }
                );
                item.find('.ui-droppable').droppable(
                  {
                    accept: "[data-block='operator'], [data-block='value']",
                    drop: this.state.app.drop,
                    greedy: true,
                    tolerance: 'pointer'
                  }
                );
                next.find('.ui-draggable').draggable(
                  {
                    helper: 'original',
                    scroll: false,
                    revert: 'invalid',
                    revertDuration: 0,
                    zIndex: 100,
                    stop: this.state.app.stop
                  }
                );
                next.find('.ui-droppable').droppable(
                  {
                    accept: "[data-block='operator'], [data-block='value']",
                    drop: this.state.app.drop,
                    greedy: true,
                    tolerance: 'pointer'
                  }
                );
                ui.placeholder.next().hide();
                ui.placeholder.next().removeClass('unlocked').addClass('locked');
                ui.item.data('next', ui.placeholder.next());
                ui.item.empty().addClass('multidrag')
                  .removeClass('unlocked')
                  .removeAttr('color')
                  .removeAttr('data-block')
                  .append('<div class="ui-sortable-handle"/>')
                  .append($('<ul/>')
                    .append(item).append(next)
                  );
              }
            }
          }
        }.bind(this),
        update: function (event, ui) {
          if (ui.item) {
            if (ui.item.hasClass('multidrag')) {
              ui.item.after(ui.item.children('ul').children()).detach();
            }
          }
        },
        toggleCreateVariable: null
      }
    }
    window.app = this;
  }

  componentWillMount() {
    this.monitor = {}
    this.oldTime1 = (new Date()).getTime();
    this.oldTime2 = (new Date()).getTime();
    this.reset = true;
    const { ipcRenderer } = this.state.app.electron;
    ipcRenderer.on('file:compile', (event) => {
      if (this.state.app.Arduino) {
        if (this.state.app.Arduino.open) {
          this.state.app.set(
            { monitor: {} },
            () => {
              if (this.state.app.Arduino.isOpen) {
                this.state.app.Arduino.close();
              }
              this.state.app.Arduino.open(() => {
                this.monitor = {}
                this.oldTime1 = (new Date()).getTime();
                this.oldTime2 = (new Date()).getTime();
                this.reset = true;
              })
            }
          );
        }
      }
    })
    ipcRenderer.on('mainWindow:isMaximized', (event, isMaximized) => {
      this.state.app.set({ isMaximized });
    });
    ipcRenderer.on('serialport:list', (event, ports) => {
      this.state.app.set({ ports });
    });
    ipcRenderer.on('fs:open', (event, filename, data) => {
      const { project } = this.state.app;
      const openfile = (filename, data) => {
        project.filename = filename;
        project.imports = data.imports;
        project.defaults = data.defaults;
        project.setup = data.setup;
        project.variables = data.variables;
        project.savedState = data.savedState;
        project.currentState = new LinkedListNode(data.savedState);
        this.state.app.set(
          {
            project: {
              filename: null,
              imports: ["Servo.h"],
              defaults: [
                { block: 'execute', command: 'Servo SERVO1' },
                { block: 'execute', command: 'Servo SERVO2' }
              ],
              setup: [
                { block: 'execute', command: 'Serial.begin(9600)' },
                { block: 'execute', command: 'Serial.write(";;;;;;;;")' },
                { block: 'execute', command: 'pinMode(4, OUTPUT)' },
                { block: 'execute', command: 'pinMode(5, OUTPUT)' },
                { block: 'execute', command: 'pinMode(6, OUTPUT)' },
                { block: 'execute', command: 'pinMode(13, OUTPUT)' },
                { block: 'execute', command: 'SERVO1.attach(12)' },
                { block: 'execute', command: 'SERVO2.attach(11)' }
              ],
              loop: [],
              variables: {},
              savedState: "<ul class=\"sortable ui-sortable\" id=\"workspace\"></ul>",
              currentState: new LinkedListNode("<ul class=\"sortable ui-sortable\" id=\"workspace\"></ul>")
            }
          },
          () => this.state.app.set(
            { project },
            () => {
              const path = this.state.app.electron.remote.require('path')
              this.refs.Header.refs.projectName.refs.entry.value = path.basename(project.filename).slice(0, path.basename(project.filename).length - 4)
              const workspaceParent = $("#workspace").parent()
              $("#workspace").remove();
              const temp = $(project.currentState.data);
              for (let index = 0; index < temp.find('[data-value]').length; index++) {
                const element = temp.find('[data-value]')[index];
                element.value = element.getAttribute('data-value');
              }
              workspaceParent.html(temp)
              const workspace = workspaceParent.find("#workspace");
              workspace.nestedSortable(
                {
                  listType: 'ul',
                  handle: 'div',
                  items: 'li',
                  toleranceElement: '> div',
                  cancel: "div[data-block='value'],input,textarea,button,select,option",
                  isAllowed: this.state.app.isAllowed,
                  stop: this.state.app.stop,
                  start: this.state.app.start,
                  update: this.state.app.update
                }
              );
              workspace.find('.ui-draggable').draggable(
                {
                  helper: 'original',
                  scroll: false,
                  revert: 'invalid',
                  revertDuration: 0,
                  zIndex: 100,
                  stop: this.state.app.stop
                }
              );
              workspace.find('.ui-droppable').droppable(
                {
                  accept: "[data-block='operator'], [data-block='value']",
                  drop: this.state.app.drop,
                  greedy: true,
                  tolerance: 'pointer'
                }
              );
              $('select.variableList').html('')
              Object.keys(project.variables).forEach(
                value => $('select.variableList')
                  .append($(document.createElement('option'))
                    .text(value)
                  )
              )
              for (let index = 0; index < $('select.variableList').length; index++) {
                const element = $('select.variableList')[index];
                element.value = element.dataset.value ? element.dataset.value : element.length ? element[0].value : undefined;
              }
              $('[data-block] select').trigger('change');
            }
          )
        )
      }
      if (project.currentState.data !== project.savedState) {
        if (window.confirm("¡Hay un archivo en uso no guardado!, ¿Deseas guardar los cambios antes de salir?")) {
          this.refs.Header.handlerSave(null, "openfile", { filename: filename, data: data });
        }
      } else {
        openfile(filename, data);
      }
    });
    ipcRenderer.on('fs:save', (event, filename) => {
      const { project } = this.state.app;
      project.filename = filename;
      this.state.app.set({ project });
    });
    ipcRenderer.on('fs:saveas', (event, filename, file_basename) => {
      const { project } = this.state.app;
      project.filename = filename;
      this.state.app.set({ project },
        () => {
          this.refs.Header.refs.projectName.refs.entry.value = file_basename.substr(0, file_basename.length - 4);
        });
    });
    ipcRenderer.on('fs:next', (event, type, data) => {
      switch (type) {
        case "close":
          const { Arduino } = this.state.app;
          ipcRenderer.send('mainWindow:close');
          if (Arduino.isOpen) {
            Arduino.close();
          }
          Arduino.destroy();
          break;
        case "newfile":
          $("#workspace").html('');
          this.refs.Header.refs.projectName.refs.entry.value = "Nuevo Projecto";
          const newProject = {
            filename: null,
            imports: ["Servo.h"],
            defaults: [
              { block: 'execute', command: 'Servo SERVO1' },
              { block: 'execute', command: 'Servo SERVO2' }
            ],
            setup: [
              { block: 'execute', command: 'Serial.begin(9600)' },
              { block: 'execute', command: 'Serial.write(";;;;;;;;")' },
              { block: 'execute', command: 'pinMode(4, OUTPUT)' },
              { block: 'execute', command: 'pinMode(5, OUTPUT)' },
              { block: 'execute', command: 'pinMode(6, OUTPUT)' },
              { block: 'execute', command: 'pinMode(13, OUTPUT)' },
              { block: 'execute', command: 'SERVO1.attach(12)' },
              { block: 'execute', command: 'SERVO2.attach(11)' }
            ],
            loop: [],
            variables: {},
            savedState: $("#workspace")[0].outerHTML,
            currentState: new LinkedListNode($("#workspace")[0].outerHTML)
          }
          this.state.app.set(
            { project: newProject },
            () => {
              $('select.variableList').html('')
              $('[data-block] select').trigger('change');
            }
          );
          break;
        case "openfile":
          ipcRenderer.send('fs:open')
          break;
        default:
          break;
      }
    });
    ipcRenderer.on('log:open', (event, data) => {
      const { MessageModal, set } = this.state.app;
      MessageModal.isOpen = true;
      MessageModal.done = false;
      MessageModal.title = data;
      set({ MessageModal });
    });
    ipcRenderer.on('log:write', (event, data) => {
      const { MessageModal, set } = this.state.app;
      MessageModal.message = data;
      set({ MessageModal });
    });
    ipcRenderer.on('log:end', (event) => {
      const { MessageModal, set } = this.state.app;
      MessageModal.done = true;
      set({ MessageModal });
    });
    ipcRenderer.send('mainWindow:isMaximized');
    ipcRenderer.send('serialport:list');
  }

  componentDidMount() {
    $.fn.textWidth = function (text, font) {
      if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
      $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font')).css('padding', this.css('padding'));
      return $.fn.textWidth.fakeEl.width() + 32;
    };
    $(document.body).on('input', '.value-slot input, .String', event => {
      const inputWidth = $(event.currentTarget).textWidth();
      const input = $(event.currentTarget);
      input.css({ width: inputWidth });
      var num, min, max;
      if (!input.is(".String")) {
        num = (num = Number.parseFloat(input.val())) && true ? num : 0.0
        if (input.parent().attr('min')) {
          min = (min = Number.parseFloat(input.parent().attr('min'))) && true ? min : 0.0
          if (num < min) {
            num = min;
          }
        }
        if (input.parent().attr('max')) {
          max = (max = Number.parseFloat(input.parent().attr('max'))) && true ? max : 0.0
          if (num > max) {
            num = max;
          }
        }
        input.attr('data-value', num.toString());
      } else {
        input.attr('data-value', input.val());
      }
    })
    $(document.body).on('keypress', '.value-slot input', event => {
      const re = /[0-9]/g;
      if (!re.test(event.key)) {
        if (event.key === '.') {
          if (event.currentTarget.value.indexOf('.') !== -1) {
            event.preventDefault();
          }
        } else {
          if (event.key === '-') {
            if (event.currentTarget.value.indexOf('-') !== -1) {
              event.preventDefault();
            }
          } else {
            event.preventDefault();
          }
        }
      }
    });
    $(document.body).on('change', '[data-block] .value-slot input, .String', event => {
      const input = $(event.currentTarget);
      input.val(input.attr('data-value'));
      input.trigger('input')
      const outer = $($('#workspace')[0].outerHTML);
      outer.find('.ui-sortable-helper').attr('style', '').removeClass('ui-sortable-helper')
      outer.find('.ui-sortable-placeholder').remove()
      outer.find('ul:empty').remove()
      const currentStateData = outer[0].outerHTML;
      if (this.state.app.project.currentState.data !== currentStateData) {
        const nextState = new LinkedListNode(currentStateData);
        nextState.prev = this.state.app.project.currentState;
        nextState.prev.next = nextState;
        const { project } = this.state.app;
        project.currentState = nextState;
        this.state.app.set({ project });
      }
    })
    $(document.body).on('change', '[data-block] select', event => {
      const select = $(event.currentTarget);
      select.attr('data-value', select.val());
      const outer = $($('#workspace')[0].outerHTML);
      outer.find('.ui-sortable-helper').attr('style', '').removeClass('ui-sortable-helper')
      outer.find('.ui-sortable-placeholder').remove()
      outer.find('ul:empty').remove()
      const currentStateData = outer[0].outerHTML;
      if (this.state.app.project.currentState.data !== currentStateData) {
        const nextState = new LinkedListNode(currentStateData);
        nextState.prev = this.state.app.project.currentState;
        nextState.prev.next = nextState;
        const { project } = this.state.app;
        project.currentState = nextState;
        this.state.app.set({ project });
      }
    });
    $(document.body).on('click', '#workspace, #workspace [data-block]', (event) => {
      this.refs.ContextMenu.setState({ isOpen: false });
      let color;
      const selected = $(
        "[color='default-selected']," +
        "[color='primary-selected']," +
        "[color='success-selected']," +
        "[color='info-selected']," +
        "[color='warning-selected']," +
        "[color='danger-selected']"
      );
      for (let index = 0; index < selected.length; index++) {
        const element = $(selected[index]);
        color = element.attr('color');
        if (element[0] !== event.currentTarget) {
          if (color.includes('-selected')) {
            element.attr('color', color.slice(0, color.length - 9));
          } else {
            element.attr('color', color + '-selected');
          }
        }
      }
      if (["input", "textarea", "button", "select", "option"].findIndex(value => value === event.target.tagName.toLowerCase()) === -1) {
        color = $(event.currentTarget).attr('color');
        if (color) {
          if (color.includes('-selected')) {
            $(event.currentTarget).attr('color', color.slice(0, color.length - 9));
          } else {
            $(event.currentTarget).attr('color', color + '-selected');
          }
        }
        const next = $(event.currentTarget).next();
        if (next) {
          if (next.attr('data-block') === "else") {
            color = next.attr('color');
            if (color) {
              if (color.includes('-selected')) {
                next.attr('color', color.slice(0, color.length - 9));
              } else {
                next.attr('color', color + '-selected');
              }
            }
          }
        }
      }
      event.stopPropagation();
    })
    $(document.body).on('keyup', (event) => {
      if (event.keyCode === 46) {
        const selected = $(
          "[color='default-selected']," +
          "[color='primary-selected']," +
          "[color='success-selected']," +
          "[color='info-selected']," +
          "[color='warning-selected']," +
          "[color='danger-selected']"
        );
        if (selected.length) {
          for (let index = 0; index < selected.length; index++) {
            const element = $(selected[index]);
            if (element.parent().hasClass('value-slot')) {
              element.parent().html("<input class=\"form-control input-sm\"/>")
            } else {
              const parent = element.parent();
              element.remove();
              if (!parent.is('#workspace')) {
                if (parent.children().length === 0) {
                  parent.remove()
                }
              }
            }
          }
          const outer = $($('#workspace')[0].outerHTML);
          outer.find('.ui-sortable-helper').attr('style', '').removeClass('ui-sortable-helper')
          outer.find('.ui-sortable-placeholder').remove()
          outer.find('ul:empty').remove()
          const currentStateData = outer[0].outerHTML;
          if (this.state.app.project.currentState.data !== currentStateData) {
            const nextState = new LinkedListNode(currentStateData);
            nextState.prev = this.state.app.project.currentState;
            nextState.prev.next = nextState;
            const { project } = this.state.app;
            project.currentState = nextState;
            this.state.app.set({ project });
          }
        }
      }
      $('input').trigger('input')
    })
    $(document.body).on('contextmenu', '#workspace [data-block]',
      (event) => {
        event.preventDefault();
        this.refs.ContextMenu.setState(
          {
            x: event.pageX,
            y: event.pageY,
            isOpen: true,
            options: [
              {
                label: 'Eliminar',
                lamda: () => {
                  const element = $(event.currentTarget);
                  const next = $(event.currentTarget).next();
                  if (next) {
                    if (next.attr('data-block') === "else") {
                      next.remove();
                    }
                  }
                  if (element.parent().hasClass('value-slot')) {
                    element.parent().html("<input class=\"form-control input-sm\"/>")
                  } else {
                    element.remove();
                  }
                  const outer = $($('#workspace')[0].outerHTML);
                  outer.find('.ui-sortable-helper').attr('style', '').removeClass('ui-sortable-helper')
                  outer.find('.ui-sortable-placeholder').remove()
                  outer.find('ul:empty').remove()
                  const currentStateData = outer[0].outerHTML;
                  if (this.state.app.project.currentState.data !== currentStateData) {
                    const nextState = new LinkedListNode(currentStateData);
                    nextState.prev = this.state.app.project.currentState;
                    nextState.prev.next = nextState;
                    const { project } = this.state.app;
                    project.currentState = nextState;
                    this.state.app.set({ project });
                  }
                }
              }
            ]
          }
        );
        event.stopPropagation();
        return false;
      }
    ).on('contextmenu',
      (event) => {
        this.refs.ContextMenu.setState({ isOpen: false });
      }
    )
    $(document.body).on('click',
      (event) => {
        this.refs.ContextMenu.setState({ isOpen: false });
      }
    );
    $('.value-slot input').trigger('input')
    $('[data-block] .value-slot input').trigger('change')
    $('[data-block] select').trigger('change')
    Mousetrap.bind('ctrl+n', this.refs.Header.handlerNew);
    Mousetrap.bind('ctrl+a', this.refs.Header.handlerOpen);
    Mousetrap.bind('ctrl+g', this.refs.Header.handlerSave);
    Mousetrap.bind('ctrl+shift+e', this.refs.Header.handlerExport);
    Mousetrap.bind('ctrl+shift+c', this.refs.Header.handlerCompile);
    Mousetrap.bind('ctrl+z', this.refs.Header.handlerUndo);
    Mousetrap.bind('ctrl+y', this.refs.Header.handlerRedo);
    this.state.app.set({
      toggleCreateVariable: () => {
        this.refs.LeftContent.refs.MenuVariables.toggle();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const prevPort = prevState.app.currentPort
    const { currentPort, Arduino, electron, set } = this.state.app;
    if (prevPort !== currentPort) {
      const SerialPort = electron.remote.require('serialport');
      if (Arduino) {
        if (Arduino.isOpen) {
          Arduino.close()
        }
        Arduino.destroy()
      };
      set(
        { Arduino: new SerialPort(currentPort, { baudRate: 9600, autoOpen: false }) },
        () => {
          const Readline = electron.remote.require('@serialport/parser-readline');
          const parser = this.state.app.Arduino.pipe(new Readline({ delimiter: ';' }));
          parser.on('data', data => {
            const newTime = (new Date()).getTime();
            if (newTime - this.oldTime2 >= 2500 && this.reset) {
              this.oldTime2 = newTime;
              this.monitor = {}
              this.reset = false;
            }
            if (data.trim() !== '') {
              data = data.split(':');
              if (data.length === 2) {
                this.monitor[data[0]] = data[1];
                if (newTime - this.oldTime1 >= 100) {
                  this.oldTime1 = newTime;
                  set({ monitor: this.monitor });
                }
              }
            }
          })
          if (this.state.app.Arduino.isOpen) {
            this.state.app.Arduino.close()
          }
          this.state.app.Arduino.open(() => {
            this.monitor = {}
            this.oldTime1 = (new Date()).getTime();
            this.oldTime2 = (new Date()).getTime();
            this.reset = true
          });
        }
      );
    }
  }


  toggleLeft() {
    this.setState({ leftbar: !this.state.leftbar });
  }

  toggleRight() {
    this.setState({ rightbar: !this.state.rightbar });
  }

  render() {
    return (
      <div className="App" >
        <Header app={this.state.app} ref="Header" />
        <main>
          <Sidebar isOpen={this.state.leftbar} side="left">
            <LeftContent app={this.state.app} ref="LeftContent" />
          </Sidebar>
          <Button onClick={this.state.app.toggleLeft} id="btn-toggle-sidebar">
            {this.state.leftbar ? '<' : '>'}
          </Button>
          <Content app={this.state.app} isLeft={this.state.leftbar} isRight={this.state.rightbar} />
          <Button onClick={this.state.app.toggleRight} id="btn-toggle-sidebar">
            {this.state.rightbar ? '>' : '<'}
          </Button>
          <Sidebar isOpen={this.state.rightbar} side="right">
            <h2>Monitor</h2>
            {
              Object.keys(this.state.app.monitor).map(
                (key, index) => {
                  const value = this.state.app.monitor[key];
                  return (
                    <Row key={index}>
                      <Col xs="7">
                        <Label>{key}</Label>
                      </Col>
                      <Col xs="5">
                        <div>{value}</div>
                      </Col>
                    </Row>
                  );
                }
              )
            }
          </Sidebar>
        </main>
        <MessageModal app={this.state.app} />
        <ContextMenu ref="ContextMenu" />
      </div>
    );
  }
}
export default App;
