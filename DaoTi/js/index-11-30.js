var rowlength = 20;
var tempwordnum = 70;
var maxShowRow = 20; //屏幕显示行数

var wordlen;
var word = "你好阿！   相对文档 简单测试也没什么问题，但是clientX与clientY获取的是相对于当前屏幕的坐标，忽略页面滚动因素，这在很多条件下很有用，但当我们需要考虑页面滚动，也就是相对于文档（body元素）的坐标时怎么办呢？加上滚动的位移就可以了，下边我们试试怎么计算页面滚动的位移。 其实在Firefox下问题会简单很多，因为Firefox支持属性pageX,与pageY属性，这两个属性已经把页面滚动计算在内了。";
//var bindElement = '"#click1","#click2"';
var tableno = 0;
var mouseUpDownStatus = 0;
var tableRowNum = 0;
var tempword;
var selectedTableId = "content1";
//按下鼠标时行数列数
var firstMouseIndex;
var row;
var column;

//鼠标移动后松开时指针所在位置    /  如果位置未改变不进行处理。
var finalMouseIndex;
var finalRow;
var finalColumn;

//鼠标按下后移动时的位置
var nowMouseIndex;
var nowRow;
var nowColumn;

//鼠标移动时的位移距离。
var moveStep;

window.onload = function() {
	showEditor();
	bindClick();
}

//显示编辑内容
function showEditor() {
	var tableword = "<tr>";
	var temp;
	var range;
	for(var i = 0; i < word.length; i++) {
		if(i % rowlength == 0 && i != 0) {
			tableRowNum++;
			tableword += "</tr><tr>";
		}
		temp = word.charAt(i);
		range = temp.charCodeAt(0);
		if(range < 123 && range > 47) {
			tableword += "<td class='character' >" + temp + "</td>";
		} else {
			tableword += "<td>" + temp + "</td>";
		}
	}
	if(word.length <= rowlength) {
		tableRowNum = 1;
	}
	tableword += "</tr>";
	document.getElementById("content1").innerHTML = tableword;
	wordlen = word.length;
}

//绑定table鼠标点击事件
function bindClick() {
	$(document).ready(function() {
		$('#contents').each(function() {
			$(this).find('table').on('mousedown', function() { //按下鼠标
				mouseUpDownStatus = 1;
				selectedTableId = this.id;
				$("#" + selectedTableId + " tr td").on("mousemove", function() {
					nowColumn = $(this).index();
					nowMouseIndex = $(this).index("td");
				});
				setTimeout(function() {
					firstMouseIndex = nowMouseIndex;
					mouseDownEvent(selectedTableId);
				}, 100);
				// insert2Tr();	
			});
			$(this).find('table').on('mouseup', function() { //放开鼠标
				$("#" + selectedTableId + " tr td").off("mouseenter");
				mouseUpDownStatus = 0;
				mouseUpEvent(selectedTableId);
				finalMouseIndex = nowMouseIndex;
			});
			$(this).find('table').on('mousemove', function() { //移动鼠标
				if(mouseUpDownStatus == 1) {
					mouseMoveEvent(selectedTableId);
				}
				//				console.log(nowMouseIndex);
			});

		})

		});
}

//鼠标按下，点击table执行事件 2017-11-13
function mouseDownEvent(index) {
	//	document.getElementById(index).classList.remove("editedTable");
	var selectedtable = document.getElementById(selectedTableId);
	var r = 1;
	row = Math.floor(firstMouseIndex / rowlength);
	if(wordlen / 20 - row <= maxShowRow) {

		maxShowRow = Math.floor(wordlen / 20) - row;

	}
	while(r < maxShowRow) {
		selectedtable.rows[row + r].classList.add("editTable"); //添加颜色
		r++;
	}
	var c = column;
	while(c < rowlength) {
		selectedtable.rows[row].cells[c].classList.add("tdcss"); //添加颜色
		c++;
	}

}

