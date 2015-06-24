// Generated by CoffeeScript 1.9.3
(function() {
  window.App = {
    Models: {},
    Views: {},
    Collections: {},
    InitModels: {},
    InitViews: {},
    InitCollections: {},
    Helpers: {}
  };

  App.Models.Chat = Backbone.Model.extend({
    urlRoot: '/consultants',
    defaults: {
      configs: {}
    },
    initialize: function() {
      this.configs = chat_configs;
      return console.log(this.configs);
    }
  });

  App.Views.Chat = Backbone.View.extend({
    el: '#ok_con_web_chat',
    $ok: $('#ok_button'),
    open: false,
    online: false,
    client: {},
    status: 'offline',
    consults: 0,
    configs: {},
    ip: '',
    initialize: function() {
      this.model.bind('change:configs', function() {
        this.configs = this.model.get('configs');
        return console.log(this.configs);
      });
      this.ip = ip;
      console.log('init view chat');
      this.updateSystem();
      return this.registerSocket();
    },
    registerSocket: function() {
      console.log("Initialize socket");
      this.socket = io('http://127.0.0.1:1337');
      this.socket.on('disconnect', function() {
        return console.error('ОТКЛЮЧИЛСЯ!');
      });
      this.socket.on('reconnect', (function(_this) {
        return function() {
          _this.socket.emit('addClient', {
            ip: ip
          });
          return console.info('Успешно переподключение к соккету');
        };
      })(this));
      this.socket.emit('addClient', {
        ip: ip
      });
      this.socket.on('takeCountConsultants', (function(_this) {
        return function(data) {
          return _this.takeCountConsultants(data);
        };
      })(this));
      return this.socket.on('chatStatusMessage', (function(_this) {
        return function(data) {
          return _this.takeChatStatusMessage(data);
        };
      })(this));
    },
    takeChatStatusMessage: function(data) {},
    takeCountConsultants: function(data) {
      var count;
      console.info('Получили количество консультантов', data);
      if ('count' in data) {
        count = parseInt(data.count);
        if (count) {
          this.online = true;
        } else {
          this.online = false;
        }
      } else {
        this.online = false;
      }
      return this.updateSystem();
    },
    updateSystem: function() {
      if (!this.online) {
        this.status = 'offline';
        return this.switchChatButton(0);
      } else {
        this.switchChatButton(1);
        return this.status = 'writeus';
      }
    },
    switchChatButton: function(command) {
      if (command) {
        console.log('Online');
        this.$ok.removeClass('ok_offline_button');
        return this.$ok.addClass('ok_online_button');
      } else {
        console.log('Offline');
        this.$ok.removeClass('ok_online_button');
        return this.$ok.addClass('ok_offline_button');
      }
    },
    events: {
      'click #ok_button': 'okClick',
      'click #ok_submit': 'offlineSubmit',
      'click #ok_writeus_submit': 'writeUsSubmit'
    },
    writeUsSubmit: function(e) {
      return console.log('Отправка вопроса консультантам');
    },
    offlineSubmit: function(e) {
      var $element, $form, data;
      $element = $(e.currentTarget);
      $form = $element.parent('form');
      data = $form.serializeObject();
      console.log('Отправляем новое задание', data);
      return this.socket.emit('takeOfflineTask', data);
    },
    okClick: function() {
      if (this.open) {
        this.hideChat();
        return this.open = false;
      } else {
        this.showChat();
        return this.open = true;
      }
    },
    showChat: function() {
      var ok_position, template;
      ok_position = 'ok_left_center';
      template = $('#' + this.status + '_tmpl').html();
      template = App.Helpers.Template(template, this.model.configs);
      $('#iframe').html(template);
      $('#ok_consultant').css('display', 'block');
      switch (ok_position) {
        case 'ok_left_center':
          return $('#ok_con_web_chat').animate({
            'left': '0'
          }, 250);
      }
    },
    hideChat: function() {
      var ok_position;
      ok_position = 'ok_left_center';
      switch (ok_position) {
        case 'ok_left_center':
          return $('#ok_con_web_chat').animate({
            'left': '-340px'
          }, 450, function() {
            return $('#ok_consultant').css('display', 'none');
          });
      }
    }
  });

  App.InitModels.Chat = new App.Models.Chat();

  App.InitViews.Chat = new App.Views.Chat({
    model: App.InitModels.Chat
  });

  App.Helpers.Template = function(tmpl, obj) {
    var template;
    template = _.template(tmpl);
    return template(obj);
  };

  $.fn.serializeObject = function() {
    var a, o;
    o = {};
    a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== void 0) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        return o[this.name].push(this.value || '');
      } else {
        return o[this.name] = this.value || '';
      }
    });
    return o;
  };

}).call(this);
