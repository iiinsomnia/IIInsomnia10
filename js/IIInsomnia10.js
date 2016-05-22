/**
 * @author ShengHui
 * @version 2.0.3
 * @date 2016-01-31
 * 自定义布局【1：深灰 | 2：深灰宽 | 3：深灰大左 | 4：深灰大右 | 5：浅灰 | 6：浅灰宽 | 7：浅灰大左 | 8：浅灰大右 | 9：红 | 10：红宽 | 11：红大左 | 12：红大右 | 13：黄 | 14：黄宽 | 15：黄大左 | 16：黄大右 | 17：蓝 | 18：蓝宽 | 19：蓝大左 | 20：蓝大右】
 */
;var IIInsomnia10 = function(opt) {
    this.z_index = 1;                                   //z-index初始值
    this.shortcutTop = 15;                              //快捷方式top初始位置
    this.shortcutLeft = 0;                              //快捷方式left初始位置
    this.windowMinWidth = 352;                          //窗口缩放最小宽度（为响应式页面考虑，内部页面最小宽度320px）
    this.windowMinHeight = 37;                          //窗口缩放最小高度
    this.fullScreen = opt.fullScreen || false;          //窗口初始化是否全屏，若为true，则窗口初始化时windowWidth、windowHeight初始化属性无效
    this.windowWidth = opt.windowWidth || 800;          //窗口初始宽度
    this.windowHeight = opt.windowHeight || 600;        //窗口初始高度
    this.loading = opt.loading || 'images/loading.gif'; //页面加载图片URL
    this.layout = opt.layout || [];                     //自定义布局
},proto = IIInsomnia10.prototype;

/**
 * [init 初始化]
 * @return {[type]} [description]
 */
proto.init = function() {
    var that = this;

    that._win = $(window);
    that._desktop = $('#desktop');
    that._shortcut = $('#shortcut');
    that._taskWrap = $('#task_wrap');
    that._taskbar = $('#taskbar');
    that._winStart = $('#winStart');
    that._startmenu = $('#startmenu');
    that._menuBars = $('#menu_bars');
    that._logout = $('#logout');
    that._programs = $('#programs');

    that._win.bind('load', function(event) {
        /* Act on the event */
        that.initPrograms();
        that.initShortcuts();

        that.initEvent();
    });
};

/**
 * [initShortcut 初始化桌面图标]
 * @return {[type]} [description]
 */
proto.initShortcuts = function() {
    var that = this;

    var desktopHeight = that._desktop.height();
    var _left = that.shortcutLeft;
    var _top = that.shortcutTop;

    that._shortcut.find('.ink').each(function(index, el) {
        var _this = $(this);
        var css = {
            'left': _left + 'px',
            'top': _top + 'px'
        };
        _this.css(css);

        _top += 110;

        if ((_top + 110) > desktopHeight) {
            _left += 104;
            _top = that.shortcutTop;
        }
    });
};

/**
 * [initPrograms 初始化开始菜单快捷方式]
 * @return {[type]} [description]
 */
proto.initPrograms = function() {
    var that = this;

    var $ul = $('<ul></ul>');
    var $tiles = that._shortcut.find('.ink').clone();
    $tiles.each(function(index, el){
        var _this = $(this);
        if(that.layout[index]){
            _this.addClass('tile' + that.layout[index]);
        }
    });
    $ul.html($tiles);
    that._programs.html($ul).perfectScrollbar();
};

/**
 * [initEvent 初始化基本事件]
 * @return {[type]} [description]
 */
