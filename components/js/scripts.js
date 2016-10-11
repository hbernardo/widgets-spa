var apiUrl = "http://spa.tglrw.com:4000";
var searchTimer = null;

var updateTableRowFunc = [
    updateUser,
    updateWidget
];

var updateNumbersFunc = [
    updateNumUsers,
    updateNumWidgets
];

var showDetailsFunc = [
    detailUser,
    detailWidget
];

function isLoaderRunning(infoType, table, rowPos) {
    return table.rows[rowPos] && ("loader"+infoType+rowPos == table.rows[rowPos].cells[1].id);
}

function startLoading(infoType, table, rowPos) {
    if (!isLoaderRunning(infoType, table, rowPos)) {
        var newRow = table.insertRow(rowPos);
        var loaderDiv = document.createElement("div");
        var emptyCell = newRow.insertCell(0);
        var loaderCell = newRow.insertCell(1);
        emptyCell.innerHTML = "";
        loaderDiv.className = "loader";
        loaderCell.className = "text-center";
        loaderCell.id = "loader"+infoType+rowPos;
        loaderCell.height = "40px";
        loaderCell.appendChild(loaderDiv);
    }
}

function stopLoading(infoType, table, rowPos) {
    if (isLoaderRunning(infoType, table, rowPos)) {
        table.deleteRow(rowPos);
    }
}

function updateUser(user, userRow, reduced) {
    var userIdCell = userRow.insertCell(0);
    var userNameCell = userRow.insertCell(1);

    userIdCell.innerHTML = user.id;
    userIdCell.className = "text-center";
    
    userNameCell.innerHTML = user.name;
    
    if (!reduced)
    {    
        var userAvatarCell = userRow.insertCell(2);
        var userAvatarImg = document.createElement("img");
        
        userAvatarImg.src = user.gravatar;
        userAvatarCell.appendChild(userAvatarImg);
    }
}

function updateWidget(widget, widgetRow, reduced) {
    var idCell = widgetRow.insertCell(0);
    var nameCell = widgetRow.insertCell(1);
    
    idCell.innerHTML = widget.id;
    idCell.className = "text-center";
    
    nameCell.innerHTML = widget.name;
    
    if (!reduced)
    {
        var colorCell = widgetRow.insertCell(2);
        var priceCell = widgetRow.insertCell(3);
        var meltsCell = widgetRow.insertCell(4);
        var inventoryCell = widgetRow.insertCell(5);
        
        colorCell.innerHTML = widget.color;
        priceCell.innerHTML = "$"+widget.price;
        meltsCell.innerHTML = ((widget.melts) ? "yes" : "no");
        inventoryCell.innerHTML = widget.inventory;
    }
}

function updateNumUsers(numUsers) {
    var numUsersDiv = document.getElementById("numUsers");
    if (numUsersDiv) {
        numUsersDiv.innerHTML = "{"+numUsers+"}";
    }
}

function updateNumWidgets(numWidgets) {
    var numWidgetsDiv = document.getElementById("numWidgets");
    if (numWidgetsDiv) {
        numWidgetsDiv.innerHTML = "{"+numWidgets+"}";
    }
}

function detailUser(user, detailRow) {
    var emptyCell = detailRow.insertCell(0);
    var valueCell = detailRow.insertCell(1);

    var userAvatarImg = document.createElement("img");
        
    userAvatarImg.src = user.gravatar;
    valueCell.appendChild(userAvatarImg);
    
    emptyCell.innerHTML = "";
}

function detailWidget(widget, detailRow) {
    var emptyCell = detailRow.insertCell(0);
    var valueCell = detailRow.insertCell(1);
    
    valueCell.innerHTML = "<b>Color:</b> "+widget.color;
    valueCell.innerHTML += "<br><b>Price:</b> $"+widget.price;
    valueCell.innerHTML += "<br><b>Melts?</b> "+((widget.melts) ? "yes" : "no");
    valueCell.innerHTML += "<br><b>Inventory:</b> "+widget.inventory;
    
    emptyCell.innerHTML = "";
}

function isValidSearch(key) {
    var isValid = (key != "gravatar") && 
                  (key != "melts");

    return isValid;
}

