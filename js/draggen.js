/**
 * @file
 * @author xieyq on 2016/8/8.
 * @version 1.0.0
 */

/*
* 表格部分内容的拖拽事件
* @param dragClassName 对应要创建拖拽对象的类名
* @param callback 鼠标放开有目标的回调函数
* */
function tableDrag(dragClassName, callback) {
    //非串案表格的td事件
    $('.js-tab-con-fcha-t').on('mousedown',  'tbody>tr', function(e) {
        var _trEle = $(this);
        var _dragEle = createDrag(dragClassName, bindDragEvent, callback); //创建拖拽对象

        var _tableEle = _dragEle.find('table');
        if(_tableEle.length == 0) { //拖拽元素中需要一个放置是tr元素时需要创建一个table元素
            _tableEle = $('<table class="' + _trEle.closest('table').attr('class') + '"></table>');
            _dragEle.append(_tableEle);
        }
        _tableEle.html(_trEle.html());  //设置拖拽元素的table内容

        var _offset = _trEle.offset();
        _dragEle.css({
            width: _trEle.width(),
            left: _offset.left,
            top: _offset.top
        });
        _trEle.find('td').each(function(tIndex, tdE) {  //给拖拽元素中的每个td设置宽度，与拖拽行一致
            _dragEle.find('td:eq(' + tIndex + ')').width($(tdE).width());
        });
        _dragEle.data('move', true);    //设置拖拽元素是否可以移动的属性为true
        _dragEle.data('startX', e.pageX - _offset.left);    //设置拖拽元素的X轴开始位置
        _dragEle.data('startY', e.pageY - _offset.top);    //设置拖拽元素的开始Y轴位置

        _trEle.addClass('drag');    //给拖拽行添加drag属性
        _dragEle.show();    //显示拖拽元素
    });
}

/*
* 左侧列表的拖拽事件
 * @param dragClassName 对应要创建拖拽对象的类名
 * @param callback 鼠标放开有目标的回调函数
* */
function listDrag(dragClassName, callback) {
    $('.js-cha-list').on('mousedown',  '.fd-cha-item-h>h3>span', function(e) {
        var _this = $(this);
        var _parentItem = _this.closest('li');
        var _offset = _parentItem.offset();

        var _dragEle = createDrag(dragClassName, bindListDragEvent, callback); //创建拖拽对象

        _dragEle.html(_parentItem.html()).css({
            width: _parentItem.width(),
            left: _offset.left,
            top: _offset.top
        });

        _dragEle.data('move', true);
        _dragEle.data('startX', e.pageX - _offset.left);
        _dragEle.data('startY', e.pageY - _offset.top);
        _parentItem.children(0).addClass('drag');   //给被拖拽元素添加drag属性
        _dragEle.show();
    });
}

/*
* 元素的拖拽事件
 * @param dragClassName 对应要创建拖拽对象的类名
 * @param callback 鼠标放开有目标的回调函数
* */
function itemDrag(dragClassName, callback) {
    $('.fd-cha-item-list').on('mousedown',  'li', function(e) {
        var _this = $(this);
        e.stopPropagation();
        var _offset = _this.offset();
        var _dragEle = createDrag(dragClassName, bindItemDrag, callback);   //创建拖拽对象

        _dragEle.html(_this.html()).css({
            width: _this.width(),
            left: _offset.left,
            top: _offset.top
        });
        _dragEle.data('move', true);
        _dragEle.data('startX', e.pageX - _offset.left);
        _dragEle.data('startY', e.pageY - _offset.top);
        _dragEle.show();
        _this.addClass('drag');
    });
}

/*
 * 绑定拖拽元素的拖拽事件
 * @param dragEle 拖拽元素
 * @param callback 鼠标放开有目标的回调函数
 * */
function bindDragEvent(dragEle, callback) {
    var events = dragEle.data("events");
    mouseDown(dragEle); //拖拽对象的鼠标按下事件
    dragEle.mousemove(function(e) {
        e = e || window.event;
        var _this = $(this);
        if(!_this.data('move')) {   //如果拖拽对象的move为false，则终止事件
            return;
        }
        var _dragInfo = getDragInfo(_this, e);  //获取信息
        setDragPosition(_this, _dragInfo);  //设置位置

        var flag = false;
        $('.fd-cha-tab-con.show .fd-cha-item-wrap').each(function() {
            var _itemThis = $(this);
            //判断是否跟正在显示的tab内容中的信息项有重叠
            if(getItemInfo(_itemThis, _dragInfo.left, _dragInfo.top, _dragInfo.width, _dragInfo.height)) {
                $('.fd-cha-tab-con.show .fd-cha-item-wrap.active').removeClass('active');   //将对应的有active类名的串案信息项去掉对应的active状态
                _itemThis.addClass('active');
                flag = true;
                return false;
            }
        });
        if(!flag) {
            $('.js-cha-list .fd-cha-item-wrap').removeClass('active');
        }
    }).mouseup(function(){
        var _this = $(this);
        _this.data('move', false);
        var _drag = $('.js-tab-con-fcha-t tr.drag');
        var _selectedItem = $('.fd-cha-tab-con.show .fd-cha-item-wrap.active');
        _this.hide();
        if(_selectedItem.length > 0) {
            _selectedItem.find('.fd-cha-item-list').prepend($('<li><div class="fd-cha-item-child">我是新加进来的案号</div></li>'));
            if(!_selectedItem.hasClass('open')) {
                _selectedItem.addClass('open');
            }
            callback(_selectedItem, _drag);
            _drag.remove();
        } else {
            _drag.removeClass('drag');
        }
    });
}

