// 変換
class Convert {
    set(left,right,bottom,top,width,height){
        this.left   = Number(left);
        this.right  = Number(right);
        this.bottom = Number(bottom);
        this.top    = Number(top);
        this.width  = Number(width);
        this.height = Number(height);
        return ""; 
    }
    // 経度-->width 変換
    long_px(long) {
        return Math.round(this.width * (long - this.left) / (this.right - this.left));
    }
    // width-->経度 変換
    px_long(x) {
        return Math.round((this.left + (this.right - this.left) * x / this.width) * 1000000) / 1000000;
    }
    // 緯度-->height 変換
    lat_py(lat) {
        return Math.round(this.height * (this.top - lat) / (this.top - this.bottom));
    }
    // height-->緯度 変換
    py_lat(y) {
        return Math.round((this.top + (this.bottom - this.top) * y / this.height) * 1000000) / 1000000;
    }
}
// フラグ
class Flag {
    constructor() {
        this.value; // そのまま
        this.px;    // 丸位置 x
        this.py;    // 丸位置 y
        this.tx;    // 文字位置 x
        this.ty;    // 文字位置 y
        this.color; // 色
        this.text;  // 文字
    }
    // セット
    set(txt) {
        this.value = txt;
        let v = txt.split(/\s+/); // 連続する空白で分割
        if (v.length < 4) {
            this.px    = 100;
            this.py    = 300;
            this.tx    = 150;
            this.ty    = 350;
            this.color = "red";
            this.text  = `項目不足:${txt}`;
        } else if (v.length == 4) { 
            this.px    = v[0];
            this.py    = v[1];
            this.pos_color(v[2]);
            this.text  = v[3];
        } else {
            this.px    = v[0];
            this.py    = v[1];
            this.pos_color(v[2]);
            this.text = txt.replace(v[0],"").replace(v[1],"").replace(v[2],"").trim();
        }
    }
    // 位置・色
    pos_color(str) {
        // 色検出
        this.color = "black";
        let colorA = {
            a: "aqua",
		    b: "blue",
		    f: "fuchsia",
		    g: "green",
            l: "lime",
		    m: "maroon",
            o: "olive",
            p: "purple",
            r: "red",
            t: "teal",
            y: "yellow",
        }
        let strX = str;
        for (let i = 0; i < str.length; i++) {
            let s = str.substr(i,1);
            if (s in colorA) {
                this.color = colorA[s];
                strX.replace(s,"");
            }
        }
        // 吹出位置
        this.tx = this.px;
        this.ty = this.py;
        for (let i = 0; i < strX.length; i++) {    
            let s = strX.substr(i,1);
            if (s == "n") this.ty = Number(this.ty) - 50;
            if (s == "s") this.ty = Number(this.ty) + 50;
            if (s == "w") this.tx = Number(this.tx) - 50;
            if (s == "e") this.tx = Number(this.tx) + 50;
        }
    }
    // 吹出 flag 描画
    display(con,px,py,tx,ty,color,text) {
        con.font = FONT_CHAR;
        let len = con.measureText(text);    // 幅測定
        // 丸作成
        con.beginPath();
        con.strokeStyle = color;            // 線の色
        con.fillStyle = color;              // 塗りつぶし色
        con.arc(px,py,5,0,Math.PI*2,true);
        con.fill();                         // 塗りつぶし
        con.stroke();
        // 四角形作成
        con.beginPath();
        con.lineWidth = 2;    
        con.fillStyle = color;
        con.strokeRect(tx-5,ty-12,len.width+10,25);
        // 文字列描画
        con.fillText(text,tx,Number(ty)+8);
        // 直線作成
        con.beginPath();
        con.lineWidth = 2;
        con.strokeStyle = color;
        con.moveTo(px,py);
        con.lineTo(tx-5,ty);
        con.stroke();
    }
}
// 現在地
class Genzai {
    constructor() {
        this.a;             // 現在地 高度
        this.h;             // 現在地 方角
        this.s;             // 現在地 速度
        this.long;          // 現在地 経度
        this.lat;           // 現在地 緯度
        this.x;             // 現在地 x
        this.y;             // 現在地 y
        this.mapX           // 地図上 x
        this.mapY           // 地図上 y
        this.m = "";        // 現在地取得メッセージ
        this.view = false;  // 現在地 GPS位置 true:描画中 false:非描画中
        this.adjMd;         // 調整位置取得、日付
        this.adjHm;         // 調整位置取得、時間
        this.adjF = false;  // 調整設定      true:済   false:未
        this.adjL = false;  // 調整 log 出力 true:必要 false:不要
        this.adjX = 0;      // 調整 x
        this.adjY = 0;      // 調整 y
    }
    // 初期化
    clear() {
        this.adjF = false;
        this.adjL = false;
        this.adjX = 0;
        this.adjY = 0;
    }
    // セット
    set(gen) {
        this.a    = gen.coords.altitude;
        this.h    = gen.coords.heading;
        this.s    = gen.coords.speed;
        this.long = Math.round(gen.coords.longitude * 1000000) / 1000000;
        this.lat  = Math.round(gen.coords.latitude * 1000000) / 1000000;
        this.x    = cConv.long_px(this.long);
        this.y    = cConv.lat_py(this.lat);
        this.m    = "";
    }
    // セット adjusr
    adjust(flag,log,ax,ay) {
        let dt = new Date();
        let mm = ("00" + (dt.getMonth()+1)).slice(-2);
        let dd = ("00" +  dt.getDate()).slice(-2);
        let HH = ("00" + (dt.getHours())).slice(-2);
        let MM = ("00" + (dt.getMinutes())).slice(-2);
        this.adjMd = `${mm}${dd}`;
        this.adjHm = `${HH}${MM}`;
        this.adjF  = flag;
        this.adjL  = log;
        this.adjX  = ax;
        this.adjY  = ay;  
    }
    // 現在地 描画
    display(con,dx,dy,color) {
        this.view = true;
        this.mapX = Math.min(Math.max(0,dx),canvas_main.width);
        this.mapY = Math.min(Math.max(0,dy),canvas_main.height);
        let background = "white";
        switch (color) {
            case "green":
                background = "rgb(222,248,220)";
                break;
            case "red":
                background = "rgb(255,192,203)";
                break;
            case "blue":
                background = "rgb(224,255,255)";
        }
        // 丸
        con.beginPath();
        con.arc(this.mapX,this.mapY,15,0,Math.PI*2,true);
        con.fillStyle = background;
        con.fill();
        con.strokeStyle = color;
        con.lineWidth = 2;
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(this.mapX,this.mapY,10,0,Math.PI*2,true);
        con.fill();
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(this.mapX,this.mapY,5,0,Math.PI*2,true);
        con.fill();
        con.stroke();
    }
}
// head内容
class Head {
    constructor() {
        this.key;
        this.value;
        this.id="";
        this.name;
        this.nameEx;
        this.left;
        this.right;
        this.bottom;
        this.top;
        this.logCount;
        this.flagCount;
    };
    // セット
    set(key,value,id,name,nameEx,left,right,bottom,top) {
        this.key        = key;
        this.value      = value;
        this.id         = id;
        this.name       = name;
        this.nameEx     = nameEx;
        this.left       = left;
        this.right      = right;
        this.bottom     = bottom;
        this.top        = top;
        this.logCount   = 0;
        this.flagCount  = 0;
    }
}
// 時間の色
const COLOR_T = [
    "#000000","#000000","#000000","#000000","#000000","#000000","#0000ff","#8f0000",
    "#8f8f00","#008f00","#8f00ff","#ff00ff","#ff0000","#ff00ff","#8f00ff","#008f00",
    "#8f8f00","#8f0000","#0000ff","#000000","#000000","#000000","#000000","#000000"];