//鼠标按钮按住并移动，table执行事件   延时执行，间隔0.5秒     //需要考虑-1的情况。
function mouseMoveEvent(index) {
	rowAndColumn();
	console.log("now:" + nowMouseIndex);
	console.log("first:" + firstMouseIndex + ",,," + nowMouseIndex + ":last:" + finalMouseIndex);

	//		reEdit(index);		
	if(nowRow == row && nowColumn > column) { //修改本行数据
		console.log(nowRow + "AAAAAAAAAAAAAAAAA:" + nowColumn);
		reType();
	} else if(nowRow - row == 1 || nowRow - row == 2) { //向下拖1～2行
		console.log("@@@@@@:row:" + nowRow + ",,,column:" + nowColumn);
	} else {
		console.log("bug>>>>>>>");
	}

}


//鼠标按钮放开，table执行事件
function mouseUpEvent(index) {
	//	document.getElementById(index).classList.add("editedTable");
	console.log("Final:::::row:" + finalRow + ",,,column:" + finalColumn);
	afterEdit();
}

//2017-11-16  bug：选中行无法获取该行所在位置。问题原因：插入了新的tr，无法定位。
//解决方案：分离两大块。向下面插入两行选择类型行。
function reType() { //重新排版。
	var trContent;
	nowColumn = nowMouseIndex % rowlength;
	moveStep = nowColumn - column;
	var temploc = row * rowlength + column;
	tempword = word.substr(row * rowlength, column) + word.substr(temploc, tempwordnum);
	for(var i = 0; i < rowlength; i++) {
		if(i >= column && i < nowColumn) {

			trContent += "<td>&nbsp;</td>";
		} else if(i < column) {
			trContent += "<td>" + tempword.substr(i, 1) + "</td>";
		} else {
			trContent += "<td class='tdcss'>" + tempword.substr(i - moveStep, 1) + "</td>";
		}
	}
	$("#content1 tr:eq(" + row + ")").html(trContent);
}

//鼠标按下时，重新给所选行，以及所选行的后2行添加事件监听，直到鼠标键松开
function insert2Tr() {
	var insertAnswer = "  答案    解析";
	var insertTitle = "大标题 小标题 小题";
	var insertWord = "<tr id='insertWord'>";
	var n = 0;
	do {
		insertAnswer += " ";
	} while (n < rowlength - insertAnswer.length);
	n = 0;
	do {
		insertTitle += " ";
	} while (n < rowlength - insertTitle.length);
	n = 0;
	insertAnswer += insertTitle;
	var temp;
	for(var i = 0; i < rowlength * 2; i++) {
		if(i == rowlength) {
			insertWord += "</tr><tr id='insertWord2' class='.trcss'>";
		}
		temp = insertAnswer.charAt(i);
		if(temp == ' ') {
			insertWord += "<td class='tdcss-g'>&nbsp</td>";
		} else {
			insertWord += "<td class='tdcss'>" + temp + "</td>";
		}
	}
	insertWord += "</tr>";
	$("#content1 tr:eq(" + row + ")").before(insertWord);

}

//插入3行的table,上面
function insert3Tr() {
	var word = "答案 解析 大标题小标题小问";
	var insertWord;
	var newtable = "<table id='table" + tableno + "'><tr>";
	for(var i = 0; i < rowlength * 3; i++) {
		if(i % 20 == 0) {
			newtable += "</tr><tr>";
		}
		newtable += "<td>" + word + "</td>";
	}
	newtable += "</tr></table>";

}

//松开鼠标按键，定位鼠标位置，重新排版文字。
function afterEdit() {
	var selectedtable = document.getElementById(selectedTableId);
	var r = 1;
	while(r < maxShowRow) {
		selectedtable.rows[row + r].classList.remove("editTable"); //去除颜色
		r++;
	}
	var c = column;
	while(c < rowlength) {
		selectedtable.rows[row].cells[c].classList.remove("tdcss"); //去除颜色
		c++;
	}
}

