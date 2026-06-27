
const API_URL = "http://localhost:8080";

var products = [];
var selectedIdx = -1;
var connected = false;
var filteredProducts = [];
var selectedProductId = null;

async function apiGetProducts() {

    const response = await fetch(`${API_URL}/api/products`, {

        method: "GET"

    });

    console.log(response);
    return await response.json();

}

// Thêm sản phẩm
async function apiAddProduct(product) {

    const response = await fetch(`${API_URL}/api/products`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(product)

    });

    console.log(response);
    return await response.json();

}

// Sửa sản phẩm
async function apiUpdateProduct(id, product) {

    const response = await fetch(`${API_URL}/api/products/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(product)

    });

    console.log(response);
    return await response.json();

}

// Xóa sản phẩm
async function apiDeleteProduct(id) {

    const response = await fetch(`${API_URL}/api/products/${id}`, {

        method: "DELETE"

    });

    console.log(response);
    return await response.json();

}
async function loadProducts() {

    try {

        products = await apiGetProducts();

        filteredProducts = [...products];

        connected = true;

        renderTable();

    }

    catch (error) {

        console.log(error);

        connected = false;

        renderTable();

    }

}
// đồng hồ

function updateClock() {

    var now = new Date();

    var pad = function (n) {
        return String(n).padStart(2, "0");
    };

    document.getElementById("nav-date").textContent =
        "Ngày " +
        pad(now.getDate()) + "/" +
        pad(now.getMonth() + 1) + "/" +
        now.getFullYear() + " " +
        pad(now.getHours()) + ":" +
        pad(now.getMinutes()) + ":" +
        pad(now.getSeconds());

}

updateClock();
setInterval(updateClock, 1000);


//bảng


function renderTable() {

    var tbody = document.getElementById("tbl-body");

    if (!connected || filteredProducts.length === 0) {

        tbody.innerHTML =
            '<tr><td colspan="8" class="empty-note">' +
            (connected
                ? "Chưa có sản phẩm nào"
                : "Chưa kết nối  — bảng trống") +
            "</td></tr>";

        return;

    }

    tbody.innerHTML = "";

    filteredProducts.forEach(function (p, i) {
        var tr = document.createElement("tr");

        tr.style.background =
            selectedIdx === i ? "#b3ddf2" : "";

        tr.innerHTML =
            "<td>" + (i + 1) + "</td>" +
            "<td>" + esc(p.prod_name || "") + "</td>" +
            "<td>" + esc(p.prod_description || "") + "</td>" +
            "<td>" + esc(p.prod_category || "") + "</td>" +
            "<td>" + esc(p.prod_status || "") + "</td>" +
            "<td>" +
            p.prod_quantity +
            "</td>" +
            "<td>" +
            fmtGia(p.prod_price) +
            " đ</td>" +
            '<td><input type="checkbox" class="select-product" ' +
            (selectedIdx === i ? "checked" : "") +
            "></td>";

        (function (idx) {

          const checkbox =
            tr.querySelector(".select-product");

          checkbox.addEventListener(
           "click",
            function () {

            if (selectedIdx === idx) {

                // Bỏ chọn
                selectedIdx = -1;
                selectedProductId = null;

                clearForm();

                renderTable();

                return;
            }

            // Chọn sản phẩm mới
            selectProduct(idx);

        }
    );

})(i);

        tbody.appendChild(tr);


    });

    var blank = document.createElement("tr");

    blank.innerHTML =
        "<td style='padding:10px'></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>";
    tbody.appendChild(blank);

    var dots = document.createElement("tr");

    dots.innerHTML =
        "<td colspan='8' style='padding:6px 12px;color:#aaa;font-size:15px;'>...</td>";

    tbody.appendChild(dots);

}
// đăng xuất
function goLogin() {


    localStorage.removeItem("token");
    localStorage.removeItem("managerName");
    window.location.href = "Dang_nhap.html";

}
//chọn sạn phẩm


function selectProduct(idx) {

    selectedIdx = idx;

    var p = filteredProducts[idx];

    selectedProductId = p.prod_id;
    document.getElementById("f-ten").value =
        p.prod_name || "";

    document.getElementById("f-thongso").value =
        p.prod_description || "";

    document.getElementById("f-theloai").value =
        p.prod_category || "";

    document.getElementById("f-trangthai").value =
        p.prod_status || "";

    document.getElementById("f-gia").value =
        p.prod_price || "";

    document.getElementById("f-sl").value =
        p.prod_quantity || 1;
    if (p.prod_img) {

        document.getElementById("img-preview").src =
             p.prod_img;

        document.getElementById("img-preview").style.display =
            "block";

        document.getElementById("img-placeholder").style.display =
            "none";

    }
    else {

        document.getElementById("img-preview").src = "";

        document.getElementById("img-preview").style.display =
            "none";

        document.getElementById("img-placeholder").style.display =
            "block";

    }

    renderTable();

}
async function addProduct() {
    var prod_name =
        document.getElementById("f-ten").value.trim();

    var prod_description =
        document.getElementById("f-thongso").value.trim();

    var prod_category =
        document.getElementById("f-theloai").value.trim();

    var prod_status =
        document.getElementById("f-trangthai").value.trim();
     if (
    prod_status !== "available" &&
    prod_status !== "unavailable"
) {

    alert(
        "Vui lòng chọn trạng thái Available hoặc Unavailable!"
    );

    return;
}
    var prod_price =
        parseFloat(document.getElementById("f-gia").value) || 1;

    var prod_quantity =
        parseInt(document.getElementById("f-sl").value) || 1;
    if (!prod_name) {
        alert("Vui lòng nhập tên sản phẩm!");
        return;
    }

        
    // console.log({
    //     prod_name,
    //     prod_quantity,
    //     prod_price,
    //     prod_category,
    //     prod_description,
    //     prod_status
    // });
    await apiAddProduct({
        prod_name,
        prod_quantity,
        prod_price,
        prod_category,
        prod_description,
        prod_status
    });

    clearForm();
    loadProducts();
}
//cập nhật sản phẩm
async function updateProduct() {

    if (selectedProductId == null) {

        alert("Vui lòng chọn sản phẩm cần cập nhật!");
        return;
    }

    var prod_name =
        document.getElementById("f-ten").value.trim();

    var prod_description =
        document.getElementById("f-thongso").value.trim();

    var prod_category =
        document.getElementById("f-theloai").value.trim();

    var prod_status =
        document.getElementById("f-trangthai").value.trim();
    if (
    prod_status !== "available" &&
    prod_status !== "unavailable"
) {

    alert(
        "Vui lòng chọn trạng thái Available hoặc Unavailable!"
    );

    return;
}
    var prod_price =
        parseFloat(document.getElementById("f-gia").value) || 1;

    var prod_quantity =
        parseInt(document.getElementById("f-sl").value) || 1;

    await apiUpdateProduct(
        selectedProductId,
        {
            prod_name,
            prod_quantity,
            prod_price,
            prod_category,
            prod_description,
            prod_status
        }
    );

    alert("Cập nhật thành công!");

    selectedIdx = -1;
    selectedProductId = null;

    clearForm();

    loadProducts();
}

// xóa


async function deleteProduct() {

    if (selectedIdx < 0 || selectedIdx >= products.length) {

        alert("Vui lòng chọn sản phẩm cần xóa!");
        return;

    }

    if (confirm("Xóa sản phẩm: " + filteredProducts[selectedIdx].prod_name + "?")) {

        await apiDeleteProduct(selectedProductId);

        selectedIdx = -1;
        selectedProductId = null;

        clearForm();

        loadProducts();

    }

}


// Xóa form


function clearForm() {

    [
        "f-theloai",
        "f-ten",
        "f-thongso",
        "f-trangthai",
        "f-gia",
        "f-sl"
    ].forEach(function (id) {

        document.getElementById(id)..selectedIndex = 0;

    });
    document.getElementById("img-preview").src = "";
    document.getElementById("img-preview").style.display =
    "none";

    document.getElementById("img-placeholder").style.display =
    "block"; 

}


//  kiểu dạng tiền 


function fmtGia(g) {

    var n = parseInt(String(g).replace(/\D/g, ""));

    return isNaN(n)
        ? (g || "")
        : n.toLocaleString("vi-VN");

}

// pre ảnh
function previewImg(e) {

    var f = e.target.files[0];

    if (!f) return;

    var r = new FileReader();

    r.onload = function (ev) {

        document.getElementById("img-preview").src =
            ev.target.result;

        document.getElementById("img-preview").style.display =
            "block";

        document.getElementById("img-placeholder").style.display =
            "none";

    };

    r.readAsDataURL(f);

}
// gọi thằng quản lý 
async function apiGetManager() {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_URL}/api/auth/admin`,
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Không lấy được thông tin quản lý");
    }

    return await response.json();
}
//hiện tên thằng quản lý 
async function loadManager() {

    try {

        const manager = await apiGetManager();

        document.getElementById(
            "header-manager"
        ).textContent = manager.user;

        document.getElementById(
            "nav-manager"
        ).textContent = manager.user;

    }
    catch (error) {

        console.log(error);

        document.getElementById(
            "header-manager"
        ).textContent = "Không xác định";

        document.getElementById(
            "nav-manager"
        ).textContent = "Không xác định";
    }

}
// tìm tên sản phâm trong bảng
function searchProducts() {

    const keyword =
        document.getElementById("inp-ten")
            .value
            .toLowerCase()
            .trim();

    filteredProducts = products.filter(function (p) {

        return p.prod_name
            .toLowerCase()
            .includes(keyword);

    });

    renderTable();
}
document
    .getElementById("inp-ten")
    .addEventListener(
        "input",
        searchProducts
    );

function esc(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
loadManager();
loadProducts()
