//source 来源(1:采集,2:购买,3:制作)
//level 品质 1:白色,2:绿色,3:蓝色
//type 类型 1:资源,2:半成品

var material = [
    {'key':'mt','name':'木头','level':1,'source':[1]},
    {'key':'st','name':'石头','level':1,'source':[1]},
    {'key':'m','name':'麻','level':1,'source':[1]},
    {'key':'zwgj','name':'植物根茎','level':2,'source':[1,2]},
    {'key':'mjp','name':'麻茎皮','level':3,'source':[1,2]},
    {'key':'mgj','name':'麻杆茎','level':2,'source':[1,2]},
    {'key':'sz','name':'树脂','level':2,'source':[1,2]},
    {'key':'xs','name':'硝石','level':2,'source':[1,2]},
    {'key':'cbt','name':'粗布条','level':2,'type':2,'material':{'m':15,'zwgj':2},'source':[2,3]},
    {'key':'b','name':'布','level':2,'type':2,'material':{'cbt':1,'mjp':1},'source':[2,3]},
    {'key':'sl','name':'塑料','level':3,'type':2,'material':{'b':1,'sz':8,'xs':2,'mgj':2},'source':[2,3]}
];