proto.initEvent = function() {
    var that = this;

    that._win.resize(function() {
        that.initShortcuts();
    });

    that._win.click(function(event) {
        /* Act on the event */
        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();
    });

    //桌面右键事件
    that._desktop.bind('contextmenu', function(event) {
        /* Act on the event */
        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.desktopContext(event);
    });

    //开始按钮事件
    that._winStart.click(function() {
        /* Act on the event */
        var _this = $(this);
        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();

        if (that._startmenu.is(':visible')) {
            that.closeStartMenu();
        } else {
            that._startmenu.show();
            that._desktop.find('.active').find('.mask').show();
        }

        return false;
    });

    //桌面快捷方式事件
    that._shortcut.find('.ink').click(function() {
        var _this = $(this);
        that.open(_this);
    });

    //桌面快捷方式右键事件
    that._shortcut.find('.ink').bind('contextmenu', function(event) {
        var _this = $(this);

        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.shortcutContext(_this, event);

        return false;
    });

    //任务栏按钮事件
    that._taskWrap.on('click', '.task', function(event) {
        event.preventDefault();
        /* Act on the event */
        var _this = $(this);
        that.task(_this);
    });

    //任务栏按钮右键事件
    that._taskWrap.on('contextmenu', '.task', function(event) {
        event.preventDefault();
        /* Act on the event */
        var _this = $(this);

        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.taskContext(_this);

        return false;
    });

    that._menuBars.click(function(event){
        var _this = $(this);
        if(_this.hasClass('expand')){
            _this.parent().animate({
                'width': '40px'
            }, 300);
            _this.removeClass('expand');
        }else{
            _this.parent().animate({
                'width': '160px'
            }, 300);
            _this.addClass('expand');
        }

        return false;
    });

    that._startmenu.click(function(event) {
        /* Act on the event */
        if(that._menuBars.hasClass('expand') && event.target.id == 'programs'){
            that._menuBars.parent().animate({
                'width': '40px'
            }, 300);
            that._menuBars.removeClass('expand');
        }

        return false;
    });

    //开始菜单快捷方式事件
    that._startmenu.on('click', '.ink', function(event) {
        event.preventDefault();
        var _this = $(this);
        that.open(_this);
        that.closeStartMenu();
    });

    //开始菜单链接事件
    that._startmenu.find('.link').click(function(event) {
        var _this = $(this);
        that.open(_this);
        that.closeStartMenu();
    });

    //退出按钮点击事件
    that._logout.click(function(event) {
        /* Act on the event */
        var _this = $(this);
        var url = _this.attr('href');
        location.href = url;
    });
};

/**
 * [closeStartMenu 关闭开始菜单]
 * @return {[type]} [description]
 */
proto.closeStartMenu = function() {
    var that = this;

    that._startmenu.hide();
    that._desktop.find('.active').find('.mask').hide();
    that._menuBars.removeClass('expand');
    that._menuBars.parent().width(40);
}

