/**
 * Created by yangjing on 2016/9/24.
 */
$(function () {
    var json = [
        {
            "name": "国家安全罪",
            "aybh":"fgsdfghdf",
            "sublist": [
                {
                    "name": "放火罪",
                    "aybh": "#a1",
                    "sublist":[]
                },
                {
                    "name": "失火罪",
                    "aybh": "#a1",
                    "sublist": [
                        {
                            "name": "公共危害罪",
                            "aybh": "#a1",
                            "sublist":[]
                        },
                        {
                            "name": "独立罪",
                            "aybh": "#a1",
                            "sublist":[]
                        }
                    ]
                }
            ]
        }
    ]
    //添加树的样式和折叠展开控制
    $("#ayTree> ul").addClass("navigation")
    $(".navigation").treeview({
        persist: "location",
        collapsed: false,
        unique: true
    });
    //查找案由,给输入框绑定回车事件
    $(document).on("keypress",function(event){
        if(event.keyCode == '13'){
            var ayText = $("#ayText").val();
            var alist = $("#ayTree").find("a");
            $(alist).each(function(index,i){
                if($(i).html().indexOf(ayText)>=0){
                    $(i).parents("ul").show();
                    var foldNode =  $(i).closest("li").parents("li");
                    foldNode.removeClass("expandable");
                    foldNode.find("div").first().removeClass("expandable-hitarea ");
                    if(foldNode.hasClass("lastExpandable")){
                        foldNode.removeClass("lastExpandable")
                        foldNode.addClass("lastCollapsable")
                        foldNode.find("div").first().removeClass("lastExpandable-hitarea");
                        foldNode.find("div").first().addClass("lastCollapsable-hitarea");
                    }
                    foldNode.addClass("collapsable");
                    $(i).addClass("selected");
                    setTimeout(function(){
                        $(i).removeClass("selected");
                    },500)
                    //$("#scroll01").prop('scrollTop','2000px');

                }
            });
        }
    });
    $(".fd-data-list").sortable({
        cursor: "move",
        item: "li",
        axis: 'y',
        opacity: 0.8, //拖动时，透明度为0.6
        revert: true, //释放时，增加动画
        update: function(event, ui){
            var categoryids = $(this).sortable("toArray");
            var $this = $(this);
        }
    });
    //添加滚动条
    var scroll01 = $('#scroll01').addScrollBar();
    var scroll02 = $('#scroll02').addScrollBar();
    $(document).on("click",".hitarea",function(){
        scroll01.scrollBar.update(20,0);
    });
    //给树绑定双击事件
    $(document).on("dblclick",".treeview a",function(){
        if($(this).parent().find("ul").length == 0){
            var liStr = "<li><a class='fd-name'>"+$(this).text()+"</a><a class='fd-remove'></a></li>";
            $(".fd-data-list").append(liStr);
            scroll02.scrollBar.update(20,0);
        }

    });
    //改选择了的案由绑定点击事件
    $(document).on("click",".fd-data-list li",function(e){
        e = e || window.event;
        e.stopPropagation();


    });
    //改选择了的案由列表的删除按钮绑定点击事件
    $(document).on("click",".fd-remove",function(e){
        e = e || window.event;
        e.stopPropagation()
        $(this).parent().remove();

    });
    //给复选框绑定点击事件
    $(document).on('change', 'input:checkbox', function() {
        var _this = $(this);
        if(_this.is(':checked')) {
            var newa = $("<a></a>");
            newa.html(_this.parent().find(".js-label").text());
            newa.addClass(_this.prop('id'));
            //var newa = "<a>"+_this.parent().find(".js-label").text()+"</a>";
            $(".fd-title span:first-child").append(newa);
        } else {
            $(".fd-title span:first-child").find("."+_this.prop('id')).remove();
        }

        //每次点击复选框需要去判断罪名是否为空，为空的时候显示“当前罪名”
        var aArry = $(".fd-title> span").find("a");
        if(aArry.length == 0){
            $(".fd-title span:last-child").html("当前罪名");
        }else {
            $(".fd-title span:last-child").html("罪");
        }

    });
    //给清空按钮绑定点击事件
    $(document).on("click",".fd-a-delete",function(){
        $(".fd-data-list").find("li").remove();
    });
    //生成最右侧的复选框相关数据
    function createZm() {
        //ajax获取json串
        //返回之后的回调函数
        var result = '[{"title": "第一节","zmlist":[{ "name": "窃取" }]}]';
        var data = JSON.parse(result);
        $.each(data,function(index,i){
            var newLi = $("#zmLi").clone();
            newLi.find("h6").html(i.title);
            $.each(i.zmlist,function(j,subItem){
                var newSpan = $("#zmSpan").clone();
                var inputId = "checkboxR"+index+j;
                newSpan.find("input").attr("id",inputId);
                newSpan.find(".fd-checkbox-label").attr("for",inputId);
                newSpan.find(".js-label").html(subItem.name);
                newLi.append(newSpan);
            });
            newLi.show();
            $(".fd-ul-data").append(newLi);
        });
    }
});
