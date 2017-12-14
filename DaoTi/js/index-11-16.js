var rowlength = 20;
var tempwordnum = 70;
var maxShowRow = 20; //屏幕显示行数

var wordlen;
var word = "你好阿！ 相对文档 简单测试也没什么问题，但是clientX与clientY获取的是相对于当前屏幕的坐标，忽略页面滚动因素，这在很多条件下很有用，但当我们需要考虑页面滚动，也就是相对于文档（body元素）的坐标时怎么办呢？加上滚动的位移就可以了，下边我们试试怎么计算页面滚动的位移。 其实在Firefox下问题会简单很多，因为Firefox支持属性pageX,与pageY属性，这两个属性已经把页面滚动计算在内了。";
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

function addTable() {

}

//绑定table鼠标点击事件
function bindClick() {
	$(document).ready(function() {
		$('#contents').each(function() {
			$(this).find('table').on('mousedown', function() { //按下鼠标
				mouseUpDownStatus = 1;
				selectedTableId = this.id;
				mouseDownEvent(selectedTableId);
			});
			$(this).find('table').on('mouseup', function() { //放开鼠标
				mouseUpDownStatus = 0;
				mouseUpEvent(selectedTableId);
			});
			$(this).find('table').on('mousemove', function() { //移动鼠标
//				setTimeout(mouseMoveEvent(selectedTableId),500);
				setTimeout(mouseMoveEvent(selectedTableId),3000);
				
			});

		})
	});
}

window.onload = function() {
	showEditor();
	bindClick();
	clickPosition();
}

//鼠标按下，点击table执行事件 2017-11-13
function mouseDownEvent(index) {
	//	document.getElementById(index).classList.remove("editedTable");
	var selectedtable = document.getElementById(selectedTableId);
	var r = 1;
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
	console.log("now:"+nowMouseIndex);
	if(mouseUpDownStatus == 1) {
//		console.log("first:" + firstMouseIndex + ",,,"+nowMouseIndex+":last:" + finalMouseIndex);
		
//		reEdit(index);		
		if(nowRow==row&&nowColumn>column){  //修改本行数据
			console.log(nowRow+"AAAAAAAAAAAAAAAAA:"+nowColumn);
			reType();
			
		}
		else if(nowRow-row==1||nowRow-row==2){    //向下拖1～2行
			console.log("@@@@@@:row:" + nowRow + ",,,column:" + nowColumn);
		}else{
			console.log("bug>>>>>>>");
		}
	}

}

//鼠标按钮放开，table执行事件
function mouseUpEvent(index) {
	//	document.getElementById(index).classList.add("editedTable");
	console.log("Final:::::row:" + finalRow + ",,,column:" + finalColumn);
	afterEdit();
}

//重新排版,按下鼠标拖拽文字   @index1:表格的行列数  @index2:当前选中的表格id
function reEdit(index) {
	setTimeout(function() {}, 200);
	var temploc = row * rowlength + column;
	tempword = word.substr(temploc, tempwordnum);
	console.log("rr:" + row + ",cc:" + column + ",sum:" + temploc);
	//根据屏幕宽度，获取显示行数
	//	var selectedtable = document.getElementById(selectedTableId);
	var tableid = index + " tr";

	//	selectedtable.rows[row].classList.add("editTable");  //添加颜色
	//	$("#content1 tr:eq("+row+")").html("<p>hello world</p>");
	console.log("index:" + temploc + ",,," + tempword);
	console.log("result:" + $(tableid).eq(index.td).html());
}

function reType(){   //重新排版。
	var trContent;
	moveStep = nowColumn - column;
	var temploc = row * rowlength + column;
	tempword = word.substr(row*rowlength,column)+word.substr(temploc, tempwordnum);
	for(var i=0;i<rowlength;i++){
		if(i>=column&&i<nowColumn){
			
			trContent += "<td>&nbsp;</td>";
		}
		else if(i<column){
			trContent += "<td>"+tempword.substr(i,1)+"</td>";
		}
		else{
			trContent += "<td class='tdcss'>"+tempword.substr(i-moveStep,1)+"</td>";
		}
	}
	$("#content1 tr:eq("+row+")").html(trContent);
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
function rowAndColumn(){
	column = firstMouseIndex % rowlength;
	row = Math.floor(firstMouseIndex / rowlength);
	nowColumn = nowMouseIndex % rowlength;
	nowRow = Math.floor(nowMouseIndex / rowlength);
	finalcolumn = finalMouseIndex % rowlength;
	finalrow = Math.floor(finalMouseIndex / rowlength);
}


//获取当前点击的行数和列数。
function clickPosition() {
//	$("#" + selectedTableId + " tr").on("mousedown", function() {
//		row = $(this).index();
//	});
	$("#" + selectedTableId + " tr td").on("mousedown", function() {
		firstMouseIndex = $(this).index("td");
		column = $(this).index();
	});

//	$("#" + selectedTableId + " tr").on("mousemove", function() {
//		nowRow = $(this).index();
//	});
	$("#" + selectedTableId + " tr td").on("mouseenter", function() {
		nowColumn = $(this).index();
		nowMouseIndex = $(this).index("td");
//		console.log($(this).index("td"));
		
	});

//	$("#" + selectedTableId + " tr").on("mouseup", function() {
//		finalRow = $(this).index();
//	});
	$("#" + selectedTableId + " tr td").on("mouseup", function() {
		finalMouseIndex = $(this).index("td");
//		finalColumn = $(this).index();
	});

}

//获取当前选中的tr并修改样式和部分内容
function selectedTrTd() {

}

////获取鼠标点击区域中的相对位置坐标
//function getXAndY(event) {
//	//鼠标点击的绝对位置
//	var e = event || window.event;
//	var x;
//	var y;
//	if(e.pageX || e.pageY) {
//		x = e.pageX;
//		y = e.pageY;
//	} else {
//		x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
//		y = e.clientY + document.body.scrollTop - document.body.clientTop;
//	}
//
//	//获取div在body中的绝对位置
//	var x1 = $("#content1").offset().left;
//	var y1 = $("#content1").offset().top;
//
//	//鼠标点击位置相对于div的坐标
//	var x2 = x - x1;
//	var y2 = y - y1;
//	return { x: x2, y: y2 };
//}
//
////计算出鼠标所在的table中的位置，位于第几行（第几个tr），第几列（第几个td）
//function getRAndD(index1, index2) {
//	var tr = index1.width / 20;
//	var td = index1.height / tableRowNum;
//	tr = index2.x / tr;
//	td = index2.y / td;
//	tr = Math.floor(tr) + 1;
//	td = Math.floor(td) + 1;
//	return { tr: tr, td: td };
//}