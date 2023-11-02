const CON_MAIN = canvas_main.getContext("2d");
const CON_FLAG = canvas_flag.getContext("2d");
const CON_LOG = canvas_log.getContext("2d");
const FONT_CHAR = "20px 'UD デジタル 教科書体 NP-B'";
const FONT_TIME = "16px 'UD デジタル 教科書体 NP-B'";
const MAP_ALL = "map.1_";
const MAP_CTRL = "map.1_c";
const MAP_FLAG = "map.1_f_";
const MAP_HEAD = "map.1_h_";
const MAP_LOG = "map.1_l_";
const INFO_ARROW = document.getElementById("info_arrow");
let cImage = new Image;
// act_ins 追加
document.getElementById("act_ins").addEventListener("click",() => {
    let key = act_key.value;
    let val = act_value.value;
    let rtn = confirm(`追加 キー:${key},内容:${val}`);
    if (rtn) localStorage.setItem(key,val);
    // 更新後表示
    if (main_sel_d.value == "addDisp") {
        tbody_detete(tbo_all);    
        tbo_all_disp();
    } else {
        tbody_detete(tbo_head,tbo_flag,tbo_log);
        tbo_hfl_disp();
    }
});
// act_upd 修正
document.getElementById("act_upd").addEventListener("click",() => {
    let key = act_key.value;
    let val = act_value.value;
    let rtn = confirm(`修正 キー:${key},内容:${val}`);
    if (rtn) {
        localStorage.removeItem(key_save);
        localStorage.setItem(key,val);
    }
    // 更新後表示
    if (main_sel_d.value == "allDisp") {
        tbody_detete(tbo_all);  
        tbo_all_disp();
    } else {
        tbody_detete(tbo_head,tbo_flag,tbo_log);
        tbo_hfl_disp();
    }
});
// act_del 削除
document.getElementById("act_del").addEventListener("click",() => {
    let key = act_key.value;
    let val = act_value.value;
    let rtn = confirm(`削除 キー:${key},内容:${val}`);
    if (rtn) {localStorage.removeItem(key)}
    // 更新後表示
    if (main_sel_d.value == "allDisp") {
        tbody_detete(tbo_all);  
        tbo_all_disp();
    } else {
        tbody_detete(tbo_head,tbo_flag,tbo_log);
        tbo_hfl_disp();
    }
});
// config_time 全時間表示 yn
document.getElementById("config_time").addEventListener("click",() => cScene.time_change(con_dispTime));
// config_time 線表示 yn
document.getElementById("config_line").addEventListener("click",() => cScene.line_change(con_dispLine));
// config_time info表示 yn
document.getElementById("config_info").addEventListener("click",() => cScene.info_change(con_dispInfo));
// config_upd 更新
document.getElementById("config_upd").addEventListener("click",() => {
    let long = ("0000" + Number(config_long.value)).slice(-4);
    let timerG = ("0000" + Number(config_timerG.value)).slice(-4);
    let timerL = ("0000" + Number(config_timerL.value)).slice(-4);
    let time = (config_time.innerHTML == "-") ? "n" : "y";
    let line = (config_line.innerHTML == "-") ? "n" : "y";
    let info = (config_info.innerHTML == "-") ? "n" : "y";
    let str = `${long} ${timerG} ${timerL} ${time}${line}${info}`;
    config_long.value = long;
    config_timerG.value = timerG;
    config_timerL.value = timerL;
    localStorage.setItem(MAP_CTRL,str);
});
// fset_ins flag追加
document.getElementById("fset_ins").addEventListener("click",() => {
    // 追加no検索
    let free = 0;
    for (let i = 0; i < flagT.length; i++) {
        if (flagT[i].slice(-2) != i + 1) {
            free = i + 1;
            break;
        }
    }
    if (free == 0) free = flagT.length + 1;
    // 追加    
    let no  = (`00${free}`).slice(-2);
    let key = `${MAP_FLAG}${cHead.id}_${no}`;
    localStorage.setItem(key,fset_text.value);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// fset_upd flag修正
document.getElementById("fset_upd").addEventListener("click",() => {
    localStorage.setItem(flagT[flagApos],fset_text.value);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// fset_del flag削除
document.getElementById("fset_del").addEventListener("click",() => {
    localStorage.removeItem(flagT[flagApos]);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// gen_ok 現在地の変更 OK
document.getElementById("gen_ok").addEventListener("click",() => {
    // 調整セット
    cGen.adjust(true,true,adjX,adjY);
    // 再表示
    cScene.reset("ctrl","flag","gen","gps");
    cScene.set("地図表示");
    if (main_rec.value == "") cScene.rec_set_n();
});
// gen_ng 現在地の変更 NG
document.getElementById("gen_ng").addEventListener("click",() => cScene.reset("ctrl","flag","gen","gps"));
// gps_ok GPSの値に変更 OK
document.getElementById("gps_ok").addEventListener("click",() => {
    // 調整セット
    cGen.adjust(true,true,0,0);
    // 再表示
    cScene.reset("ctrl","flag","gen","gps");
    if (main_rec.value == "") cScene.rec_set_n();
});
// gps_get GPS再取得
document.getElementById("gps_get").addEventListener("click",() => {
    navigator.geolocation.getCurrentPosition(gen_ok_m,gen_err,gen_opt);
});
// gps_rec GPSの値に変更 OK+地図表示+🔴
document.getElementById("gps_rec").addEventListener("click",() => {
    // 調整セット
    cGen.adjust(true,true,0,0);
    // 再表示
    cScene.reset("ctrl","flag","gen","gps");
    // 記録状態 y
    cScene.rec_set_y();
    let timerG = Number(con_timerG);
    if (timerG < 1) timerG = 1;
    // 現在地取得 開始
    con_timerId = setInterval(gen_get,timerG * 1000); // 秒→ミリ秒
});
// to start
document.getElementById("main_s").addEventListener("click",() => cScene.set("start"));
// to data
document.getElementById("main_d").addEventListener("click",() => {
    main_sel_d.value = "";
    cScene.set("データ")
});
// to info
document.getElementById("main_i").addEventListener("click",() => cScene.set("info"));
// main_map 地図選択
document.getElementById("main_map").addEventListener("click",() => {
    if (con_timerF) {
        cScene.err_disp("記録中は地図の選択不可");
        return;
    }
    main_file_m.click();
});
// 地図名
document.getElementById("main_name").addEventListener("click",() => {
    // 消去 地図表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// main_file_h 保存データ選択
document.getElementById("main_file_h").addEventListener("change",(e) => {
    if (e.target.files.length == 0) return;
    // ファイルのブラウザ上でのURLを取得する
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    // ファイル読込終了後
    fileReader.onload = () => {
        key_all = [];
        val_all = [];        
        let strs = fileReader.result.split("\n");
        for (str of strs) {
            let text = str.split("\t");
            if (text.length == 2) {
                key_all.push(text[0]);
                val_all.push(text[1]);
                tbody_append(tbo_all,text[0],text[1]);
            }
        }
    }
});
// main_file_m 地図データ選択
document.getElementById("main_file_m").addEventListener("change",(e) => {
    if (e.target.files.length == 0) return;
    // ファイルのブラウザ上でのURLを取得する
    let file = e.target.files[0];
    let file_url = window.URL.createObjectURL(file);
    let file_name = file.name.replace(".png","");
    // 地図情報検索
    con_file = "";
    for (let i = 0; i < headA.length; i++) {
        if (headA[i].name == file_name) {
            con_file = file_name;
            cHead = headA[i];
        }
    }
    // 地図未登録
    if (con_file == "") {
        cScene.err_disp(`地図未登録:${file_name}`);
        return;
    }
    // info 初期化
    info_cnt = 0;
    info_save = "";
    info_arrow.innerHTML = "";
    // 地図読込
    cImage.src = file_url;
    main_name.innerHTML = file_name;
});
// main_exe 実行
document.getElementById("main_exe").addEventListener("click",() => {
    switch (main_sel_d.value) {
        // 全保存
        case "allSave":
            key_all = [];
            val_all = [];
            for (let i = 0; i < localStorage.length; i++) key_all.push(localStorage.key(i));
            key_all.sort()
            for (let i = 0; i < key_all.length; i++) val_all.push(localStorage.getItem(key_all[i]));
            cText.save("map_all",key_all,val_all);
            break;
        // cfh保存
        case "cfhSave":
            key_all = [];
            val_all = [];
            // 登録データ取得
            for (let i = 0; i < localStorage.length; i++) {
                let k = localStorage.key(i);
                if (k.slice(0,7) == MAP_CTRL || k.slice(0,8) == MAP_FLAG || k.slice(0,8) == MAP_HEAD) key_all.push(k);
            }
            key_all.sort()
            for (let i = 0; i < key_all.length; i++) val_all.push(localStorage.getItem(key_all[i]));
            cText.save("map_cfh",key_all,val_all);       
            break;      
        // 選択保存
        case "selSave":
            let id  = main_sel_h.value.slice(8,10);
            let txt = main_sel_h.value.slice(11);
            key_all = [];
            val_all = [];
            // 登録データ取得
            for (let i = 0; i < localStorage.length; i++) {
                let k = localStorage.key(i);
                if (k.slice(0,6) == MAP_ALL && k.slice(8,10) == id) key_all.push(k);
            }
            key_all.sort()
            for (item of key_all) {
                let val = localStorage.getItem(item);
                val_all.push(val);
            }
            cText.save(txt,key_all,val_all);
            break;      
        // 保存データ追加
        case "fileAdd":
            for (let i = 0; i < key_all.length; i++) localStorage.setItem(key_all[i],val_all[i]);
            cScene.set("終了");
            main_sel_d.value = "";
            break;
    }        
});
// main_erase 消去
document.getElementById("main_erase").addEventListener("click",() => {
    cScene.info_clear();
    cScene.set("start");
});
// main_flag 選択削除 flag
document.getElementById("main_flag").addEventListener("click",() => {
    if (!confirm('flag 削除 OK')) return;
    for (item of flagT) localStorage.removeItem(item);
    tbody_detete(tbo_head,tbo_flag,tbo_log);
    tbo_hfl_disp();
});
// main_log 選択削除 log
document.getElementById("main_log").addEventListener("click",() => {
    if (!confirm('log 削除 OK')) return;
    for (item of logT) localStorage.removeItem(item);
    tbody_detete(tbo_head,tbo_flag,tbo_log);
    tbo_hfl_disp();
});
// main_rec 記録 yn
document.getElementById("main_rec").addEventListener("click",() => rec_yn());
// main_err エラー消去
document.getElementById("main_err").addEventListener("click",() => cScene.err_clear());
// main_sel_d Data処理
document.getElementById("main_sel_d").addEventListener("change",() => {
    switch (main_sel_d.value) {
        // 全表示
        case "allDisp":
            tbody_detete(tbo_all);
            cScene.set("全表示");
            tbo_all_disp();
            break;
        // 選択表示
        case "selDisp":
            cScene.set("選択表示");
            main_sel_h_disp();
            break;
        // 集計表示
        case "sumDisp":
            tbody_detete(tbo_summ);
            cScene.set("集計表示");
            tbo_summ_disp();
            break;
        // 全保存
        case "allSave":
            tbody_detete(tbo_all);
            cScene.set("全保存");
            tbo_all_disp();
            break;
        // cfh保存
        case "cfhSave":
            tbody_detete(tbo_ctrl,tbo_head,tbo_flag);
            cScene.set("cfh保存");
            tbo_cfh_disp();
            break;
        // 選択保存
        case "selSave":
            tbody_detete(tbo_head,tbo_flag,tbo_log);
            cScene.set("選択保存");
            main_sel_h_disp();
            break;
        // 保存追加
        case "fileAdd":
            main_file_h.click();
            tbody_detete(tbo_all);
            cScene.set("保存追加");
            break;
        // 選択削除
        case "selDel":
            cScene.set("選択削除");
            main_sel_h_disp();
            break;
    }        
});
// main_sel_h Data処理2
document.getElementById("main_sel_h").addEventListener("change",() => {
    tbody_detete(tbo_head,tbo_flag,tbo_log);    
    switch (main_sel_d.value) {
        // 選択表示
        case "selDisp":
            cScene.set("選択表示2");
            tbo_hfl_disp();
            break;
        // 選択保存
        case "selSave":
            cScene.set("選択保存2");
            tbo_hfl_disp();
            break;
        // 選択削除
        case "selDel":
            cScene.set("選択削除2");
            tbo_hfl_disp();
            break;
    }
});
// main_sel_m 地図処理
document.getElementById("main_sel_m").addEventListener("change",() => {
    switch (main_sel_m.value) {
        // 現在地設定
        case "genSet":
            // 消去・地図表示
            cScene.reset("ctrl","flag");
            cScene.set("地図表示");
            navigator.geolocation.getCurrentPosition(gen_ok_m,gen_err,gen_opt);
            break;
        // 地図表示
        case "mapDisp":
            // 消去・地図表示           
            cScene.reset("ctrl","flag");
            cScene.set("地図表示");
            break;
        // Flag設定
        case "flagSet":
            // 消去・地図表示
            cScene.reset("ctrl","flag");
            cScene.set("地図表示");
            break;
        // 位置計測
        case "genGet":
            // 消去・地図表示
            cScene.reset("ctrl","flag");
            cScene.set("地図表示");
            break;
    }
});
// iii_00 移動
document.getElementById("iii_00").addEventListener('click',() => {
    cScene.set("地図表示");
    window.scrollTo({top:0,left:0,behavior:'smooth'});
});
// iii_gps 移動
document.getElementById("iii_gps").addEventListener('click',() => {
    cScene.set("地図表示");
    let scroll = {behavior:'smooth'};
    scroll.top = cGen.y + 7;
    scroll.left = cGen.x - 20;
    window.scrollTo(scroll);
});
// iii_start 移動
document.getElementById("iii_start").addEventListener('click',() => {
    main_sel_m.value = "";
    cScene.set("start");
    window.scrollTo({top:0,left:0,behavior:'smooth'});
});
// iii_log_d log削除
document.getElementById("iii_log_d").addEventListener("click",() => tbo_iii_log_del());
// iii_rec 記録 yn
document.getElementById("iii_rec").addEventListener("click",() => rec_yn());
// iii_x 消去
document.getElementById("iii_x").addEventListener("click",() => cScene.reset('iii'));
// canvas click
document.getElementById("canvas_log").addEventListener("click",(e) => {
    // mouse click 位置
    mouseUpX = e.offsetX;
    mouseUpY = e.offsetY;
    switch (main_sel_m.value) {
        // Flag設定
        case "flagSet":
            // flag配列チェック
            flagApos = -1;
            for (let i = 0; i < flagA.length; i++) {
                let x = Math.abs(mouseUpX - flagA[i].px);
                let y = Math.abs(mouseUpY - flagA[i].py);
                if (x < 10 && y < 10) flagApos = i;
            }
            // Flag設定
            if (flagApos == -1) {
                con_arc(CON_FLAG,mouseUpX,mouseUpY,5,"green");
                div_fset.style.left = mouseUpX - 60 + "px";
                div_fset.style.top  = mouseUpY + 50 + "px";
                div_fset.style.display = "block";    
                fset_text.value = `${mouseUpX} ${mouseUpY} seg Memo`;
                fset_ins.style.display = "inline";
                fset_upd.style.display = "none";
                fset_del.style.display = "none";
            } else {
                div_fset.style.left = mouseUpX - 60 + "px";
                div_fset.style.top  = mouseUpY + 50 + "px";
                div_fset.style.display = "block";
                fset_text.value = flagA[flagApos].value;
                fset_ins.style.display = "inline";
                fset_upd.style.display = "inline";
                fset_del.style.display = "inline";
            }
            break;
        // 位置計測
        case "genGet":
            // 位置計測、表示
            let long = cConv.px_long(mouseUpX);
            let lat = cConv.py_lat(mouseUpY);
            let str = `位置 X=${mouseUpX},Y=${mouseUpY},経度=${long},緯度=${lat}`;
            if (mouseUpX < canvas_main.width - 400) {
                con_box(CON_FLAG,mouseUpX,mouseUpY,400,40,"green",str);
            } else {
                con_box(CON_FLAG,mouseUpX - 400,mouseUpY,400,40,"green",str);
            }
            con_arc(CON_FLAG,mouseUpX,mouseUpY,1,"black"); 
            break;
    }
});
// マウスdown
document.getElementById("canvas_log").addEventListener('mousedown',(e) => {
    mouseDownDate = new Date();
    // 右クリック
    if (e.button == 2) {
        cScene.iii(e.offsetX,e.offsetY + 100);
    }
});
// マウスup
document.getElementById("canvas_log").addEventListener('mouseup',(e) => mouse_up(e.offsetX,e.offsetY));
// タッチstart
document.getElementById("canvas_log").addEventListener("touchstart",(e) => { 
    // 3本指はiii表示
    if (e.targetTouches.length == 3) {
        let obj = e.changedTouches[0];
        let x = Math.round(obj.pageX);
        let y = Math.round(obj.pageY);
        cScene.iii(x,y - div_canvas.offsetTop);
    }
    mouseDownDate = new Date();
});
// タッチend
document.getElementById("canvas_log").addEventListener("touchend",(e) => {
    let obj = e.changedTouches[0];
    mouse_up(obj.pageX,obj.pageY - div_canvas.offsetTop);
});
// 地図読込完了
cImage.onload = () => {
    main_sel_m.value = "genSet";
    // 矢印情報セット
    cArrow.size(cImage.width,cImage.height)
    // 地図情報セット
    canvas_main.width   = cImage.width;
    canvas_main.height  = cImage.height;
    canvas_flag.width   = cImage.width;
    canvas_flag.height  = cImage.height;
    canvas_log.width    = cImage.width;
    canvas_log.height   = cImage.height;
    div_main.style.width = cImage.width + "px";
    storage_get();
    cConv.set(cHead.left,cHead.right,cHead.bottom,cHead.top,cImage.width,cImage.height);
    cGen.clear();
    cLog.first;
    cScene.rec_clear();
    cScene.reset("main","log","ctrl","flag");
    for (item of logA) cLog.display(CON_LOG,item.md,item.hm,item.long,item.x,item.lat,item.y,item.dir);
    cScene.set("地図表示");
    navigator.geolocation.getCurrentPosition(gen_ok_m,gen_err,gen_opt);
}
// start時
window.onload = () => {
    // control 取得
    let ctrl = -1;   
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);    
        if (x.slice(0,7) == MAP_CTRL) {
            ctrl = i;
            break;
        }
    }
    //  control 有無確認 
    if (ctrl != -1) {
        let x = localStorage.getItem(MAP_CTRL);
        config_long.value = x.slice(0,4);
        config_timerG.value = x.slice(5,9);
        config_timerL.value = x.slice(10,14);
        con_long = Number(config_long.value) * 1000;
        con_timerG = Number(config_timerG.value);
        con_timerL = Number(config_timerL.value) / 60;
        con_dispTime = x.slice(15,16);
        con_dispLine = x.slice(16,17);
        con_dispInfo = x.slice(17,18);
        cScene.time_set(con_dispTime);
        cScene.line_set(con_dispLine);
        cScene.info_set(con_dispInfo);
    }
    cScene.set("start");
    // headA 作成
    headA_set();
    if (!navigator.geolocation) cScene.info_disp("位置情報取得 不可");
}
// 丸
function con_arc(con,x,y,radius,color) {
    con.beginPath();
    con.strokeStyle = color;
    con.fillStyle = color;
    con.arc(x,y,radius,0,Math.PI*2,true);
    con.fill();
    con.stroke(); 
}
// 四角形
function con_box(con,x,y,w,h,color,text) {
    let colorX     = "black";
    let background = "white";
    let line       = "black";
    switch (color) {
        case "green":
            colorX     = color;
            background = "rgb(222,248,220)";
            line       = "lightgreen";
            break;
        case "red":
            colorX     = color;
            background = "rgb(255,192,203)";
            line       = "fuchsia";
            break;
        case "blue":
            colorX     = color;
            background = "rgb(224,255,255)";
            line       = "aqua";
    }
    con.beginPath(); 
    con.fillStyle = line; 
    con.fillRect(x,y,w,h);
    con.fillStyle = background;
    con.fillRect(x+3 , y+3, w-6, h-6);
    con.fillStyle = colorX;
    con.font      = "14px 'MS ゴシック'";
    con.fillText(text,x+12,y+25);
}
// 現在地取得
function gen_get() {navigator.geolocation.getCurrentPosition(gen_ok_timer,gen_err,gen_opt)}
// 現在地取得成功 マウスup 長押
function gen_ok_long(gen) {
    let long = Math.round(gen.coords.longitude * 1000000) / 1000000;
    let lat  = Math.round(gen.coords.latitude * 1000000) / 1000000;
    let x    = cConv.long_px(long);
    let y    = cConv.lat_py(lat);
    adjX     = mouseUpX - x; // 調整 x
    adjY     = mouseUpY - y; // 調整 y
    cScene.reset("flag","gps","gen");
    cScene.gps(CON_FLAG,x,y);
    cScene.gen(CON_FLAG,mouseUpX,mouseUpY);
}
// 現在地取得成功 M クリック時
function gen_ok_m(gen) {
    cGen.set(gen);
    cScene.reset("gps");
    cScene.gps(CON_FLAG,cGen.x,cGen.y);
}
// 現在地取得成功 Timer
function gen_ok_timer(gen) {
    // 現在地・GPS位置消去、Log再表示
    if (cGen.view) cScene.reset("gen","gps","log");
    cScene.err_clear();
    cGen.view = false;
    cGen.set(gen);
    if (cGen.adjL) {
        // 設定地 log 出力
        cScene.info_disp(`設定:${cGen.long} ${cGen.lat} ${cGen.adjX} ${cGen.adjY}`);
        cLog.storage(MAP_LOG,cHead.id,cGen.adjMd,cGen.adjHm,"a",cGen.long,cGen.lat,cGen.adjX,cGen.adjY);
        cLog.display(CON_LOG,cGen.adjMd,cGen.adjHm,cGen.long,cGen.adjX,cGen.lat,cGen.adjY,"r");    
        cGen.adjL = false;
    }
    // 現在地 log 出力
    let dt = new Date();
    let mm = ("00" + (dt.getMonth()+1)).slice(-2);
    let dd = ("00" +  dt.getDate()).slice(-2);
    let HH = ("00" + (dt.getHours())).slice(-2);
    let MM = ("00" + (dt.getMinutes())).slice(-2);
    let Md = `${mm}${dd}`;
    let Hm = `${HH}${MM}`;
    cScene.info_disp(`現在:${cGen.long} ${cGen.lat}`);
    cLog.storage(MAP_LOG,cHead.id,Md,Hm,"g",cGen.long,cGen.lat,"","");
    cLog.display(CON_LOG,Md,Hm,cGen.long,cGen.adjX,cGen.lat,cGen.adjY,"r");
    INFO_ARROW.innerHTML = cArrow.set_ok(cGen.x,cGen.y);
}
// 現在地取得失敗
function gen_err(err) {
	let gen_mess = {
		0: "原因不明のエラー",
		1: "位置情報の取得不許可",
		2: "位置情報の取得不可",
		3: "位置情報の取得タイムアウト",
	};
	cGen.m = gen_mess[err.code];
    cScene.info_disp(cGen.m);
    cScene.err_disp(cGen.m);
    INFO_ARROW.innerHTML = cArrow.set_str("✕");
}
// オプション・オブジェクト
let gen_opt = {
	"enableHighAccuracy": true,
	"timeout": 5000,
	"maximumAge": 0,
}
// headA 作成
function headA_set() {
    headA = [];
    key_all = []; 
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,8) == MAP_HEAD) key_all.push(x);
    }
    key_all.sort();
    for (item of key_all) {
        let k   = item.split("_");
        let val = localStorage.getItem(item);
        let v   = val.split(/\s+/); // 連続する空白で分割
        if (k.length == 4 && k[3] != "" && v.length == 4) {
            xHead = new Head;
            xHead.set(item,val,k[2],k[3],k[3],v[0],v[1],v[2],v[3]);
            headA.push(xHead);
        } else if (k.length == 5 && k[3] != "" && k[4] != "" && v.length == 4) {
            xHead = new Head;
            xHead.set(item,val,k[2],k[3],`${k[3]}_${k[4]}`,v[0],v[1],v[2],v[3]);
            headA.push(xHead);
        }
    }
}
// main_sel_h_disp 表示
function main_sel_h_disp() {
    // 登録データ取得 head
    key_all = [];    
    for (let i = 0; i < localStorage.length; i++) {
        let temp = localStorage.key(i);
        if (temp.slice(0,8) == MAP_HEAD) key_all.push(temp);
    }
    key_all.sort();
    // option削除
    let sel = main_sel_h.options;
    for (let i = sel.length - 1; i > -1; i--) {
        if (!sel[i].selectid) main_sel_h.removeChild(sel[i]);
    }
    // option追加         
    for (item of key_all) {
        let k   = item.split("_");
        let opt = document.createElement("option");
        if (k.length == 4 && k[3] != "")  {
            opt.text = k[3];
        } else if (k.length > 4 && k[3] != "" && k[4] != "") {
            opt.text = `${k[3]}_${k[4]}`;
        } else {
            opt.text = item;           
        }
        opt.value = item;
        main_sel_h.appendChild(opt);
    }
    main_sel_h.value = "";
}
// マウスup
function mouse_up(x,y) {
    // マウス up - down 長押
    mouseUpX = Math.round(x);
    mouseUpY = Math.round(y);
    mouseUpDate = new Date();
    if (mouseUpDate.getTime() - mouseDownDate.getTime() < con_long) return;
    // 現在地設定、地図表示は、長押しで現在地取得
    if (main_sel_m.value == "mapDisp" || main_sel_m.value == "genSet") {
        navigator.geolocation.getCurrentPosition(gen_ok_long,gen_err,gen_opt);
    }
}
// 記録 yn
function rec_yn() {
    // 初期状態時は記録n
    if (main_rec.value == "") {
        cScene.rec_set_n();
        return;
    }
    // 記録状態変更
    cScene.rec_change();
    if (main_rec.value == "y") {
        let timerG = Number(con_timerG);
        if (timerG < 1) timerG = 1;
        // 現在地取得 開始
        con_timerId = setInterval(gen_get,timerG * 1000); // 秒→ミリ秒 
    } else {
        clearInterval(con_timerId);
    }
}
// Web Storage 読込
function storage_get() {
    let strFlag = MAP_FLAG + cHead.id;
    let strLog = MAP_LOG + cHead.id;
    // flag,log 配列作成
    flagT = [];
    logT  = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,10) == strFlag) flagT.push(x);
        if (x.slice(0,10) == strLog) logT.push(x);
    }
    // flag 配列作成
    flagT.sort();
    flagA = [];
    for (item of flagT) {
        cFlag = new Flag;
        cFlag.set(localStorage.getItem(item));
        flagA.push(cFlag);
    }
    // log 配列作成
    logT.sort();
    logA = [];    
    let aX = 0; //調整 x
    let aY = 0; //調整 y   
    for (item of logT) {
        cLog = new Log;
        cLog.set(item,localStorage.getItem(item),aX,aY);
        aX = cLog.x;
        aY = cLog.y;
        logA.push(cLog);
    }
}
// tbo_all 表示
function tbo_all_disp() {
    // 登録データ取得
    key_all = [];
    for (let i = 0; i < localStorage.length; i++) key_all.push(localStorage.key(i));    
    key_all.sort();
    // 行追加
    for (item of key_all) tbody_append(tbo_all,item,localStorage.getItem(item));
    // onclick イベント追加
    for (let r = 0; r < tbo_all.rows.length; r++) {
        for (let c = 0; c < tbo_all.rows[r].cells.length; c++) {
            let rc = tbo_all.rows[r].cells[c];
            rc.onclick = function() {tbo_all_click(this)}
        }
    }
    act_key.value = "";
    act_value.value = "";    
}
// tbo_all クリック
function tbo_all_click(x) {
    let r = x.parentNode.rowIndex - 1;
    act_key.value = tbo_all.rows[r].cells[0].innerHTML;
    act_value.value = tbo_all.rows[r].cells[1].innerHTML;
    key_save = act_key.value;
    val_save = act_value.value;    
}
// tbo_cfh 表示
function tbo_cfh_disp() {
    // con,flag,head 取得
    ctrlT = [];
    headT = [];
    flagT = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,7) == MAP_CTRL) {
            ctrlT.push(x);
        } else if (x.slice(0,8) == MAP_FLAG) {
            flagT.push(x);
        } else if (x.slice(0,8) == MAP_HEAD) {
            headT.push(x);
        }
    }
    // 行追加 ctrl
    ctrlT.sort();
    for (item of ctrlT) tbody_append(tbo_ctrl,item,localStorage.getItem(item));
    // 行追加 head
    headT.sort();
    for (item of headT) tbody_append(tbo_head,item,localStorage.getItem(item));
    // 行追加 flag
    flagT.sort();
    for (item of flagT) tbody_append(tbo_flag,item,localStorage.getItem(item));
}
// tbo_summ 表示
function tbo_summ_disp() {
    // headA 作成
    headA_set();
    // flag,log 取得
    fgA = [];
    lgA = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,8) == MAP_FLAG) {
            fgA.push(x);
        } else if (x.slice(0,8) == MAP_LOG) {
            lgA.push(x);
        }
    }
    // flag 集計
    for (fg of fgA) {
        let id = fg.substr(8,2);
        for (let i = 0; i < headA.length; i++) {
            if (id == headA[i].id) {
                headA[i].flagCount++;
                break;
            } 
        }
    }
    // log 集計
    for (lg of lgA) {
        let id = lg.substr(8,2);
        for (let i = 0; i < headA.length; i++) {
            if (id == headA[i].id) {
                headA[i].logCount++;
                break;
            } 
        }
    }
    // 表示
    let xHead = new Head;
    for (xHead of headA) {
        let k = document.createTextNode(xHead.key);
        let f = document.createTextNode(xHead.flagCount > 0 ? xHead.flagCount : "");
        let fx = document.createTextNode(xHead.flagCount > 0 ? "d" : "");
        let l = document.createTextNode(xHead.logCount > 0 ? xHead.logCount : "");
        let lx = document.createTextNode(xHead.logCount > 0 ? "d" : "");
        let row = document.getElementById("tbo_summ").insertRow();
        row.insertCell().appendChild(k);
        row.insertCell().appendChild(f);
        row.insertCell().appendChild(fx);
        row.insertCell().appendChild(l);
        row.insertCell().appendChild(lx);
        // onclick イベント追加
        if (fx.data == "d") {
            let rc = tbo_summ.rows[row.sectionRowIndex].cells[2];
            rc.onclick = function() {tbo_summ_flag_del(k)}
        }
        if (lx.data == "d") {
            let rc = tbo_summ.rows[row.sectionRowIndex].cells[4];
            rc.onclick = function() {tbo_summ_log_del(k)}
        }
    }
}
// flag 削除
function tbo_summ_flag_del(k) {
    if (!confirm(`${k.data} flag 削除 OK`)) return;
    let key = k.data.slice(0,11).replace(MAP_HEAD,MAP_FLAG);
    flagA = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,11) == key) flagA.push(x);       
    }
    for (item of flagA) localStorage.removeItem(item);
    tbody_detete(tbo_summ);
    tbo_summ_disp();
}
// log 削除 (sum)
function tbo_summ_log_del(k) {
    if (!confirm(`${k.data} log 削除 OK`)) return;
    let key = k.data.slice(0,11).replace(MAP_HEAD,MAP_LOG);
    logA = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,11) == key) logA.push(x);       
    }
    for (item of logA) localStorage.removeItem(item);
    tbody_detete(tbo_summ);
    tbo_summ_disp();
}
// log 削除 (iii)
function tbo_iii_log_del(k) {
    if (!confirm(`${cHead.key} log 削除 OK`)) return;
    let key = cHead.key.slice(0,11).replace(MAP_HEAD,MAP_LOG);
    logA = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if (x.slice(0,11) == key) logA.push(x);       
    }
    for (item of logA) localStorage.removeItem(item);
    cScene.reset('iii','log');
}
// tbo_hfl 表示
function tbo_hfl_disp() {
    // head,flag,log 取得
    headT = [];
    flagT = [];
    logT = [];
    let strHead = MAP_HEAD + main_sel_h.value.substr(8,2);
    let strFlag = MAP_FLAG + main_sel_h.value.substr(8,2);
    let strLog = MAP_LOG + main_sel_h.value.substr(8,2);
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        switch (x.slice(0,10)) {
            case strFlag:
                flagT.push(x);
                break;
            case strHead:
                headT.push(x);
                break;
            case strLog:
                logT.push(x);
        }
    }
    // 行追加 head
    headT.sort();
    for (item of headT) tbody_append(tbo_head,item,localStorage.getItem(item));
    // onclick イベント追加 flag
    for (let r = 0; r < tbo_head.rows.length; r++) {
        for (let c = 0; c < tbo_head.rows[r].cells.length; c++) {
            let rc = tbo_head.rows[r].cells[c];
            rc.onclick = function() {tbo_head_click(this)}
        }
    }
    // 行追加 flag
    flagT.sort();
    for (item of flagT) tbody_append(tbo_flag,item,localStorage.getItem(item));
    // onclick イベント追加 flag
    for (let r = 0; r < tbo_flag.rows.length; r++) {
        for (let c = 0; c < tbo_flag.rows[r].cells.length; c++) {
            let rc = tbo_flag.rows[r].cells[c];
            rc.onclick = function() {tbo_flag_click(this)}
        }
    }
    // 行追加 log
    logT.sort();
    for (item of logT) tbody_append(tbo_log,item,localStorage.getItem(item));
    // onclick イベント追加 log
    for (let r = 0; r < tbo_log.rows.length; r++) {
        for (let c = 0; c < tbo_log.rows[r].cells.length; c++) {
            let rc = tbo_log.rows[r].cells[c];
            rc.onclick = function() {tbo_log_click(this)}
        }
    }
    act_key.value = "";
    act_value.value = "";    
}
// tbo_head クリック
function tbo_head_click(x) {
    let r = x.parentNode.rowIndex - 1;
    act_key.value = tbo_head.rows[r].cells[0].innerHTML;
    act_value.value = tbo_head.rows[r].cells[1].innerHTML;
    key_save = act_key.value;
    val_save = act_value.value;        
}
// tbo_flag クリック
function tbo_flag_click(x) {
    let r = x.parentNode.rowIndex - 1;
    act_key.value = tbo_flag.rows[r].cells[0].innerHTML;
    act_value.value = tbo_flag.rows[r].cells[1].innerHTML;
    key_save = act_key.value;
    val_save = act_value.value;    
}
// tbo_log クリック
function tbo_log_click(x) {
    let r = x.parentNode.rowIndex - 1;
    act_key.value = tbo_log.rows[r].cells[0].innerHTML;
    act_value.value = tbo_log.rows[r].cells[1].innerHTML;
    key_save = act_key.value;
    val_save = act_value.value;    
}
// tbody 行追加
function tbody_append(ctrl,key,value) {
    let row = ctrl.insertRow();
    let cell = row.insertCell();
    let k = document.createTextNode(key);
    let v = document.createTextNode(value);
    cell.appendChild(k);
    cell = row.insertCell();
    cell.appendChild(v);
}
// tbody 行削除
function tbody_detete(...ctrl) {
    for (let i = 0 ; i < ctrl.length ; i++){    
        for (let j = ctrl[i].rows.length - 1; j > -1; j--) ctrl[i].deleteRow(j);
    }
};
// 開始
let adjX = 0;           // 調整 x
let adjY = 0;           // 調整 y
let can_rect = canvas_main.getBoundingClientRect();
let con_file = "";      // 地図file名
let con_long = 2;       // 長押し(2秒)
let con_timerId;        // タイマーid
let con_timerF = false; // タイマー起動状態
let con_timerG = 10;    // 現在地取得間隔(10秒)
let con_timerL = 5;     // ログ保存間隔(5分)
let con_dispTime = "n"  // 全時間表示
let con_dispLine = "n"  // 線表示
let con_dispInfo = "n"  // info表示
let ctrlA;              // ctrl Array
let ctrlT;              // ctrl Array
let flagA;              // flag Array
let flagApos;           // flag Array 選択位置
let flagT;              // flag Array
let headA;              // head Array
let headT;              // head Array
let key_all;
let key_save;
let logA;               // log Array
let logT;               // log Array
let mouseDownDate;      // mouse down日付時間
let mouseUpDate;        // mouse up日付時間
let mouseUpX;           // mouse up x
let mouseUpY;           // mouse up y
let val_all;
let val_save;
