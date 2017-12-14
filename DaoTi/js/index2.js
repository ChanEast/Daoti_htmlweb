var rowlength = 20;
var tempwordnum = 70;

var word = "你好阿！ 相对文档 简单测试也没什么问题，但是clientX与clientY获取的是相对于当前屏幕的坐标，忽略页面滚动因素，这在很多条件下很有用，但当我们需要考虑页面滚动，也就是相对于文档（body元素）的坐标时怎么办呢？加上滚动的位移就可以了，下边我们试试怎么计算页面滚动的位移。 其实在Firefox下问题会简单很多，因为Firefox支持属性pageX,与pageY属性，这两个属性已经把页面滚动计算在内了。";
//var bindElement = '"#click1","#click2"';
var tableno = 0;
var mouseUpDownStatus = 0;
var tableRowNum = 0;
var tempword;
//当前鼠标点击行数列数
var row;
var column;

//function hello() {
//	bindClick();
//}

//function getMousePos(event) {
//	//	console.log("tttt:" + getXAndY(event).x + "," + getXAndY(event).y);
//}

//显示编辑内容
function showEditor() {
	var tableword = "<tr>";
	var temp;
	var range;
	for(var i = 0; i < word.length; i++) {
		if(i % 20 == 0) {
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
	if(word.length <= 20) {
		tableRowNum = 1;
	}
	tableword += "</tr>";
	document.getElementById("content1").innerHTML = tableword;
}

function addTable() {

}

//绑定table鼠标点击事件
function bindClick() {
	var tableWidth;
	var tableHeight;
	$(document).ready(function() {
		$('#contents').each(function() {
			$(this).find('table').on('mousedown', function() {  //按下鼠标
				mouseUpDownStatus = 1;
				//				alert(this.id);
				mouseDownEvent2(this.id + "");
				//				alert("down:"+mouseUpDownStatus);
			});
			$(this).find('table').on('mouseup', function() {	//放开鼠标
				mouseUpDownStatus = 0;
				mouseUpEvent(this.id + "");
				//				alert("up:"+mouseUpDownStatus);
			});
			$(this).find('table').on('mousemove', function() {	//移动鼠标
				mouseMoveEvent(this.id + "");
			});

		})
	});
}

window.onload = function() {
	showEditor();
	bindClick();
//	clickPosition();
}

//鼠标按下，点击table执行事件
function mouseDownEvent(index) {
	tableWidth = document.getElementById(index).offsetWidth;
	tableHeight = document.getElementById(index).offsetHeight;
	posX = getXAndY(event).x;
	posY = getXAndY(event).y;
	console.log("height:" + tableHeight + ",width:" + tableWidth);
	console.log("tttt:" + getXAndY(event).x + "," + getXAndY(event).y);
	//	getMousePos(event);
	var rd = getRAndD({ width: tableWidth, height: tableHeight }, { x: posX, y: posY });
	console.log("row:" + tableRowNum + ",tr:" + rd.tr + ",td:" + rd.td);
	document.getElementById(index).classList.add("editTable");
	document.getElementById(index).classList.remove("editedTable");
}

//鼠标按下，点击table执行事件   2017-11-13
function mouseDownEvent2(index) {
	if(mouseUpDownStatus == 1) {
		reEdit(index);
	}
}

//鼠标按钮按住并移动，table执行事件
function mouseMoveEvent(index) {
	if(mouseUpDownStatus == 1) {
		reEdit(index);
	}

}

//鼠标按钮放开，table执行事件
function mouseUpEvent(index) {
	document.getElementById(index).classList.remove("editTable");
	document.getElementById(index).classList.add("editedTable");
}

//获取鼠标点击区域中的相对位置坐标
function getXAndY(event) {
	//鼠标点击的绝对位置
	var e = event || window.event;
	var x;
	var y;
	if(e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
		y = e.clientY + document.body.scrollTop - document.body.clientTop;
	}

	//获取div在body中的绝对位置
	var x1 = $("#content1").offset().left;
	var y1 = $("#content1").offset().top;

	//鼠标点击位置相对于div的坐标
	var x2 = x - x1;
	var y2 = y - y1;
	return { x: x2, y: y2 };
}

//计算出鼠标所在的table中的位置，位于第几行（第几个tr），第几列（第几个td）
function getRAndD(index1, index2) {
	var tr = index1.width / 20;
	var td = index1.height / tableRowNum;
	tr = index2.x / tr;
	td = index2.y / td;
	tr = Math.floor(tr) + 1;
	td = Math.floor(td) + 1;
	return { tr: tr, td: td };
}

//重新排版,按下鼠标拖拽文字   @index1:表格的行列数  @index2:当前选中的表格id
function reEdit(index) {
	setTimeout(function(){},200);
	//	var temploc = index1.tr + index1.td * 20;
	var temploc = row * rowlength + column;
	tempword = word.sub(temploc, tempwordnum);
	console.log("rr:"+row+",cc:"+column);
	//根据屏幕宽度，获取显示行数
	var selectedtable = document.getElementById(index);
	var tableid = index + " tr";
	//	selectedtable.rows[index1.td].innerHTML = "";
	console.log("result:" + $(tableid).eq(index.td).html());
}

//松开鼠标按键，定位鼠标位置，重新排版文字。
function afteEdit() {

}

//点下鼠标，鼠标位置后的文字变色，放开鼠标按钮恢复颜色
function mousedownWordChange() {
	if(mouseUpDownStatus == 1) {
		document.getElementById("content").classList.remove("editTable");
	} else {
		document.getElementById("content").classList.add("editTable");
	}
}

//获取当前点击的行数和列数。
function clickPosition() {
	$(document).ready(function() {
		$("#content1 tr").click(function() {
//						console.log("loc:" + ",,," + $(this).index());
			row = $(this).index();
			//			return $(this).index();
		});
		$("#content1 tr td").click(function() {
//						console.log("loc2:" + ",,," + $(this).index());
			column = $(this).index() + 1;
			//			return $(this).index();
		});
	});
}

function test2(index) {
	var tableid = "#"+index;
	
}