/*
 * 列表拖拽事件
 * @param dragEle 拖拽元素
 * @param callback 鼠标放开有目标的回调函数
 * */
function bindListDragEvent(dragEle, callback) {
    mouseDown(dragEle); //拖拽对象的鼠标按下事件
    leftItemMousemove(dragEle); //鼠标移动事件
    dragEle.mouseup(function(){
        var _this = $(this);
        _this.data('move', false);
        var _drag = $('.fd-cha-tab-con.show .fd-cha-item-wrap.drag');
        var _selectedItem = $('.fd-cha-tab-con.show .fd-cha-item-wrap.active');
        var _tableHint = $('.js-drag-hint');
        _this.hide();
        /*
         * 如果有目标所触发的操作
         * */
        function hasTargetEvent() {
            callback(_selectedItem, _drag);
            var _parentUl = _drag.closest('.fd-ysca-list');
            _drag.parent().remove();
            if(_parentUl.find('.fd-ysca-info').length <= 1) {  //如果长度为1的话就加上合并类名
                _parentUl.closest('.fd-ysca-list-wrap').addClass('merge');
            }
        }
        if(_selectedItem.length > 0) {
            _selectedItem.find('.fd-cha-item-list').prepend($('<li><div class="fd-cha-item-child">我是新加进来的案号</div></li>'));
            if(!_selectedItem.hasClass('open')) {
                _selectedItem.addClass('open');
            }
            hasTargetEvent();
            return;
        }
        if(_tableHint.is(':visible')) { //如果拖拽到表格的提示框没有隐藏的话 则表示拖入到表格中了
            alert('表格有数据插入');
            _tableHint.hide();
            hasTargetEvent();
            return;
        }
        _drag.removeClass('drag');   //如果都不存在，则删掉对应信息项上面的drag类名
    });
}
/*
* 绑定list中item的拖拽事件
 * @param dragEle 拖拽元素
 * @param callback 鼠标放开有目标的回调函数
* */
function bindItemDrag(dragEle, callback) {
    mouseDown(dragEle); //拖拽对象的鼠标按下事件
    leftItemMousemove(dragEle); //鼠标移动事件
    dragEle.mouseup(function(){
        var _this = $(this);
        var _drag = $('.fd-cha-item-list li.drag');
        _this.data('move', false);
        var _selectedItem = $('.fd-cha-tab-con.show .fd-cha-item-wrap.active');
        var _tableHint = $('.js-drag-hint');
        _this.hide();
        if(_selectedItem.length > 0) {
            _selectedItem.find('.fd-cha-item-list').prepend($('<li><div class="fd-cha-item-child">我是新加进来的案号</div></li>'));
            if(!_selectedItem.hasClass('open')) {
                _selectedItem.addClass('open');
            }
            callback(_selectedItem, _drag);
            _drag.remove();
            return;
        }
        if(_tableHint.is(':visible')) { //如果拖拽到表格的提示框没有隐藏的话 则表示拖入到表格中了
            alert('表格有数据插入');
            _tableHint.hide();
            callback(_selectedItem, _drag);
            _drag.remove();
            return;
        }
        _drag.removeClass('drag');   //如果都不存在，则删掉对应信息项上面的drag类名
    });
}

/*
 * 拖拽元素鼠标按下的事件
 * @param dragEle 拖拽元素
 * */