/**
 * [createWindow 创建窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.createWindow = function(obj) {
    var that = this;

    var desktop_w = that._desktop.width();
    var desktop_h = that._desktop.height();
    var $tpl = $('<div class="window" id=""><div class="titlebar"><div class="win-logo" title="点击刷新当前窗口"></div><div class="title-mask"></div><span class="title"></span><div class="handle"><a href="javascript:;" class="min"></a><a href="javascript:;" class="max"></a><a href="javascript:;" class="revert"></a><a href="javascript:;" class="close"></a></div></div><div class="body"><iframe src="" frameborder="0"></iframe><div class="loading"><img src="' + that.loading + '" alt=""></div><div class="mask"></div></div><div class="resize T" data-poi="T"></div><div class="resize R" data-poi="R"></div><div class="resize B" data-poi="B"></div><div class="resize L" data-poi="L"></div><div class="resize RT" data-poi="RT"></div><div class="resize RB" data-poi="RB"></div><div class="resize LB" data-poi="LB"></div><div class="resize LT" data-poi="LT"></div></div>');
    var $win_logo = $('.win-logo', $tpl);
    var $title = $('.title', $tpl);
    var $revert = $('.revert', $tpl);
    var $max = $('.max', $tpl);
    var $title_mask = $('.title-mask', $tpl);
    var $iframe = $('iframe', $tpl);
    var $loading = $('.loading', $tpl);

    $tpl.attr('id', 'window_' + obj.data('window'));
    $tpl.data('window', obj.data('window'));
    $tpl.data('url', obj.data('url'));

    var initCss = {
        'width': that.fullScreen ? '100%' : that.windowWidth + 'px',
        'height': that.fullScreen ? '100%' : that.windowHeight + 'px',
        'left': that.fullScreen ? '0' : ((desktop_w - that.windowWidth) / 2) + 'px',
        'top': that.fullScreen ? '0' : ((desktop_h - that.windowHeight) / 2) + 'px'
    };

    if(that.fullScreen){
        $revert.show();
        $max.hide();
    }else{
        $revert.hide();
        $max.show();
    }

    $tpl.css(initCss);

    $win_logo.append('<i class="fa fa-' + obj.data('icon') + ' fa-2x"></i>');

    $title.text(obj.data('title'));
    $title_mask.data('window', obj.data('window'));

    $iframe.attr('src', obj.data('url'));
    $iframe.on('load', function() {
        $loading.hide();
    });

    $tpl.data('info', {
        'width': that.windowWidth + 'px',
        'height': that.windowHeight + 'px',
        'left': ((desktop_w - that.windowWidth) / 2) + 'px',
        'top': ((desktop_h - that.windowHeight) / 2) + 'px'
    });

    that.initWindowEvent($tpl);

    that._desktop.append($tpl);
    that.activeWindow($tpl);
    that.createTask(obj);
};

/**
 * [createTask 创建任务栏按钮]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.createTask = function(obj) {
    var that = this;

    var icon = obj.data('icon');
    var id = obj.data('window');
    var title = obj.data('title');
    $tpl = $('<li class="task" id=""></li>');
    $tpl.attr('id', 'task_' + id);
    $tpl.data('window', id);

    $tpl.append('<i class="fa fa-' + icon + ' fa-2x"></i>');

    that._taskWrap.append($tpl);
    that.activeTask($tpl);
};

/**
 * [initEvent 初始化窗口事件]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.initWindowEvent = function(obj) {
    var that = this;

    obj.on('click', '.win-logo', function(event) {
        event.preventDefault();
        that.refreshWindow(obj);
    });

    obj.on('click', '.min', function(event) {
        event.preventDefault();
        that.minimize(obj);
    });

    obj.on('click', '.max', function(event) {
        event.preventDefault();
        that.maximize(obj);
    });

    obj.on('click', '.revert', function(event) {
        event.preventDefault();
        that.revert(obj);
    });

    obj.on('click', '.close', function(event) {
        event.preventDefault();
        that.close(obj);
    });

    obj.on('mousedown', '.title-mask', function(event) {
        event.preventDefault();

        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.windowMove(obj, event);
    });

    obj.on('dblclick', '.title-mask', function(event) {
        event.preventDefault();
        that.windowZoom(obj);
    });

    obj.on('contextmenu', '.title-mask', function(event) {
        event.preventDefault();

        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.titlebarContext(obj, event);

        return false;
    });

    obj.on('mousedown', '.resize', function(event) {
        event.preventDefault();
        var _this = $(this);

        that.destroyDesktopContext();
        that.destroyShortcutContext();
        that.destroyTitlebarContext();
        that.destroyTaskContext();
        that.destroyTaskContext();
        that.closeStartMenu();

        that.windowResize(obj, event, _this.data('poi'));
    });

    obj.on('click', '.mask', function(event) {
        event.preventDefault();
        that.activeWindow(obj);
        that.activeTask(obj.data('window'));
    });
};

/**
 * [open 打开窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.open = function(obj) {
    var that = this;
    var id = obj.data('window');

    if (that.checkWinAlive(id)) {
        that.activeWindow(id);
        that.activeTask(id);
        $('#window_' + id).show();
    } else {
        that.createWindow(obj);
    }
};

/**
 * [minimize 最小化窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.minimize = function(param) {
    var $obj;
    var $task;

    if (typeof(param) == 'object') {
        $obj = param;
        $task = $('#task_' + param.data('window'));
    } else {
        $obj = $('#window_' + param);
        $task = $('#task_' + param);
    }

    $obj.hide();
    $task.removeClass('active');
};

/**
 * [maximize 最大化窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.maximize = function(param) {
    var $obj;

    if (typeof(param) == 'object') {
        $obj = param;
    } else {
        $obj = $('#window_' + param);
    }

    $obj.css({
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    });

    $obj.find('.max').hide();
    $obj.find('.revert').show();
};

/**
 * [revert 还原窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.revert = function(param) {
    var $obj;

    if (typeof(param) == 'object') {
        $obj = param;
    } else {
        $obj = $('#window_' + param);
    }

    $obj.css({
        'width': $obj.data('info').width,
        'height': $obj.data('info').height,
        'left': $obj.data('info').left,
        'top': $obj.data('info').top
    });

    $obj.find('.revert').hide();
    $obj.find('.max').show();
};

/**
 * [close 关闭窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.close = function(param) {
    var that = this;
    var $obj;

    if (typeof(param) == 'object') {
        $obj = param;
    } else {
        $obj = $('#window_' + param);
    }

    that.destroyTask(param);
    $obj.remove();
};

/**
 * [task 任务栏按钮点击效果]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.task = function(obj) {
    var that = this;

    if (obj.hasClass('active')) {
        that.minimize(obj.data('window'));
    } else {
        that.open(obj);
    }

    return false;
};

/**
 * [refreshWindow 刷新当前窗口]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.refreshWindow = function(obj) {
    obj.find('.loading').show();
    obj.find('iframe').attr('src', obj.data('url'));
};

/**
 * [destroyTask 销毁任务栏按钮]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.destroyTask = function(param) {
    var $obj;

    if (typeof(param) == 'object') {
        $obj = $('#task_' + param.data('window'));
    } else {
        $obj = $('#task_' + param);
    }

    $obj.remove();
};

/**
 * [checkWinAlive 检查窗口是打开]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.checkWinAlive = function(id) {
    var that = this;
    var alive = false;

    that._taskWrap.find('.task').each(function() {
        var _this = $(this);
        if (_this.data('window') == id) {
            alive = true;
            return false;
        }
    });

    return alive;
};

/**
 * [activeWindow 窗口获取焦点]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
proto.activeWindow = function(param) {
    var that = this;
    var $obj;
    var $windows = that._desktop.find('.window');
    $windows.removeClass('active');
    $windows.find('.mask').show();

    if (typeof(param) == 'object') {
        $obj = param;
    } else {
        $obj = $('#window_' + param);
    }

    $obj.addClass('active');
    $obj.find('.mask').hide();
    $obj.css('z-index', that.z_index);
    that.z_index++;
};

/**
 * [activeTask 任务栏按钮获取焦点]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
proto.activeTask = function(param) {
    var that = this;
    var $obj;

    that._taskWrap.find('.task').removeClass('active');

    if (typeof(param) == 'object') {
        $obj = param;
    } else {
        $obj = $('#task_' + param);
    }

    $obj.addClass('active');
};

/**
 * [windowResize 窗口缩放]
 * @param  {[type]} obj [description]
 * @param  {[type]} e   [description]
 * @param  {[type]} poi [description]
 * @return {[type]}     [description]
 */
