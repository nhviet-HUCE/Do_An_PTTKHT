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

let selectedOrder = null;

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


async function apiCancelOrder(id) {  

    const response =
        await fetch(
            `${API_URL}/api/orders/${id}`,
            {
                method: "PUT"
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

        selectedOrder = null;

    }

    else {

        selectedIdx = idx;

        selectedOrder =
            filteredOrders[idx];

        selectedOrderId =
            selectedOrder.Inv_id;
    }

    updateDetailPanel();

    renderTable();
}
function updateDetailPanel() { //chú ý phần này

    const desc =
        document.getElementById(
            "detail-description"
        );

    const qty =
        document.getElementById(
            "detail-quantity"
        );

    if (!desc || !qty) {

        return;
    }

    if (!selectedOrder) {

        desc.textContent =
            "Chưa chọn đơn hàng";

        qty.textContent =
            "--";

        return;
    }

    desc.textContent =
      
        selectedOrder.prod_name ||
        "Không có mô tả";

    qty.textContent =
        selectedOrder.quantity ||
   
        "--";
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

                       <span class="
                          order-status
                            ${(o.status || "cho").toLowerCase()}
                        ">

                        ${o.status || "Chờ"}

                       </span>

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

    updateDetailPanel();
}



//    hủyORDER

async function cancelOrder() {

    if (
        selectedOrderId == null
    ) {

        alert(
            "Vui lòng chọn đơn hàng"
        );

        return;
    }

    const ok = confirm(
        "Bạn có chắc muốn hủy đơn hàng này?"
    );

    if (!ok) {
        
        return;
    }
    filteredOrders[
    selectedIdx
    ].status = "Hủy";

    await apiCancelOrder(
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
     filteredOrders[
    selectedIdx
    ].status = "Duyệt";

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
        "btn-cancel"
    )
    .addEventListener(
        "click",
        cancelOrder
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