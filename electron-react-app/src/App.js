import React, { Component } from 'react';
import Header from './Component/Header';
import Sidebar from './Component/Sidebar';
import Content from './Component/Content';
import LeftContent from './Component/LeftContent';
import MessageModal from './Component/MessageModal';
import ContextMenu from './Component/ContextMenu';
import { Button } from 'reactstrap';
import LinkedListNode from './Classes/LinkedListNode';
import Mousetrap from 'mousetrap';
import './App.css';
const { $, electron } = window;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: true,
      app: {
        project: {
          filename: 'Nuevo Proyecto',
          imports: ["Servo.h"],
          defaults: [
            { block: 'execute', command: 'Servo SERVO1' },
            { block: 'execute', command: 'Servo SERVO2' }
          ],
          setup: [
            { block: 'execute', command: 'pinMode(4, OUTPUT)' },
            { block: 'execute', command: 'pinMode(5, OUTPUT)' },
            { block: 'execute', command: 'pinMode(6, OUTPUT)' },
            { block: 'execute', command: 'pinMode(13, OUTPUT)' },
            { block: 'execute', command: 'SERVO1.attach(12)' },
            { block: 'execute', command: 'SERVO2.attach(11)' }
          ],
          loop: [],
          variables: {},
          savedState: "<ul class=\"sortable ui-sortable\" id=\"workspace\" style=\"min-height: calc(100vh - 86px);\"></ul>",
          currentState: new LinkedListNode("<ul class=\"sortable ui-sortable\" id=\"workspace\" style=\"min-height: calc(100vh - 86px);\"></ul>")
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
          if (ui.item) {
            if (ui.item.hasClass('multidrag')) {
              ui.item.after(ui.item.children('ul').children()).detach();
              ui.item.data('next').detach()
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
          $('input').trigger('input');
        }.bind(this),
        drop: function (event, ui) {
          const helper = ui.helper.clone().attr('style', null).removeClass('ui-draggable-dragging');
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
          $('input').trigger('input')
        }.bind(this),
        MessageModal: {
          isOpen: false,
          title: "",
          message: "",
          done: false
        },
        toggle: this.toggle.bind(this),
        start: function (event, ui) {
          if (ui.item.attr('data-block') === 'if') {
            if (ui.placeholder.next()) {
              if (ui.placeholder.next().attr('data-block') === 'else') {
                const item = ui.item.clone().removeAttr('style')
                const next = ui.placeholder.next().clone();
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
        }
      }
    }
    window.app = this;
  }

  componentWillMount() {
    const { ipcRenderer } = this.state.app.electron;
    ipcRenderer.on('mainWindow:isMaximized', (event, isMaximized) => {
      this.state.app.set({ isMaximized });
    });
    ipcRenderer.on('serialport:list', (event, ports) => {
      this.state.app.set({ ports });
    });
    ipcRenderer.on('fs:open', (event, filename, data) => {
      const { project } = this.state.app;
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
            filename: 'Nuevo Proyecto',
            imports: ["Servo.h"],
            defaults: [
              { block: 'execute', command: 'Servo SERVO1' },
              { block: 'execute', command: 'Servo SERVO2' }
            ],
            setup: [
              { block: 'execute', command: 'pinMode(4, OUTPUT)' },
              { block: 'execute', command: 'pinMode(5, OUTPUT)' },
              { block: 'execute', command: 'pinMode(6, OUTPUT)' },
              { block: 'execute', command: 'pinMode(13, OUTPUT)' },
              { block: 'execute', command: 'SERVO1.attach(12)' },
              { block: 'execute', command: 'SERVO2.attach(11)' }
            ],
            loop: [],
            variables: {},
            savedState: "<ul class=\"sortable ui-sortable\" id=\"workspace\" style=\"min-height: calc(100vh - 86px);\"></ul>",
            currentState: new LinkedListNode("<ul class=\"sortable ui-sortable\" id=\"workspace\" style=\"min-height: calc(100vh - 86px);\"></ul>")
          }
        },
        () => {
          this.state.app.set(
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
          );
        }
      )
    });
    ipcRenderer.on('fs:save', (event, filename) => {
      const { project } = this.state.app;
      project.filename = filename;
      this.state.app.set({ project });
    });
    ipcRenderer.on('fs:saveas', (event, filename) => {
      const { project } = this.state.app;
      project.filename = filename;
      this.state.app.set({ project });
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
    $(document.body).on('input', '.value-slot input', event => {
      const inputWidth = $(event.currentTarget).textWidth();
      const input = $(event.currentTarget);
      input.css({ width: inputWidth });
      input.attr('data-value', input.val());
    })
    $(document.body).on('change', '[data-block] .value-slot input', event => {
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
  }

  toggle() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  render() {
    return (
      <div className="App" >
        <Header app={this.state.app} ref="Header" />
        <main>
          <Sidebar isOpen={this.state.sidebar}>
            <LeftContent app={this.state.app} />
          </Sidebar>
          <Button onClick={this.state.app.toggle} id="btn-toggle-sidebar">
            {this.state.sidebar ? '<' : '>'}
          </Button>
          <Content app={this.state.app} isOpen={this.state.sidebar} />
        </main>
        <MessageModal app={this.state.app} />
        <ContextMenu ref="ContextMenu" />
      </div>
    );
  }
}
export default App;