proto.windowResize = function(obj, e, poi) {
    that = this;

    if (!obj.hasClass('active')) {
        that.activeWindow(obj);
        that.activeTask(obj.data('window'));
    }

    obj.find('.mask').show();

    var W = obj.width();
    var H = obj.height();
    var X = e.clientX;
    var Y = e.clientY;

    that._win.unbind('mousemove').bind('mousemove', function(event) {
        /* Act on the event */
        var L = event.clientX;
        var T = event.clientY;

        switch (poi) {
            case "T":
                if ((H + Y - T) > that.windowMinHeight) {
                    obj.css({
                        height: (H + Y - T) + "px",
                        top: T + "px"
                    });
                }
                break;
            case "R":
                if ((W - X + L) > that.windowMinWidth) {
                    obj.css({
                        width: (W - X + L) + "px"
                    });
                }
                break;
            case "B":
                if ((H - Y + T) > that.windowMinHeight) {
                    obj.css({
                        height: (H - Y + T) + "px"
                    });
                }
                break;
            case "L":
                if ((W + X - L) > that.windowMinWidth) {
                    obj.css({
                        width: (W + X - L) + "px",
                        left: L + "px"
                    });
                }
                break;
            case "RT":
                if ((H + Y - T) > that.windowMinHeight) {
                    obj.css({
                        height: (H + Y - T) + "px",
                        top: T + "px"
                    });
                }
                if ((W - X + L) > that.windowMinWidth) {
                    obj.css({
                        width: (W - X + L) + "px"
                    });
                }
                break;
            case "RB":
                if ((W - X + L) > that.windowMinWidth) {
                    obj.css({
                        width: (W - X + L) + "px"
                    });
                }
                if ((H - Y + T) > that.windowMinHeight) {
                    obj.css({
                        height: (H - Y + T) + "px"
                    });
                }
                break;
            case "LT":
                if ((W + X - L) > that.windowMinWidth) {
                    obj.css({
                        width: (W + X - L) + "px",
                        left: L + "px"
                    });
                }
                if ((H + Y - T) > that.windowMinHeight) {
                    obj.css({
                        height: (H + Y - T) + "px",
                        top: T + "px"
                    });
                }
                break;
            case "LB":
                if ((W + X - L) > that.windowMinWidth) {
                    obj.css({
                        width: (W + X - L) + "px",
                        left: L + "px"
                    });
                }
                if ((H - Y + T) > that.windowMinHeight) {
                    obj.css({
                        height: (H - Y + T) + "px"
                    });
                }
                break;
        }

        obj.data("info", {
            'width': obj.width(),
            'height': obj.height(),
            'left': obj.offset().left,
            'top': obj.offset().top
        });
    });

    that._win.unbind('mouseup').bind('mouseup', function() {
        $(this).unbind('mousemove');
        obj.find('.mask').hide();
    });
};