// ログ      
class Log {
    constructor() {
        this.md;        // 月日
        this.hm;        // 時分
        this.long;      // 経度
        this.lat;       // 緯度
        this.x;         // 調整 x
        this.y;         // 調整 y
        this.dir;       // 吹出方向,e:東,w:西,s:南,n:北,無指定:東
        this.l_first;   // 一件目 log
        this.l_md;      // log save 月日
        this.l_minute;  // log save 分
        this.l_px;      // log save 丸x
        this.l_py;      // log save 丸y
        this.s_first;   // 一件目 storage
        this.s_md;      // storage save 月日
        this.s_minute;  // storage save 分
    }
    // 開始状態
    first() {
        this.l_first = true;
        this.s_first = true;
    }
    // セット
    set(key,value,ax,ay) {
        let k = key.split("_");
        let v = value.split(/\s+/); // 連続する空白で分割
        this.md   = k[3];
        this.hm   = k[4].substr(0,4);
        this.long = v[0];
        this.lat  = v[1];
        if (k[4].substr(4,1) == "a") {
            this.x = v[2];
            this.y = v[3];
        } else {
            this.x = ax;
            this.y = ay;            
        }
        if (v.length == 3) {
            this.dir = v[2];
        } else {
            this.dir = "e";
        }
    }
    // Web Storage 出力
    storage(map,id,md,hm,opt,long,lat,ax,ay) {
        let draw = false;
        let minute = hm.substr(0,2) * 60 + Number(hm.substr(2,2));        
        if (this.s_first) {
            this.s_md = md;
            this.s_minute = minute + 1;    // 次の分
            draw = true;
        } else if (md != this.s_md) {
            this.s_md = md;
            this.s_minute = 0;
            draw = true;
        } else if (minute >= this.s_minute) {
            this.s_minute = minute + 1;             
            draw = true;
        }
        if (draw) {
            let key = `${map}${id}_${md}_${hm}${opt}`;
            let val = `${long} ${lat} ${ax} ${ay}`;
            localStorage.setItem(key,val);
        }
        this.s_first = false;
    }
    // 吹出 log 描画
    display(con,sel,md,hm,long,ax,lat,ay,dir) {
        // 色の選択
        let color = COLOR_T[Number(hm.substr(0,2))]; 
        // 箱・線の位置
        let text = `${hm.substr(0,2)}:${hm.substr(2,2)}`;
        let bx;         // 箱・左上x
        let by;         // 箱・左上y
        let bh = 22;    // 箱・高
        let bw = 56;    // 箱・幅 74
        let lx;         // 線・終端x
        let ly;         // 線・終端y
        let llx = 50;   // 線・長x
        let lly = 20;   // 線・長y 
        let px = cConv.long_px(long) + Number(ax);  // 丸x
        let py = cConv.lat_py(lat) + Number(ay);    // 丸y
        // 吹出(log)方向での箱・線の位置 
        switch (dir) {
            case "n":
                // 北
                bx = px - bw / 2;
                by = py - lly - bh;
                lx = px;
                ly = py - lly;
                break;
            case "s":
                // 南
                bx = px - bw / 2;
                by = py + lly;
                lx = px;
                ly = py + lly;
                break;
            case "w":
                // 西
                bx = px - llx - bw;
                by = py - bh / 2;
                lx = px - llx;
                ly = py;
                break;
            default:
                // 東
                bx = px + llx;
                by = py - bh / 2; // 上に
                lx = px + llx;
                ly = py;
        }
        con.font = FONT_TIME;
        // 丸作成
        con.beginPath();
        con.strokeStyle = color;            // 線の色
        con.fillStyle = color;              // 塗りつぶし色
        con.arc(px,py,3,0,Math.PI*2,true);
        con.fill();                         // 塗りつぶし
        con.stroke();
        // 時間吹出判定
        let draw = false;
        let minute = hm.substr(0,2) * 60 + Number(hm.substr(2,2));
        switch (sel) {
            // 表示時間・表示線時
            case "aDispT":
            case "aDispB":
                draw = true;
                break;
            // 表示・表示線
            default:
                if (this.l_first) {
                    this.l_md = md;
                    this.l_minute = minute + con_timerL;    // 次の分
                    draw = true;
                } else if (md != this.l_md) {
                    this.l_md = md;
                    this.l_minute = 0;
                    draw = true;
                } else if (minute >= this.l_minute) {
                    this.l_minute = minute + con_timerL;             
                    draw = true;
                }
                break;                
        }
        // 時間吹出作成
        if (draw) {
            // 四角形作成
            con.beginPath();
            con.lineWidth = 2;    
            con.fillStyle = color;
            con.strokeRect(bx,by,bw,bh);
            // 文字列描画
            con.fillText(text,bx+2,by+17);
            // 直線作成
            con.beginPath();
            con.lineWidth = 2;
            con.strokeStyle = color;
            con.moveTo(px,py);
            con.lineTo(lx,ly);
            con.stroke();           
        }
        // 丸～丸の線作成
        if ((sel == "aDispB" || sel == "aDispL") && (!this.l_first)) {
            con.beginPath();
            con.lineWidth = 2;
            con.strokeStyle = "black";
            con.moveTo(px,py);
            con.lineTo(this.l_px,this.l_py);
            con.stroke();
        }
        this.l_px = px;
        this.l_py = py;
        this.l_first = false;
    }
}
// 画面
class Scene {
    constructor() {
        this.m_c;
        this.m_d;
        this.m_i;
        this.m_sel_d;
        this.m_sel_h;
        this.m_exe;
        this.m_flag;
        this.m_log;
        this.m_map;
        this.m_name;
        this.m_m;
        this.m_sel_m;
        this.d_config;
        this.d_act;
        this.d_all;
        this.d_ctrl;
        this.d_head;
        this.d_flag;
        this.d_log;
        this.d_summ;
        this.d_info;
        this.d_canvas;
        // info data
        this.info_cnt = 0;
        this.info_save = "";
    }
    // エラー消去
    err_clear() {
        main_err.value = "";
        main_err.style.display = "none";
    }
    // エラー表示
    err_disp(mess) {
        main_err.textContent = mess;
        main_err.style.display = "inline";
    }
    // 現在地
    gen(con,x,y) {
        // 丸
        con.beginPath();
        con.arc(x,y,15,0,Math.PI*2,true);
        con.fillStyle = "rgb(222,248,220)";
        con.fill();
        con.strokeStyle = "green";
        con.lineWidth = 2;
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(x,y,10,0,Math.PI*2,true);
        con.fill();
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(x,y,5,0,Math.PI*2,true);
        con.fill();
        con.stroke();
        // div_gen 表示
        div_gen.style.left = x - 30 + "px";
        div_gen.style.top  = y + 50 + "px";
        div_gen.style.display = "block";
        gen_ok.style.display = "inline";
        gen_ng.style.display = "inline";
    }
    // GPS
    gps(con,x,y) {
        let xx = Math.min(Math.max(0,x),canvas_main.width);
        let yy = Math.min(Math.max(0,y),canvas_main.height);
        // 丸
        con.beginPath();
        con.arc(xx,yy,15,0,Math.PI*2,true);
        con.fillStyle = "rgb(255,192,203)";
        con.fill();
        con.strokeStyle = "red";
        con.lineWidth = 2;
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(xx,yy,10,0,Math.PI*2,true);
        con.fill();
        con.stroke();
        // 丸
        con.beginPath();
        con.arc(xx,yy,5,0,Math.PI*2,true);
        con.fill();
        con.stroke();
        // div_gps 表示
        div_gps.style.left = xx - 30 + "px";
        div_gps.style.top  = yy + 50 + "px";
        div_gps.style.display = "block";
    }
    // info表示・変更
    info_set(yn) {(yn == "y") ? config_info.innerHTML = "✓" : config_info.innerHTML = "－";}
    info_change(yn) {
        if (yn == "n") {
            con_dispInfo = "y";
            config_info.innerHTML = "✓";
        } else {
            con_dispInfo = "n";
            config_info.innerHTML = "－";
        }
    }
    // info 初期化
    info_clear() {
        this.info_cnt = 0;
        this.info_save = "";
        pre_info.innerHTML = "";
    }
    // info 表示
    info_disp(info) {
        if (con_dispInfo == "n") return;
        if (info == this.info_save && this.info_cnt < 9) {
            this.info_cnt++;
            pre_info.innerHTML = pre_info.innerHTML.substring(0,pre_info.innerHTML.length - 1) + "↑\n";
        } else {
            let dt = new Date();
            let HH = ("00" + (dt.getHours())).slice(-2);
            let MM = ("00" + (dt.getMinutes())).slice(-2);
            pre_info.innerHTML += `${HH}:${MM} ${info}\n`;
            this.info_cnt = 0;
            this.info_save = info;
        }
    }
    // 線表示・変更
    line_set(yn) {(yn == "y") ? config_line.innerHTML = "✓" : config_line.innerHTML = "－";}
    line_change(yn) {
        if (yn == "n") {
            con_dispLine = "y";
            config_line.innerHTML = "✓";
        } else {
            con_dispLine = "n";
            config_line.innerHTML = "－";
        }
    }
    // 全時間表示・変更
    time_set(yn) {(yn == "y") ? config_time.innerHTML = "✓" : config_time.innerHTML = "－";}
    time_change(yn) {
        if (yn == "n") {
            con_dispTime = "y";
            config_time.innerHTML = "✓";
        } else {
            con_dispTime = "n";
            config_time.innerHTML = "－";
        }
    }
    // 記録変更
    rec_change() {(main_rec.value == "y") ? this.rec_set_n() : this.rec_set_y()}
    // 記録初期化
    rec_clear() {
        main_rec.value = ""
        main_rec.style.display = "none";
    }
    // 記録n
    rec_set_n() {
        main_rec.value ="n";
        main_rec.innerHTML = "🔵";
        main_rec.style.display = "inline";
    }
    // 記録y
    rec_set_y() {
        main_rec.value ="y";
        main_rec.style.display = "inline";
        main_rec.innerHTML = "🔴";
    }
    // セット
    set(key) {
        // none セット
        this.m_c      = "none";
        this.m_d      = "none";
        this.m_i      = "none";
        this.m_sel_d  = "none";
        this.m_sel_h  = "none";
        this.m_exe    = "none";
        this.m_erase  = "none";
        this.m_flag   = "none";
        this.m_log    = "none";
        this.m_map    = "none";
        this.m_name   = "none";
        this.m_m      = "none";
        this.m_sel_m  = "none";
        this.d_config = "none";
        this.d_act    = "none";
        this.d_all    = "none";
        this.d_ctrl   = "none";
        this.d_head   = "none";
        this.d_flag   = "none";
        this.d_log    = "none";
        this.d_summ   = "none";
        this.d_info   = "none";
        this.d_canvas = "none";
        switch (key) {
            case "ロード":
                this.m_d      = "inline";
                this.m_i      = "inline";
                this.m_map    = "inline";
                this.m_name   = "inline";
                this.d_config = "block";
                if (main_file.value != "") this.m_m = "inline";
                break;
            case "データ":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                break;
            case "全表示":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.d_act    = "block";
                this.d_all    = "block";
                break;
            case "選択表示":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline";
                break;
            case "選択表示2":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline";
                this.d_act    = "block";
                this.d_head   = "block";
                this.d_flag   = "block";
                this.d_log    = "block";
                break;
            case "集計表示":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.d_summ   = "inline";
                break;
            case "全保存":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_exe    = "inline";
                this.d_all    = "block";
                break;
            case "cfh保存":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_exe    = "inline";
                this.d_ctrl   = "block";             
                this.d_head   = "block";
                this.d_flag   = "block";               
                break;
            case "選択保存":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline";
                break;
            case "選択保存2":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline";                
                this.m_exe    = "inline";
                this.d_head   = "block";
                this.d_flag   = "block";
                this.d_log    = "block";
                break;
            case "保存追加":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                break;
            case "選択削除":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline";
                break;
            case "選択削除2":
                this.m_c      = "inline";
                this.m_sel_d  = "inline";
                this.m_sel_h  = "inline"; 
                this.m_flag   = "inline";
                this.m_log    = "inline";
                this.d_flag   = "block";
                this.d_log    = "block";
                break;
            case "info":
                this.m_c      = "inline";
                this.m_erase  = "inline";
                this.d_info   = "block";
                break;
            case "地図表示":
                this.m_c      = "inline";
                this.m_d      = "inline";
                this.m_sel_m  = "inline";
                this.d_canvas = "block";
                break;
        }
        // main
        main_c.style.display     = this.m_c;
        main_d.style.display     = this.m_d;
        main_i.style.display     = this.m_i;
        main_sel_d.style.display = this.m_sel_d;
        main_sel_h.style.display = this.m_sel_h;
        main_exe.style.display   = this.m_exe;
        main_erase.style.display = this.m_erase;
        main_flag.style.display  = this.m_flag;
        main_log.style.display   = this.m_log;
        main_map.style.display   = this.m_map;
        main_name.style.display  = this.m_name;
        main_m.style.display     = this.m_m;
        main_sel_m.style.display = this.m_sel_m;
        // config
        div_config.style.display = this.d_config;
        // data
        div_act.style.display    = this.d_act;
        div_all.style.display    = this.d_all;
        div_ctrl.style.display   = this.d_ctrl;
        div_head.style.display   = this.d_head;
        div_flag.style.display   = this.d_flag;
        div_log.style.display    = this.d_log;
        div_summ.style.display   = this.d_summ;
        // info
        div_info.style.display   = this.d_info;
        // canvas
        div_canvas.style.display = this.d_canvas;
        // error
        if (main_err.value == "") {
            main_err.style.display = "none";
        } else {
            main_err.style.display = "inline";
        }
    }   
    // リセット
    reset(...act) {
        for (let i = 0 ; i < act.length ; i++){
            switch (act[i]) {
                case "flag":
                    CON_FLAG.clearRect(0,0,canvas_main.width, canvas_main.height);
                    storage_get();
                    for (item of flagA) cFlag.display(CON_FLAG,item.px,item.py,item.tx,item.ty,item.color,item.text);
                    div_ctrl.style.display = "none";
                    break;
                case "log":
                    CON_LOG.clearRect(0,0,canvas_main.width, canvas_main.height);
                    break;
                case "main":
                    CON_MAIN.clearRect(0,0,canvas_main.width, canvas_main.height);
                    CON_MAIN.drawImage(cImage,0,0);
                    break;
                case "fset":
                    div_fset.style.display = "none";
                    break;
                case "gen":
                    div_gen.style.display = "none";
                    break;
                case "gps":
                    div_gps.style.display = "none";
            }
        }
    }
}
// Text処理
class Text {
    // 保存
    save(file,key,text) {
        let str = "data:text/csv;charset=utf-8,";   // 出力方法追加
        for (let i = 0; i < key.length; i++) str += `${key[i]}\t${text[i]}\n`;
        let uri = encodeURI(str);                   // エンコード化
        let ele = document.createElement("a");      // a要素作成
        ele.setAttribute("href", uri);              // a要素に出力データ追加
        ele.setAttribute("download",`${file}.txt`); // a要素に出力情報追加
        ele.style.visibility = "hidden";            // 非表示
        document.body.appendChild(ele);             // コントロール追加
        ele.click();                                // クリックイベント発生
        document.body.removeChild(ele);             // コントロール削除
    }
}
let cConv  = new Convert;
let cFlag  = new Flag;
let cGen   = new Genzai;
let cHead  = new Head;
let cLog   = new Log;
let cMap   = new Map;
let cScene = new Scene;
let cText  = new Text;
