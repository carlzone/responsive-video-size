const minboxwidth = 280; // Set constant width of the smallest screen width that it can accept.
const minboxheight = 320; // Set constant height of the smalles screen height that it can accept.

//Create a new box when the #createBoxBtn is click
$(document).on("click", "button#createBoxBtn", function() {
  var boxgroupcount = $(".box-group").children().length;
  var boxsubcount = $(".box-sub-group").children().length;
  var total = boxgroupcount + boxsubcount + 1;

  $(".box-group").append(
    '<div class="box">\
      <h1 class="box-text">' + total + "</h1>\
    </div>"
  );
  sizeOfBoxes();
});

$(document).on("click", "button#removeBoxBtn", function() {
  var boxgroupcount = $(".box-group").children().length;
  var boxsubcount = $(".box-sub-group").children().length;

  var randNum =
    (Math.random() * 1000) %
    ((boxgroupcount + boxsubcount - 1) % (boxgroupcount + boxsubcount));

  // $(div.box - group)
  //   .children(".box:nth-child(" + randNum.toFixed(0) + ")")
  //   .remove();

  sizeOfBoxes();
});

var resizing = false;
var holder;
var lastResizeTime;
window.addEventListener("resize", function() {
  lastResizeTime = Date.now();
  if (resizing == false) {
    resizing = true;
    clearTimeout(holder);
    holder = setTimeout(resizeEnd, 700);
  }
});

function resizeEnd() {
  var curtime = Date.now();
  if (curtime > lastResizeTime) {
    console.log("Current Time: ", curtime);
    console.log("Last Resize Time: ", lastResizeTime);
    resizing = false;
    sizeOfBoxes();
  }
}

/*|
This function will set the size of each box to fit the screen and
hide excess box that cannot be accommodate
|*/
function sizeOfBoxes() {
  var boxspecs = boxCoordinator();
  var width = 100 / boxspecs.columns;
  var height = 100 / boxspecs.rows;
  console.log(boxspecs);
  $("div.box-group")
    .children()
    .each(function(i, val) {
      $(this).css("width", width.toString() + "%");
      $(this).css("height", height.toString() + "%");
      $(this).removeClass("hidden");
      if (boxspecs.hidenbox > 0 && boxspecs.showbox < i + 1) {
        $(this).addClass("hidden");
      }
    });
}

/*|
This function will find the best number of columns and rows that will
can fit the screen with the minimum width and height.
|*/
function boxCoordinator() {
  let hscreen = window.innerWidth; // Size of the viewport width
  let vscreen = window.innerHeight; // Size of the viewport height
  let boxtotal = $("div.box-group").children("div.box").length; // Number of boxes
  var reducedboxtotal = boxtotal; // Number of box that can be shown
  var x; // X for columns
  var y; // Y for rows
  var limit = 0;
  console.clear();
  console.log("-----------------");
  do {
    var counter = 0; //column - number of box along the horizontal axis
    var result = 0; //row - number of box along the vertical axis
    var canfit = true;

    if (hscreen > vscreen) {
      console.log("---------------------------");
      console.log("Calculating the columns");
      console.log("---------------------------");
      let looplimit = 0;
      // Find the number of column that is equal or +1 of the number of row
      do {
        counter++;
        result = reducedboxtotal / counter;
        looplimit++;
      } while (
        counter - result.toFixed(0) != 1 &&
        counter - result.toFixed(0) != 0 &&
        looplimit < 10
      );
      x = counter; // X gets the counter as number of columns
      y = result.toFixed(0); // Y gets the result as number of rows

      // Uncomment for debugging purposes
      // console.log("-----------------");
      // console.log("hscreen: ", hscreen);
      // console.log("columns: ", x);
      // console.log("total width columns: ", x * minboxwidth);
      // console.log("vscreen: ", vscreen);
      // console.log("rows: ", y);
      // console.log("total height columns: ", y * minboxheight);
      // console.log("Can fit before: ", canfit);

      //Check if x * minboxwidth <= hscreen to transfer some items to the next row

      var result = checkSizeToAllocate(x, y, hscreen, vscreen, reducedboxtotal);
      x = result.x;
      y = result.y;
      canfit = result.canfit;
      reducedboxtotal = result.reducedbox;
    } else {
      // Find the number of column that is equal or -1 of the number of row
      console.log("-----------------");
      console.log("Calculating the rows");
      console.log("-----------------");
      let looplimit = 0;
      do {
        counter++;
        result = reducedboxtotal / counter;
        // console.log(result + "=" + boxtotal + "/" + counter);
        looplimit++;
      } while (
        counter - result.toFixed(0) != 1 &&
        counter - result.toFixed(0) != 0 &&
        looplimit < 10
      );
      x = result.toFixed(0); // X gets the counter as number of columns
      y = counter; // Y gets the result as number of rows

      // Uncomment for debugging purposes
      // console.log("-----------------");
      // console.log("-----------------");
      // console.log("hscreen: ", hscreen);
      // console.log("columns: ", x);
      // console.log("total width columns: ", x * minboxwidth);
      // console.log("vscreen: ", vscreen);
      // console.log("rows: ", y);
      // console.log("total height columns: ", y * minboxheight);
      // console.log("Can fit before: ", canfit);

      //Check if y * minboxheight <= vscreen to transfer some items to the next column
      var result = checkSizeToAllocate(x, y, hscreen, vscreen, reducedboxtotal);
      x = result.x;
      y = result.y;
      reducedboxtotal = result.reducedbox;
      console.log("Can fit after: ", canfit);
    }
    limit++;
  } while (!canfit && limit < 10);
  return {
    showbox: reducedboxtotal,
    hidenbox: boxtotal - reducedboxtotal,
    columns: x,
    rows: y
  };
}

/*
This function will check how many box can fit inside the screen given the
x = number of coloumns
y = number of rows
sW = width of the viewport
sH = height of the viewport
reducedbox = the number of box reduced
*/
function checkSizeToAllocate(x, y, sW, sH, reducedboxtotal) {
  let looplimit = 0;
  var vcanfit = true;
  var checked = false;
  while (y * minboxheight > sH && vcanfit && looplimit < 10) {
    console.log("reducing y from ", y);
    // Check if column can still be added to fit another set of items
    if ((x + 1) * minboxwidth <= sW) {
      y--;
      x++;
      checked = true;
    } else {
      y--;
      vcanfit = false;
      reducedboxtotal--;
    }
    console.log("after reduced ", y);
    looplimit++;
  }
  if (!checked) {
    var hcanfit = true;
    while (x * minboxwidth > sW && hcanfit && looplimit < 10) {
      console.log("reducing x");
      //Check if y can still accommodate another row to fit all item
      if ((y + 1) * minboxheight <= sH) {
        x--;
        y++;
      } else {
        x--;
        hcanfit = false;
        reducedboxtotal--;
      }
      looplimit++;
    }
  }

  return {
    reducedbox: reducedboxtotal,
    x: x,
    y: y,
    vcanfit: vcanfit,
    hcanfit: hcanfit
  };
}