/**
 * [windowMove 窗口移动]
 * @param  {[type]} obj [description]
 * @param  {[type]} e   [description]
 * @return {[type]}     [description]
 */
proto.windowMove = function(obj, e) {
    var that = this;

    if (!obj.hasClass('active')) {
        that.activeWindow(obj);
        that.activeTask(obj.data('window'));
    }
    obj.find('.mask').show();

    var L = obj.offset().left;
    var T = obj.offset().top;
    var X = e.screenX; //鼠标位于屏幕的left
    var Y = e.screenY; //鼠标位于屏幕的top

    //全屏时处理
    if(obj.find('.revert').is(':visible')){
        L = X - parseInt(obj.data("info").width) / 2;
        T = 0;
    }

    that._win.unbind('mousemove').bind('mousemove', function(event) {
        /* Act on the event */

        obj.find('.mask').show();
        obj.find('.revert').hide();
        obj.find('.max').show();

        var x = event.screenX; //鼠标位于屏幕的left
        var y = event.screenY; //鼠标位于屏幕的top
        var off_x = x - X; //距初始位置的偏移量
        var off_y = y - Y; //距初始位置的偏移量
        var l = L + off_x;
        var t = T + off_y;
        var w = obj.data("info").width;
        var h = obj.data("info").height;

        obj.css({
            'width': w,
            'height': h,
            'left': l,
            'top': t
        });

        obj.data("info", {
            'width': w,
            'height': h,
            'left': obj.offset().left,
            'top': obj.offset().top
        });
    });

    that._win.unbind('mouseup').bind('mouseup', function() {
        $(this).unbind('mousemove');
        obj.find('.mask').hide();
    });
};

/**
 * [windowZoom 窗口双击放大和缩小]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.windowZoom = function(obj) {
    var that = this;

    if (!obj.hasClass('active')) {
        that.activeWindow(obj);
        that.activeTask(obj.data('window'));
    }

    $revert = obj.find('.revert');
    if ($revert.is(':visible')) {
        that.revert(obj);
    } else {
        that.maximize(obj);
    }
};

/**
 * [taskContext 任务栏按钮右键菜单]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.taskContext = function(obj) {
    var that = this;

    var W = obj.outerWidth();
    var X = obj.offset().left;

    var $tpl = $('<div class="task-context"><div class="inner"><a href="javascript:;" class="close"><span class="icon"></span><span>关闭窗口</span></a></div></div>');
    var $close = $('.close', $tpl);

    $close.click(function(event) {
        /* Act on the event */
        that.close(obj.data('window'));
    });

    that._taskbar.append($tpl);

    var w = $tpl.width();
    var _left = X + (W - w) / 2;

    $tpl.css({
        'left': _left <= 0 ? 0 : _left + 'px',
        'bottom': '40px'
    });

    $tpl.show();
};

/**
 * [destroyTaskContext 销毁任务栏按钮右键菜单]
 * @return {[type]} [description]
 */
proto.destroyTaskContext = function() {
    var that = this;

    that._taskbar.find('.task-context').remove();
};

/**
 * [desktopContext 桌面右键菜单]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
proto.desktopContext = function(e) {
    var that = this;
    var W = that._desktop.width();
    var H = that._desktop.height();

    var x = e.pageX;
    var y = e.pageY;

    var $tpl = $('<div class="desktop-context"><div class="inner"><ul><li class="menu"><a href="javascript:" class="show-desktop">显示桌面</a></li><li class="menu"><a href="javascript:" class="close-all">关闭所有</a></li><li class="separate">&nbsp;</li><li class="menu"><a href="javascript:" class="refresh">刷 新</a></li></ul></div></div>');
    var $show_desktop = $('.show-desktop', $tpl);
    var $close_all = $('.close-all', $tpl);
    var $refresh = $('.refresh', $tpl);

    $show_desktop.click(function(event) {
        /* Act on the event */
        that._desktop.find('.window').each(function(index, ele) {
            var _this = $(this);
            that.minimize(_this);
        });
    });

    $close_all.click(function(event) {
        /* Act on the event */
        that._desktop.find('.window').each(function(index, ele) {
            var _this = $(this);
            that.close(_this);
        });
    });

    $refresh.click(function(event) {
        /* Act on the event */
        location.reload();
    });

    that._desktop.append($tpl);

    var w = $tpl.width();
    var h = $tpl.height();
    var left = x;
    var top = y;

    if (x + w > W) {
        left = x - w;
    }

    if (y + h > H) {
        top = y - h;
    }

    $tpl.css({
        'left': left + 'px',
        'top': top + 'px'
    });

    $tpl.show();
};