function mouseDown(dragEle) {
    dragEle.mousedown(function() {
        $(this).data('move', true);
    });
}
/*
* 左侧串案和疑似串案中的信息项的拖拽对应的鼠标移动事件
* @param dragEle 拖拽对象
* @param e 鼠标的移动事件
* */
function leftItemMousemove(dragEle) {
    dragEle.mousemove(function(e) {
        e = e || window.event;
        var _this = $(this);
        if(!_this.data('move')) {   //如果拖拽对象的move为false，则终止事件
            return;
        }
        var _dragInfo = getDragInfo(_this, e);  //获取信息
        setDragPosition(_this, _dragInfo);  //设置位置

        //是否有目标
        var flag = false;
        $('.fd-cha-tab-con.show .fd-cha-item-wrap:not(.drag)').each(function() {
            var _itemThis = $(this);
            //判断是否跟正在显示的tab内容中的信息项有重叠
            if(getItemInfo(_itemThis, _dragInfo.left, _dragInfo.top, _dragInfo.width, _dragInfo.height)) {
                $('.fd-cha-tab-con.show .fd-cha-item-wrap.active').removeClass('active');   //将对应的有active类名的串案信息项去掉对应的active状态
                _itemThis.addClass('active');
                flag = true;
                $('.js-drag-hint').hide();  //隐藏拖拽到表格时候的提示
                return false;   //如果有重叠则跳出each循环
            }
        });
        if(flag) {
            return;
        }
        $('.js-cha-list .fd-cha-item-wrap').removeClass('active');  //如果跟左侧的串案列表都没有交集的话，则去掉所有active

        //判断拖拽元素是否在表格元素中
        if(getItemInfo($('.js-tab-con-fcha-t'), _dragInfo.left, _dragInfo.top, _dragInfo.width, _dragInfo.height)) {
            $('.js-drag-hint').show();  //展现拖拽到表格时候的提示
            flag = true;
            return;
        }
        $('.js-drag-hint').hide();  //如果都没有重叠则隐藏拖拽到表格时候的提示
    });
}

/*
 * 设置拖拽对象的位置
 * @param dragEle 拖拽对象
 * @param info 对应的信息
 * */
function setDragPosition(dragEle, info) {
    dragEle.css({
        top: info.top,
        left: info.left
    });//控件新位置
}
/*
 * 获取拖拽对象的信息
 * @param dragEle 拖拽对象
 * @param e 对应的鼠标事件对象
 * return 拖拽对象当前的坐标和宽高
 * */
function getDragInfo(dragEle, e) {
    return {
        left: e.pageX - dragEle.data('startX'), //移动时根据鼠标位置计算控件x轴的位置
        top: e.pageY - dragEle.data('startY'),  //移动时根据鼠标位置计算控件y轴的位置
        width: dragEle.width(),  //对象的宽度
        height: dragEle.height()  //对象的高度
    };
}

/*
* 创建拖拽对象
* @param dragClassName 拖拽对象的类名
* */
function createDrag(dragClassName, callback, updateScrollBar) {
    if($('.' + dragClassName).length > 0) {     //如果拖拽元素存在则返回对应的拖拽对象
        return $('.' + dragClassName);
    }
    var dragEle = $('<div class="' + dragClassName + '"></div>');   //不存在则创建对应的拖拽对象
    $('body').append(dragEle);
    callback(dragEle, updateScrollBar);
    return dragEle;
}

/*
* 获取元素和拖拽元素是否重叠
* @param itemEle 元素
* @param dragX 拖拽元素的x轴坐标
* @param dragY 拖拽元素的y轴坐标
* @param dragW 拖拽元素的宽度
* @param dragH 拖拽元素的高度
* return 是否重叠
* */
function getItemInfo(itemEle, dragX, dragY, dragW, dragH) {
    //判断元素的信息
    var _itemX = itemEle.offset().left;
    var _itemY = itemEle.offset().top;
    var _itemW = itemEle.width();
    var _itemH = itemEle.height();

    //判断x坐标是否有重合，需考虑元素宽度
    var xmerge = judgemerge(_itemX, (_itemX + _itemW), dragX, dragX + dragX + dragW);
    //判断y坐标是否有重合，需考虑元素高度
    var ymerge = judgemerge(_itemY, (_itemY + _itemH), dragY, dragY + dragH);

    return xmerge && ymerge;
}

/*
 * 判断交集，传入两个元素的某个坐标的最小值和最大值，判断是否有重叠部分
 * @param target_min 目标元素的最小值
 * @param target_max 目标元素的最大值
 * @param c_min 拖动元素的最小值
 * @param c_max 拖动元素的最大值
 * */
function judgemerge(target_min, target_max, c_min, c_max) {
    if (c_min > target_min && c_min < target_max) {//最小值是否在目标元素坐标范围内
        return true;
    } else if (c_max > target_min && c_max < target_max) {//最大值是否在目标元素坐标范围内
        return true;
    } else if (c_min < target_min && c_min < target_max && c_max > target_min && c_max > target_max) {
        //当前元素坐标范围是否包含目标元素坐标范围
        return true;
    } else {
        return false;
    }
}