//求出当前鼠标键头所在的行与列
function rowAndColumn() {
	column = firstMouseIndex % rowlength;
	row = Math.floor(firstMouseIndex / rowlength);
	nowColumn = nowMouseIndex % rowlength;
	nowRow = Math.floor(nowMouseIndex / rowlength);
	finalcolumn = finalMouseIndex % rowlength;
	finalrow = Math.floor(finalMouseIndex / rowlength);
}

//载入添加单题模块。   1.获取长和宽   
function insertDiv() {
	var dom = "  ";

}

//添加选择内容到编辑框  addSelectedTextToEditDiv
function addQuestion() {
	var ques = getSelectedText();
	//	var regex =new RegExp("	","g");
	//	ques = ques.replace(regex,"");
	$("#question").val(ques);
}

//文本选中
function getSelectedText() {
	var selectionObj = null;
	var rangeObj = null;
	var selectedText = "";

	if(isIE() == "1") {
		selectionObj = document.selection;　　　　
		rangeObj = selectionObj.createRange();
		selectedText = rangeObj.text;
	} else {　
		if(window.getSelection) {　　　　　　　
			selectionObj = window.getSelection();　　
			selectedText = selectionObj.toString();　　　　
		} else if(document.selection) {　　　　　　　
			selectionObj = document.selection;　　　　　
			rangeObj = selectionObj.createRange();　　　　　　　
			selectedText = rangeObj.text;　　　　　　　　　　　　
		}
	}
	var result = "";
//	for(var i = 0; i < selectedText.length; i = i + 2) {
//		result += selectedText.charAt(i);
//		console.log(i + "<<<<<<" + selectedText.charAt(i));
//	}
	for(var i = 0; i < selectedText.length; i++) {
		if(selectedText.charAt(i) != '	') {
			result += selectedText.charAt(i);
		}
		console.log(i + "<<<<<<" + selectedText.charAt(i));
	}

	console.log(">>>>>>" + selectedText);
	return result;
}

//判断是否是IE浏览器  
function isIE() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器  
	if(isIE) {
		return "1";
	} else {
		return "-1";
	}
}

//先跳过该模块的开发。 date:2017-11-30
//对每个空格（td）进行鼠标操作记录，按下（click）一次，进行一次标记，再按一次取消记录。
// function markTrForSelected(){
// 	var beginTag = -1;
// 	var endTag = -1;
// 	var selectedTag;
	
// 	// 4 种情况:
// 	// 1）起点值和终点值都没有设置。   beginTag == -1； endTag == -1；   =>  beginTag == selectedTag;
// 	//		1.1）
// 	//		1.2）
// 	// 2）起点位置已经设置，终点位置未设置。  beginTag ！= -1； endTag == -1；  =>   endTag == selectedTag;
// 	//		2.1）
// 	//		2.2）
// 	//		2.3）
// 	// 3）起点位置和终点位置都已经设置。   beginTag ！= -1； endTag ！= -1；   => 
// 	//      3.1) 点击位置小于起点位置	
// 	//		3.2) 点击位置大于终点点位置  
// 	//		3.3) 点击位置在起点位置和终点位置中间。
// 	//
// 	// 4）起点位置被取消，终点位置已设置。 beginTag == -1； endTag ！= -1；
// 	//		4.1）
// 	//		4.2）
// 	//		4.3）


// 	if(sleletedTag == -1){
// 		return false;
// 	}

// 	if(beginTag == selectedTag){	//取消开始位置
// 		if(beginTag==-1){  //未设置值，设置值。

// 		}else{

// 		}
// 	}else if(endTag == selectedTag){  //取消结束位置

// 	}
// 	if(beginTag==-1){ //如果开始位置未设置，就先设置开始位置。
			
// 	}
// 	else if(endTag==-1){  //如果结束位置未设置，就设置结束位置。

// 	}else if(beginTag>endTag){  //如果开始位置已经设置，点击位置小于开始位置，则改变开始位置为选中位置

// 	}else if(){

// 	}

// }