/**
 * [destroyDesktopContext 销毁桌面右键菜单]
 * @return {[type]} [description]
 */
proto.destroyDesktopContext = function() {
    var that = this;

    that._desktop.find('.desktop-context').remove();
};

/**
 * [shortcutContext 快捷方式右键菜单]
 * @param  {[type]} obj [description]
 * @param  {[type]} e   [description]
 * @return {[type]}     [description]
 */
proto.shortcutContext = function(obj, e) {
    var that = this;

    var W = that._desktop.width();
    var H = that._desktop.height();

    var x = e.pageX;
    var y = e.pageY;

    $tpl = $('<div class="shortcut-context"><div class="inner"><ul><li class="menu"><a href="javascript:;" class="open"><b>打 开</b></a></li></ul></div></div>');
    $open = $('.open', $tpl);

    $open.click(function(event) {
        /* Act on the event */
        that.open(obj);
    });

    that._desktop.append($tpl);

    var w = $tpl.width();
    var h = $tpl.height();
    var left = x;
    var top = y;

    if (x + w > W) {
        left = x - w;
    }

    if (y + h > H) {
        top = y - h;
    }

    $tpl.css({
        'left': left + 'px',
        'top': top + 'px'
    });

    $tpl.show();
};

/**
 * [destroyShortcutContext 销毁快捷方式右键菜单]
 * @return {[type]} [description]
 */
proto.destroyShortcutContext = function() {
    var that = this;

    that._desktop.find('.shortcut-context').remove();
};

/**
 * [titlebarContext 窗口标题栏右键菜单]
 * @param  {[type]} obj [description]
 * @param  {[type]} e   [description]
 * @return {[type]}     [description]
 */
proto.titlebarContext = function(obj, e) {
    var that = this;

    var W = that._desktop.width();
    var H = that._desktop.height();

    var x = e.pageX;
    var y = e.pageY;

    $tpl = $('<div class="titlebar-context"><div class="inner"><ul><li class="menu revert-menu"><a href="javascript:;" class="revert">还 原</a></li><li class="menu"><a href="javascript:;" class="minimize">最小化</a></li><li class="menu max-menu"><a href="javascript:;" class="maximize">最大化</a></li><li class="separate">&nbsp;</li><li class="menu"><a href="javascript:" class="close">关 闭</a></li></ul></div></div>');

    $revert_menu = $('.revert-menu', $tpl);
    $max_menu = $('.max-menu', $tpl);
    $revert = $('.revert', $tpl);
    $minimize = $('.minimize', $tpl);
    $maximize = $('.maximize', $tpl);
    $close = $('.close', $tpl);

    if (obj.find('.revert').is(':visible')) {
        $revert_menu.show();
        $max_menu.hide();
    } else {
        $max_menu.show();
        $revert_menu.hide();
    }

    $revert.click(function(event) {
        /* Act on the event */
        that.revert(obj);
    });

    $minimize.click(function(event) {
        /* Act on the event */
        that.minimize(obj);
    });

    $maximize.click(function(event) {
        /* Act on the event */
        that.maximize(obj);
    });

    $close.click(function(event) {
        /* Act on the event */
        that.close(obj);
    });

    that._desktop.append($tpl);

    var w = $tpl.width();
    var h = $tpl.height();
    var left = x;
    var top = y;

    if (x + w > W) {
        left = x - w;
    }

    if (y + h > H) {
        top = y - h;
    }

    $tpl.css({
        'left': left + 'px',
        'top': top + 'px'
    });

    $tpl.show();
};

/**
 * [destroyTitlebarContext 销毁窗口标题栏右键菜单]
 * @return {[type]} [description]
 */
proto.destroyTitlebarContext = function() {
    var that = this;

    that._desktop.find('.titlebar-context').remove();
};