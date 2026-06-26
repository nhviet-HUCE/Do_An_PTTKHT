const API_URL = "http://localhost:8080";



let products = [];

let connected = false;




function esc(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}



function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("vi-VN");
}




async function apiGetProducts() {

    const response =
        await fetch(

            `${API_URL}/api/products`,

            {
                method: "GET"
            }

        );

    console.log(response);

    return await response.json();
}


// Trạng thái sản phẩm

async function apiToggleStatus(prodId) {

    const response =
        await fetch(

            `${API_URL}/api/products/toggle/${prodId}`,

            {
                method: "PUT"
            }

        );

    console.log(response);

    return await response.json();
}




async function loadEmployeeName() {
    const token=localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/api/auth/protected`,
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Không lấy được thông tin nhân viên");
    }
    const data=await response.json();
    const empName =data.user;

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



// Thay đổi trạng thái

async function changeStatus(prodId) {

    try {

        await apiToggleStatus(
            prodId
        );

        await loadProducts();

    }

    catch (error) {

        console.log(error);

        alert(
            "Không thể cập nhật trạng thái sản phẩm"
        );
    }
}




function renderTable() {

    const tbody =
        document.getElementById(
            "tbl-products"
        );

    if (
        !connected ||
        products.length === 0
    ) {

        tbody.innerHTML =

            `<tr>

                <td
                    colspan="6"
                    class="empty-note">

                    ${
                        connected
                            ? "Chưa có sản phẩm"
                            : "Không thể kết nối dữ liệu"
                    }

                </td>

            </tr>`;

        return;
    }

    tbody.innerHTML = "";

    products.forEach(

        function (p, i) {

            const checked =

                p.prod_status ===
                "available"

                    ? "checked"

                    : "";

            const row =

                `<tr>

                    <td>
                        ${i + 1}
                    </td>

                    <td>
                        ${esc(
                            p.prod_name
                        )}
                    </td>

                    <td>
                        ${esc(
                            p.prod_quantity
                        )}
                    </td>

                    <td>
                        ${formatPrice(
                            p.prod_price
                        )} đ
                    </td>

                    <td>
                        ${esc(
                            p.prod_status
                        )}
                    </td>

                    <td>

                        <input

                            type="checkbox"

                            class="select-product"

                            ${checked}

                            onchange="
                                changeStatus(
                                    '${p.prod_id}'
                                )
                            "

                        >

                    </td>

                </tr>`;

            tbody.insertAdjacentHTML(
                "beforeend",
                row
            );
        }
    );
}


async function loadProducts() {

    try {

        products =
            await apiGetProducts();

        connected = true;
    }

    catch (error) {

        console.log(error);

        connected = false;

        products = [];
    }

    renderTable();
}

function goLogin() {


    localStorage.removeItem("token");
    localStorage.removeItem("managerName");
    window.location.href = "../../Dang_nhap.html";

}

loadEmployeeName();

loadProducts();
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