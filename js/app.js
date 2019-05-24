var hashMap = function () {
    var size = 0;
    var entry = {};
    this.put = function (key , value){
        if(!this.containsKey(key)){size ++ ;}
        entry[key] = value;
    };
    this.get = function (key){
        return this.containsKey(key) ? entry[key] : null;
    };
    this.remove = function(key){
        if( this.containsKey(key)&&(delete entry[key])){size --;}
    };
    this.containsKey = function(key){
        return (key in entry);
    };
    this.getKey = function(){
        var data = [];
        for(var prop in entry){
            if(entry.hasOwnProperty(prop)){
                data.push(prop);
            }
        }
        return data;
    };
    this.getdata = function(){
        var data = [];
        for(var prop in entry){
            if(entry.hasOwnProperty(prop)){
                data.push(entry[prop]);
            }
        }
        return data;
    };
    this.containsValue = function (value){
        for(var prop in entry){
            if(entry.hasOwnProperty(prop)){
                if(entry[prop] === value){return true;}
            }
        }
        return false;
    };
    this.size = function (){
        return size;
    };
    this.clear = function (){
        size = 0;
        entry = {};
    };
};
var App = function () {
    var self = this;
    self.view = null;
    self.formula = [];
    self.formulaMap = null;
    self.material = [];
    self.materialMap = [];
    self.debug = true;
    self.selectFormula = null;
    self.formulaList = null;
    self.init = function () {
        var view;
        //初始化页面结构
        self.view = mui('#app').view({
            defaultPage: '#index'
        });
        //初始化单页的区域滚动
        mui('.mui-scroll-wrapper').scroll();
        view = self.view.view;
        (function($) {
            //处理view的后退与webview后退
            var oldBack = $.back;
            $.back = function() {
                if (self.view.canBack()) {
                    //如果view可以后退，则执行view的后退
                    self.view.back();
                } else {
                    //执行webview后退
                    oldBack();
                }
            };
            //监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
            //第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
            view.addEventListener('pageBeforeShow', function(e) {
                //				console.log(e.detail.page.id + ' beforeShow');
            });
            view.addEventListener('pageShow', function(e) {
                //				console.log(e.detail.page.id + ' show');
            });
            view.addEventListener('pageBeforeBack', function(e) {
                //				console.log(e.detail.page.id + ' beforeBack');
            });
            view.addEventListener('pageBack', function(e) {
                //				console.log(e.detail.page.id + ' back');
            });
        })(mui);
        //初始化数据结构
        self.initMaterial();

        self.initFormula();

        self.bind();
    };

    self.bind = function(){
        mui('#index').on('tap','.openFormula',function () {
            self.view.go('#formula');
            self.formulaList.caleLayout();
        });
        self.formulaSelect();
    };

    self.log = function(log,index){
        if(self.debug !== true){
            return false;
        }
        if(typeof(index) !== 'undefined'){
            console && console.log(log,index);
        }else{
            console && console.log(log);
        }
        return true;
    };

    self.initMaterial = function(){
        var item = null;
        var first = null;
        if(typeof(window.material) !== 'undefined'){
            self.material = window.material;
            //初始化所有素材到表中
            self.materialMap = new hashMap();
            self.formulaMap = new hashMap();
            for(var i = 0;i<self.material.length;i ++){
                item = self.material[i];
                self.materialMap.put(item.key,item);
                if(item && item.hasOwnProperty('type') && item.type === 2){
                    //生成首字母KEY
                    first = item.key.substring(0,1);
                    item['first'] = first.toLocaleUpperCase();
                    self.formula.push(item);
                    self.formulaMap.put(item.key,item);
                }
            }
        }else{
            self.log('material null!');
        }
    };

    self.initFormula = function () {
        var item = null;
        var html  = [];
        var prev_index = null;
        var $formulaBody = null;
        self.log('formula size :' + self.formula.length);
        //组装Dom
        html.push('<div id="formulaList" class="mui-indexed-list">');
        html.push('<div class="mui-indexed-list-search mui-input-row mui-search">');
        html.push('<input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索机场">');
        html.push('</div>');
        html.push('<div class="mui-indexed-list-bar">');
        //生成索引结构
        for(i=0;i<26;i++) {
            html.push('<a>'+String.fromCharCode(65 + i)+'</a>');
        }
        html.push('</div>');
        html.push('<div class="mui-indexed-list-alert"></div>');
        html.push('<div class="mui-indexed-list-inner">');
        html.push('<div class="mui-indexed-list-empty-alert">没有数据</div>');
        html.push('<ul class="mui-table-view" id="formulaUl">');
        //生成固定的DOM结构
        for(i=0;i<self.formula.length;i++){
            item = self.formula[i];
            if(prev_index !== item.first){
                html.push('<li data-group="'+item.first+'" class="mui-table-view-divider mui-indexed-list-group">'+item.first+'</li>');
            }
            html.push('<li data-value="'+item.key+'" class="mui-table-view-cell mui-indexed-list-item">'+item.name+'</li>');
        }
        html.push('</ul>');
        html.push('</div>');
        html.push('</div>');

        $formulaBody = mui('.formulaBody')[0];
        $formulaBody.innerHTML = html.join('');

        var list = document.getElementById('formulaList');

        self.formulaList = new mui.IndexedList(list);
    };

    self.formulaSelect = function () {
        mui('#formulaUl').on('tap', '.mui-indexed-list-item', function(e) {
            var $item = mui(this)[0];
            self.selectFormula = $item.dataset.value;
            self.view.back();
            self.formulaControl();
        });
    };

    self.formulaControl = function () {
        var $el = mui('.formula-detail');
        var html = null;
        if(self.selectFormula !== null){
            html = self.getFormulaDom(self.selectFormula);
            if(html){
                $el[0].innerHTML = html;
            }
        }
    };

    self.getFormulaDom = function (key,level) {
        var detail;
        var html = [];
        var width;
        var material = [];
        var item = null;
        var temp = null;
        var winWidth = document.body.offsetWidth;
        detail = self.formulaMap.get(key);
        if(!detail){
            return '';
        }
        if(typeof(level) === 'undefined'){
            html.push('<div class="formula-title"><span>'+detail.name+'</span></div>');
        }
        html.push('<ul class="formula-material">');
        for(var m in detail.material){
            if(detail.material.hasOwnProperty(m)){
                material.push(m);
            }
        }
        if(material.length === 0){
            return '';
        }
        width = (winWidth - 8 - ((material.length - 1) * 15)) / material.length;
        console.log(winWidth);

        for(m in detail.material){
            temp = '';
            if(detail.material.hasOwnProperty(m)){
                item = self.materialMap.get(m);
                temp = '<li style="width:'+width+'px;"><span>'+item.name+'&times;'+detail['material'][m]+'</span>';
                if(item.hasOwnProperty('type') && item.type === 2){
                    temp += self.getFormulaDom(item.key,1);
                }
                temp += '</li>';
                html.push(temp);
            }
        }
        html.push('</ul>');
        return html.join('');
    }
};
