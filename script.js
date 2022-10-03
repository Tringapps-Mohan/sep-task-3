let storedData;
let tablePointer = [];
let currentPage = 1;
let container = document.getElementById("container");
let plusButtons = document.getElementsByClassName("plus");
let tableContainer = document.getElementById("table-area");
let totalRecords = 0;
let newRecord = `<div class="box-container">
<input type="text" class="name text-box"
title="Name doesn't contains symbols e.g:!,#,$,@,%,^,.etc" placeholder="----Your Name----" />
<input type="text" class="age text-box" title="Enter a numeric value for age"
placeholder="----Age----" />
<input type="text" class="mark text-box" title="Enter marks in number" placeholder="----Marks----" />
                <div class="plusAndMinus">
                    <input type="button" value="+" class="plus" onclick="addNewRecord()" />
                    <input type="button" value="-" class="minus" onclick="deleteRecord(this.parentElement.parentElement)" />
                </div>
            </div>`;


const getStoredData = () => {
    storedData = localStorage.getItem("task3");
    if (storedData == undefined || storedData == null || storedData == '') {
        storedData = [];
        localStorage.setItem("task3", JSON.stringify(storedData));
    } else {
        storedData = JSON.parse(storedData);
    }
};

const checkPreAndNextButtons = () => {
    getStoredData();
    totalRecords = storedData.length;
    let pre = document.getElementById("pre");
    let next = document.getElementById("next");
    if (totalRecords / 5 <= 1) {
        next.disabled = pre.disabled = true;
    } else {
        let totalPages = Math.ceil(totalRecords / 5);
        if (currentPage < totalPages && currentPage > 1) {
            next.disabled = pre.disabled = false;
        } else if (currentPage == 1 && totalPages == 1) {
            pre.disabled = true;
            next.disabled = false;
        } else if (totalPages == currentPage) {
            next.disabled = true;
            pre.disabled = false;
        } else {
            next.disabled = false;
            pre.disabled = true;
        }
    }
};

const findNoOfRowsAndDisplayMinusButtons = () => {
    if (container.children.length == 1) {
        container.children[0].children[3].children[1].style.display = "none";
    } else {
        [...document.getElementsByClassName("minus")].forEach(element => element.style.display = "block");
    }
};

const addNewRecord = () => {
    container.lastElementChild.insertAdjacentHTML("afterend", newRecord);
    findNoOfRowsAndDisplayMinusButtons();
};

const createPagination = (totalRecords, recordsPerPage) => {
    let paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
    let i = 0;
    while (totalRecords > 0) {
        paginationContainer.innerHTML += `<div class="page-numbers single-page-number" onclick="showPage(parseInt(this.innerText))" >${++i}</div>`;
        totalRecords -= recordsPerPage;
    }
};

const deleteRecord = element => {
    element.parentElement.removeChild(element);
    let data = { name: element.children[0].value, age: parseInt(element.children[1].value), mark: parseInt(element.children[2].value) };
    storedData = JSON.parse(localStorage.getItem("task3"));
    let index = storedData.findIndex(e => JSON.stringify(e) === JSON.stringify(data));
    if (index == -1) {
        findNoOfRowsAndDisplayMinusButtons();
        return;
    }
    storedData.splice(index, 1);
    localStorage.setItem("task3", JSON.stringify(storedData));
    showTable(true);
};

const showTable = (ignoreEmpty = false) => {
    if (!ignoreEmpty) {
        let boxContainers = document.getElementsByClassName("box-container");
        const data = [];
        const recordValues = [];
        [...boxContainers].forEach(element => {
            let record = { name: element.children[0].value, age: parseInt(element.children[1].value), mark: parseInt(element.children[2].value) };
            data.push(record);
            recordValues.push(...Object.values(record));
        });

        if (recordValues.includes("") || recordValues.includes(NaN) || recordValues.includes(null)) {
            alert("Some fields are not filled!\nor\nSome fields are filled with wrong values!");
            return;
        }
        getStoredData();
        storedData = storedData.concat(data);
        if (storedData.length == 0) {
            return;
        }
    }
    tableContainer.style.display = "block";
    storedData = [...new Set(storedData.map(e => JSON.stringify(e)))].map(e => JSON.parse(e));
    localStorage.setItem("task3", JSON.stringify(storedData));
    fillTable(5, storedData);
    createPagination(storedData.length, 5);
    checkPreAndNextButtons();
    findNoOfRowsAndDisplayMinusButtons();
};
const clearAll = () => {
    container.innerHTML = newRecord;
    tableContainer.style.display = "none";
    localStorage.setItem("task3", "");
};

const fillTable = (noOfRecords, storedData, start = 0) => {
    tablePointer = [];
    let tableBody = document.getElementById("data-table-body");
    let data = "";
    noOfRecords = storedData.length - start < noOfRecords ? storedData.length - start : noOfRecords;
    for (let i = start; i < start + noOfRecords; i++) {
        tablePointer.push({ name: storedData[i]["name"], age: storedData[i]["age"], mark: storedData[i]["mark"] });
        data += `<tr><td>${storedData[i]["name"]}</td><td>${storedData[i]["age"]}</td><td>${storedData[i]["mark"]}</td></tr>`;
    }

    tableBody.innerHTML = data;
};

const showPage = (pageNumber) => {
    getStoredData();
    fillTable(5, storedData, (pageNumber * 5) - 5);
    currentPage = pageNumber;
    checkPreAndNextButtons();
};

const sortStoredData = (property, orderBy = false) => {
    let tableBody = document.getElementById("data-table-body");
    if (property == 'name') {
        tablePointer.sort((a, b) => {
            let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA > nameB)
                return 1;
            else if (nameA < nameB)
                return -1;
            else return 0;
        })
    } else {
        tablePointer.sort((a, b) => a[property] - b[property]);
    }
    if (orderBy) tablePointer.reverse();
    fillTable(5, tablePointer);
};
getStoredData();
if (storedData.length > 0) {
    showTable(true);
}
checkPreAndNextButtons();

const pre = (element) => {
    currentPage--;
    element.disabled = false;
    if ((currentPage - 1) * 5 <= 0) {
        element.disabled = true;
    }
    element.nextElementSibling.nextElementSibling.disabled = false;
    showPage(currentPage);

};

const next = element => {
    currentPage++;
    element.disabled = false;
    if ((currentPage) * 5 >= totalRecords)
        element.disabled = true;
    element.previousElementSibling.previousElementSibling.disabled = false;

    showPage(currentPage);
};
