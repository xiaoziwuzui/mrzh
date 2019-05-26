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
    self.priceMap = null;
    self.userData = null;
    self.debug = true;
    self.selectFormula = null;
    self.formulaList = null;
    self.materialList = null;
    self.currentJob = 2;
    self.init = function () {
        var view;
        //初始化页面结构
        self.view = mui('#app').view({
            defaultPage: '#index'
        });
        //初始化单页的区域滚动
        // mui('.mui-scroll-wrapper').scroll();
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
        self.priceMap = new hashMap();
        self.materialMap = new hashMap();
        self.formulaMap = new hashMap();
        self.userData = new hashMap();
        self.initUserData();
        self.initMaterial();

        self.initFormula();
        self.initMaterialDom();

        self.bind();
    };

    self.bind = function(){
        mui('#index').on('tap','.openFormula',function () {
            self.view.go('#formula');
            self.formulaList.caleLayout();
        }).on('tap','.settingMaterial',function () {
            self.view.go('#material');
            self.materialList.caleLayout();
        });
        mui('#app').on('tap','.openSetting',function () {
            self.view.go('#setting');
        });
        self.formulaSelect();
        self.materialSelect();
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
            for(var i = 0;i<self.material.length;i ++){
                item = self.material[i];
                //生成首字母KEY
                first = item.key.substring(0,1);
                item['first'] = first.toLocaleUpperCase();
                self.materialMap.put(item.key,item);
                if(item && item.hasOwnProperty('type') && item.type === 2){
                    self.formula.push(item);
                    self.formulaMap.put(item.key,item);
                }
            }
        }else{
            self.log('material null!');
        }
    };

    self.initUserData = function(){
        var local = null,key;
        self.userData = new hashMap();
        self.priceMap = new hashMap();
        //从本地读取存储的库存数据
        local = localStorage.getItem('uData');
        if(local){
            local = JSON.parse(local);
            if(local){
                for(key in local){
                    if(local.hasOwnProperty(key)){
                        self.userData.put(key,local[key]);
                    }
                }
            }
        }
        //从本地读取存储的库存数据
        local = localStorage.getItem('uPrice');
        if(!local){
            //基本物价
            local = '{"mt":1211,"st":1211,"m":0,"zwgj":18,"b":84,"xs":77,"sz":17,"mgj":18,"mjp":23,"cbt":50,"sl":393,"gjnlhx":18000,"gg":421,"pg":567,"sya":27,"bmml":625,"wb":70,"sm":27,"frx":1917,"ylhj":339,"shyk":88,"lxm":43,"yk":27,"gj":285,"gjjgkj":30000,"xk":15,"lbm":9,"ymy":12,"bsy":19,"lk":13,"tk":12,"hym":11,"jmy":32,"gfz":2800,"sy":19,"ymhb":27,"th":1209,"nlb":196,"dz":63,"jd":104,"hmp":300,"hmye":14,"yjp":11,"qy":63,"maox":300,"zhz":68}';
            localStorage.setItem('uPrice',local);
        }
        local = JSON.parse(local);
        if(local){
            for(key in local){
                if(local.hasOwnProperty(key)){
                    self.priceMap.put(key,local[key]);
                }
            }
        }
    };

    self.getUserMaterial = function(key){
       var item = self.userData.get(key);
       if(!item){
           return 0;
       }else{
           return item;
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
        html.push('<input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索配方">');
        html.push('</div>');
        html.push('<div class="mui-indexed-list-bar">');

        //索引分组
        var group = {};
        for (var j=0;j<self.formula.length;j++){
            item = self.formula[j];
            if(group[item.first]){
                group[item.first].push(item.key);
            }else{
                group[item.first] = [item.key];
            }
        }
        //索引排序
        var groupSort = [];
        for(var k in group){
            if(group.hasOwnProperty(k)){
                groupSort.push(k);
            }
        }
        groupSort.sort();
        //生成索引结构
        for(var b = 0;b<groupSort.length;b++){
            html.push('<a>'+groupSort[b]+'</a>');
        }
        html.push('</div>');
        html.push('<div class="mui-indexed-list-alert"></div>');
        html.push('<div class="mui-indexed-list-inner">');
        html.push('<div class="mui-indexed-list-empty-alert">没有数据</div>');
        html.push('<ul class="mui-table-view" id="formulaUl">');

        for(b = 0;b<groupSort.length;b++){
            k = groupSort[b];
            if(group.hasOwnProperty(k)){
                html.push('<li data-group="'+k+'" class="mui-table-view-divider mui-indexed-list-group">'+k+'</li>');
                for(var l=0;l<group[k].length;l++){
                    item = self.formulaMap.get(group[k][l]);
                    html.push('<li data-value="'+item.key+'" class="mui-table-view-cell mui-indexed-list-item">'+item.name+'</li>');
                }
            }
        }

        html.push('</ul>');
        html.push('</div>');
        html.push('</div>');

        $formulaBody = mui('.formulaBody')[0];
        $formulaBody.innerHTML = html.join('');

        var list = document.getElementById('formulaList');

        self.formulaList = new mui.IndexedList(list);
    };

    self.initMaterialDom = function () {
        var item = null;
        var html  = [];
        var prev_index = null;
        var $materialBody = null;
        var material = self.materialMap.getKey();
        var total = 0;
        var price = 0;
        self.log('material size :' + self.material.length);
        //组装Dom
        html.push('<div id="materialList" class="mui-indexed-list">');
        html.push('<div class="mui-indexed-list-search mui-input-row mui-search">');
        html.push('<input type="search" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索材料">');
        html.push('</div>');
        html.push('<div class="mui-indexed-list-bar">');

        //索引分组
        var group = {};
        for (var j=0;j<self.material.length;j++){
            item = self.material[j];
            if(group[item.first]){
                group[item.first].push(item.key);
            }else{
                group[item.first] = [item.key];
            }
        }
        //索引排序
        var groupSort = [];
        for(var k in group){
            if(group.hasOwnProperty(k)){
                groupSort.push(k);
            }
        }
        groupSort.sort();
        //生成索引结构
        for(var b = 0;b<groupSort.length;b++){
            html.push('<a>'+groupSort[b]+'</a>');
        }

        html.push('</div>');
        html.push('<div class="mui-indexed-list-alert"></div>');
        html.push('<div class="mui-indexed-list-inner">');
        html.push('<div class="mui-indexed-list-empty-alert">没有数据</div>');
        html.push('<ul class="mui-table-view" id="formulaUl">');


        for(b = 0;b<groupSort.length;b++){
            k = groupSort[b];
            if(group.hasOwnProperty(k)){
                html.push('<li data-group="'+k+'" class="mui-table-view-divider mui-indexed-list-group">'+k+'</li>');
                for(var l=0;l<group[k].length;l++){
                    item = self.materialMap.get(group[k][l]);
                    total = parseInt(self.userData.get(group[k][l]));
                    price = parseInt(self.priceMap.get(group[k][l]));
                    if(isNaN(total) || !price) total = 0;
                    if(isNaN(price) || !price) price = 0;

                    html.push('<li data-value="'+item.key+'" class="mui-table-view-cell mui-indexed-list-item">'+item.name+'<small style="float: right;">库存:'+total+',单价:'+price+'</small></li>');
                }
            }
        }

        html.push('</ul>');
        html.push('</div>');
        html.push('</div>');

        $materialBody = mui('.materialBody')[0];
        $materialBody.innerHTML = html.join('');

        var list = document.getElementById('materialList');

        self.materialList = new mui.IndexedList(list);
    };

    self.formulaSelect = function () {
        mui('#formulaUl').on('tap', '.mui-indexed-list-item', function(e) {
            var $item = mui(this)[0];
            self.selectFormula = $item.dataset.value;
            self.view.back();
            self.formulaControl();
        });
    };

    self.materialSelect = function () {
        mui('#material').on('tap', '.mui-indexed-list-item', function(e) {
            var $item = mui(this)[0];
            mui.prompt('更新材料库存和单价',['库存','单价'],'设置',['保存','取消'],function (e) {
                var key = $item.dataset.value;
                var total = parseInt(e.value[0]);
                var price = parseInt(e.value[1]);
                var item = self.materialMap.get(key);
                var html = '';
                if(isNaN(total)) total = 0;
                if(isNaN(price)) price = 0;
                self.userData.put(key,total);
                self.priceMap.put(key,price);
                html = item.name + '<small style="float: right;">库存:'+total+',单价:'+price+'</small>';
                $item.innerHTML = html;
                //本地固化
                var u = {};
                var uk = self.userData.getKey();
                var p = {};
                var pk = self.priceMap.getKey();
                for(var i = 0;i<uk.length;i++){
                    u[uk[i]] = self.userData.get(uk[i]);
                }
                for(i = 0;i<pk.length;i++){
                    p[pk[i]] = self.priceMap.get(pk[i]);
                }
                localStorage.setItem('uData',JSON.stringify(u));
                localStorage.setItem('uPrice',JSON.stringify(p));
            },'div');
        });
    };

    self.formulaControl = function () {
        var $el = mui('.formula-detail');
        var html = null;
        if(self.selectFormula !== null){
            html = self.getFormulaDom(self.selectFormula);
            if(html){
                $el[0].innerHTML = html;
                //计算价格
                var price;
                var priceH = '';
                var item;
                var formula = self.getUPrice(self.selectFormula);
                var money = 0;
                price = self.calcPrice(self.selectFormula);
                for(var i=0;i<price.length;i++){
                    item = price[i];
                    money += item.money;
                    priceH += '<p>'+item.name+' &times; '+item.total+';缺 '+item.dec+'; 支出:'+item.dec +'&times;'+item.price + '=' +item.money+'</p>';
                }
                priceH = '<p>'+(formula > 0 ? '售价 : '+ formula + ' - 15% = '+(formula - formula * 0.15)+';收入:'+(formula-money) + ';' : '') + '成本 : ' + money+'</p>' + priceH;
                var $pel;
                $pel = mui('.formula-price');
                $pel[0].innerHTML = priceH;
            }
        }
    };

    self.getFormulaDom = function (key,top,level) {
        var detail;
        var html = '';
        var width;
        var material = [];
        var item = null;
        var temp = null;
        var userT = null;
        var left = 0;
        var winWidth = document.body.offsetWidth - 8;
        var i = 1;
        var j = 0;
        detail = self.formulaMap.get(key);
        if(!detail){
            return '';
        }
        if(typeof(top) === 'undefined'){
            top = 0;
        }
        if(typeof(level) === 'undefined'){
            level = 1;
            html += '<div class="formula-title"><span>'+detail.name+'</span></div>';
        }
        html += '<div class="formula-material">__BBB__<div class="formula-after"></div>';
        if(level > 1){
            html += '<div class="formula-control"></div>';
        }
        for(var m in detail.material){
            if(detail.material.hasOwnProperty(m)){
                material.push(m);
            }
        }
        if(material.length === 0){
            return '';
        }

        if(material.length === 2){
            j = (winWidth - (72 * material.length)) / material.length;
        }


        left = 0;
        top = (level - 1) * 20;
        var first = 0;
        var last = 0;
        var indexShow = false;
        var temp2 = '';
        for(m in detail.material){
            temp = '';
            userT = null;
            if(detail.material.hasOwnProperty(m)){
                item = self.materialMap.get(m);
                userT = self.userData.get(m);
                if(!item.level){
                    item.level = 1;
                }
                if(!userT){
                    userT = 0;
                }
                left = (i-1) * 72;
                if(i > 1){
                    left += j;
                }
                if(i === material.length){
                    html = html.replace('__BBB__','<div class="formula-before" style="left:36px;width:'+left+'px;"></div>');
                }

                temp = '<div class="material-item level-'+item.level+'" style="left:'+left+'px;top:0px"><span>'+item.name+'</span>';
                temp += '<p><input type="number" readonly value="'+userT+'" placeholder="" size="3" maxlength="3" autocomplete="off"/><i>/'+detail['material'][m]+'</i></p>';
                if(item.hasOwnProperty('type') && item.type === 2){
                    temp2 = self.getFormulaDom(item.key,top,level + 1);
                    if(indexShow === true){
                        temp2 = temp2.replace('<div class="formula-material">','<div class="formula-material close">');
                    }else{
                        indexShow = true;
                    }
                    temp += temp2;

                }
                temp += '</div>';
                html += temp;
                i++;
            }
        }

        html += '</div>';
        return html;
    };

    self.getUData = function(key){
        var item = self.userData.get(key);
        if(!item){
            return 0;
        }else{
            item = parseInt(item);
            if(isNaN(item)){
                return 0;
            }else{
                return item;
            }
        }
    };

    self.getUPrice = function(key){
        var item = self.priceMap.get(key);
        if(!item){
            return 100;
        }else{
            item = parseInt(item);
            if(isNaN(item)){
                return 100;
            }else{
                return item;
            }
        }
    };


    /**
     * 计算价格
     * @param key
     * @param total
     */
    self.calcPrice = function (key,total) {
        var item,formula,m;
        var price = [];
        var temp = [];
        var stock = {};
        var uPrice = 0;
        var dec = 0;var unit = 0;
        var i = 0;
        if(typeof total === 'undefined'){
            total = 1;
        }
        formula = self.formulaMap.get(key);
        for(m in formula.material){
            if(formula.material.hasOwnProperty(m)){
                item = self.materialMap.get(m);
                stock = self.getUData(item.key);
                uPrice = self.getUPrice(item.key);
                unit = formula['material'][m] * total;
                if(stock < unit){
                    //库存不足够,计算成本
                    dec = unit - stock;
                    if(item.hasOwnProperty('job') && item.job !== self.currentJob){
                        //材料是专属半成品且职业不同时不计算合成 成本
                        item.type = 1;
                    }
                    if(item.hasOwnProperty('type') && item.type === 2){
                        //半成品,计算是否可以合成
                        temp = self.calcPrice(item.key,dec);
                        for(i = 0;i<temp.length;i++){
                            price.push(temp[i]);
                        }
                    }else{
                        //基础资源,计算购买需要的金额
                        price.push({
                            name:item.name,
                            total:unit,
                            dec:dec,
                            price:uPrice,
                            money:dec * uPrice
                        });
                    }
                }else{
                    //库存足够,计算节省+材料卖出的收益
                    price.push({
                        name:item.name,
                        total:unit,
                        dec:0,
                        price:uPrice,
                        money:0
                    });
                }
            }
        }
        return price;
    };
};
