function updateDateTime() {

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("nav-date").textContent =
        `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);
const API_URL = "http://localhost:8080";

let orders = [];

let filteredOrders = [];

let selectedIdx = -1;

let selectedOrderId = null;

let connected = false;



//    ESCAPE HTML


function esc(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


// format tiền

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("vi-VN");
}



async function apiGetOrders() {

    const response =
        await fetch(
            `${API_URL}/api/invoices`,
            {
                method: "GET"
            }
        );

    console.log(response);

    return await response.json();
}


async function apiDeleteOrder(id) {

    const response =
        await fetch(
            `${API_URL}/api/orders/${id}`,
            {
                method: "DELETE"
            }
        );

    console.log(response);

    return await response.json();
}


async function apiApproveOrder(id) {

    const response =
        await fetch(
            `${API_URL}/api/orders/${id}/approve`,
            {
                method: "PUT"
            }
        );

    console.log(response);

    return await response.json();
}







// chọn order
function selectOrder(idx) {

    if (selectedIdx === idx) {

        selectedIdx = -1;

        selectedOrderId = null;

    } else {

        selectedIdx = idx;

        selectedOrderId =
            filteredOrders[idx]
            .Inv_id;
    }

    updateButtons();

    renderTable();
}



//    RENDER TABLE
 

function renderTable() {

    const tbody =
        document.getElementById(
            "tbl-orders"
        );

    if (
        !connected ||
        filteredOrders.length === 0
    ) {

        tbody.innerHTML =

            `<tr>
                <td colspan="7"
                    class="empty-note">

                    ${
                        connected
                            ? "Chưa có đơn hàng"
                            : "Vui lòng kết nối Database"
                    }

                </td>
            </tr>`;

        return;
    }

    tbody.innerHTML = "";

    filteredOrders.forEach(

        function (o, i) {

            const checked =
                selectedIdx === i
                    ? "checked"
                    : "";

            const row =

                `<tr>

                    <td>
                        ${esc(o.Inv_id)}
                    </td>

                    <td>
                        ${esc(o.prod_name)}
                    </td>

                    <td>
                        ${esc(o.User_name)}
                    </td>

                    <td>
                        ${esc(o.created_At)}
                    </td>

                    <td>
                        ${esc(o.Track_num)}
                    </td>

                    <td>
                        ${formatPrice(
                            o.Inv_price
                        )} đ
                    </td>

                    <td>

                        <input
                            type="checkbox"
                            class="select-product"
                            ${checked}
                            onclick="selectOrder(${i})">

                    </td>

                </tr>`;

            tbody.insertAdjacentHTML(
                "beforeend",
                row
            );
        }
    );
}



//    LOAD DATA

async function loadOrders() {

    try {

        orders =
            await apiGetOrders();

        filteredOrders =
            [...orders];

        connected = true;

    }

    catch (error) {

        console.log(error);

        connected = false;

        filteredOrders = [];
    }

    renderTable();

    updateButtons();
}



//    xóa ORDER

async function deleteOrder() {

    if (
        selectedOrderId == null
    ) {

        alert(
            "Vui lòng chọn đơn hàng"
        );

        return;
    }

    const ok = confirm(
        "Bạn có chắc muốn xóa đơn hàng này?"
    );

    if (!ok) {

        return;
    }

    await apiDeleteOrder(
        selectedOrderId
    );

    selectedIdx = -1;

    selectedOrderId = null;

    await loadOrders();
}


//    duyệt ORDER

async function approveOrder() {

    if (
        selectedOrderId == null
    ) {

        alert(
            "Vui lòng chọn đơn hàng"
        );

        return;
    }

    await apiApproveOrder(
        selectedOrderId
    );

    alert(
        "Duyệt đơn thành công"
    );

    selectedIdx = -1;

    selectedOrderId = null;

    await loadOrders();
}


//    EMPLOYEE NAME

function loadEmployeeName() {

    const empName =
        localStorage.getItem(
            "employee_name"
        );

    const target =
        document.getElementById(
            "header-Employee"
        );

    if (target) {

        target.textContent =
            empName ||
            "Chưa có tên nhân viên";
    }
}

function goLogin() {


    localStorage.removeItem("token");
    localStorage.removeItem("managerName");
    window.location.href = "Dang_nhap.html";

}

//    EVENTS

document
    .getElementById(
        "btn-delete"
    )
    .addEventListener(
        "click",
        deleteOrder
    );

document
    .getElementById(
        "btn-approve"
    )
    .addEventListener(
        "click",
        approveOrder
    );


loadEmployeeName();



loadOrders();