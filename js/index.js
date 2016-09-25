/**
 * Created by yangjing on 2016/9/24.
 */
$(function () {
    var json = [
        {
            "name": "国家安全罪",
            "list": [
                {
                    "name": "放火罪",
                    "url": "#a1"
                },
                {
                    "name": "国家安全罪",
                    "list": [
                        {
                            "name": "国家安全罪",
                            "list":[{
                                "name": "国家安全罪",
                                "list":[{
                                    "name": "国家安全罪",
                                    "list":[{
                                        "name": "国家安全罪",
                                        "list":[{
                                            "name":"和平罪",
                                            "list":[{
                                                "name": "国家安全罪",
                                                "list":[{
                                                    "name": "国家安全罪",
                                                    "list":[{
                                                        "name": "国家安全罪",
                                                        "list":[{
                                                            "name": "国家安全罪",
                                                            "list":[{
                                                                "name":"和平罪",
                                                                "url":"adsfasdf"

                                                            }]
                                                        }]
                                                    }]
                                                }]
                                            }]

                                        }]
                                    }]
                                }]
                            }]
                        },
                        {
                            "name": "国家安全罪",
                            "url":""
                        },
                        {
                            "name": "国家安全罪",
                            "list":[
                                {
                                    "name": "国家安全罪",
                                    "list":[{
                                        "name": "国家安全罪",
                                        "list":[{
                                            "name": "国家安全罪",
                                            "list":[{
                                                "name": "国家安全罪",
                                                "list":[{
                                                    "name":"和平罪",
                                                    "url":"adsfasdf"

                                                }]
                                            }]
                                        }]
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "国家安全罪",
            "list": [
                {
                    "name": "放火罪",
                    "url": "#a1"
                },
                {
                    "name": "国家安全罪",
                    "list": [
                        {
                            "name": "国家安全罪",
                            "url": "#a11"
                        },
                        {
                            "name": "国家安全罪",
                            "url":""
                        },
                        {
                            "name": "国家安全罪",
                            "url": "#a13"
                        }
                    ]
                }
            ]
        },
        {
            "name": "国家安全罪",
            "list": [
                {
                    "name": "放火罪",
                    "url": "#a1"
                },
                {
                    "name": "国家安全罪",
                    "list": [
                        {
                            "name": "国家安全罪",
                            "url": "#a11"
                        },
                        {
                            "name": "国家安全罪",
                            "url":""
                        },
                        {
                            "name": "国家安全罪",
                            "url": "#a13"
                        }
                    ]
                }
            ]
        }
    ]

    var str = "<ul>";
    var forTree = function(o){
        for(var i=0;i<o.length;i++){
            var urlstr;
            try{
                if(typeof o[i]["url"] == "undefined"){
                    urlstr = "<li><a>"+ o[i]["name"] +"</a><ul>";
                    str += urlstr;
                    if(o[i]["list"] != null){
                        forTree(o[i]["list"]);
                    }
                    str += "</ul>"
                }else{
                    urlstr = "<li><a href="+ o[i]["url"] +">"+ o[i]["name"] +"</a>";
                    str += urlstr;
                }
                str += "</li>";
            }catch(e){}
        }
        return str+"</ul>";
    }

    document.getElementById("ayTree").innerHTML = forTree(json);
    $("#ayTree > ul").addClass("navigation")

    $(".navigation").treeview({
        persist: "location",
        collapsed: true,
        unique: true
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
        var liStr = "<li><a class='fd-name'>"+$(this).text()+"</a><a class='fd-remove'></a></li>";
        $(".fd-data-list").append(liStr);
        scroll02.scrollBar.update(20,0);
    });
    //改选择了的案由绑定点击事件
    $(document).on("click",".fd-data-list li",function(e){
        e = e || window.event;
        if(e.target==this){
            //请求最右侧数据
            alert("请求最右侧数据");
        }

    });
    //改选择了的案由列表的删除按钮绑定点击事件
    $(document).on("click",".fd-remove",function(e){
        e = e || window.event;
        if(e.target==this){
            $(this).parent().remove();
        }
    });
    //给复选框绑定点击事件
    $(document).on('change', 'input:checkbox', function() {
        var _this = $(this);
        if(_this.is(':checked')) {
            var newa = "<a>"+_this.parent().find(".js-label").text()+"</a>";
            $(".fd-title> span").append(newa);
        } else {

        }
    });
});