function searchMatch(obj, searchStr) {
    searchStr = searchStr.toLowerCase();
    for (var key in obj) {
        if (obj[key]) {
            var str = obj[key].toString().toLowerCase();
            if (!isNaN(searchStr) && !isNaN(str)) {
                if (parseFloat(searchStr) == parseFloat(str)) {
                    return true;
                }
            }
            else {
                if (obj.hasOwnProperty(key) && isValidSearch(key) && str.search(searchStr) >= 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function updateCreateEditForm(edit, row) {
    var id = "";
    var name = "";
    var color = "red";
    var price = "";
    var melts = false;
    var inventory = "";
    
    if (edit && row) {
        id = row.cells[0].innerHTML;
        name = row.cells[1].innerHTML;
        color = row.cells[2].innerHTML;
        price = row.cells[3].innerHTML.substring(1);
        melts = ("yes" == row.cells[4].innerHTML) ? true : false;
        inventory = row.cells[5].innerHTML;
        
        document.getElementById("widget-form-title").innerHTML = "Edit Widget";
        document.getElementById("widget-create-button").style.display = "none";
        document.getElementById("widget-edit-button").style.display = "";
    }
    else {
        document.getElementById("widget-form-title").innerHTML = "Create Widget";
        document.getElementById("widget-create-button").style.display = "";
        document.getElementById("widget-edit-button").style.display = "none";
    }
    
    document.getElementById("widget-id").value = id;
    document.getElementById("widget-name").value = name;
    document.getElementById("widget-color").value = color;
    document.getElementById("widget-price").value = price;
    document.getElementById("widget-count").value = inventory;
    document.getElementById("widget-properties-0").checked = melts;
    
    window.scrollTo(0,document.body.scrollHeight);
}

function rowClickHandler(cmd, infoType, table, row, reduced) {
    return function() {
        if (reduced) {
            var pos = row.rowIndex;

            if (!isLoaderRunning(infoType, table, pos)) {
                var idCell = row.cells[0];
                var id = idCell.innerHTML;
                
                if (table.rows[pos] && ("" == table.rows[pos].cells[0].innerHTML)) {
                    table.deleteRow(pos);
                }
                else {
                    var xhttp = new XMLHttpRequest();
                    
                    startLoading(infoType, table, pos);

                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var obj = JSON.parse(this.responseText);
                            var newRow;
                            
                            stopLoading(infoType, table, pos);
                            
                            newRow = table.insertRow(pos);
                            showDetailsFunc[infoType](obj, newRow);
                        }
                    };
                    xhttp.open("GET", apiUrl+cmd+"/"+id, true);
                    xhttp.send();
                }
            }
        }
        else if (1 == infoType) {
            updateCreateEditForm(true, row);
        }
    };
}

function updateList(cmd, searchStr, reduced) {
    var infoType;
    if ("/widgets" == cmd) {
        infoType = 1;
    }
    else if ("/users" == cmd) {
        infoType = 0;
    }
    
    var table = document.getElementById("list"+infoType);

    if (!isLoaderRunning(infoType, table, 0)) {
        var xhttp = new XMLHttpRequest();

        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
        
        startLoading(infoType, table, 0);
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(this.responseText);
        
                stopLoading(infoType, table, 0);

                updateNumbersFunc[infoType](json.length);
                
                for (var i = 0; i < json.length; ++i) {
                    var obj = json[i];
                    
                    if (('' == searchStr) || searchMatch(obj, searchStr)) {
                        var row = table.insertRow(table.rows.length);
                        updateTableRowFunc[infoType](obj, row, reduced);
                        
                        if (reduced || (1 == infoType)) {
                            row.style.cursor = "pointer";
                            row.onclick = rowClickHandler(cmd, infoType, table, row, reduced);
                        }
                    }
                }
            }
        };
        xhttp.open("GET", apiUrl+cmd, true);
        xhttp.send();
    }
}

function searchList(cmd, searchStr, reduced) {
    if (searchStr.length > 3 || searchStr == "") {
        var infoType;
        if ("/widgets" == cmd) {
            infoType = 1;
        }
        else if ("/users" == cmd) {
            infoType = 0;
        }
        
        searchTimer = setTimeout(function() { updateList(cmd, searchStr, reduced); }, 300);
    }
}

function clearTimer() {
    clearTimeout(searchTimer); 
}

function isFormValid(edit, id, name, color, price, inventory, melts) {
    if (edit && (id.length <= 0 || isNaN(id) || (parseInt(Number(id)) != id))) {
        alert("Invalid widget id");
        return false;
    }
    
    if (name.length <= 0) {
        alert("Invalid widget name");
        return false;
    }
    
    if (price.length <= 0 || isNaN(price)) {
        alert("Invalid widget price");
        return false;
    }
    
    if (inventory.length <= 0 || isNaN(inventory) || (parseInt(Number(inventory)) != inventory)) {
        alert("Invalid widget inventory");
        return false;
    }
    
    return true;
}

function disableCreateEditForm() {
    document.getElementById("widget-edit-create").style.display = "none";
    document.getElementById("widget-edit-create-loader").style.display = "";
}

function enableCreateEditForm() {
    document.getElementById("widget-edit-create").style.display = "";
    document.getElementById("widget-edit-create-loader").style.display = "none";
}

function settingMeltsToFalse(name, color, price, inventory) {
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            
            for (var i = json.length-1; i >= 0; --i) {
                var widget = json[i];
                
                if ( (name == widget.name.toString()) && 
                     (color == widget.color.toString()) && 
                     (price == widget.price.toString()) && 
                     (inventory == widget.inventory.toString()) ) {
                    document.getElementById("widget-id").value = widget.id;
                    setWidget(true);
                    break;
                }
            }
        }
    };
    xhttp.open("GET", apiUrl+"/widgets", true);
    xhttp.send();
}

function setWidget(edit) {
    var id = document.getElementById("widget-id").value;
    var name = document.getElementById("widget-name").value;
    var color = document.getElementById("widget-color").value;
    var price = document.getElementById("widget-price").value;
    var inventory = document.getElementById("widget-count").value;
    var melts = document.getElementById("widget-properties-0").checked;
    
    if (isFormValid(edit, id, name, color, price, inventory, melts)) {
        var xhttp = new XMLHttpRequest();
        var widgetJson = new Object();
        
        disableCreateEditForm();
        
        widgetJson.name = name;
        widgetJson.color = color;
        widgetJson.price = price;
        widgetJson.inventory = inventory;
        widgetJson.melts = melts;

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300) {
                    if (!edit && (false == melts)) {
                        // workaround to bypass server not accepting creation of widgets with melts = false 
                        settingMeltsToFalse(name, color, price, inventory);
                    }
                    else {
                        enableCreateEditForm();
                        updateList('/widgets', '', false);
                    }
                }
            }
        };
        
        if (edit) {
            widgetJson.id = id;
            xhttp.open("PUT", apiUrl+"/widgets/"+id, true);
        }
        else {
            // server do not accept creation of widgets with melts = false (doing workaround of updating it after creation with melts = true)
            widgetJson.melts = true;
            xhttp.open("POST", apiUrl+"/widgets", true);
        }
        
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(widgetJson));
    }
}
