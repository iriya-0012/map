const ACT_KEY = document.getElementById("act_key");
const ACT_VALUE = document.getElementById("act_value");
const CANVAS_FLAG = document.getElementById("canvas_flag");
const CANVAS_LOG = document.getElementById("canvas_log");
const CANVAS_MAIN = document.getElementById("canvas_main");
const CON_FLAG = CANVAS_FLAG.getContext("2d");
const CON_LOG = CANVAS_LOG.getContext("2d");
const CON_MAIN = CANVAS_MAIN.getContext("2d");
const CONFIG_INFO = document.getElementById("config_info");
const CONFIG_LINE = document.getElementById("config_line");
const CONFIG_LONG = document.getElementById("config_long");
const CONFIG_TIME = document.getElementById("config_time");
const CONFIG_TIMERG = document.getElementById("config_timerG");
const CONFIG_TIMERL = document.getElementById("config_timerL");
const DIV_ACT = document.getElementById("div_act");
const DIV_ALL = document.getElementById("div_all");
const DIV_CANVAS = document.getElementById("div_canvas");
const DIV_CONFIG = document.getElementById("div_config");
const DIV_CTRL = document.getElementById("div_ctrl");
const DIV_ETC = document.getElementById("div_etc");
const DIV_FLAG = document.getElementById("div_flag");
const DIV_FSET = document.getElementById("div_fset");
const DIV_GEN = document.getElementById("div_gen");
const DIV_GPS = document.getElementById("div_gps");
const DIV_HEAD = document.getElementById("div_head");
const DIV_III = document.getElementById("div_iii");
const DIV_INFO = document.getElementById("div_info");
const DIV_LOG = document.getElementById("div_log");
const DIV_MAIN = document.getElementById("div_main");
const DIV_SUMM = document.getElementById("div_summ");
const FSET_DEL = document.getElementById("fset_del");
const FSET_INS = document.getElementById("fset_ins");
const FSET_TEXT = document.getElementById("fset_text");
const FSET_UPD = document.getElementById("fset_upd");
const FONT_CHAR = "20px 'UD デジタル 教科書体 NP-B'";
const FONT_TIME = "16px 'UD デジタル 教科書体 NP-B'";
const GEN_NG = document.getElementById("gen_ng");
const GEN_OK = document.getElementById("gen_ok");
const III_REC = document.getElementById("iii_rec");
const INFO_ARROW = document.getElementById("info_arrow");
const MAIN_CHECK_C = document.getElementById("main_check_c");
const MAIN_CHECK_F = document.getElementById("main_check_f");
const MAIN_CHECK_H = document.getElementById("main_check_h");
const MAIN_CHECK_L = document.getElementById("main_check_l");
const MAIN_CHECK_E = document.getElementById("main_check_e");
const MAIN_CLOSE = document.getElementById("main_close");
const MAIN_D = document.getElementById("main_d");
const MAIN_ERASE = document.getElementById("main_erase");
const MAIN_ERR = document.getElementById("main_err");
const MAIN_EXE = document.getElementById("main_exe");
const MAIN_FILE_H = document.getElementById("main_file_h");
const MAIN_FILE_M = document.getElementById("main_file_m");
const MAIN_FLAG = document.getElementById("main_flag");
const MAIN_I = document.getElementById("main_i");
const MAIN_LOG = document.getElementById("main_log");
const MAIN_MAP = document.getElementById("main_map");
const MAIN_NAME = document.getElementById("main_name");
const MAIN_REC = document.getElementById("main_rec");
const MAIN_S = document.getElementById("main_s");
const MAIN_SEL_D = document.getElementById("main_sel_d");
const MAIN_SEL_H = document.getElementById("main_sel_h");
const MAIN_SEL_M = document.getElementById("main_sel_m");
const MAIN_SPAN_A = document.getElementById("main_span_a");
const MAP_ALL = "map.1_";
const MAP_CTRL = "map.1_c";
const MAP_FLAG = "map.1_f_";
const MAP_HEAD = "map.1_h_";
const MAP_LOG = "map.1_l_";
const TBO_ALL = document.getElementById("tbo_all");
const TBO_CTRL = document.getElementById("tbo_ctrl");
const TBO_ETC = document.getElementById("tbo_etc");
const TBO_FLAG = document.getElementById("tbo_flag");
const TBO_HEAD = document.getElementById("tbo_head");
const TBO_LOG = document.getElementById("tbo_log");
const TBO_SUMM = document.getElementById("tbo_summ");
let cImage = new Image;
// canvas click
CANVAS_LOG.addEventListener("click",(e) => {
    // mouse click 位置
    mouseUpX = e.offsetX;
    mouseUpY = e.offsetY;
    switch (MAIN_SEL_M.value) {
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
                DIV_FSET.style.left = mouseUpX - 60 + "px";
                DIV_FSET.style.top  = mouseUpY + 50 + "px";
                DIV_FSET.style.display = "block";    
                FSET_TEXT.value = `${mouseUpX} ${mouseUpY} seg Memo`;
                FSET_INS.style.display = "inline";
                FSET_UPD.style.display = "none";
                FSET_DEL.style.display = "none";
            } else {
                DIV_FSET.style.left = mouseUpX - 60 + "px";
                DIV_FSET.style.top  = mouseUpY + 50 + "px";
                DIV_FSET.style.display = "block";
                FSET_TEXT.value = flagA[flagApos].value;
                FSET_INS.style.display = "inline";
                FSET_UPD.style.display = "inline";
                FSET_DEL.style.display = "inline";
            }
            break;
        // 位置計測
        case "genGet":
            // 位置計測、表示
            let long = cConv.px_long(mouseUpX);
            let lat = cConv.py_lat(mouseUpY);
            let str = `位置 X=${mouseUpX},Y=${mouseUpY},経度=${long},緯度=${lat}`;
            if (mouseUpX < CANVAS_MAIN.width - 400) {
                con_box(CON_FLAG,mouseUpX,mouseUpY,400,40,"green",str);
            } else {
                con_box(CON_FLAG,mouseUpX - 400,mouseUpY,400,40,"green",str);
            }
            con_arc(CON_FLAG,mouseUpX,mouseUpY,1,"black"); 
            break;
    }
});
// canvas マウスdown
CANVAS_LOG.addEventListener('mousedown',(e) => {
    mouseDownDate = new Date();
    // 右クリック
    if (e.button == 2) {
        cScene.iii(e.offsetX,e.offsetY + 100);
    }
});
// canvas マウスup
CANVAS_LOG.addEventListener('mouseup',(e) => mouse_up(e.offsetX,e.offsetY));
// canvas タッチstart
CANVAS_LOG.addEventListener("touchstart",(e) => { 
    // 3本指はiii表示
    if (e.targetTouches.length == 3) {
        let obj = e.changedTouches[0];
        let x = Math.round(obj.pageX);
        let y = Math.round(obj.pageY);
        cScene.iii(x,y - DIV_CANVAS.offsetTop);
    }
    mouseDownDate = new Date();
});
// canvas タッチend
CANVAS_LOG.addEventListener("touchend",(e) => {
    let obj = e.changedTouches[0];
    mouse_up(obj.pageX,obj.pageY - DIV_CANVAS.offsetTop);
});
// config_time 全時間表示 yn
CONFIG_TIME.addEventListener("click",() => cScene.time_change(con_dispTime));
// config_time 線表示 yn
CONFIG_LINE.addEventListener("click",() => cScene.line_change(con_dispLine));
// config_time info表示 yn
CONFIG_INFO.addEventListener("click",() => cScene.info_change(con_dispInfo));
// fset_ins flag追加
FSET_INS.addEventListener("click",() => {
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
    localStorage.setItem(key,FSET_TEXT.value);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// fset_upd flag修正
FSET_UPD.addEventListener("click",() => {
    localStorage.setItem(flagT[flagApos],FSET_TEXT.value);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// fset_del flag削除
FSET_DEL.addEventListener("click",() => {
    localStorage.removeItem(flagT[flagApos]);
    storage_get();
    // 再表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// gen_ok 現在地の変更 OK
GEN_OK.addEventListener("click",() => {
    // 調整セット
    cGen.adjust(true,true,adjX,adjY);
    // 再表示
    cScene.reset("ctrl","flag","gen","gps");
    cScene.set("地図表示");
    if (MAIN_REC.value == "") cScene.rec_set_n();
});
// gen_ng 現在地の変更 NG
GEN_NG.addEventListener("click",() => cScene.reset("ctrl","flag","gen","gps"));
// to start
MAIN_S.addEventListener("click",() => cScene.set("start"));
// to data
MAIN_D.addEventListener("click",() => {
    MAIN_SEL_D.value = "";
    cScene.set("データ")
});
// to info
MAIN_I.addEventListener("click",() => cScene.set("info"));
// main_map 地図選択
MAIN_MAP.addEventListener("click",() => {
    if (con_timerF) {
        cScene.err_disp("記録中は地図の選択不可");
        return;
    }
    MAIN_FILE_M.click();
});
// 地図名
MAIN_NAME.addEventListener("click",() => {
    // 消去 地図表示
    cScene.reset("ctrl","flag");
    cScene.set("地図表示");
});
// main_check_c control表示
MAIN_CHECK_C.addEventListener("change",() => DIV_CTRL.style.display = (MAIN_CHECK_C.checked) ? "block" : "none");
// main_check_f flag表示
MAIN_CHECK_F.addEventListener("change",() => DIV_FLAG.style.display = (MAIN_CHECK_F.checked) ? "block" : "none");
// main_check_h head表示
MAIN_CHECK_H.addEventListener("change",() => DIV_HEAD.style.display = (MAIN_CHECK_H.checked) ? "block" : "none");
// main_check_l log表示
MAIN_CHECK_L.addEventListener("change",() => DIV_LOG.style.display = (MAIN_CHECK_L.checked) ? "block" : "none");
// main_check_e etc表示
MAIN_CHECK_E.addEventListener("change",() => DIV_ETC.style.display = (MAIN_CHECK_E.checked) ? "block" : "none");
// main_file_h 保存データ選択
MAIN_FILE_H.addEventListener("change",(e) => {
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
                tbody_append(TBO_ALL,text[0],text[1]);
            }
        }
    }
});
// main_file_m 地図データ選択
MAIN_FILE_M.addEventListener("change",(e) => {
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
    INFO_ARROW.innerHTML = "";
    // 地図読込
    cImage.src = file_url;
    MAIN_NAME.innerHTML = file_name;
});
// main_exe 実行
MAIN_EXE.addEventListener("click",() => {
    switch (MAIN_SEL_D.value) {
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
            let id  = MAIN_SEL_H.value.slice(8,10);
            let txt = MAIN_SEL_H.value.slice(11);
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
            MAIN_SEL_D.value = "";
            break;
    }        
});
// main_erase 消去
MAIN_ERASE.addEventListener("click",() => {
    cArrow.clear();
    INFO_ARROW.innerHTML = "";
    cScene.set("start");
});
// main_flag 選択削除 flag
MAIN_FLAG.addEventListener("click",() => {
    if (!confirm('flag 削除 OK')) return;
    for (item of flagT) localStorage.removeItem(item);
    tbody_detete(TBO_HEAD,TBO_FLAG,TBO_LOG);
    tbo_hfl_disp();
});
// main_log 選択削除 log
MAIN_LOG.addEventListener("click",() => {
    if (!confirm('log 削除 OK')) return;
    for (item of logT) localStorage.removeItem(item);
    tbody_detete(TBO_HEAD,TBO_FLAG,TBO_LOG);
    tbo_hfl_disp();
});
// main_rec 記録 yn
MAIN_REC.addEventListener("click",() => rec_yn());
// main_err エラー消去
MAIN_ERR.addEventListener("click",() => cScene.err_clear());
// main_sel_d Data処理
MAIN_SEL_D.addEventListener("change",() => {
    switch (MAIN_SEL_D.value) {
        // 全表示
        case "allDisp":
            tbody_detete(TBO_CTRL,TBO_HEAD,TBO_FLAG,TBO_LOG,TBO_ETC);
            cScene.set("全表示");
            tbo_cfhle_disp();
            break;
        // 選択表示
        case "selDisp":
            cScene.set("選択表示");
            main_sel_h_disp();
            break;
        // 集計表示
        case "sumDisp":
            tbody_detete(TBO_SUMM);
            cScene.set("集計表示");
            tbo_summ_disp();
            break;
        // 全保存
        case "allSave":
            tbody_detete(TBO_ALL);
            cScene.set("全保存");
            tbo_all_disp();
            break;
        // cfh保存
        case "cfhSave":
            tbody_detete(TBO_CTRL,TBO_HEAD,TBO_FLAG);
            cScene.set("cfh保存");
            tbo_cfh_disp();
            break;
        // 選択保存
        case "selSave":
            tbody_detete(TBO_HEAD,TBO_FLAG,TBO_LOG);
            cScene.set("選択保存");
            main_sel_h_disp();
            break;
        // 保存追加
        case "fileAdd":
            MAIN_FILE_H.click();
            tbody_detete(TBO_ALL);
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
MAIN_SEL_H.addEventListener("change",() => {
    tbody_detete(TBO_HEAD,TBO_FLAG,TBO_LOG);    
    switch (MAIN_SEL_D.value) {
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
MAIN_SEL_M.addEventListener("change",() => {
    switch (MAIN_SEL_M.value) {
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
// act_ins 追加
document.getElementById("act_ins").addEventListener("click",() => {
    let key = ACT_KEY.value;
    let val = ACT_VALUE.value;
    let rtn = confirm(`追加 キー:${key},内容:${val}`);
    if (rtn) localStorage.setItem(key,val);
    // 更新後再表示
    tbo_redisp();
});
// act_upd 修正
document.getElementById("act_upd").addEventListener("click",() => {
    let key = ACT_KEY.value;
    let val = ACT_VALUE.value;
    let rtn = confirm(`修正 キー:${key},内容:${val}`);
    if (rtn) {
        localStorage.removeItem(key_save);
        localStorage.setItem(key,val);
    }
    // 更新後再表示
    tbo_redisp();
});
// act_del 削除
document.getElementById("act_del").addEventListener("click",() => {
    let key = ACT_KEY.value;
    let val = ACT_VALUE.value;
    let rtn = confirm(`削除 キー:${key},内容:${val}`);
    if (rtn) {localStorage.removeItem(key)}
    // 更新後再表示
    tbo_redisp();
});
// config_upd 更新
document.getElementById("config_upd").addEventListener("click",() => {
    let long = ("0000" + Number(CONFIG_LONG.value)).slice(-4);
    let timerG = ("0000" + Number(CONFIG_TIMERG.value)).slice(-4);
    let timerL = ("0000" + Number(CONFIG_TIMERL.value)).slice(-4);
    let time = (CONFIG_TIME.innerHTML == "-") ? "n" : "y";
    let line = (CONFIG_LINE.innerHTML == "-") ? "n" : "y";
    let info = (CONFIG_INFO.innerHTML == "-") ? "n" : "y";
    let str = `${long} ${timerG} ${timerL} ${time}${line}${info}`;
    CONFIG_LONG.value = long;
    CONFIG_TIMERG.value = timerG;
    CONFIG_TIMERL.value = timerL;
    localStorage.setItem(MAP_CTRL,str);
});
// gps_ok GPSの値に変更 OK
document.getElementById("gps_ok").addEventListener("click",() => {
    // 調整セット
    cGen.adjust(true,true,0,0);
    // 再表示
    cScene.reset("ctrl","flag","gen","gps");
    if (MAIN_REC.value == "") cScene.rec_set_n();
});
// gps_get GPS再取得
document.getElementById("gps_get").addEventListener("click",() => {
    navigator.geolocation.getCurrentPosition(gen_ok_m,gen_err,gen_opt);
});
// gps_log_d log削除
document.getElementById("gps_log_d").addEventListener("click",() => tbo_iii_log_del());
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
    MAIN_SEL_M.value = "";
    cScene.set("start");
    window.scrollTo({top:0,left:0,behavior:'smooth'});
});
// iii_log_d log削除
document.getElementById("iii_log_d").addEventListener("click",() => tbo_iii_log_del());
// iii_rec 記録 yn
document.getElementById("iii_rec").addEventListener("click",() => rec_yn());
// iii_x 消去
document.getElementById("iii_x").addEventListener("click",() => cScene.reset('iii'));
// 地図読込完了
cImage.onload = () => {
    MAIN_SEL_M.value = "genSet";
    // 矢印情報セット
    cArrow.size(cImage.width,cImage.height)
    // 地図情報セット
    CANVAS_MAIN.width   = cImage.width;
    CANVAS_MAIN.height  = cImage.height;
    CANVAS_FLAG.width   = cImage.width;
    CANVAS_FLAG.height  = cImage.height;
    CANVAS_LOG.width    = cImage.width;
    CANVAS_LOG.height   = cImage.height;
    DIV_MAIN.style.width = cImage.width + "px";
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
        CONFIG_LONG.value = x.slice(0,4);
        CONFIG_TIMERG.value = x.slice(5,9);
        CONFIG_TIMERL.value = x.slice(10,14);
        con_long = Number(CONFIG_LONG.value) * 1000;
        con_timerG = Number(CONFIG_TIMERG.value);
        con_timerL = Number(CONFIG_TIMERL.value) / 60;
        con_dispTime = x.slice(15,16);
        con_dispLine = x.slice(16,17);
        con_dispInfo = x.slice(17,18);
        cScene.time_set(con_dispTime);
        cScene.line_set(con_dispLine);
        cScene.info_set(con_dispInfo);
    }
    cScene.set("start");
    headA_set();
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
    cGen.set(gen);
    adjX = mouseUpX - cGen.x; // 調整 x
    adjY = mouseUpY - cGen.y; // 調整 y
    cScene.reset("flag","gps","gen");
    cScene.gps(CON_FLAG,cGen.x,cGen.y);
    cScene.gen(CON_FLAG,mouseUpX,mouseUpY);
}
// 現在地取得成功 地図読込完了、GPS再取得
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
    let sel = MAIN_SEL_H.options;
    for (let i = sel.length - 1; i > -1; i--) {
        if (!sel[i].selectid) MAIN_SEL_H.removeChild(sel[i]);
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
        MAIN_SEL_H.appendChild(opt);
    }
    MAIN_SEL_H.value = "";
}
// マウスup
function mouse_up(x,y) {
    // マウス up - down 長押
    mouseUpX = Math.round(x);
    mouseUpY = Math.round(y);
    mouseUpDate = new Date();
    if (mouseUpDate.getTime() - mouseDownDate.getTime() < con_long) return;
    // 現在地設定、地図表示は、長押しで現在地取得
    if (MAIN_SEL_M.value == "mapDisp" || MAIN_SEL_M.value == "genSet") {
        navigator.geolocation.getCurrentPosition(gen_ok_long,gen_err,gen_opt);
    }
}
// 記録 yn
function rec_yn() {
    // 初期状態時は記録n
    if (MAIN_REC.value == "") {
        cScene.rec_set_n();
        return;
    }
    // 記録状態変更
    cScene.rec_change();
    if (MAIN_REC.value == "y") {
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
    for (item of key_all) tbody_append(TBO_ALL,item,localStorage.getItem(item));
}
// tbo_all クリック
function tbo_all_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_ALL.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_ALL.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;    
}
// tbo_cfh 表示
function tbo_cfh_disp() {
    // con,flag,head 取得
    ctrlT = [];
    headT = [];
    flagT = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if      (x.slice(0,7) == MAP_CTRL) {ctrlT.push(x)}
        else if (x.slice(0,8) == MAP_FLAG) {flagT.push(x)}
        else if (x.slice(0,8) == MAP_HEAD) {headT.push(x)}
    }
    // 行追加 ctrl
    ctrlT.sort();
    for (item of ctrlT) tbody_append(TBO_CTRL,item,localStorage.getItem(item));
    // 行追加 head
    headT.sort();
    for (item of headT) tbody_append(TBO_HEAD,item,localStorage.getItem(item));
    // 行追加 flag
    flagT.sort();
    for (item of flagT) tbody_append(TBO_FLAG,item,localStorage.getItem(item));
}
// tbo_cfhle 表示
function tbo_cfhle_disp() {
    // con,flag,head,log,etc 取得
    ctrlT = [];
    flagT = [];
    headT = [];
    logT = [];
    etcT = [];
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if      (x.slice(0,7) == MAP_CTRL) {ctrlT.push(x)}
        else if (x.slice(0,8) == MAP_FLAG) {flagT.push(x)}
        else if (x.slice(0,8) == MAP_HEAD) {headT.push(x)}
        else if (x.slice(0,8) == MAP_LOG) {logT.push(x)}
        else {etcT.push(x)}
    }
    // 行追加 ctrl
    ctrlT.sort();
    for (item of ctrlT) tbody_append(TBO_CTRL,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_CTRL.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_CTRL.rows[r].cells[c].onclick = function() {tbody_click(TBO_CTRL,this)}
        }
    }
    // 行追加 flag
    flagT.sort();
    for (item of flagT) tbody_append(TBO_FLAG,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_FLAG.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_FLAG.rows[r].cells[c].onclick = function() {tbody_click(TBO_FLAG,this)}
        }
    }
    // 行追加 head
    headT.sort();
    for (item of headT) tbody_append(TBO_HEAD,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_HEAD.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_HEAD.rows[r].cells[c].onclick = function() {tbody_click(TBO_HEAD,this)}
        }
    }
    // 行追加 log
    logT.sort();
    for (item of logT) tbody_append(TBO_LOG,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_LOG.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_LOG.rows[r].cells[c].onclick = function() {tbody_click(TBO_LOG,this)}
        }
    }
    // 行追加 etc
    etcT.sort();
    for (item of etcT) tbody_append(TBO_ETC,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_ETC.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_ETC.rows[r].cells[c].onclick = function() {tbody_click(TBO_ETC,this)}
        }
    }
    // 表示
    DIV_CTRL.style.display = (MAIN_CHECK_C.checked) ? "block" : "none";
    DIV_FLAG.style.display = (MAIN_CHECK_F.checked) ? "block" : "none";
    DIV_HEAD.style.display = (MAIN_CHECK_H.checked) ? "block" : "none";
    DIV_LOG.style.display = (MAIN_CHECK_L.checked) ? "block" : "none";
    DIV_ETC.style.display = (MAIN_CHECK_E.checked) ? "block" : "none";
}
// tbo 再表示
function tbo_redisp() {
    if (MAIN_SEL_D.value == "allDisp") {
        tbody_detete(TBO_CTRL,TBO_HEAD,TBO_FLAG,TBO_LOG,TBO_ETC);
        tbo_cfhle_disp();
    } else {
        tbody_detete(TBO_HEAD,TBO_FLAG,TBO_LOG);
        tbo_hfl_disp();
    }
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
        let row = TBO_SUMM.insertRow();
        row.insertCell().appendChild(k);
        row.insertCell().appendChild(f);
        row.insertCell().appendChild(fx);
        row.insertCell().appendChild(l);
        row.insertCell().appendChild(lx);
        // onclick イベント追加
        if (fx.data == "d") {
            let rc = TBO_SUMM.rows[row.sectionRowIndex].cells[2];
            rc.onclick = function() {tbo_summ_flag_del(k)}
        }
        if (lx.data == "d") {
            let rc = TBO_SUMM.rows[row.sectionRowIndex].cells[4];
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
    tbody_detete(TBO_SUMM);
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
    tbody_detete(TBO_SUMM);
    tbo_summ_disp();
}
// log 削除 (iii)
function tbo_iii_log_del() {
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
    let strHead = MAP_HEAD + MAIN_SEL_H.value.substr(8,2);
    let strFlag = MAP_FLAG + MAIN_SEL_H.value.substr(8,2);
    let strLog = MAP_LOG + MAIN_SEL_H.value.substr(8,2);
    for (let i = 0; i < localStorage.length; i++) {
        let x = localStorage.key(i);
        if      (x.slice(0,10) == strFlag) {flagT.push(x)}
        else if (x.slice(0,10) == strHead) {headT.push(x)}
        else if (x.slice(0,10) == strLog) {logT.push(x)}
    }
    // 行追加 head
    headT.sort();
    for (item of headT) tbody_append(TBO_HEAD,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_HEAD.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_HEAD.rows[r].cells[c].onclick = function() {tbody_click(TBO_HEAD,this)}
        }
    }
    // 行追加 flag
    flagT.sort();
    for (item of flagT) tbody_append(TBO_FLAG,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_FLAG.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_FLAG.rows[r].cells[c].onclick = function() {tbody_click(TBO_FLAG,this)}
        }
    }
    // 行追加 log
    logT.sort();
    for (item of logT) tbody_append(TBO_LOG,item,localStorage.getItem(item));
    for (let r = 0; r < TBO_LOG.rows.length; r++) {
        for (let c = 0; c < 2; c++) {
            TBO_LOG.rows[r].cells[c].onclick = function() {tbody_click(TBO_LOG,this)}
        }
    }
    ACT_KEY.value = "";
    ACT_VALUE.value = "";    
}
// tbo_ctrl クリック
function tbo_ctrl_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_CTRL.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_CTRL.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
}
// tbo_head クリック
function tbo_head_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_HEAD.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_HEAD.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
}
// tbo_flag クリック
function tbo_flag_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_FLAG.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_FLAG.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
}
// tbo_log クリック
function tbo_log_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_LOG.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_LOG.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
}
// tbo_etc クリック
function tbo_etc_click(x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = TBO_ETC.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = TBO_ETC.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
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
// tbody クリックイベント追加
function tbody_click(ctrl,x) {
    let r = x.parentNode.rowIndex - 1;
    ACT_KEY.value = ctrl.rows[r].cells[0].innerHTML;
    ACT_VALUE.value = ctrl.rows[r].cells[1].innerHTML;
    key_save = ACT_KEY.value;
    val_save = ACT_VALUE.value;
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
let can_rect = CANVAS_MAIN.getBoundingClientRect();
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
